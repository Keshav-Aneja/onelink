export function debounce<F extends (...args: any[]) => any>(
  fn: F,
  delay: number,
): (...args: Parameters<F>) => void {
  let timeoutId: NodeJS.Timeout;

  return function (this: ThisParameterType<F>, ...args: Parameters<F>) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
}
