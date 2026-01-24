/**
 * ADMIN PAYMENT SETUP PAGE
 * Dedicated page for configuring and testing Stripe payments
 */

import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { ArrowLeft, Settings } from 'lucide-react';
import { PaymentSetupTester } from '../components/admin/PaymentSetupTester';

export default function AdminPaymentSetupPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate('/admin')}
          className="mb-8 hover:bg-white transition-all"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Admin Hub
        </Button>

        {/* Page Header */}
        <div className="mb-8 bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center shadow-lg">
              <Settings className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Payment Configuration
              </h1>
              <p className="text-gray-600 mt-1">
                Set up and test your Stripe payment integration
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <PaymentSetupTester />
      </div>
    </div>
  );
}
