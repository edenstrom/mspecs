export const capitalize = (str?: string) => {
  if (!str) return '';

  return str[0].toUpperCase() + str.slice(1);
};

export const firstCharacterLowercase = (str?: string) => {
  if (!str) return '';

  return str[0].toLowerCase() + str.slice(1);
};
