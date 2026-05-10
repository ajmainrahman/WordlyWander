import { createContext, useContext, useState } from "react";

type Lang = "en" | "bn";

interface Strings {
  home: string;
  bangladesh: string;
  blog: string;
  photos: string;
  about: string;
  tagline: string;
  latestPosts: string;
  featuredDestinations: string;
  photoJournal: string;
  newsletterTitle: string;
  newsletterSub: string;
  subscribe: string;
  readMore: string;
  backToTop: string;
  ourStory: string;
  searchPlaceholder: string;
  filterAll: string;
  bestTime: string;
  highlights: string;
  familyRating: string;
  relatedDest: string;
  emailPlaceholder: string;
  allCategories: string;
}

const en: Strings = {
  home: "Home",
  bangladesh: "Travel",
  blog: "Scripts",
  photos: "Postcards",
  about: "Our Story",
  tagline: "Wordly + Wander — stories from a writing family that roams.",
  latestPosts: "Latest from the Blog",
  featuredDestinations: "Featured Destinations",
  photoJournal: "Postcards",
  newsletterTitle: "Join our wander",
  newsletterSub: "Get new stories in your inbox",
  subscribe: "Subscribe",
  readMore: "Read More",
  backToTop: "Back to Top",
  ourStory: "Our Story",
  searchPlaceholder: "Search posts...",
  filterAll: "All",
  bestTime: "Best Time to Visit",
  highlights: "Travel Highlights",
  familyRating: "Family-Friendly Rating",
  relatedDest: "Related Destinations",
  emailPlaceholder: "Your email address",
  allCategories: "All Categories",
};

const bn: Strings = {
  home: "হোম",
  bangladesh: "ভ্রমণ",
  blog: "স্ক্রিপ্টস",
  photos: "পোস্টকার্ড",
  about: "আমাদের গল্প",
  tagline: "ওয়ার্ডলি + ওয়ান্ডার — একটি লেখক পরিবারের ঘুরে বেড়ানোর গল্প।",
  latestPosts: "সর্বশেষ ব্লগ পোস্ট",
  featuredDestinations: "বিশেষ গন্তব্য",
  photoJournal: "পোস্টকার্ড ও অনুচ্ছেদ",
  newsletterTitle: "আমাদের সাথে ঘুরুন",
  newsletterSub: "নতুন গল্প সরাসরি আপনার ইনবক্সে পান",
  subscribe: "সাবস্ক্রাইব",
  readMore: "আরো পড়ুন",
  backToTop: "উপরে যান",
  ourStory: "আমাদের গল্প",
  searchPlaceholder: "পোস্ট খুঁজুন...",
  filterAll: "সব",
  bestTime: "ভ্রমণের সেরা সময়",
  highlights: "ভ্রমণ হাইলাইটস",
  familyRating: "পারিবারিক রেটিং",
  relatedDest: "সংশ্লিষ্ট গন্তব্য",
  emailPlaceholder: "আপনার ইমেইল",
  allCategories: "সব বিভাগ",
};

interface LanguageContextType {
  lang: Lang;
  toggleLang: () => void;
  t: Strings;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "en",
  toggleLang: () => {},
  t: en,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");
  const toggleLang = () => setLang((l) => (l === "en" ? "bn" : "en"));
  return (
    <LanguageContext.Provider value={{ lang, toggleLang, t: lang === "en" ? en : bn }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  return useContext(LanguageContext);
}
