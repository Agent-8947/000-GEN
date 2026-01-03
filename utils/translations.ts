// Language translations for multi-language support
// Supported languages: EN, UK, DE, FR, ES, IT, ZH, RU

export const LANGUAGE_NAMES: Record<string, { name: string; flag: string }> = {
    en: { name: 'English', flag: '🇬🇧' },
    uk: { name: 'Українська', flag: '🇺🇦' },
    de: { name: 'Deutsch', flag: '🇩🇪' },
    fr: { name: 'Français', flag: '🇫🇷' },
    es: { name: 'Español', flag: '🇪🇸' },
    it: { name: 'Italiano', flag: '🇮🇹' },
    zh: { name: '中文', flag: '🇨🇳' },
    ru: { name: 'Русский', flag: '🇷🇺' }
};

export const translations: Record<string, Record<string, string>> = {
    en: {
        // Navigation
        'nav.home': 'Home',
        'nav.about': 'About',
        'nav.services': 'Services',
        'nav.contact': 'Contact',

        // Buttons
        'btn.getStarted': 'Get Started',
        'btn.learnMore': 'Learn More',
        'btn.send': 'Send',
        'btn.submit': 'Submit',
        'btn.cancel': 'Cancel',

        // Form
        'form.name': 'Name',
        'form.email': 'Email',
        'form.message': 'Message',
        'form.placeholder.name': 'Your name',
        'form.placeholder.email': 'your@email.com',
        'form.placeholder.message': 'Your message...',

        // Common
        'common.readMore': 'Read More',
        'common.viewAll': 'View All',
        'common.close': 'Close',
        'common.open': 'Open'
    },

    uk: {
        // Navigation
        'nav.home': 'Головна',
        'nav.about': 'Про нас',
        'nav.services': 'Послуги',
        'nav.contact': 'Контакти',

        // Buttons
        'btn.getStarted': 'Почати',
        'btn.learnMore': 'Дізнатися більше',
        'btn.send': 'Надіслати',
        'btn.submit': 'Відправити',
        'btn.cancel': 'Скасувати',

        // Form
        'form.name': "Ім'я",
        'form.email': 'Email',
        'form.message': 'Повідомлення',
        'form.placeholder.name': "Ваше ім'я",
        'form.placeholder.email': 'ваш@email.com',
        'form.placeholder.message': 'Ваше повідомлення...',

        // Common
        'common.readMore': 'Читати далі',
        'common.viewAll': 'Переглянути все',
        'common.close': 'Закрити',
        'common.open': 'Відкрити'
    },

    de: {
        // Navigation
        'nav.home': 'Startseite',
        'nav.about': 'Über uns',
        'nav.services': 'Dienstleistungen',
        'nav.contact': 'Kontakt',

        // Buttons
        'btn.getStarted': 'Loslegen',
        'btn.learnMore': 'Mehr erfahren',
        'btn.send': 'Senden',
        'btn.submit': 'Absenden',
        'btn.cancel': 'Abbrechen',

        // Form
        'form.name': 'Name',
        'form.email': 'E-Mail',
        'form.message': 'Nachricht',
        'form.placeholder.name': 'Ihr Name',
        'form.placeholder.email': 'ihre@email.com',
        'form.placeholder.message': 'Ihre Nachricht...',

        // Common
        'common.readMore': 'Weiterlesen',
        'common.viewAll': 'Alle anzeigen',
        'common.close': 'Schließen',
        'common.open': 'Öffnen'
    },

    fr: {
        // Navigation
        'nav.home': 'Accueil',
        'nav.about': 'À propos',
        'nav.services': 'Services',
        'nav.contact': 'Contact',

        // Buttons
        'btn.getStarted': 'Commencer',
        'btn.learnMore': 'En savoir plus',
        'btn.send': 'Envoyer',
        'btn.submit': 'Soumettre',
        'btn.cancel': 'Annuler',

        // Form
        'form.name': 'Nom',
        'form.email': 'Email',
        'form.message': 'Message',
        'form.placeholder.name': 'Votre nom',
        'form.placeholder.email': 'votre@email.com',
        'form.placeholder.message': 'Votre message...',

        // Common
        'common.readMore': 'Lire la suite',
        'common.viewAll': 'Voir tout',
        'common.close': 'Fermer',
        'common.open': 'Ouvrir'
    },

    es: {
        // Navigation
        'nav.home': 'Inicio',
        'nav.about': 'Acerca de',
        'nav.services': 'Servicios',
        'nav.contact': 'Contacto',

        // Buttons
        'btn.getStarted': 'Empezar',
        'btn.learnMore': 'Saber más',
        'btn.send': 'Enviar',
        'btn.submit': 'Enviar',
        'btn.cancel': 'Cancelar',

        // Form
        'form.name': 'Nombre',
        'form.email': 'Email',
        'form.message': 'Mensaje',
        'form.placeholder.name': 'Tu nombre',
        'form.placeholder.email': 'tu@email.com',
        'form.placeholder.message': 'Tu mensaje...',

        // Common
        'common.readMore': 'Leer más',
        'common.viewAll': 'Ver todo',
        'common.close': 'Cerrar',
        'common.open': 'Abrir'
    },

    it: {
        // Navigation
        'nav.home': 'Home',
        'nav.about': 'Chi siamo',
        'nav.services': 'Servizi',
        'nav.contact': 'Contatti',

        // Buttons
        'btn.getStarted': 'Inizia',
        'btn.learnMore': 'Scopri di più',
        'btn.send': 'Invia',
        'btn.submit': 'Invia',
        'btn.cancel': 'Annulla',

        // Form
        'form.name': 'Nome',
        'form.email': 'Email',
        'form.message': 'Messaggio',
        'form.placeholder.name': 'Il tuo nome',
        'form.placeholder.email': 'tua@email.com',
        'form.placeholder.message': 'Il tuo messaggio...',

        // Common
        'common.readMore': 'Leggi di più',
        'common.viewAll': 'Vedi tutto',
        'common.close': 'Chiudi',
        'common.open': 'Apri'
    },

    zh: {
        // Navigation
        'nav.home': '首页',
        'nav.about': '关于',
        'nav.services': '服务',
        'nav.contact': '联系',

        // Buttons
        'btn.getStarted': '开始',
        'btn.learnMore': '了解更多',
        'btn.send': '发送',
        'btn.submit': '提交',
        'btn.cancel': '取消',

        // Form
        'form.name': '姓名',
        'form.email': '邮箱',
        'form.message': '消息',
        'form.placeholder.name': '您的姓名',
        'form.placeholder.email': 'your@email.com',
        'form.placeholder.message': '您的消息...',

        // Common
        'common.readMore': '阅读更多',
        'common.viewAll': '查看全部',
        'common.close': '关闭',
        'common.open': '打开'
    },

    ru: {
        // Navigation
        'nav.home': 'Главная',
        'nav.about': 'О нас',
        'nav.services': 'Услуги',
        'nav.contact': 'Контакты',

        // Buttons
        'btn.getStarted': 'Начать',
        'btn.learnMore': 'Узнать больше',
        'btn.send': 'Отправить',
        'btn.submit': 'Отправить',
        'btn.cancel': 'Отмена',

        // Form
        'form.name': 'Имя',
        'form.email': 'Email',
        'form.message': 'Сообщение',
        'form.placeholder.name': 'Ваше имя',
        'form.placeholder.email': 'ваш@email.com',
        'form.placeholder.message': 'Ваше сообщение...',

        // Common
        'common.readMore': 'Читать далее',
        'common.viewAll': 'Посмотреть все',
        'common.close': 'Закрыть',
        'common.open': 'Открыть'
    }
};

// Hook for using translations
export const useTranslation = (currentLanguage: string) => {
    const t = (key: string): string => {
        return translations[currentLanguage]?.[key] || translations['en'][key] || key;
    };

    return { t };
};
