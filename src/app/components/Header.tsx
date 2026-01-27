import { Link } from 'react-router';
import { Globe, LogIn, User } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export default function Header() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="h-10 w-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">DP</span>
            </div>
            <span className="text-gray-900 font-semibold text-xl">DuoPro Services</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <a href="#about" className="text-gray-700 hover:text-blue-600 transition-colors">
              {t('header.about')}
            </a>
            <a href="#services" className="text-gray-700 hover:text-blue-600 transition-colors">
              {t('header.services')}
            </a>
            <a href="#pricing" className="text-gray-700 hover:text-blue-600 transition-colors">
              {t('header.pricing')}
            </a>
            <a href="#process" className="text-gray-700 hover:text-blue-600 transition-colors">
              {t('header.process')}
            </a>
            <a href="#contact" className="text-gray-700 hover:text-blue-600 transition-colors">
              {t('header.contact')}
            </a>
          </nav>

          <div className="flex items-center gap-4">
            {/* Language Switcher */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'fr' : 'en')}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 hover:border-blue-600 hover:bg-blue-50 transition-colors"
            >
              <Globe className="w-4 h-4" />
              <span className="text-sm font-medium">{language === 'en' ? 'FR' : 'EN'}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}