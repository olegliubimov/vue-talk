import { noBackAnswers } from '/src/composables/constants';
import axios from 'axios';

export const getKeyByValue = (obj, val) => {
  const desiredKey = Object.keys(obj).find((key) => obj[key].includes(val));
  return desiredKey;
};

export const removeAllSpaces = (str_value) => {
  return str_value.split(' ').join('');
};

export const findAndPerformMath = (str_value) => {
  const math = str_value.match(/\d+ ?(\+?-?\*?\/?)? ?/g);
  if (!math || isNaN(removeAllSpaces(math.join('')).slice(-1))) return false;
  return String(eval(removeAllSpaces(math.join(''))));
};

export async function getAnswer(str_value) {
  // if (str_value in answers) return answers[str_value];
  try {
    const res = await axios.get(
      'http://127.0.0.1:5000/?phrase=' + encodeURIComponent(str_value)
    );
    return res.data;
  } catch (error) {
    const randAnswer = Math.floor(Math.random() * noBackAnswers.length);
    return {
      data: noBackAnswers[randAnswer],
    };
  }
}
