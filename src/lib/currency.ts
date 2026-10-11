interface FormatINROptions {
  showDecimals?: boolean;
  compact?: boolean;
}

/**
 * Formats a number into Indian Rupee (INR) representation.
 * Example: 10000 -> ₹10,000, 171.05 -> ₹171.05
 */
export function formatINR(amount: number, options: FormatINROptions = {}): string {
  const { showDecimals = false, compact = false } = options;

  if (isNaN(amount)) {
    return '₹0';
  }

  if (compact && Math.abs(amount) >= 1000) {
    if (Math.abs(amount) >= 100000) {
      const lakhs = (amount / 100000).toFixed(1);
      return `₹${lakhs.endsWith('.0') ? lakhs.slice(0, -2) : lakhs}L`;
    }
    const thousands = (amount / 1000).toFixed(1);
    return `₹${thousands.endsWith('.0') ? thousands.slice(0, -2) : thousands}k`;
  }

  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0,
  });

  return formatter.format(amount);
}

/**
 * Safely parses numeric input from string, removing currency symbols and commas.
 */
export function parseINR(value: string): number {
  const cleaned = value.replace(/[^0-9.-]/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
}
