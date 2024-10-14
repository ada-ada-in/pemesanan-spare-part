export const toTitleCase = (str) => {
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

export const toCapitalizeFirstWordCase = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const toUpperCase = (str) => {
  return str.toUpperCase();
};

export const toLowerCase = (str) => {
  return str.toLowerCase();
};
