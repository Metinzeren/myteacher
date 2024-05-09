import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import tr from './tr.json';

const resources = {
  tr: tr,
};
i18n.use(initReactI18next).init({
  compatibilityJSON: 'v3',
  resources,
  lng: 'tr',
});

export default {i18n};
