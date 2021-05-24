import i18n from "i18next";
import detector from "i18next-browser-languagedetector";
import { reactI18nextModule } from "react-i18next";
import XHR from "i18next-http-backend";

import translationEN from './resources/translations/translationEN.json';
import translationHU from './resources/translations/translationHU.json';

// the translations
const resources = {
    en: {
      translation: translationEN
    },
    hu: {
      translation: translationHU
    }
  };

i18n
    .use(XHR)
    .use(detector)
    .use(reactI18nextModule) // passes i18n down to react-i18next
    .init({
    resources,
    detection: { order: ["path", "navigator"] },
    fallbackLng: "hu", // use en if detected lng is not available
    keySeparator: false, // we do not use keys in form messages.welcome
    interpolation: {
        escapeValue: false // react already safes from xss
    }
});

export default i18n;