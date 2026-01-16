import { MessageCircle } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";

export function WhatsAppButton() {
  const { language } = useLanguage();
  
  const phoneNumber = "15794211620"; // Formato WhatsApp: código país + número
  const whatsappUrl = `https://wa.me/${phoneNumber}`;
  
  const messages = {
    en: "Chat on WhatsApp",
    fr: "Discuter sur WhatsApp"
  };

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-lg transition-all duration-300 hover:scale-110 group"
      aria-label={messages[language]}
    >
      <MessageCircle className="w-6 h-6" />
      
      {/* Tooltip */}
      <span className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-slate-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
        {messages[language]}
      </span>
      
      {/* Pulse animation */}
      <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-75"></span>
    </a>
  );
}