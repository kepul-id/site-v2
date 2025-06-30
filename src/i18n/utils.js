export function useTranslations(lang) {
  return function t(key) {
    const keys = key.split('.');
    let result = dictionaries[lang];
    for (const k of keys) {
      if (result && typeof result === 'object' && k in result) {
        result = result[k];
      } else {
        return key; // Fallback to key if translation not found
      }
    }
    return result;
  };
}

import en from './en.json';
import id from './id.json';

const dictionaries = {
  en,
  id,
};

console.log("Dictionaries loaded:", dictionaries);
