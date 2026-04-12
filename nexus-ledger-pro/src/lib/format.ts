/**
 * Indian Rupee formatter
 * Outputs: ₹X,XX,XXX.XX  (Indian numbering system)
 */
const inrFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export const inr = (value: number | null | undefined): string => {
  if (value == null) return '₹0.00'
  return inrFormatter.format(value)
}

/** Signed INR, with explicit +/- prefix */
export const inrSigned = (value: number): string => {
  const abs = Math.abs(value)
  const prefix = value >= 0 ? '+' : '-'
  return `${prefix}${inrFormatter.format(abs)}`
}
