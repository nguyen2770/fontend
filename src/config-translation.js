import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import translationEN from './locales/en/en.json'
import translationVI from './locales/vi/vi.json'
import { STORAGE_KEY } from './utils/constant';

const resources = {
    en: { translation: translationEN },
    vi: { translation: translationVI }
};

i18next.use(initReactI18next).init({
    lng: localStorage.getItem(STORAGE_KEY.LANGUAGE) ? localStorage.getItem(STORAGE_KEY.LANGUAGE) : 'vi',
    debug: true,
    resources
})
