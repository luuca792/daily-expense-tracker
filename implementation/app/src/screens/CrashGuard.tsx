import { Component, type ErrorInfo, type ReactNode } from 'react';
import { useStore } from '../state/store';
import { ErrorScreen } from './BootError';

/**
 * Catches an error while a screen renders. Without it React removes the whole app and leaves a white page.
 * Shows the error screen instead; Xuất dữ liệu exports the data in memory, which includes changes a failed save
 * didn't store yet (plan §4.4).
 */
export class CrashGuard extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null as Error | null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Crash', error, info.componentStack);
  }

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;
    return <ErrorScreen title="Đã xảy ra lỗi" data={useStore.getState().data} detail={error.message} />;
  }
}
