import { useState } from 'react';
import { CreditCard, FileUp, Calculator, CheckCircle, Send, Calendar, Users, ClipboardList, Rocket, Clock, Shield, Zap } from 'lucide-react';

export default function ProcessSection() {
  const [activeTab, setActiveTab] = useState<'personal' | 'business'>('personal');

  return (
    <section id="process" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide mb-2">HOW IT WORKS</p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            A Simple, Transparent Process
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            From <span className="text-blue-600">initial consultation</span> to <span className="text-blue-600">final filing</span>, every step is designed to be clear, efficient, and stress-free.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-4 mb-12">
          <button
            onClick={() => setActiveTab('personal')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'personal'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Personal Tax
          </button>
          <button
            onClick={() => setActiveTab('business')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'business'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Business Services
          </button>
        </div>

        {/* Personal Tax Process */}
        {activeTab === 'personal' && (
          <div className="max-w-3xl mx-auto">
            {/* Timeline */}
            <div className="relative">
              {/* Vertical Line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-blue-200"></div>

              {/* Step 1 */}
              <div className="relative flex gap-6 mb-12">
                <div className="flex-shrink-0 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center z-10">
                  <CreditCard className="w-8 h-8 text-blue-600" />
                </div>
                <div className="flex-1 pt-2">
                  <div className="text-6xl font-bold text-gray-200 absolute -top-4 -left-2">01</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Initial Payment ($50)</h3>
                  <p className="text-gray-600 mb-2">
                    Pay a small deposit of $50 CAD to start your tax filing. The remaining balance is due after we complete your return.
                  </p>
                  <div className="flex items-center gap-2 text-blue-600 text-sm">
                    <Clock className="w-4 h-4" />
                    <span>2 minutes</span>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative flex gap-6 mb-12">
                <div className="flex-shrink-0 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center z-10">
                  <FileUp className="w-8 h-8 text-blue-600" />
                </div>
                <div className="flex-1 pt-2">
                  <div className="text-6xl font-bold text-gray-200 absolute -top-4 right-0">02</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Document Upload</h3>
                  <p className="text-gray-600 mb-2">
                    Upload your tax documents (T4s, receipts, slips, etc.) through our secure portal with automatic OCR extraction.
                  </p>
                  <div className="flex items-center gap-2 text-blue-600 text-sm">
                    <Clock className="w-4 h-4" />
                    <span>15-30 minutes</span>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative flex gap-6 mb-12">
                <div className="flex-shrink-0 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center z-10">
                  <Calculator className="w-8 h-8 text-blue-600" />
                </div>
                <div className="flex-1 pt-2">
                  <div className="text-6xl font-bold text-gray-200 absolute -top-4 -left-2">03</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Tax Calculation & Review</h3>
                  <p className="text-gray-600 mb-2">
                    We analyze your documents, calculate your refund/owing, and prepare your complete tax return.
                  </p>
                  <div className="flex items-center gap-2 text-blue-600 text-sm">
                    <Clock className="w-4 h-4" />
                    <span>3-5 business days</span>
                  </div>
                </div>
              </div>

              {/* Step 4 */}
              <div className="relative flex gap-6 mb-12">
                <div className="flex-shrink-0 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center z-10">
                  <CheckCircle className="w-8 h-8 text-blue-600" />
                </div>
                <div className="flex-1 pt-2">
                  <div className="text-6xl font-bold text-gray-200 absolute -top-4 right-0">04</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Final Payment & Approval</h3>
                  <p className="text-gray-600 mb-2">
                    Review your completed return, pay the remaining balance, and approve for CRA submission.
                  </p>
                  <div className="flex items-center gap-2 text-blue-600 text-sm">
                    <Clock className="w-4 h-4" />
                    <span>30 minutes</span>
                  </div>
                </div>
              </div>

              {/* Step 5 */}
              <div className="relative flex gap-6">
                <div className="flex-shrink-0 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center z-10">
                  <Send className="w-8 h-8 text-blue-600" />
                </div>
                <div className="flex-1 pt-2">
                  <div className="text-6xl font-bold text-gray-200 absolute -top-4 -left-2">05</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Filed with CRA</h3>
                  <p className="text-gray-600 mb-2">
                    Your tax return is electronically filed with the CRA. You'll receive your refund in 2-3 weeks!
                  </p>
                  <div className="flex items-center gap-2 text-blue-600 text-sm">
                    <Clock className="w-4 h-4" />
                    <span>Same day</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Business Services Process */}
        {activeTab === 'business' && (
          <div className="max-w-3xl mx-auto">
            {/* Free Consultation Banner */}
            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 mb-12">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <ClipboardList className="w-6 h-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    🎉 First Consultation is FREE!
                  </h3>
                  <p className="text-sm text-gray-700 mb-4">
                    For Small Business, Bookkeeping, and Financial Reports services, we start with a <span className="font-semibold">complimentary consultation</span> to understand your needs and provide a customized proposal.
                  </p>
                  <a
                    href="#contact"
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Calendar className="w-4 h-4" />
                    Schedule Free Consultation
                  </a>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="relative">
              {/* Vertical Line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-blue-200"></div>

              {/* Step 1 */}
              <div className="relative flex gap-6 mb-12">
                <div className="flex-shrink-0 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center z-10">
                  <Calendar className="w-8 h-8 text-blue-600" />
                </div>
                <div className="flex-1 pt-2">
                  <div className="text-6xl font-bold text-gray-200 absolute -top-4 -left-2">01</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Free Initial Consultation</h3>
                  <p className="text-gray-600 mb-2">
                    Schedule a complimentary consultation to discuss your business needs and scope of work.
                  </p>
                  <div className="flex items-center gap-2 text-blue-600 text-sm">
                    <Clock className="w-4 h-4" />
                    <span>30-45 minutes</span>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative flex gap-6 mb-12">
                <div className="flex-shrink-0 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center z-10">
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
                <div className="flex-1 pt-2">
                  <div className="text-6xl font-bold text-gray-200 absolute -top-4 right-0">02</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Proposal & Scope Review</h3>
                  <p className="text-gray-600 mb-2">
                    Receive a detailed proposal with pricing, timeline, and customized service plan.
                  </p>
                  <div className="flex items-center gap-2 text-blue-600 text-sm">
                    <Clock className="w-4 h-4" />
                    <span>1-2 days</span>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative flex gap-6 mb-12">
                <div className="flex-shrink-0 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center z-10">
                  <ClipboardList className="w-8 h-8 text-blue-600" />
                </div>
                <div className="flex-1 pt-2">
                  <div className="text-6xl font-bold text-gray-200 absolute -top-4 -left-2">03</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Onboarding & Setup</h3>
                  <p className="text-gray-600 mb-2">
                    Complete onboarding, documentation, and initial setup of your business accounts.
                  </p>
                  <div className="flex items-center gap-2 text-blue-600 text-sm">
                    <Clock className="w-4 h-4" />
                    <span>3-5 days</span>
                  </div>
                </div>
              </div>

              {/* Step 4 */}
              <div className="relative flex gap-6">
                <div className="flex-shrink-0 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center z-10">
                  <Rocket className="w-8 h-8 text-blue-600" />
                </div>
                <div className="flex-1 pt-2">
                  <div className="text-6xl font-bold text-gray-200 absolute -top-4 right-0">04</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Ongoing Service Delivery</h3>
                  <p className="text-gray-600 mb-2">
                    Regular service delivery with monthly reports, continuous support, and strategic guidance.
                  </p>
                  <div className="flex items-center gap-2 text-blue-600 text-sm">
                    <Clock className="w-4 h-4" />
                    <span>Ongoing</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Average Turnaround */}
            <div className="mt-12 bg-blue-50 border border-blue-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 text-center mb-3">
                Average Turnaround Time: 5-7 Business Days
              </h3>
              <p className="text-sm text-gray-600 text-center mb-4">
                From document submission to final filing. Rush service available for urgent situations.
              </p>
              <div className="flex flex-wrap justify-center gap-6">
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="w-5 h-5" />
                  <span className="text-sm">Free initial consultation</span>
                </div>
                <div className="flex items-center gap-2 text-green-600">
                  <Shield className="w-5 h-5" />
                  <span className="text-sm">Secure document handling</span>
                </div>
                <div className="flex items-center gap-2 text-green-600">
                  <Zap className="w-5 h-5" />
                  <span className="text-sm">Electronic CRA filing</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
