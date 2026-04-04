import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

export type AppLanguage = 'en' | 'ar';

export function useLanguage() {
  const { i18n } = useTranslation();
  const currentLang = (i18n.language === 'ar' ? 'ar' : 'en') as AppLanguage;
  const isRTL = currentLang === 'ar';

  const setLanguage = useCallback(
    (lang: AppLanguage) => {
      i18n.changeLanguage(lang);
      document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = lang;
      localStorage.setItem('dressnmore_lang', lang);
    },
    [i18n],
  );

  const toggleLanguage = useCallback(() => {
    setLanguage(currentLang === 'ar' ? 'en' : 'ar');
  }, [currentLang, setLanguage]);

  return { isRTL, currentLang, toggleLanguage, setLanguage };
}
