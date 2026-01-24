import { Helmet } from 'react-helmet-async';
import { FileText, Users, Globe, CheckCircle, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';
import { useLanguage } from '@/app/contexts/LanguageContext';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import { WhatsAppButton } from '@/app/components/WhatsAppButton';
import { Contact } from '@/app/components/Contact';
import { Pricing } from '@/app/components/Pricing';
import { Process } from '@/app/components/Process';
import { useState } from 'react';
import { useNavigate } from 'react-router';

export default function HomePage() {
  const { t } = useLanguage();
  const [expandedService, setExpandedService] = useState<string | null>(null);
  const navigate = useNavigate();

  const toggleService = (service: string) => {
    setExpandedService(expandedService === service ? null : service);
  };

  return (
    <>
      <Helmet>
        <title>DuoPro Services - Canadian Tax Services | Personal & Small Business Tax Returns</title>
        <meta name="description" content="Professional Canadian tax services for individuals, newcomers, and small businesses. Expert personal and small business tax returns in English and French." />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />

        {/* WhatsApp Button */}
        <WhatsAppButton />

        {/* Hero Section */}
        <section className="relative bg-white pt-24 pb-16 md:pt-32 md:pb-24">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
              {/* Left Column - Content */}
              <div className="space-y-8">
                <div className="inline-block">
                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                    <CheckCircle className="w-4 h-4" />
                    Professional Canadian Tax Services
                  </span>
                </div>
                
                <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
                  {t('hero.title')}
                </h1>
                
                <p className="text-xl text-gray-600 leading-relaxed">
                  {t('hero.subtitle')}
                </p>
              </div>

              {/* Right Column - Image */}
              <div className="relative">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                  <img
                    src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=2000&auto=format&fit=crop"
                    alt="Professional tax services"
                    className="w-full h-[500px] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
                
                {/* Floating Card */}
                <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-xl border border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className="bg-green-100 p-3 rounded-lg">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">CRA Certified</div>
                      <div className="text-sm text-gray-600">Trusted & Secure</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto space-y-6">
              
              {/* Personal Tax */}
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <button
                  onClick={() => toggleService('personal')}
                  className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="text-left">
                      <h3 className="text-xl font-bold text-gray-900">Personal Tax</h3>
                      <p className="text-gray-600 text-sm mt-1">Complete tax preparation and filing services for individuals and newcomers to Canada.</p>
                    </div>
                  </div>
                  {expandedService === 'personal' ? (
                    <ChevronUp className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  )}
                </button>
                
                {expandedService === 'personal' && (
                  <div className="border-t border-gray-200 p-6 bg-gray-50">
                    <div className="grid md:grid-cols-3 gap-6">
                      <div>
                        <h4 className="font-bold text-gray-900 mb-3">T1 Personal Tax Returns</h4>
                        <ul className="space-y-2 text-sm text-gray-700">
                          <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                            <span>Complete preparation and filing of individual income tax returns</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                            <span>Employment income (T4s)</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                            <span>Investment income and capital gains</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                            <span>RRSP contributions and deductions</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                            <span>Medical expenses and credits</span>
                          </li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 mb-3">Newcomer Tax Services</h4>
                        <ul className="space-y-2 text-sm text-gray-700">
                          <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                            <span>Specialized support for new immigrants navigating Canadian taxes</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                            <span>First-time tax filer assistance</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                            <span>Residency status determination</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                            <span>Foreign income reporting</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                            <span>Tax treaty benefits</span>
                          </li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 mb-3">Tax Compliance & Review</h4>
                        <ul className="space-y-2 text-sm text-gray-700">
                          <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                            <span>Ensuring your tax filings meet all CRA requirements</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                            <span>Prior year tax review</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                            <span>Notice of Assessment review</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                            <span>Missing slips and documentation</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                            <span>Amendment requests (T1-ADJ)</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Business Tax */}
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <button
                  onClick={() => toggleService('business')}
                  className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Users className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="text-left">
                      <h3 className="text-xl font-bold text-gray-900">Small Business Tax</h3>
                      <p className="text-gray-600 text-sm mt-1">Comprehensive tax services for small businesses and self-employed individuals.</p>
                    </div>
                  </div>
                  {expandedService === 'business' ? (
                    <ChevronUp className="w-5 h-5 text-green-600 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  )}
                </button>
                
                {expandedService === 'business' && (
                  <div className="border-t border-gray-200 p-6 bg-gray-50">
                    <div className="grid md:grid-cols-3 gap-6">
                      <div>
                        <h4 className="font-bold text-gray-900 mb-3">Corporate Tax Returns</h4>
                        <ul className="space-y-2 text-sm text-gray-700">
                          <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span>T2 corporate tax return preparation</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span>GST/HST filing and compliance</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span>Payroll deductions and remittances</span>
                          </li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 mb-3">Self-Employed Returns</h4>
                        <ul className="space-y-2 text-sm text-gray-700">
                          <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span>Business income and expense tracking</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span>Home office deductions</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span>Vehicle and equipment expenses</span>
                          </li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 mb-3">Business Advisory</h4>
                        <ul className="space-y-2 text-sm text-gray-700">
                          <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span>Tax planning and optimization</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span>Business structure consultation</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span>CRA audit support</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Bookkeeping */}
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <button
                  onClick={() => toggleService('bookkeeping')}
                  className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-orange-100 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-6 h-6 text-orange-600" />
                    </div>
                    <div className="text-left">
                      <h3 className="text-xl font-bold text-gray-900">Bookkeeping</h3>
                      <p className="text-gray-600 text-sm mt-1">Professional accounting and bookkeeping services for small businesses.</p>
                    </div>
                  </div>
                  {expandedService === 'bookkeeping' ? (
                    <ChevronUp className="w-5 h-5 text-orange-600 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  )}
                </button>
                
                {expandedService === 'bookkeeping' && (
                  <div className="border-t border-gray-200 p-6 bg-gray-50">
                    <div className="grid md:grid-cols-3 gap-6">
                      <div>
                        <h4 className="font-bold text-gray-900 mb-3">Monthly Bookkeeping</h4>
                        <ul className="space-y-2 text-sm text-gray-700">
                          <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                            <span>Bank reconciliation</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                            <span>Accounts payable/receivable</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                            <span>Expense categorization</span>
                          </li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 mb-3">Financial Reports</h4>
                        <ul className="space-y-2 text-sm text-gray-700">
                          <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                            <span>Profit & loss statements</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                            <span>Balance sheets</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                            <span>Cash flow reports</span>
                          </li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 mb-3">Payroll Services</h4>
                        <ul className="space-y-2 text-sm text-gray-700">
                          <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                            <span>Employee payroll processing</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                            <span>T4 and T4A preparation</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                            <span>ROE preparation</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Financial Reports & Management */}
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <button
                  onClick={() => toggleService('financial')}
                  className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="text-left">
                      <h3 className="text-xl font-bold text-gray-900">Financial Reports & Management</h3>
                      <p className="text-gray-600 text-sm mt-1">Management reports, financial analysis, and controller services for business insights.</p>
                    </div>
                  </div>
                  {expandedService === 'financial' ? (
                    <ChevronUp className="w-5 h-5 text-purple-600 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  )}
                </button>
                
                {expandedService === 'financial' && (
                  <div className="border-t border-gray-200 p-6 bg-gray-50">
                    <div className="grid md:grid-cols-3 gap-6">
                      <div>
                        <h4 className="font-bold text-gray-900 mb-3">Management Reports</h4>
                        <p className="text-sm text-gray-600 mb-3">Comprehensive management reports for informed decision-making.</p>
                        <ul className="space-y-2 text-sm text-gray-700">
                          <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                            <span>Profit & Loss statements</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                            <span>Cash flow reports</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                            <span>Budget vs Actual analysis</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                            <span>Custom management dashboards</span>
                          </li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 mb-3">Financial Analysis</h4>
                        <p className="text-sm text-gray-600 mb-3">In-depth financial analysis to drive business performance.</p>
                        <ul className="space-y-2 text-sm text-gray-700">
                          <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                            <span>Financial ratio analysis</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                            <span>Profitability analysis</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                            <span>Cost structure analysis</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                            <span>Trend and variance analysis</span>
                          </li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 mb-3">Controller Services</h4>
                        <p className="text-sm text-gray-600 mb-3">Strategic controller services for business oversight and planning.</p>
                        <ul className="space-y-2 text-sm text-gray-700">
                          <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                            <span>KPI tracking and reporting</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                            <span>Performance metrics</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                            <span>Financial planning & forecasting</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                            <span>Strategic business insights</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="about" className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose DuoPro Services?</h2>
                <p className="text-xl text-gray-600">Trusted by hundreds of Canadians for their tax needs</p>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl border border-blue-100 hover:shadow-lg transition-all hover:-translate-y-1">
                  <div className="bg-blue-100 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
                    <Globe className="w-7 h-7 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-gray-900">Bilingual Service</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">Full service in English and French to serve you better</p>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-white p-8 rounded-2xl border border-green-100 hover:shadow-lg transition-all hover:-translate-y-1">
                  <div className="bg-green-100 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
                    <CheckCircle className="w-7 h-7 text-green-600" />
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-gray-900">Expert Team</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">Qualified tax professionals with years of experience</p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-white p-8 rounded-2xl border border-purple-100 hover:shadow-lg transition-all hover:-translate-y-1">
                  <div className="bg-purple-100 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
                    <FileText className="w-7 h-7 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-gray-900">Secure Portal</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">Safe document upload and real-time tracking</p>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-white p-8 rounded-2xl border border-orange-100 hover:shadow-lg transition-all hover:-translate-y-1">
                  <div className="bg-orange-100 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
                    <ArrowRight className="w-7 h-7 text-orange-600" />
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-gray-900">Fast Processing</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">Quick turnaround times for your tax returns</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <Pricing />

        {/* Process Section */}
        <Process />

        {/* Contact Section - Complete Component */}
        <Contact />

        <Footer />
      </div>
    </>
  );
}