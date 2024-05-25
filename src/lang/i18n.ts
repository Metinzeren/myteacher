import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import tr from './tr.json';
import en from './en.json';

const resources = {
  tr: {
    translation: tr,
    addStudentForm: tr.addStudentForm,
  },
  en: en,
};

i18n.use(initReactI18next).init({
  compatibilityJSON: 'v3', // Eğer JSON formatı ile ilgili bir sorun yoksa bu satırı kaldırabilirsiniz
  resources,
  lng: 'tr', // Varsayılan dil
  interpolation: {
    escapeValue: false, // React zaten XSS'den koruyor
  },
});

export default i18n;
