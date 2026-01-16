import { Check } from 'lucide-react';
import { AlertCircle } from 'lucide-react';

export default function PricingSection() {
  return (
    <section id="pricing" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Transparent Pricing
          </h2>
          <p className="text-lg text-gray-600">
            Professional tax services with clear, competitive rates
          </p>
        </div>

        {/* Detailed Services Grid */}
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            {/* T1 - Personal Tax Returns */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-1">T1 – Personal Tax Returns</h3>
              <p className="text-sm text-gray-600 mb-6">Individual income tax filing</p>
              
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-blue-700 mb-1">Simple T1 (T4 only)</div>
                  <div className="text-sm font-semibold text-gray-900">CAD $80 - $120</div>
                </div>
                <div>
                  <div className="text-sm text-blue-700 mb-1">With investments / capital gains</div>
                  <div className="text-sm font-semibold text-gray-900">CAD $150 - $200</div>
                </div>
                <div>
                  <div className="text-sm text-blue-700 mb-1">With rental income</div>
                  <div className="text-sm font-semibold text-gray-900">CAD $180 - $250</div>
                </div>
                <div>
                  <div className="text-sm text-blue-700 mb-1">Multiple slips / complex deductions</div>
                  <div className="text-sm font-semibold text-gray-900">CAD $200+</div>
                </div>
              </div>
            </div>

            {/* Newcomer Tax Services */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-1">Newcomer Tax Services</h3>
              <p className="text-sm text-gray-600 mb-6">Specialized support for new Canadian residents</p>
              
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-blue-700 mb-1">First-time filer + tax residency</div>
                  <div className="text-sm font-semibold text-gray-900">CAD $150 - $220</div>
                </div>
                <div>
                  <div className="text-sm text-blue-700 mb-1">Foreign income + treaty</div>
                  <div className="text-sm font-semibold text-gray-900">CAD $220 - $300</div>
                </div>
                <div>
                  <div className="text-sm text-blue-700 mb-1">Complete package (GST/HST + CCB + foreign income)</div>
                  <div className="text-sm font-semibold text-gray-900">CAD $250 - $350</div>
                </div>
              </div>
            </div>

            {/* Small Business / Self-Employed */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-1">Small Business / Self-Employed</h3>
              <p className="text-sm text-gray-600 mb-6">T2125 and business tax services</p>
              
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-blue-700 mb-1">Simple T2125 (few expenses)</div>
                  <div className="text-sm font-semibold text-gray-900">CAD $250 - $350</div>
                </div>
                <div>
                  <div className="text-sm text-blue-700 mb-1">With home office + expense optimization + GST/HST</div>
                  <div className="text-sm font-semibold text-gray-900">CAD $400 - $600</div>
                </div>
                <div>
                  <div className="text-sm text-blue-700 mb-1">With basic bookkeeping + quarterly planning</div>
                  <div className="text-sm font-semibold text-gray-900">CAD $600 - $700</div>
                </div>
              </div>
            </div>

            {/* GST / HST Returns */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-1">GST / HST Returns</h3>
              <p className="text-sm text-gray-600 mb-6">Sales tax filing</p>
              
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-blue-700 mb-1">Simple filing</div>
                  <div className="text-sm font-semibold text-gray-900">CAD $80 - $150</div>
                </div>
                <div>
                  <div className="text-sm text-blue-700 mb-1">With reconciliation and adjustments</div>
                  <div className="text-sm font-semibold text-gray-900">CAD $150 - $250</div>
                </div>
              </div>
            </div>

            {/* Tax Compliance & Review */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-1">Tax Compliance & Review</h3>
              <p className="text-sm text-gray-600 mb-6">Reviews and amendments</p>
              
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-blue-700 mb-1">Prior year review</div>
                  <div className="text-sm font-semibold text-gray-900">CAD $120 - $250</div>
                </div>
                <div>
                  <div className="text-sm text-blue-700 mb-1">Notice of Assessment review</div>
                  <div className="text-sm font-semibold text-gray-900">CAD $100 - $180</div>
                </div>
                <div>
                  <div className="text-sm text-blue-700 mb-1">T1-ADJ (amendment) per year</div>
                  <div className="text-sm font-semibold text-gray-900">CAD $80 - $150</div>
                </div>
                <div>
                  <div className="text-sm text-blue-700 mb-1">Missing slips / compliance review</div>
                  <div className="text-sm font-semibold text-gray-900">CAD $200 - $400</div>
                </div>
              </div>
            </div>

            {/* Tax Planning & Advice */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-1">Tax Planning & Advice</h3>
              <p className="text-sm text-gray-600 mb-6">Strategic tax consultation</p>
              
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-blue-700 mb-1">Hourly consultation</div>
                  <div className="text-sm font-semibold text-gray-900">CAD $120 - $200</div>
                </div>
                <div>
                  <div className="text-sm text-blue-700 mb-1">Annual personal planning</div>
                  <div className="text-sm font-semibold text-gray-900">CAD $250 - $500</div>
                </div>
                <div>
                  <div className="text-sm text-blue-700 mb-1">Retirement / investment planning</div>
                  <div className="text-sm font-semibold text-gray-900">CAD $400 - $800</div>
                </div>
              </div>
            </div>
          </div>

          {/* Important Note */}
          <div className="mt-12 bg-amber-50 border-l-4 border-amber-400 rounded-lg p-6 max-w-4xl mx-auto">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Important Note</h4>
                <p className="text-sm text-gray-700">
                  All prices are estimates. Final pricing is determined after an initial consultation based on your specific situation and complexity.
                </p>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <div className="mt-8 text-center">
            <a
              href="/login"
              className="inline-block px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              Get a Free Quote
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
