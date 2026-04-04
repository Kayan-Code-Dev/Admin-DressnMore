import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import messages from './local/index';

const savedLang = (localStorage.getItem('dressnmore_lang') ?? 'ar') as 'en' | 'ar';

// Set initial HTML direction and lang
document.documentElement.dir = savedLang === 'ar' ? 'rtl' : 'ltr';
document.documentElement.lang = savedLang;

i18n
  .use(initReactI18next)
  .init({
    lng: savedLang,
    fallbackLng: 'en',
    debug: false,
    resources: messages,
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
