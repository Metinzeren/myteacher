import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import tr from './tr.json';
import en from './en.json';

const resources = {
  tr: {
    translation: tr,
    addStudentForm: tr.addStudentForm,
    addClassRoomForm: tr.addClassRoomForm,
  },
  en: en,
};

i18n.use(initReactI18next).init({
  compatibilityJSON: 'v3',
  resources,
  lng: 'tr',
  interpolation: {
    escapeValue: false,
  },
});
export const getLanguage = () => i18n.language;
export type Resource = keyof (typeof resources)['tr' | 'en'];
export const getResourceByKey = (key: Resource) => {
  let language = getLanguage();
  let res = resources as any;
  return res[language][key as any];
};
export default i18n;
