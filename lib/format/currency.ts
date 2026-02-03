export function getCurrencySymbol(code?: string) {
  switch (code) {
    case 'EUR':
      return '€'
    case 'USD':
      return '$'
    case 'GBP':
    default:
      return '£'
  }
}

export function formatCurrency(amount: number, code: string = 'GBP') {
  try {
    return new Intl.NumberFormat('en-GB', { style: 'currency', currency: code, maximumFractionDigits: 0 }).format(amount)
  } catch {
    const sym = getCurrencySymbol(code)
    return `${sym}${amount.toLocaleString()}`
  }
}

