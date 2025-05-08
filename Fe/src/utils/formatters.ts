export const formatCurrency = (amount: number | string | null | undefined): string => {
  if (amount === null || amount === undefined) return "0 ₫";
  
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(numericAmount);
};

export const formatDate = (dateString: string | Date | null | undefined): string => {
  if (!dateString) return "N/A";
  
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  
  if (isNaN(date.getTime())) return "N/A";
  
  return date.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

export const formatMonthYear = (dateString: string | Date | null | undefined): string => {
  if (!dateString) return "N/A";
  
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  
  if (isNaN(date.getTime())) return "N/A";
  
  return date.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'numeric'
  });
};
