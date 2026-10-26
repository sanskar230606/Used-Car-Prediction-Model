export function formatIndianRupees(val) {
  if (val === undefined || val === null || isNaN(val)) return '₹0';
  const num = Math.round(Number(val));
  if (num >= 10000000) {
    return `₹${(num / 10000000).toFixed(2)} Cr`;
  } else if (num >= 100000) {
    return `₹${(num / 100000).toFixed(2)} Lakh`;
  } else {
    return `₹${num.toLocaleString('en-IN')}`;
  }
}

export function formatExactINR(val) {
  if (val === undefined || val === null || isNaN(val)) return '₹0';
  return `₹${Math.round(Number(val)).toLocaleString('en-IN')}`;
}
