import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import en from './en.json';
import tr from './tr.json';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  getLanguage as getLanguageAsync,
  getLocalStorage,
  setLanguage,
  setLocalStorage,
} from '../utils/AsyncStorageUtils';

const resources = {
  en: en,
  tr: tr,
};
const initI18n = async () => {
  try {
    let storedLanguage = await getLanguageAsync();
    if (storedLanguage === undefined) {
      await setLanguage('tr');
      storedLanguage = 'tr';
    }
    if (storedLanguage) {
      await i18n.use(initReactI18next).init({
        compatibilityJSON: 'v3',
        resources,
        lng: storedLanguage || 'tr',
        interpolation: {
          escapeValue: false,
        },
        fallbackLng: 'tr',
      });
      return i18n;
    } else {
      console.error('No language in AsyncStorage.');
    }
  } catch (error) {
    console.error('Error initializing i18n:', error);
  }
};
export const getLanguage = () => i18n.language;

export type Resource = keyof typeof tr | keyof typeof en;

export const getResourceByKey = (key: Resource) => {
  let language = getLanguage();
  let res = resources as any;
  return res[language][key];
};

export default initI18n;
