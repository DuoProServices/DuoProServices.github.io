import { FileCheck, AlertCircle } from 'lucide-react';

interface TaxFilingsTabProps {
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
}

export default function TaxFilingsTab({ language, taxYears }: TaxFilingsTabProps) {
  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-blue-900 mb-2">
          {language === 'en' ? 'Your Tax Returns' : 'Vos déclarations d\'impôts'}
        </h3>
        <p className="text-sm text-blue-700">
          {language === 'en'
            ? 'We prepare and file TWO tax returns for you: T1 (Federal - CRA) and TP-1 (Provincial - Revenu Québec for QC residents).'
            : 'Nous préparons et produisons DEUX déclarations d\'impôts pour vous : T1 (Fédéral - ARC) et TP-1 (Provincial - Revenu Québec pour les résidents du QC).'}
        </p>
      </div>

      {taxYears.map((year) => (
        <div key={year.year} className="border border-gray-200 rounded-lg overflow-hidden">
          {/* Year Header */}
          <div className="bg-white p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  {language === 'en' ? `Tax Year ${year.year}` : `Année fiscale ${year.year}`}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {language === 'en'
                    ? `Filing for income earned in ${parseInt(year.year) - 1}`
                    : `Déclaration pour les revenus gagnés en ${parseInt(year.year) - 1}`}
                </p>
              </div>
              <div>
                <span
                  className={`px-4 py-2 rounded-full text-sm font-semibold ${
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
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  {language === 'en' ? 'Documents Uploaded' : 'Documents téléversés'}
                </span>
                <span className="text-sm text-gray-600">
                  {year.documentsUploaded} / {year.documentsRequired}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    year.documentsUploaded === 0
                      ? 'bg-gray-400'
                      : year.documentsUploaded < year.documentsRequired
                      ? 'bg-yellow-500'
                      : 'bg-green-500'
                  }`}
                  style={{
                    width: `${(year.documentsUploaded / year.documentsRequired) * 100}%`,
                  }}
                />
              </div>
            </div>

            {/* Status Message */}
            {!year.isPaid && year.documentsUploaded === 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-yellow-800">
                  {language === 'en'
                    ? 'Upload your documents in the "Documents" tab, then submit payment in the "Payments" tab to start processing.'
                    : 'Téléversez vos documents dans l\'onglet "Documents", puis soumettez le paiement dans l\'onglet "Paiements" pour commencer le traitement.'}
                </div>
              </div>
            )}

            {!year.isPaid && year.documentsUploaded > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start gap-3">
                <FileCheck className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-800">
                  {language === 'en'
                    ? `Great! You've uploaded ${year.documentsUploaded} document${year.documentsUploaded > 1 ? 's' : ''}. Go to the "Payments" tab to submit and pay $50 CAD to start processing your tax return.`
                    : `Super! Vous avez téléversé ${year.documentsUploaded} document${year.documentsUploaded > 1 ? 's' : ''}. Allez dans l'onglet "Paiements" pour soumettre et payer 50 $ CAD pour commencer le traitement de votre déclaration.`}
                </div>
              </div>
            )}

            {year.isPaid && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-start gap-3">
                <FileCheck className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-green-800">
                  {language === 'en'
                    ? '✅ Payment received! Your tax returns are being processed. We will notify you when they are ready for review.'
                    : '✅ Paiement reçu! Vos déclarations d\'impôts sont en cours de traitement. Nous vous informerons lorsqu\'elles seront prêtes pour révision.'}
                </div>
              </div>
            )}
          </div>

          {/* Two Tax Returns */}
          <div className="bg-gray-50 p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* T1 Federal */}
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <FileCheck className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">T1 Federal Return</h4>
                  <p className="text-xs text-gray-500">
                    {language === 'en' ? 'Canada Revenue Agency (CRA)' : 'Agence du revenu du Canada (ARC)'}
                  </p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    {language === 'en' ? 'Status:' : 'Statut:'}
                  </span>
                  <span className="font-medium text-gray-900">
                    {year.isPaid
                      ? language === 'en'
                        ? 'Processing'
                        : 'En traitement'
                      : language === 'en'
                      ? 'Not Submitted'
                      : 'Non soumis'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    {language === 'en' ? 'Form:' : 'Formulaire:'}
                  </span>
                  <span className="font-medium text-gray-900">T1 General</span>
                </div>
                {year.isPaid && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      {language === 'en' ? 'Expected:' : 'Attendu:'}
                    </span>
                    <span className="font-medium text-gray-900">
                      {language === 'en' ? '3-5 business days' : '3-5 jours ouvrables'}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* TP-1 Québec */}
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileCheck className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">TP-1 Québec Return</h4>
                  <p className="text-xs text-gray-500">
                    {language === 'en' ? 'Revenu Québec (QC Residents)' : 'Revenu Québec (résidents du QC)'}
                  </p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    {language === 'en' ? 'Status:' : 'Statut:'}
                  </span>
                  <span className="font-medium text-gray-900">
                    {year.isPaid
                      ? language === 'en'
                        ? 'Processing'
                        : 'En traitement'
                      : language === 'en'
                      ? 'Not Submitted'
                      : 'Non soumis'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    {language === 'en' ? 'Form:' : 'Formulaire:'}
                  </span>
                  <span className="font-medium text-gray-900">TP-1.D</span>
                </div>
                {year.isPaid && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      {language === 'en' ? 'Expected:' : 'Attendu:'}
                    </span>
                    <span className="font-medium text-gray-900">
                      {language === 'en' ? '3-5 business days' : '3-5 jours ouvrables'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Info Box */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
        <h4 className="font-semibold text-gray-900 mb-3">
          {language === 'en' ? 'What happens next?' : 'Que se passe-t-il ensuite?'}
        </h4>
        <div className="space-y-2 text-sm text-gray-700">
          <p>
            {language === 'en'
              ? '1️⃣ Upload your tax documents in the "Documents" tab'
              : '1️⃣ Téléversez vos documents fiscaux dans l\'onglet "Documents"'}
          </p>
          <p>
            {language === 'en'
              ? '2️⃣ Submit payment of $50 CAD in the "Payments" tab to start processing'
              : '2️⃣ Soumettez le paiement de 50 $ CAD dans l\'onglet "Paiements" pour commencer le traitement'}
          </p>
          <p>
            {language === 'en'
              ? '3️⃣ We will prepare BOTH your T1 (Federal) and TP-1 (Québec) tax returns'
              : '3️⃣ Nous préparerons VOS DEUX déclarations d\'impôts T1 (Fédéral) et TP-1 (Québec)'}
          </p>
          <p>
            {language === 'en'
              ? '4️⃣ Review your completed returns and approve for filing'
              : '4️⃣ Révisez vos déclarations complétées et approuvez pour la production'}
          </p>
          <p>
            {language === 'en'
              ? '5️⃣ We will file both returns electronically with CRA and Revenu Québec'
              : '5️⃣ Nous produirons les deux déclarations électroniquement auprès de l\'ARC et de Revenu Québec'}
          </p>
        </div>
      </div>
    </div>
  );
}
