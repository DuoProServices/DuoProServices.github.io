/**
 * ADMIN INVOICES PAGE
 * Full page wrapper for the InvoicesManager component
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { ArrowLeft, Home } from 'lucide-react';
import { InvoicesManager } from '../components/admin/InvoicesManager';

export default function AdminInvoicesPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <div className="mb-6 flex items-center gap-2">
          <Button
            variant="ghost"
            onClick={() => navigate('/admin')}
            className="mr-2"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Admin Hub
          </Button>
          <Button
            variant="ghost"
            onClick={() => navigate('/admin/financial-dashboard')}
          >
            <Home className="w-4 h-4 mr-2" />
            Financial Dashboard
          </Button>
        </div>

        {/* Main Content */}
        <InvoicesManager />
      </div>
    </div>
  );
}
