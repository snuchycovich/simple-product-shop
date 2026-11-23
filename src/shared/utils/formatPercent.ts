const formatter = new Intl.NumberFormat('en-US', {
  style: 'percent',
  maximumFractionDigits: 0,
})

export function formatPercent(rate: number): string {
  return formatter.format(rate)
}
