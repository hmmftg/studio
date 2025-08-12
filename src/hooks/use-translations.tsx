"use client"

import React, { createContext, useContext, useState, useCallback } from 'react';

const translations = {
  en: {
    registration: {
      title: "Join the Queue",
      description: "Enter your details below to register for a consultation.",
      nameLabel: "Full Name",
      namePlaceholder: "e.g., John Doe",
      phoneLabel: "Phone Number",
      phonePlaceholder: "e.g., (123) 456-7890",
      nationalityLabel: "Nationality",
      nationalityPlaceholder: "Select your nationality",
      submitButton: "Register and See My Place"
    }
  },
  fa: {
    registration: {
      title: "به صف بپیوندید",
      description: "برای ثبت نام در مشاوره، اطلاعات خود را در زیر وارد کنید.",
      nameLabel: "نام کامل",
      namePlaceholder: "مثلا جان دو",
      phoneLabel: "شماره تلفن",
      phonePlaceholder: "مثلا (123) 456-7890",
      nationalityLabel: "ملیت",
      nationalityPlaceholder: "ملیت خود را انتخاب کنید",
      submitButton: "ثبت نام کنید و جای من را ببینید"
    }
  },
  ar: {
    registration: {
      title: "انضم إلى الطابور",
      description: "أدخل بياناتك أدناه للتسجيل في استشارة.",
      nameLabel: "الاسم الكامل",
      namePlaceholder: "مثال: جون دو",
      phoneLabel: "رقم الهاتف",
      phonePlaceholder: "مثال: (123) 456-7890",
      nationalityLabel: "الجنسية",
      nationalityPlaceholder: "اختر جنسيتك",
      submitButton: "سجل وشاهد مكاني"
    }
  },
  tr: {
    registration: {
      title: "Sıraya Katıl",
      description: "Danışma için kaydolmak üzere aşağıya bilgilerinizi girin.",
      nameLabel: "Tam Ad",
      namePlaceholder: "ör. John Doe",
      phoneLabel: "Telefon Numarası",
      phonePlaceholder: "ör. (123) 456-7890",
      nationalityLabel: "Uyruk",
      nationalityPlaceholder: "Uyruğunuzu seçin",
      submitButton: "Kaydol ve Yerimi Gör"
    }
  },
  ur: {
    registration: {
      title: "قطار میں شامل ہوں",
      description: "مشاورت کے لیے رجسٹر ہونے کے لیے نیچے اپنی تفصیلات درج کریں۔",
      nameLabel: "پورا نام",
      namePlaceholder: "مثال کے طور پر جان ڈو",
      phoneLabel: "فون نمبر",
      phonePlaceholder: "مثال کے طور پر (123) 456-7890",
      nationalityLabel: "قومیت",
      nationalityPlaceholder: "اپنی قومیت منتخب کریں",
      submitButton: "رجسٹر کریں اور میری جگہ دیکھیں"
    }
  }
};

type Locale = keyof typeof translations;

interface TranslationsContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

const TranslationsContext = createContext<TranslationsContextType | undefined>(undefined);

export const TranslationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocale] = useState<Locale>('en');

  const t = useCallback((key: string) => {
    const keys = key.split('.');
    let result: any = translations[locale];
    for (const k of keys) {
      result = result?.[k];
      if (result === undefined) {
        // Fallback to English if translation is missing
        let fallbackResult: any = translations.en;
        for (const fk of keys) {
            fallbackResult = fallbackResult?.[fk];
        }
        return fallbackResult || key;
      }
    }
    return result || key;
  }, [locale]);

  return (
    <TranslationsContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </TranslationsContext.Provider>
  );
};

export const useTranslations = () => {
  const context = useContext(TranslationsContext);
  if (context === undefined) {
    throw new Error('useTranslations must be used within a TranslationsProvider');
  }
  return context;
};
