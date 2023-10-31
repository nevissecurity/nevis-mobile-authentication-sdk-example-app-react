/**
 * Copyright © 2023 Nevis Security AG. All rights reserved.
 */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import translationEN from './en/translation.json';

export const resources = {
	en: {
		translation: translationEN,
	},
};

i18n.use(initReactI18next).init({
	compatibilityJSON: 'v3',
	resources,
	lng: 'en',
	fallbackLng: 'en',
	interpolation: {
		escapeValue: false,
	},
});
