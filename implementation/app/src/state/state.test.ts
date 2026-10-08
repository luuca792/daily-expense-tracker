import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Repository, SaveResult } from '../data/repository';
import { demoData } from '../domain/__fixtures__/sample';
import { createPeriod } from '../domain/periods';
import { Data } from '../domain/types';
import { SAVE_FAILED_TEXT, startAutosave } from './autosave';
import { useStore } from './store';

const flush = () => new Promise((r) => setTimeout(r, 0));

function fakeRepo(save: (d: Data) => Promise<SaveResult> = async () => 'ok', stored: Data | null = null) {
  return {
    save: vi.fn(save),
    load: vi.fn(async () => (stored ? { kind: 'ok' as const, data: stored } : { kind: 'empty' as const })),
  } as unknown as Repository & { save: ReturnType<typeof vi.fn> };
}

function setup(repo = fakeRepo()) {
  let otherTab: () => void = () => undefined;
  const deps = {
    repo,
    postSaved: vi.fn(),
    reload: vi.fn(),
    onOtherTabSaved: (cb: () => void) => ((otherTab = cb), () => undefined),
  };
  const stop = startAutosave(useStore, deps);
  return { deps, stop, otherTab: () => otherTab() };
}

beforeEach(() => useStore.getState().init(demoData(), null));

describe('store', () => {
  it('update works on a copy', () => {
    const before = useStore.getState().data!;
    useStore.getState().update((d) => (d.userName = 'Minh'));
    expect(useStore.getState().data!.userName).toBe('Minh');
    expect(before.userName).not.toBe('Minh');
  });
  it('undo restores the previous data', () => {
    const before = useStore.getState().data!;
    useStore.getState().updateWithUndo('Đã xóa', (d) => (d.periods = []));
    expect(useStore.getState().toast?.text).toBe('Đã xóa');
    useStore.getState().undo();
    expect(useStore.getState().data).toBe(before);
    expect(useStore.getState().toast).toBeNull();
  });
  it('another tab\'s data drops the undo toast', () => {
    useStore.getState().updateWithUndo('Đã xóa', (d) => (d.periods = []));
    useStore.getState().replaceFromOtherTab(demoData());
    expect(useStore.getState().toast).toBeNull();
  });
});

describe('autosave (plan §4.5)', () => {
  it('every local change is saved, then other tabs are told', async () => {
    const { deps, stop } = setup();
    useStore.getState().update((d) => createPeriod(d, { name: 'x', start: '2026-11-01' }));
    useStore.getState().update((d) => (d.userName = 'Lan'));
    await flush();
    expect(deps.repo.save).toHaveBeenCalledTimes(2);
    expect(deps.repo.save).toHaveBeenLastCalledWith(useStore.getState().data);
    expect(deps.postSaved).toHaveBeenCalledTimes(2);
    stop();
  });
  it('undo is saved too; toasts and toggles are not', async () => {
    const { deps, stop } = setup();
    useStore.getState().updateWithUndo('x', (d) => (d.userName = 'Lan'));
    useStore.getState().undo();
    useStore.getState().setToggle('p', 'inc');
    await flush();
    expect(deps.repo.save).toHaveBeenCalledTimes(2);
    stop();
  });
  it('boot data and other tabs\' data are not saved again', async () => {
    const { deps, stop } = setup();
    useStore.getState().init(demoData(), null);
    useStore.getState().replaceFromOtherTab(demoData());
    await flush();
    expect(deps.repo.save).not.toHaveBeenCalled();
    stop();
  });
  it('a failed save shows a toast and keeps the change in memory', async () => {
    const { stop } = setup(fakeRepo(async () => { throw new Error('QuotaExceeded'); }));
    useStore.getState().update((d) => (d.userName = 'Lan'));
    await flush();
    expect(useStore.getState().toast?.text).toBe(SAVE_FAILED_TEXT);
    expect(useStore.getState().data!.userName).toBe('Lan');
    stop();
  });
  it('newer data in storage → reload instead of overwriting', async () => {
    const { deps, stop } = setup(fakeRepo(async () => 'newer'));
    useStore.getState().update((d) => (d.userName = 'Lan'));
    await flush();
    expect(deps.reload).toHaveBeenCalled();
    expect(deps.postSaved).not.toHaveBeenCalled();
    stop();
  });
  it('another tab saved → its data replaces ours', async () => {
    const theirs = { ...demoData(), userName: 'Từ tab khác' };
    const { otherTab, deps, stop } = setup(fakeRepo(undefined, theirs));
    otherTab();
    await flush();
    expect(useStore.getState().data!.userName).toBe('Từ tab khác');
    expect(deps.repo.save).not.toHaveBeenCalled();
    stop();
  });
});
