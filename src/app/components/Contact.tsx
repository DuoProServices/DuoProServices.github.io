<<<<<<< HEAD
import { Mail, Phone, MapPin, Clock, Send, Calendar, MessageCircle } from "lucide-react";
=======
import { useState } from "react";
import { Mail, Phone, MapPin, Clock, Send, Calendar } from "lucide-react";
>>>>>>> 4611dd44203dcbfb0e686683575a9f9bd31460a8
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { useLanguage } from "../contexts/LanguageContext";
import { toast } from "sonner";
<<<<<<< HEAD
import { API_ENDPOINTS } from "@/config/api";
import { memo, useState } from "react";
import { publicAnonKey } from "/utils/supabase/info";

export const Contact = memo(function Contact() {
=======

export function Contact() {
>>>>>>> 4611dd44203dcbfb0e686683575a9f9bd31460a8
  const { t, language } = useLanguage();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });
  const [submitting, setSubmitting] = useState(false);

<<<<<<< HEAD
  // Toggle between Formspree (false) and Backend (true)
  // Formspree ativo até fazer deploy das Edge Functions no Supabase
  // Para ativar o backend: deploy Edge Functions + adicionar RESEND_API_KEY
  const USE_BACKEND_EMAIL = false; // ⚠️ Usando Formspree temporariamente (já funciona!)

=======
>>>>>>> 4611dd44203dcbfb0e686683575a9f9bd31460a8
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
<<<<<<< HEAD
      console.log('📧 [Contact Form] Submitting form data:', {
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        hasMessage: !!formData.message,
        method: USE_BACKEND_EMAIL ? 'Backend (Resend)' : 'Formspree'
      });

      let response;
      
      if (USE_BACKEND_EMAIL) {
        // Use backend with Resend
        console.log('📧 [Contact Form] Using backend email service...');
        response = await fetch(API_ENDPOINTS.contactSend, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
      } else {
        // Use Formspree
        console.log('📧 [Contact Form] Using Formspree...');
        response = await fetch("https://formspree.io/f/xbddrodk", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
      }

      console.log('📧 [Contact Form] Response status:', response.status);
      console.log('📧 [Contact Form] Response ok:', response.ok);

      if (response.ok) {
        const responseData = await response.json();
        console.log('✅ [Contact Form] Success! Response:', responseData);
        
=======
      const response = await fetch("https://formspree.io/f/duoproservices.info@gmail.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
>>>>>>> 4611dd44203dcbfb0e686683575a9f9bd31460a8
        const messages = {
          en: "Thank you for your inquiry! We'll get back to you soon.",
          fr: "Merci pour votre demande! Nous vous répondrons bientôt.",
          pt: "Obrigado pela sua consulta! Entraremos em contato em breve."
        };
        toast.success(messages[language]);
        setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
      } else {
<<<<<<< HEAD
        const errorText = await response.text();
        console.error('❌ [Contact Form] Failed:', response.status, errorText);
        throw new Error(`Failed to send message: ${response.status}`);
      }
    } catch (error) {
      console.error('❌ [Contact Form] Error:', error);
      const errorMessages = {
        en: "Failed to send message. Please try again or email us directly at duopro@duoproservices.ca",
        fr: "Échec de l'envoi du message. Veuillez réessayer ou nous envoyer un e-mail directement à duopro@duoproservices.ca",
        pt: "Falha ao enviar mensagem. Tente novamente ou envie-nos um e-mail diretamente para duopro@duoproservices.ca"
=======
        throw new Error("Failed to send message");
      }
    } catch (error) {
      const errorMessages = {
        en: "Failed to send message. Please try again or email us directly.",
        fr: "Échec de l'envoi du message. Veuillez réessayer ou nous envoyer un e-mail directement.",
        pt: "Falha ao enviar mensagem. Tente novamente ou envie-nos um e-mail diretamente."
>>>>>>> 4611dd44203dcbfb0e686683575a9f9bd31460a8
      };
      toast.error(errorMessages[language]);
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const contactInfo = [
    {
      icon: Mail,
      labelKey: "contact.emailLabel",
<<<<<<< HEAD
      value: "duopro@duoproservices.ca",
      link: "mailto:duopro@duoproservices.ca"
=======
      value: "duproservices@gmail.com",
      link: "mailto:info@taxservices.ca"
>>>>>>> 4611dd44203dcbfb0e686683575a9f9bd31460a8
    },
    {
      icon: Phone,
      labelKey: "contact.phoneLabel",
<<<<<<< HEAD
      value: "+514 562 7838",
      link: "tel:+15145627838"
    },
    {
      icon: MessageCircle,
      labelKey: "contact.whatsappLabel",
      value: "+1 579 421 1620",
      link: "https://wa.me/15794211620"
=======
      value: "(555) 123-4567",
      link: "tel:+15551234567"
>>>>>>> 4611dd44203dcbfb0e686683575a9f9bd31460a8
    },
    {
      icon: MapPin,
      labelKey: "contact.locationLabel",
<<<<<<< HEAD
      value: "Serving clients across Canada",
=======
      valueKey: "contact.locationValue",
>>>>>>> 4611dd44203dcbfb0e686683575a9f9bd31460a8
      link: null
    },
    {
      icon: Clock,
      labelKey: "contact.hoursLabel",
<<<<<<< HEAD
      value: "Mon-Fri: 9am-6pm EST",
=======
      valueKey: "contact.hoursValue",
>>>>>>> 4611dd44203dcbfb0e686683575a9f9bd31460a8
      link: null
    }
  ];

  return (
    <section id="contact" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="text-blue-600 uppercase tracking-wide mb-3">{t("contact.section")}</div>
          <h2 className="text-4xl text-slate-900 mb-4">
            {t("contact.title")}
          </h2>
          <p className="text-lg text-slate-600">
            {t("contact.description")}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-8">
            <div>
              <h3 className="text-2xl text-slate-900 mb-6">{t("contact.infoTitle")}</h3>
              <div className="space-y-6">
<<<<<<< HEAD
                {contactInfo.map((item) => {
                  const isWhatsApp = item.labelKey === "contact.whatsappLabel";
                  const bgColor = isWhatsApp ? "bg-green-100" : "bg-blue-100";
                  const iconColor = isWhatsApp ? "text-green-600" : "text-blue-600";
                  const hoverColor = isWhatsApp ? "hover:text-green-600" : "hover:text-blue-600";
                  
                  return (
                    <div key={item.labelKey} className="flex items-start gap-4">
                      <div className={`w-12 h-12 ${bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
                        <item.icon className={`w-6 h-6 ${iconColor}`} />
                      </div>
                      <div>
                        <div className="text-sm text-slate-500 mb-1">{t(item.labelKey)}</div>
                        {item.link ? (
                          <a 
                            href={item.link}
                            target={isWhatsApp ? "_blank" : undefined}
                            rel={isWhatsApp ? "noopener noreferrer" : undefined}
                            className={`text-slate-900 ${hoverColor} transition-colors`}
                          >
                            {item.value}
                          </a>
                        ) : (
                          <div className="text-slate-900">{item.valueKey ? t(item.valueKey) : item.value}</div>
                        )}
                      </div>
                    </div>
                  );
                })}
=======
                {contactInfo.map((item) => (
                  <div key={item.labelKey} className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-sm text-slate-500 mb-1">{t(item.labelKey)}</div>
                      {item.link ? (
                        <a 
                          href={item.link}
                          className="text-slate-900 hover:text-blue-600 transition-colors"
                        >
                          {item.value}
                        </a>
                      ) : (
                        <div className="text-slate-900">{item.valueKey ? t(item.valueKey) : item.value}</div>
                      )}
                    </div>
                  </div>
                ))}
>>>>>>> 4611dd44203dcbfb0e686683575a9f9bd31460a8
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-slate-50 border border-blue-100 rounded-lg p-6">
              <h4 className="text-slate-900 mb-2">{t("contact.taxSeasonTitle")}</h4>
              <p className="text-sm text-slate-600 mb-3">
                {t("contact.taxSeasonDesc")}
              </p>
              <p className="text-sm text-slate-600">
                {t("contact.virtualDesc")}
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8">
              <h3 className="text-2xl text-slate-900 mb-6">{t("contact.formTitle")}</h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">{t("contact.nameLabel")} *</Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder={t("contact.namePlaceholder")}
                      className="bg-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">{t("contact.emailLabel")} *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder={t("contact.emailPlaceholder")}
                      className="bg-white"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="phone">{t("contact.phoneLabel")}</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder={t("contact.phonePlaceholder")}
                      className="bg-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">{t("contact.subjectLabel")} *</Label>
                    <Input
                      id="subject"
                      name="subject"
                      type="text"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder={t("contact.subjectPlaceholder")}
                      className="bg-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">{t("contact.messageLabel")} *</Label>
                  <Textarea
                    id="message"
                    name="message"
                    required
                    value={formData.message}
                    onChange={handleChange}
                    placeholder={t("contact.messagePlaceholder")}
                    rows={6}
                    className="bg-white resize-none"
                  />
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-slate-600">
                  <p className="mb-2">
                    <strong className="text-slate-900">{t("contact.privacyTitle")}</strong> {t("contact.privacyText")}
                  </p>
                  <p>
                    {t("contact.consentText")}
                  </p>
                </div>

                <Button 
                  type="submit"
                  size="lg"
                  className="w-full md:w-auto bg-blue-600 hover:bg-blue-700"
                  disabled={submitting}
                >
                  <Send className="w-4 h-4 mr-2" />
                  {submitting ? "Sending..." : t("contact.submitButton")}
                </Button>
              </form>
            </div>

            {/* Calendly Integration */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-8 mt-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-7 h-7 text-green-600" />
                </div>
                <div>
                  <h3 className="text-2xl text-slate-900 mb-2">{t("contact.scheduleTitle")}</h3>
                  <p className="text-slate-600">
                    {t("contact.scheduleDesc")}
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-xl overflow-hidden shadow-sm">
                <iframe
                  src="https://calendly.com/duoproservices-info"
                  width="100%"
                  height="700"
                  frameBorder="0"
                  title="Schedule Consultation"
                  className="rounded-xl"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
<<<<<<< HEAD
});
=======
}
>>>>>>> 4611dd44203dcbfb0e686683575a9f9bd31460a8
