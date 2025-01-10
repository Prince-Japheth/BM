export const formatValue = (value, isRequest = false) => {
    const numericValue = Number(value);
    if (isNaN(numericValue)) return '$0.00';
  
    if (isRequest) {
      return numericValue.toLocaleString();
    }
    if (numericValue >= 1e9) return `$${(numericValue / 1e9).toFixed(1)}B`;
    if (numericValue >= 1e6) return `$${(numericValue / 1e6).toFixed(1)}M`;
    if (numericValue >= 1e3) return `$${(numericValue / 1e3).toFixed(1)}K`;
    return `$${numericValue.toFixed(2)}`;
  };
  
  