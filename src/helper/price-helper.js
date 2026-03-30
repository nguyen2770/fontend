export const parsePriceVnd = function (price) {
  if (!price) return 0;
  const numb = parseFloat(price);
  return numb.toLocaleString("vi-VN", { style: "currency", currency: "VND"});
};
export const priceFormatter = (value) => {
  if (!value) return null;
  return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

// Định dạng số có dấu phẩy ngăn cách hàng nghìn
export const formatCurrency = (value) => {
  if (value === null || value === undefined) return '';
  return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

// Loại bỏ ký tự $, dấu phẩy để giữ lại số thô
export const parseCurrency = (value) => {
  return value?.replace(/\$\s?|(,*)/g, '') || '';
};