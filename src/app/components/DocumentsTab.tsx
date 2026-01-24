import { Calendar, ChevronDown, ChevronUp, Upload, FileText, X } from 'lucide-react';

interface DocumentsTabProps {
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
  documentCategories: Array<{
    id: string;
    name: string;
    icon: any;
    documents: string[];
  }>;
  uploadedFiles: Array<{
    id: string;
    name: string;
    year: string;
    category: string;
    docType: string;
    uploadedAt: string;
    size: number;
  }>;
  expandedYear: string | null;
  expandedCategory: { [key: string]: string | null };
  toggleYear: (year: string) => void;
  toggleCategory: (year: string, categoryId: string) => void;
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>, year: string, category: string, docType: string) => void;
  handleRemoveFile: (fileId: string) => void;
  getFilesForDocType: (year: string, category: string, docType: string) => any[];
  isUploading: boolean;
}

export default function DocumentsTab({
  language,
  taxYears,
  documentCategories,
  uploadedFiles,
  expandedYear,
  expandedCategory,
  toggleYear,
  toggleCategory,
  handleFileUpload,
  handleRemoveFile,
  getFilesForDocType,
  isUploading,
}: DocumentsTabProps) {
  return (
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-blue-900">
          {language === 'en'
            ? '📁 Upload your tax documents for each year. You can upload documents anytime. When ready, go to the "Payments" tab to submit payment and start processing.'
            : '📁 Téléversez vos documents fiscaux pour chaque année. Vous pouvez téléverser des documents à tout moment. Lorsque vous êtes prêt, allez dans l\'onglet "Paiements" pour soumettre le paiement et commencer le traitement.'}
        </p>
      </div>

      {taxYears.map((year) => (
        <div key={year.year} className="border border-gray-200 rounded-lg overflow-hidden">
          {/* Year Header */}
          <div className="bg-white">
            <button
              onClick={() => toggleYear(year.year)}
              className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <Calendar className="w-6 h-6 text-blue-600" />
                <div className="text-left">
                  <h3 className="font-semibold text-lg">
                    {language === 'en' ? `Tax Year ${year.year}` : `Année fiscale ${year.year}`}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {year.documentsUploaded} / {year.documentsRequired}{' '}
                    {language === 'en' ? 'documents' : 'documents'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
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
                {expandedYear === year.year ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </div>
            </button>
          </div>

          {/* Year Content - Document Categories */}
          {expandedYear === year.year && (
            <div className="bg-gray-50 p-6 space-y-3">
              {documentCategories.map((category) => {
                const Icon = category.icon;
                return (
                  <div
                    key={category.id}
                    className="border border-gray-200 rounded-lg bg-white overflow-hidden"
                  >
                    {/* Category Header */}
                    <button
                      onClick={() => toggleCategory(year.year, category.id)}
                      className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5 text-blue-600" />
                        <span className="font-medium">{category.name}</span>
                        <span className="text-xs text-gray-500">
                          (
                          {
                            uploadedFiles.filter(
                              (f) => f.year === year.year && f.category === category.id
                            ).length
                          }{' '}
                          {language === 'en' ? 'files' : 'fichiers'})
                        </span>
                      </div>
                      {expandedCategory[year.year] === category.id ? (
                        <ChevronUp className="w-4 h-4 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      )}
                    </button>

                    {/* Category Content - Document Upload */}
                    {expandedCategory[year.year] === category.id && (
                      <div className="border-t border-gray-200 p-4 bg-gray-50">
                        <div className="space-y-3">
                          {category.documents.map((docType) => {
                            const filesForDocType = getFilesForDocType(
                              year.year,
                              category.id,
                              docType
                            );
                            return (
                              <div
                                key={docType}
                                className="bg-white p-4 rounded-lg border border-gray-200"
                              >
                                <div className="flex items-center justify-between mb-3">
                                  <span className="text-sm font-medium text-gray-700">
                                    {docType}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    {filesForDocType.length}{' '}
                                    {language === 'en' ? 'files' : 'fichiers'}
                                  </span>
                                </div>

                                {/* Uploaded files list */}
                                {filesForDocType.length > 0 && (
                                  <div className="mb-3 space-y-2">
                                    {filesForDocType.map((file) => (
                                      <div
                                        key={file.id}
                                        className="flex items-center justify-between bg-green-50 p-2 rounded border border-green-200"
                                      >
                                        <div className="flex items-center gap-2">
                                          <FileText className="w-4 h-4 text-green-600" />
                                          <span className="text-xs text-gray-700">
                                            {file.name}
                                          </span>
                                        </div>
                                        <button
                                          onClick={() => handleRemoveFile(file.id)}
                                          className="text-red-600 hover:text-red-700"
                                        >
                                          <X className="w-4 h-4" />
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                )}

                                {/* Upload area */}
                                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors">
                                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <Upload
                                      className={`w-8 h-8 mb-2 ${
                                        isUploading
                                          ? 'text-blue-500 animate-pulse'
                                          : 'text-gray-400'
                                      }`}
                                    />
                                    <p className="text-xs text-gray-600 text-center">
                                      {isUploading
                                        ? language === 'en'
                                          ? 'Uploading...'
                                          : 'Téléversement...'
                                        : language === 'en'
                                        ? 'Click to upload or drag and drop'
                                        : 'Cliquez pour téléverser ou glisser-déposer'}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                      PDF, JPG, PNG (max 10MB)
                                    </p>
                                  </div>
                                  <input
                                    type="file"
                                    className="hidden"
                                    multiple
                                    accept=".pdf,.jpg,.jpeg,.png"
                                    onChange={(e) =>
                                      handleFileUpload(e, year.year, category.id, docType)
                                    }
                                    disabled={isUploading}
                                  />
                                </label>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
