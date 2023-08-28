export function minusPercent(n: number, p: number) {
  if (p === 0) return n;
  return n * (p / 100);
  // return n - (n * (p/100));
}
