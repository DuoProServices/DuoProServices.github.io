import { CreditCard, CheckCircle, AlertCircle, Calendar } from 'lucide-react';

interface PaymentsTabProps {
  language: 'en' | 'fr';
  taxYears: Array<{
    year: string;
    status: string;
    statusColor: string;
    documentsUploaded: number;
    documentsRequired: number;
    canSubmit: boolean;
    isPaid: boolean;
  }>;
  handleSubmitTaxReturn: (year: string) => void;
  isSubmitting: boolean;
}

export default function PaymentsTab({
  language,
  taxYears,
  handleSubmitTaxReturn,
  isSubmitting,
}: PaymentsTabProps) {
  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-blue-900 mb-2">
          {language === 'en' ? 'Payment & Submission' : 'Paiement et soumission'}
        </h3>
        <p className="text-sm text-blue-700">
          {language === 'en'
            ? 'Pay $50 CAD initial fee to submit your tax return for processing. Upload your documents first in the "Documents" tab.'
            : 'Payez des frais initiaux de 50 $ CAD pour soumettre votre déclaration d\'impôts pour traitement. Téléversez d\'abord vos documents dans l\'onglet "Documents".'}
        </p>
      </div>

      {/* Submit Payment Section */}
      <div>
        <h3 className="font-semibold text-lg mb-4">
          {language === 'en' ? 'Submit Your Tax Return' : 'Soumettre votre déclaration d\'impôts'}
        </h3>

        {taxYears.map((year) => (
          <div
            key={year.year}
            className="border border-gray-200 rounded-lg overflow-hidden mb-4"
          >
            <div className="bg-white p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Calendar className="w-6 h-6 text-blue-600" />
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {language === 'en' ? `Tax Year ${year.year}` : `Année fiscale ${year.year}`}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {year.documentsUploaded} / {year.documentsRequired}{' '}
                      {language === 'en' ? 'documents uploaded' : 'documents téléversés'}
                    </p>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    year.statusColor === 'blue'
                      ? 'bg-blue-100 text-blue-700'
                      : year.statusColor === 'green'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {year.status}
                </span>
              </div>

              {/* Payment Status */}
              {year.isPaid ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-semibold text-green-900 mb-1">
                      {language === 'en' ? 'Payment Received' : 'Paiement reçu'}
                    </h5>
                    <p className="text-sm text-green-700">
                      {language === 'en'
                        ? 'Your tax return has been submitted and is being processed. We will notify you when it\'s ready for review.'
                        : 'Votre déclaration d\'impôts a été soumise et est en cours de traitement. Nous vous informerons lorsqu\'elle sera prête pour révision.'}
                    </p>
                    <div className="mt-3 pt-3 border-t border-green-200">
                      <div className="flex justify-between text-sm">
                        <span className="text-green-700">
                          {language === 'en' ? 'Amount Paid:' : 'Montant payé:'}
                        </span>
                        <span className="font-semibold text-green-900">$50.00 CAD</span>
                      </div>
                      <div className="flex justify-between text-sm mt-1">
                        <span className="text-green-700">
                          {language === 'en' ? 'Payment Date:' : 'Date de paiement:'}
                        </span>
                        <span className="font-semibold text-green-900">Jan 8, 2026</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {/* Warning if no documents */}
                  {year.documentsUploaded === 0 && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3 mb-4">
                      <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h5 className="font-semibold text-yellow-900 mb-1">
                          {language === 'en'
                            ? 'No Documents Uploaded'
                            : 'Aucun document téléversé'}
                        </h5>
                        <p className="text-sm text-yellow-700">
                          {language === 'en'
                            ? 'Please upload your tax documents in the "Documents" tab before submitting payment.'
                            : 'Veuillez téléverser vos documents fiscaux dans l\'onglet "Documents" avant de soumettre le paiement.'}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Payment Details */}
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-5 mb-4">
                    <h5 className="font-semibold text-gray-900 mb-3">
                      {language === 'en' ? 'Payment Details' : 'Détails du paiement'}
                    </h5>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">
                          {language === 'en' ? 'Initial Filing Fee:' : 'Frais de dépôt initial:'}
                        </span>
                        <span className="font-semibold text-gray-900">$50.00 CAD</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">
                          {language === 'en' ? 'Includes:' : 'Inclut:'}
                        </span>
                        <span className="text-sm text-gray-700">
                          {language === 'en' ? 'T1 Federal + TP-1 Québec' : 'T1 Fédéral + TP-1 Québec'}
                        </span>
                      </div>
                      <div className="pt-2 mt-2 border-t border-gray-300">
                        <div className="flex justify-between">
                          <span className="font-semibold text-gray-900">
                            {language === 'en' ? 'Total Due:' : 'Total dû:'}
                          </span>
                          <span className="font-bold text-gray-900 text-lg">$50.00 CAD</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Submit & Pay Button */}
                  {year.canSubmit && (
                    <button
                      onClick={() => handleSubmitTaxReturn(year.year)}
                      disabled={isSubmitting || year.documentsUploaded === 0}
                      className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                    >
                      <CreditCard className="w-6 h-6" />
                      {isSubmitting
                        ? language === 'en'
                          ? 'Processing...'
                          : 'Traitement...'
                        : language === 'en'
                        ? 'Submit & Pay $50 CAD'
                        : 'Soumettre et payer 50 $ CAD'}
                    </button>
                  )}

                  {year.documentsUploaded === 0 && (
                    <p className="text-xs text-gray-500 text-center mt-3">
                      {language === 'en'
                        ? '⚠️ Upload at least one document to enable payment'
                        : '⚠️ Téléversez au moins un document pour activer le paiement'}
                    </p>
                  )}
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Payment History */}
      <div>
        <h3 className="font-semibold text-lg mb-4">
          {language === 'en' ? 'Payment History' : 'Historique des paiements'}
        </h3>

        <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
          <div className="p-8 text-center text-gray-500 text-sm">
            {language === 'en'
              ? 'No payments yet. Your payment history will appear here.'
              : 'Aucun paiement pour le moment. Votre historique de paiements apparaîtra ici.'}
          </div>
        </div>
      </div>

      {/* Important Notes */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
        <h4 className="font-semibold text-gray-900 mb-3">
          {language === 'en' ? 'Important Information' : 'Informations importantes'}
        </h4>
        <div className="space-y-2 text-sm text-gray-700">
          <p>
            {language === 'en'
              ? '💳 We accept all major credit cards and debit cards via Stripe'
              : '💳 Nous acceptons toutes les principales cartes de crédit et de débit via Stripe'}
          </p>
          <p>
            {language === 'en'
              ? '🔒 Your payment information is secure and encrypted'
              : '🔒 Vos informations de paiement sont sécurisées et cryptées'}
          </p>
          <p>
            {language === 'en'
              ? '📧 You will receive a payment confirmation email after submission'
              : '📧 Vous recevrez un courriel de confirmation de paiement après la soumission'}
          </p>
          <p>
            {language === 'en'
              ? '⏱️ Processing typically takes 3-5 business days'
              : '⏱️ Le traitement prend généralement 3 à 5 jours ouvrables'}
          </p>
          <p>
            {language === 'en'
              ? '📄 The $50 fee covers BOTH your T1 Federal and TP-1 Québec returns'
              : '📄 Les frais de 50 $ couvrent VOS DEUX déclarations T1 Fédéral et TP-1 Québec'}
          </p>
        </div>
      </div>
    </div>
  );
}