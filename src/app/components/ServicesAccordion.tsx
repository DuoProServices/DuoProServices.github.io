import { useState } from 'react';
import { FileText, Store, Calculator, FileBarChart, ChevronDown, ChevronUp, CheckCircle } from 'lucide-react';

interface AccordionItemProps {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  iconBg: string;
  borderColor: string;
  expandedContent?: React.ReactNode;
}

function AccordionItem({ id, title, description, icon, iconBg, borderColor, expandedContent }: AccordionItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`bg-white border-2 ${borderColor} rounded-xl overflow-hidden transition-all ${isOpen ? 'md:col-span-2' : ''}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-6 flex items-start gap-4 text-left hover:bg-gray-50 transition-colors"
      >
        <div className={`${iconBg} w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0`}>
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
        <div className="flex-shrink-0">
          {isOpen ? (
            <ChevronUp className="w-5 h-5 text-blue-600" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </div>
      </button>

      {isOpen && expandedContent && (
        <div className="px-6 pb-6 border-t border-gray-100">
          {expandedContent}
        </div>
      )}
    </div>
  );
}

export default function ServicesAccordion() {
  return (
    <section id="services" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Comprehensive Financial Services for Every Need
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            From personal tax returns to full bookkeeping and financial reporting, we offer complete solutions designed to meet your Canadian financial obligations with accuracy and efficiency.
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-4">
          {/* Personal Tax */}
          <AccordionItem
            id="personal-tax"
            title="Personal Tax"
            description="Complete tax preparation and filing services for individuals and newcomers to Canada."
            icon={<FileText className="w-6 h-6 text-blue-600" />}
            iconBg="bg-blue-50"
            borderColor="border-blue-200"
            expandedContent={
              <div className="grid md:grid-cols-3 gap-6 mt-6">
                {/* T1 Personal Tax Returns */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">T1 Personal Tax Returns</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Complete preparation and filing of individual income tax returns.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                      <span>Employment income (T4 slips)</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                      <span>Investment income and capital gains</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                      <span>RRSP contributions and deductions</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                      <span>Medical expenses and credits</span>
                    </li>
                  </ul>
                </div>

                {/* Newcomer Tax Services */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">Newcomer Tax Services</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Specialized support for new immigrants navigating Canadian taxes.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                      <span>First-time tax filer assistance</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                      <span>Residency status determination</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                      <span>Foreign income reporting</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                      <span>Tax treaty benefits</span>
                    </li>
                  </ul>
                </div>

                {/* Tax Compliance & Review */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">Tax Compliance & Review</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Ensuring your tax filings meet all CRA requirements.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                      <span>Prior year tax review</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                      <span>Notice of Assessment review</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                      <span>Missing slips and documentation</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                      <span>Amendment requests (T1-ADJ)</span>
                    </li>
                  </ul>
                </div>
              </div>
            }
          />

          {/* Small Business */}
          <AccordionItem
            id="small-business"
            title="Small Business"
            description="Comprehensive tax and compliance services for sole proprietors and small business owners."
            icon={<Store className="w-6 h-6 text-green-600" />}
            iconBg="bg-green-50"
            borderColor="border-green-200"
            expandedContent={
              <div className="grid md:grid-cols-3 gap-6 mt-6">
                {/* Business Tax Filings */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">Business Tax Filings</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Essential tax services for sole proprietors and small businesses.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>T2125 Statement of Business Activities</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Business expense optimization</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Home office deductions</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Quarterly tax planning</span>
                    </li>
                  </ul>
                </div>

                {/* GST/HST Returns */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">GST/HST Returns</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Complete GST/HST registration, filing, and compliance services.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>GST/HST registration</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Monthly/quarterly return preparation</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Input tax credit optimization</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>GST/HST compliance review</span>
                    </li>
                  </ul>
                </div>

                {/* Business Planning */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">Business Planning</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Strategic business and tax planning for growth.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Business structure consultation</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Tax-efficient compensation planning</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Incorporation advice</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Growth strategy tax planning</span>
                    </li>
                  </ul>
                </div>
              </div>
            }
          />

          {/* Bookkeeping */}
          <AccordionItem
            id="bookkeeping"
            title="Bookkeeping"
            description="Professional bookkeeping and financial record management for your business."
            icon={<Calculator className="w-6 h-6 text-purple-600" />}
            iconBg="bg-purple-50"
            borderColor="border-purple-200"
            expandedContent={
              <div className="grid md:grid-cols-3 gap-6 mt-6">
                {/* Monthly Bookkeeping */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">Monthly Bookkeeping</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Professional monthly bookkeeping and reconciliation services.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                      <span>Bank reconciliation</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                      <span>Accounts payable/receivable</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                      <span>Financial statements preparation</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                      <span>Monthly financial reports</span>
                    </li>
                  </ul>
                </div>

                {/* Expense Tracking */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">Expense Tracking</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Comprehensive expense categorization and tracking.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                      <span>Receipt management</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                      <span>Expense categorization</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                      <span>Vendor payment tracking</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                      <span>Tax-deductible expense identification</span>
                    </li>
                  </ul>
                </div>

                {/* Financial Records */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">Financial Records</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Complete financial record organization and management.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                      <span>Document organization</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                      <span>Digital record keeping</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                      <span>Audit-ready documentation</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                      <span>Year-end preparation</span>
                    </li>
                  </ul>
                </div>
              </div>
            }
          />

          {/* Financial Reports & Management */}
          <AccordionItem
            id="financial-reports"
            title="Financial Reports & Management"
            description="Management reports, financial analysis, and controller services for business insights."
            icon={<FileBarChart className="w-6 h-6 text-orange-600" />}
            iconBg="bg-orange-50"
            borderColor="border-orange-200"
            expandedContent={
              <div className="grid md:grid-cols-3 gap-6 mt-6">
                {/* Management Reports */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">Management Reports</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Comprehensive management reports for informed decision-making.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
                      <span>Profit & Loss statements</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
                      <span>Cash flow reports</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
                      <span>Budget vs Actual analysis</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
                      <span>Custom management dashboards</span>
                    </li>
                  </ul>
                </div>

                {/* Financial Analysis */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">Financial Analysis</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    In-depth financial analysis to drive business performance.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
                      <span>Financial ratio analysis</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
                      <span>Profitability analysis</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
                      <span>Cost structure analysis</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
                      <span>Trend and variance analysis</span>
                    </li>
                  </ul>
                </div>

                {/* Controller Services */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">Controller Services</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Strategic controller services for financial oversight and planning.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
                      <span>KPI tracking and reporting</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
                      <span>Performance metrics</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
                      <span>Financial planning & forecasting</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
                      <span>Strategic business insights</span>
                    </li>
                  </ul>
                </div>
              </div>
            }
          />
        </div>

        {/* CTA Box */}
        <div className="max-w-4xl mx-auto mt-8">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-8 text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Not Sure Which Service You Need?
            </h3>
            <p className="text-gray-600">
              Contact us for a free consultation to discuss your specific financial and tax situation.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}