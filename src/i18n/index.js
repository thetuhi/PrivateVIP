import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import en from './locales/en.json'
import ru from './locales/ru.json'
import tr from './locales/tr.json'

// Three locales at roughly 4 KB gzipped each. Bundling them is cheaper than
// the request waterfall and the flash of untranslated text that lazy loading
// would introduce on a first paint.
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      ru: { translation: ru },
      tr: { translation: tr },
    },
    fallbackLng: 'en',
    supportedLngs: ['en', 'ru', 'tr'],
    // 'en-GB' and 'ru-RU' should resolve to 'en' and 'ru' rather than falling
    // all the way back to English for Russian speakers.
    load: 'languageOnly',
    nonExplicitSupportedLngs: true,
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      lookupLocalStorage: 'pvi-lang',
      caches: ['localStorage'],
    },
    interpolation: {
      // React already escapes everything it renders.
      escapeValue: false,
    },
    returnEmptyString: false,
  })

// Keep <html lang> in sync so screen readers switch voice and the browser
// applies the right hyphenation and quote rules.
i18n.on('languageChanged', (lng) => {
  document.documentElement.lang = lng
})

export default i18n
