import { useState } from "react";
import { FileText, Briefcase, Calculator, FileBarChart, ChevronDown } from "lucide-react";
<<<<<<< HEAD
=======
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
>>>>>>> 4611dd44203dcbfb0e686683575a9f9bd31460a8
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
<<<<<<< HEAD
=======
      subServices: [
        {
          titleKey: "services.personal1Title",
          descKey: "services.personal1Desc",
          features: [
            "services.personal1Feature1",
            "services.personal1Feature2",
            "services.personal1Feature3",
            "services.personal1Feature4",
          ]
        },
        {
          titleKey: "services.personal2Title",
          descKey: "services.personal2Desc",
          features: [
            "services.personal2Feature1",
            "services.personal2Feature2",
            "services.personal2Feature3",
            "services.personal2Feature4",
          ]
        },
        {
          titleKey: "services.personal3Title",
          descKey: "services.personal3Desc",
          features: [
            "services.personal3Feature1",
            "services.personal3Feature2",
            "services.personal3Feature3",
            "services.personal3Feature4",
          ]
        }
      ]
>>>>>>> 4611dd44203dcbfb0e686683575a9f9bd31460a8
    },
    {
      id: "business",
      icon: Briefcase,
      color: "green",
      titleKey: "services.main2Title",
      descKey: "services.main2Desc",
<<<<<<< HEAD
=======
      subServices: [
        {
          titleKey: "services.business1Title",
          descKey: "services.business1Desc",
          features: [
            "services.business1Feature1",
            "services.business1Feature2",
            "services.business1Feature3",
            "services.business1Feature4",
          ]
        },
        {
          titleKey: "services.business2Title",
          descKey: "services.business2Desc",
          features: [
            "services.business2Feature1",
            "services.business2Feature2",
            "services.business2Feature3",
            "services.business2Feature4",
          ]
        },
        {
          titleKey: "services.business3Title",
          descKey: "services.business3Desc",
          features: [
            "services.business3Feature1",
            "services.business3Feature2",
            "services.business3Feature3",
            "services.business3Feature4",
          ]
        }
      ]
>>>>>>> 4611dd44203dcbfb0e686683575a9f9bd31460a8
    },
    {
      id: "bookkeeping",
      icon: Calculator,
      color: "purple",
      titleKey: "services.main3Title",
      descKey: "services.main3Desc",
<<<<<<< HEAD
=======
      subServices: [
        {
          titleKey: "services.bookkeeping1Title",
          descKey: "services.bookkeeping1Desc",
          features: [
            "services.bookkeeping1Feature1",
            "services.bookkeeping1Feature2",
            "services.bookkeeping1Feature3",
            "services.bookkeeping1Feature4",
          ]
        },
        {
          titleKey: "services.bookkeeping2Title",
          descKey: "services.bookkeeping2Desc",
          features: [
            "services.bookkeeping2Feature1",
            "services.bookkeeping2Feature2",
            "services.bookkeeping2Feature3",
            "services.bookkeeping2Feature4",
          ]
        },
        {
          titleKey: "services.bookkeeping3Title",
          descKey: "services.bookkeeping3Desc",
          features: [
            "services.bookkeeping3Feature1",
            "services.bookkeeping3Feature2",
            "services.bookkeeping3Feature3",
            "services.bookkeeping3Feature4",
          ]
        }
      ]
>>>>>>> 4611dd44203dcbfb0e686683575a9f9bd31460a8
    },
    {
      id: "reports",
      icon: FileBarChart,
      color: "orange",
      titleKey: "services.main4Title",
      descKey: "services.main4Desc",
<<<<<<< HEAD
=======
      subServices: [
        {
          titleKey: "services.reports1Title",
          descKey: "services.reports1Desc",
          features: [
            "services.reports1Feature1",
            "services.reports1Feature2",
            "services.reports1Feature3",
            "services.reports1Feature4",
          ]
        },
        {
          titleKey: "services.reports2Title",
          descKey: "services.reports2Desc",
          features: [
            "services.reports2Feature1",
            "services.reports2Feature2",
            "services.reports2Feature3",
            "services.reports2Feature4",
          ]
        },
        {
          titleKey: "services.reports3Title",
          descKey: "services.reports3Desc",
          features: [
            "services.reports3Feature1",
            "services.reports3Feature2",
            "services.reports3Feature3",
            "services.reports3Feature4",
          ]
        }
      ]
>>>>>>> 4611dd44203dcbfb0e686683575a9f9bd31460a8
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: {
        bg: "bg-blue-100",
        text: "text-blue-600",
<<<<<<< HEAD
        chevron: "text-blue-500"
=======
        border: "border-blue-300",
        hover: "hover:border-blue-400"
>>>>>>> 4611dd44203dcbfb0e686683575a9f9bd31460a8
      },
      green: {
        bg: "bg-green-100",
        text: "text-green-600",
<<<<<<< HEAD
        chevron: "text-green-500"
=======
        border: "border-green-300",
        hover: "hover:border-green-400"
>>>>>>> 4611dd44203dcbfb0e686683575a9f9bd31460a8
      },
      purple: {
        bg: "bg-purple-100",
        text: "text-purple-600",
<<<<<<< HEAD
        chevron: "text-purple-500"
=======
        border: "border-purple-300",
        hover: "hover:border-purple-400"
>>>>>>> 4611dd44203dcbfb0e686683575a9f9bd31460a8
      },
      orange: {
        bg: "bg-orange-100",
        text: "text-orange-600",
<<<<<<< HEAD
        chevron: "text-orange-500"
=======
        border: "border-orange-300",
        hover: "hover:border-orange-400"
>>>>>>> 4611dd44203dcbfb0e686683575a9f9bd31460a8
      }
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

<<<<<<< HEAD
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
=======
  const toggleService = (id: string) => {
    setExpandedService(expandedService === id ? null : id);
  };

  return (
    <section id="services" className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="text-blue-600 uppercase tracking-wide mb-3">{t("services.section")}</div>
          <h2 className="text-4xl text-slate-900 mb-4">
            {t("services.title")}
          </h2>
          <p className="text-lg text-slate-600">
>>>>>>> 4611dd44203dcbfb0e686683575a9f9bd31460a8
            {t("services.description")}
          </p>
        </div>

<<<<<<< HEAD
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
=======
        {/* Main Service Cards - Grid 2x2 */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {mainServices.map((service) => {
            const colorClasses = getColorClasses(service.color);
            const isExpanded = expandedService === service.id;
            
            return (
              <div key={service.id}>
                <button
                  onClick={() => toggleService(service.id)}
                  className={`w-full text-left bg-white rounded-xl border-2 ${
                    isExpanded ? colorClasses.border : 'border-slate-200'
                  } ${colorClasses.hover} hover:shadow-lg transition-all p-6`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className={`w-14 h-14 ${colorClasses.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                        <service.icon className={`w-7 h-7 ${colorClasses.text}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl text-slate-900 mb-2">
                          {t(service.titleKey)}
                        </h3>
                        <p className="text-slate-600">
                          {t(service.descKey)}
                        </p>
                      </div>
                    </div>
                    <ChevronDown 
                      className={`w-6 h-6 ${colorClasses.text} flex-shrink-0 ml-2 transition-transform ${
                        isExpanded ? 'rotate-180' : ''
                      }`}
                    />
                  </div>
                </button>

                {/* Expanded Sub-services */}
                <div
                  className={`grid gap-4 mt-4 transition-all duration-300 overflow-hidden ${
                    isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="grid sm:grid-cols-3 gap-4">
                      {service.subServices.map((subService, idx) => (
                        <Card key={idx} className="border-slate-200 bg-white">
                          <CardHeader className="pb-3">
                            <CardTitle className="text-base text-slate-900">
                              {t(subService.titleKey)}
                            </CardTitle>
                            <CardDescription className="text-sm text-slate-600">
                              {t(subService.descKey)}
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <ul className="space-y-2">
                              {subService.features.map((featureKey) => (
                                <li key={featureKey} className="flex items-start gap-2 text-sm text-slate-600">
                                  <svg
                                    className={`w-4 h-4 ${colorClasses.text} flex-shrink-0 mt-0.5`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M5 13l4 4L19 7"
                                    />
                                  </svg>
                                  <span>{t(featureKey)}</span>
                                </li>
                              ))}
                            </ul>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
>>>>>>> 4611dd44203dcbfb0e686683575a9f9bd31460a8
                </div>
              </div>
            );
          })}
        </div>
<<<<<<< HEAD
      </div>
    </section>
  );
}
=======

        {/* CTA Section */}
        <div className="mt-12 bg-blue-50 border border-blue-100 rounded-lg p-8 text-center">
          <h3 className="text-xl text-slate-900 mb-2">
            {t("services.notSureTitle")}
          </h3>
          <p className="text-slate-600 mb-4">
            {t("services.notSureDesc")}
          </p>
        </div>
      </div>
    </section>
  );
}
>>>>>>> 4611dd44203dcbfb0e686683575a9f9bd31460a8
