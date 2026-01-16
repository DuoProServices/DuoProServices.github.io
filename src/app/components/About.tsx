import { Shield, Award, Heart, CheckCircle, Linkedin } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useLanguage } from "../contexts/LanguageContext";

export function About() {
  const { t } = useLanguage();
  
  const values = [
    {
      icon: Shield,
      title: t("about.value1Title"),
      description: t("about.value1Desc")
    },
    {
      icon: Award,
      title: t("about.value2Title"),
      description: t("about.value2Desc")
    },
    {
      icon: Heart,
      title: t("about.value3Title"),
      description: t("about.value3Desc")
    }
  ];

  const team = [
    {
      name: t("about.team1Name"),
      linkedin: "https://www.linkedin.com/in/veronicaprass"
    },
    {
      name: t("about.team2Name"),
      linkedin: "https://www.linkedin.com/in/germana-azevedo-a62ab832/"
    }
  ];

  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Image */}
          <div className="order-2 lg:order-1">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1654966543470-a867e2c40c48?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGNvbGxhYm9yYXRpb24lMjBwYXJ0bmVyc2hpcCUyMGNhbmFkYXxlbnwxfHx8fDE3NjYxODA1NDR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Business collaboration partnership"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Right Column - Content */}
          <div className="order-1 lg:order-2 space-y-6">
            <div className="space-y-3">
              <div className="text-blue-600 uppercase tracking-wide">{t("about.section")}</div>
              <h2 className="text-4xl text-slate-900">
                {t("about.title")}
              </h2>
            </div>

            <p className="text-lg text-slate-600">
              {t("about.p1")}
            </p>

            <p className="text-slate-600">
              {t("about.p2")}
            </p>

            {/* Values Grid */}
            <div className="grid gap-6 pt-6">
              {values.map((value) => (
                <div key={value.title} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                      <value.icon className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg text-slate-900 mb-1">{value.title}</h3>
                    <p className="text-slate-600">{value.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-start gap-3 pt-4 bg-slate-50 p-6 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <div className="text-slate-900 mb-1">{t("about.craCompliant")}</div>
                <p className="text-sm text-slate-600">
                  {t("about.craCompliantDesc")}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="mt-24">
          <div className="text-center mb-12">
            <div className="text-blue-600 uppercase tracking-wide mb-3">{t("about.teamSection")}</div>
            <h2 className="text-4xl text-slate-900">{t("about.teamTitle")}</h2>
          </div>

          <div className="flex flex-wrap justify-center gap-6 max-w-2xl mx-auto">
            {team.map((member) => (
              <a
                key={member.name}
                href={member.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-slate-50 px-6 py-4 rounded-lg hover:bg-blue-50 transition-colors group"
              >
                <Linkedin className="w-6 h-6 text-blue-600 group-hover:text-blue-700" />
                <span className="text-lg text-slate-900 group-hover:text-blue-700">{member.name}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}