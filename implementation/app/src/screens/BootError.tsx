import { exportData } from '../data/export';

/**
 * Shown when stored data can't be opened (plan §4.4): written by a newer app, a failed migration, invalid data, or
 * storage that doesn't answer. Xuất dữ liệu exports the RAW stored record unchanged, so it can be rescued by hand or
 * imported by a later version. Never offers to delete or reset. One of the two screens allowed to call data/
 * directly (plan §2.2), with CrashGuard.
 */
export function BootError({ raw }: { raw: unknown }) {
  return <ErrorScreen title="Không mở được dữ liệu" data={raw} />;
}

/**
 * The error screen shared by BootError and CrashGuard. Xuất dữ liệu only when there is something to export.
 * `detail` (the error message) is shown small, so the user can report it.
 */
export function ErrorScreen({ title, data, detail }: { title: string; data: unknown; detail?: string }) {
  return (
    <div className="app">
      <div className="boot-error">
        <h1>{title}</h1>
        {detail && <div className="boot-error-detail">{detail}</div>}
        <div className="btn-col">
          {data != null && <button className="btn pri" onClick={() => void exportData(data)}>Xuất dữ liệu</button>}
          <button className="btn" onClick={restart}>Thử lại</button>
        </div>
      </div>
    </div>
  );
}

/** Reload on the home page (2.0): reloading the page that crashed would likely crash again */
function restart() {
  history.replaceState(null, '', location.pathname + location.search);
  location.reload();
}
