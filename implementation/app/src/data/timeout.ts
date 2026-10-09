/** Thrown by withTimeout when the promise hasn't settled in time */
export class TimeoutError extends Error {
  constructor(ms: number) {
    super(`No answer from storage after ${ms} ms`);
    this.name = 'TimeoutError';
  }
}

/** Rejects with TimeoutError if `p` hasn't settled after `ms`. `p` itself keeps running. */
export function withTimeout<T>(p: PromiseLike<T>, ms: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const t = setTimeout(() => reject(new TimeoutError(ms)), ms);
    p.then(
      (v) => (clearTimeout(t), resolve(v)),
      (e) => (clearTimeout(t), reject(e)),
    );
  });
}
