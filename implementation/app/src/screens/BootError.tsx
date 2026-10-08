import { exportData } from '../data/export';

/**
 * Shown when stored data can't be opened (plan §4.4): written by a newer app, a failed migration or invalid data.
 * Xuất dữ liệu exports the RAW stored record unchanged, so it can be rescued by hand or imported by a later version.
 * Never offers to delete or reset. The only screen allowed to call data/ directly (plan §2.2).
 */
export function BootError({ raw }: { raw: unknown }) {
  return (
    <div className="app">
      <div className="boot-error">
        <h1>Không mở được dữ liệu</h1>
        <div className="btn-col">
          <button className="btn pri" onClick={() => void exportData(raw)}>Xuất dữ liệu</button>
          <button className="btn" onClick={() => location.reload()}>Thử lại</button>
        </div>
      </div>
    </div>
  );
}
