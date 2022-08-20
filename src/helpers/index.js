export const getKeyByValue = (obj, val) => {
  const desiredKey = Object.keys(obj).find((key) => obj[key].includes(val));
  return desiredKey;
};

export const removeAllSpaces = (str_value) => {
  return str_value.split(" ").join("");
};

export const findAndPerformMath = (str_value) => {
  const math = str_value.match(/\d+ ?(\+?-?\*?\/?)? ?/g);
  if (!math || isNaN(removeAllSpaces(math.join("")).slice(-1))) return false;
  return String(eval(removeAllSpaces(math.join(""))));
};

const answers = {
  "как дела": "все впорядке а ты как",
};

export const getAnswer = (str_value) => {
  if (str_value in answers) return answers[str_value];
};
