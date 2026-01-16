import { useState } from "react";
import { FileText, Briefcase, Calculator, FileBarChart, ChevronDown } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";

export function Services() {
  const { t } = useLanguage();
  const [expandedService, setExpandedService] = useState<string | null>(null);

  const mainServices = [
    {
      id: "personal",
      icon: FileText,
      color: "blue",
      titleKey: "services.main1Title",
      descKey: "services.main1Desc",
    },
    {
      id: "business",
      icon: Briefcase,
      color: "green",
      titleKey: "services.main2Title",
      descKey: "services.main2Desc",
    },
    {
      id: "bookkeeping",
      icon: Calculator,
      color: "purple",
      titleKey: "services.main3Title",
      descKey: "services.main3Desc",
    },
    {
      id: "reports",
      icon: FileBarChart,
      color: "orange",
      titleKey: "services.main4Title",
      descKey: "services.main4Desc",
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: {
        bg: "bg-blue-100",
        text: "text-blue-600",
        chevron: "text-blue-500"
      },
      green: {
        bg: "bg-green-100",
        text: "text-green-600",
        chevron: "text-green-500"
      },
      purple: {
        bg: "bg-purple-100",
        text: "text-purple-600",
        chevron: "text-purple-500"
      },
      orange: {
        bg: "bg-orange-100",
        text: "text-orange-600",
        chevron: "text-orange-500"
      }
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <section id="services" className="py-20 bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="text-blue-600 uppercase tracking-wide text-sm mb-3">
            {t("services.section")}
          </div>
          <h2 className="text-3xl md:text-4xl text-slate-900 font-semibold mb-4">
            {t("services.title")}
          </h2>
          <p className="text-base text-slate-600">
            {t("services.description")}
          </p>
        </div>

        {/* Service Cards - Grid 2x2 */}
        <div className="grid md:grid-cols-2 gap-6">
          {mainServices.map((service) => {
            const colorClasses = getColorClasses(service.color);
            
            return (
              <div 
                key={service.id}
                className="bg-white rounded-lg p-6 border border-slate-100 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 ${colorClasses.bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <service.icon className={`w-6 h-6 ${colorClasses.text}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg text-slate-900 font-semibold mb-2">
                      {t(service.titleKey)}
                    </h3>
                    <p className="text-sm text-slate-600">
                      {t(service.descKey)}
                    </p>
                  </div>
                  <ChevronDown className={`w-5 h-5 ${colorClasses.chevron} flex-shrink-0`} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}