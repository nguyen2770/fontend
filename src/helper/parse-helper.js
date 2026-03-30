export const parseToLabel = function (arr, value) {
  return arr.find((item) => item.value == value)?.label;
};
export const getOptionColor = (options, value) => {
  const option = (options || []).find((item) => item.value === value);
  return option?.color;
};
