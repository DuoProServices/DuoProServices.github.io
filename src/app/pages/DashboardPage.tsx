import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router';
import { 
  FileText, Upload, Clock, CheckCircle, LogOut, Home, 
  User, ChevronDown, ChevronUp, FileCheck, Calendar,
  Briefcase, Heart, DollarSign, Receipt, Building, X, CreditCard, Users, GraduationCap, MessageSquare
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { API_ENDPOINTS } from '@/config/api';
import { publicAnonKey } from '/utils/supabase/info';
import PersonalInfoTab from '../components/PersonalInfoTab';
import TaxFilingsTab from '../components/TaxFilingsTab';
import DocumentsTab from '../components/DocumentsTab';
import PaymentsTab from '../components/PaymentsTab';
import { useAuth } from '../contexts/AuthContext';
import { isAdminEmail } from '../config/admins';
import { supabase } from '../utils/supabaseClient';
import { AdminStatusBanner } from '../components/AdminStatusBanner';

interface UploadedFile {
  id: string;
  name: string;
  year: string;
  category: string;
  docType: string;
  uploadedAt: string;
  size: number;
}

export default function DashboardPage() {
  const { t, language, setLanguage } = useLanguage();
  const navigate = useNavigate();
  const { user } = useAuth(); // 🔧 Adicionar useAuth
  const [activeTab, setActiveTab] = useState<'personal' | 'filings' | 'documents' | 'payments' | 'messages' | 'status'>('personal');
  const [expandedYear, setExpandedYear] = useState<string | null>('2026');
  const [expandedCategory, setExpandedCategory] = useState<{ [key: string]: string | null }>({
    '2024': null,
    '2025': null,
    '2026': null
  });

  // Uploaded files state
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedPersonalSection, setExpandedPersonalSection] = useState<string | null>('personal');
  const [loadingProfile, setLoadingProfile] = useState(true);

  // Personal Information Form State - Complete CRA/RQ Questions
  const [personalInfo, setPersonalInfo] = useState({
    // Step 1: Personal Information
    firstName: '',
    middleName: '',
    lastName: '',
    sin: '',
    dateOfBirth: '',
    preferredLanguage: 'English',
    gender: '',
    
    // Step 2: Mailing Address
    careOf: '',
    addressUnit: '',
    streetNumber: '',
    streetName: '',
    city: '',
    province: '',
    postalCode: '',
    homePhoneArea: '',
    homePhoneNumber: '',
    hasNonCanadianAddress: 'no',
    
    // Step 3: Residency
    canadianResidentAllYear: 'yes',
    provinceOnDec31: '',
    provinceMovedDate: '',
    homeAddressSameAsMailing: 'yes',
    addressChangedInYear: 'no',
    currentProvince: '',
    
    // Step 4: Marital Status & Dependents
    maritalStatus: '',
    maritalStatusChanged: 'no',
    hasDependents: 'no',
    
    // Step 5: General Questions (CRA)
    firstTimeFilingCRA: 'no',
    canadianCitizen: 'yes',
    registeredIndianAct: 'no',
    foreignPropertyOver100k: 'no',
    disposedPrincipalResidence: 'no',
    flippedProperty: 'no',
    firstHomeSavingsAccount: 'no',
    virtualCurrency: 'no',
    confinedToPrison: 'no',
    
    // Step 6: Revenu Québec
    singleParentOrLivedAlone: 'no',
    firstTimeFilingRQ: 'no',
    claimSolidarityTaxCredit: 'no',
    prescriptionDrugInsurance: 'no',
    workTelephoneArea: '',
    workTelephoneNumber: '',
    workTelephoneExt: '',
    
    // Step 7: Online Accounts
    signupCRAOnlineMail: 'yes',
    signupRQOnlineMail: 'yes',
    receiveRQNotifications: 'email',
    notificationEmail: '',
  });

  const taxYears = [
    { 
      year: '2026', 
      status: language === 'en' ? '🔵 In Progress' : '🔵 En cours',
      statusColor: 'blue',
      documentsUploaded: uploadedFiles.filter(f => f.year === '2026').length,
      documentsRequired: 8,
      canSubmit: true,
      isPaid: false
    },
    { 
      year: '2025', 
      status: language === 'en' ? '⚪ Available (For returning clients)' : '⚪ Disponible (clients existants)',
      statusColor: 'gray',
      documentsUploaded: uploadedFiles.filter(f => f.year === '2025').length,
      documentsRequired: 8,
      canSubmit: true,
      isPaid: false
    },
    { 
      year: '2024', 
      status: language === 'en' ? '⚪ Available (For returning clients)' : '⚪ Disponible (clients existants)',
      statusColor: 'gray',
      documentsUploaded: uploadedFiles.filter(f => f.year === '2024').length,
      documentsRequired: 8,
      canSubmit: true,
      isPaid: false
    },
  ];

  const CANADIAN_PROVINCES = [
    { value: 'AB', label: 'Alberta' },
    { value: 'BC', label: 'British Columbia' },
    { value: 'MB', label: 'Manitoba' },
    { value: 'NB', label: 'New Brunswick' },
    { value: 'NL', label: 'Newfoundland and Labrador' },
    { value: 'NS', label: 'Nova Scotia' },
    { value: 'ON', label: 'Ontario' },
    { value: 'PE', label: 'Prince Edward Island' },
    { value: 'QC', label: 'Québec' },
    { value: 'SK', label: 'Saskatchewan' },
    { value: 'NT', label: 'Northwest Territories' },
    { value: 'NU', label: 'Nunavut' },
    { value: 'YT', label: 'Yukon' },
  ];

  const updatePersonalField = (field: string, value: any) => {
    setPersonalInfo(prev => ({ ...prev, [field]: value }));
  };

  const togglePersonalSection = (section: string) => {
    setExpandedPersonalSection(expandedPersonalSection === section ? null : section);
  };

  const documentCategories = [
    { 
      id: 'employment',
      name: language === 'en' ? 'Employment Income' : 'Revenu d\'emploi',
      icon: Briefcase,
      documents: [
        'T4 Slips',
        'Relevé 1 (Québec)',
        'T4A Slips',
        'Employment Letter'
      ]
    },
    { 
      id: 'rrsp',
      name: language === 'en' ? 'RRSP & Retirement' : 'REER et retraite',
      icon: DollarSign,
      documents: [
        'RRSP Contributions',
        'Relevé 10 (RRSP)',
        'Pension Income T4A(P)',
        'FHSA Contributions'
      ]
    },
    { 
      id: 'investment',
      name: language === 'en' ? 'Investment Income' : 'Revenu de placement',
      icon: DollarSign,
      documents: [
        'T5 Slips (Interest & Dividends)',
        'Relevé 3 (Québec)',
        'T3 Slips (Trust Income)',
        'Foreign Income'
      ]
    },
    { 
      id: 'dependents',
      name: language === 'en' ? 'Dependents & Child Care' : 'Personnes à charge et garde d\'enfants',
      icon: Users,
      documents: [
        'Child Care Receipts',
        'Dependents Information',
        'Child Tax Benefit',
        'Education Expenses'
      ]
    },
    { 
      id: 'medical',
      name: language === 'en' ? 'Medical Expenses' : 'Frais médicaux',
      icon: Heart,
      documents: [
        'Medical Receipts',
        'Prescription Receipts',
        'Dental Expenses',
        'Insurance Premiums'
      ]
    },
    { 
      id: 'donations',
      name: language === 'en' ? 'Donations & Charitable' : 'Dons et charité',
      icon: Heart,
      documents: [
        'Donation Receipts',
        'Charitable Contributions',
        'Political Contributions'
      ]
    },
    { 
      id: 'tuition',
      name: language === 'en' ? 'Tuition & Education' : 'Frais de scolarité',
      icon: GraduationCap,
      documents: [
        'T2202 Tuition',
        'Relevé 8 (Québec)',
        'Student Loan Interest',
        'Textbook Receipts'
      ]
    },
    { 
      id: 'property',
      name: language === 'en' ? 'Property & Home' : 'Propriété et résidence',
      icon: Home,
      documents: [
        'Property Tax Bill',
        'Home Office Expenses',
        'Mortgage Interest',
        'Rental Income/Expenses'
      ]
    },
    { 
      id: 'other',
      name: language === 'en' ? 'Other Documents' : 'Autres documents',
      icon: FileText,
      documents: [
        'Moving Expenses',
        'Union Dues',
        'Professional Fees',
        'Other Slips'
      ]
    },
  ];

  const steps = [
    { id: 1, title: language === 'en' ? 'Account Created' : 'Compte créé', status: 'completed' },
    { id: 2, title: language === 'en' ? 'Personal Info Submitted' : 'Info personnelle soumise', status: 'completed' },
    { id: 3, title: language === 'en' ? 'Upload Documents' : 'Téléverser documents', status: 'current' },
    { id: 4, title: language === 'en' ? 'Submit & Pay' : 'Soumettre et payer', status: 'pending' },
    { id: 5, title: language === 'en' ? 'Under Review' : 'En révision', status: 'pending' },
  ];

  const toggleYear = (year: string) => {
    setExpandedYear(expandedYear === year ? null : year);
  };

  const toggleCategory = (year: string, categoryId: string) => {
    setExpandedCategory(prev => ({
      ...prev,
      [year]: prev[year] === categoryId ? null : categoryId
    }));
  };

  // Handle file upload
  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    year: string,
    category: string,
    docType: string
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);

    try {
      // Simulate upload (in production, upload to Supabase Storage)
      for (const file of Array.from(files)) {
        const newFile: UploadedFile = {
          id: Date.now().toString() + Math.random(),
          name: file.name,
          year,
          category,
          docType,
          uploadedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          size: file.size
        };
        
        setUploadedFiles(prev => [...prev, newFile]);
      }

      alert(language === 'en' 
        ? `✅ ${files.length} file(s) uploaded successfully!`
        : `✅ ${files.length} fichier(s) téléversé(s) avec succès!`
      );
    } catch (error) {
      console.error('Upload error:', error);
      alert(language === 'en' ? '❌ Upload failed' : '❌ Échec du téléversement');
    } finally {
      setIsUploading(false);
    }
  };

  // Remove uploaded file
  const handleRemoveFile = (fileId: string) => {
    if (confirm(language === 'en' 
      ? 'Are you sure you want to remove this file?' 
      : 'Êtes-vous sûr de vouloir supprimer ce fichier?')) {
      setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
    }
  };

  // Get files for specific year/category/docType
  const getFilesForDocType = (year: string, category: string, docType: string) => {
    return uploadedFiles.filter(
      f => f.year === year && f.category === category && f.docType === docType
    );
  };

  // Submit tax return and pay $50 CAD
  const handleSubmitTaxReturn = async (year: string) => {
    if (isSubmitting) return;

    const confirmMessage = language === 'en'
      ? `Submit Tax Return for ${year}?\n\nYou will be charged $50 CAD initial fee to submit your tax return for processing.\n\nYou can upload documents freely, but payment is required to submit.`
      : `Soumettre la déclaration d'impôts pour ${year}?\n\nDes frais initiaux de 50 $ CAD vous seront facturés pour soumettre votre déclaration d'impôts pour traitement.\n\nVous pouvez téléverser des documents librement, mais le paiement est requis pour soumettre.`;

    if (!confirm(confirmMessage)) return;

    setIsSubmitting(true);

    try {
      // Create Stripe payment session
      const response = await fetch(API_ENDPOINTS.createInitialPaymentInvoice, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({
          year: year,
          documentCount: uploadedFiles.filter(f => f.year === year).length,
          amount: 50 // $50 CAD initial fee
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Payment failed');
      }

      // Redirect to Stripe Checkout
      if (data.paymentUrl) {
        window.location.href = data.paymentUrl;
      } else {
        throw new Error('No payment URL received');
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert(language === 'en' 
        ? `❌ Payment failed: ${error instanceof Error ? error.message : 'Unknown error'}`
        : `❌ Échec du paiement: ${error instanceof Error ? error.message : 'Erreur inconnue'}`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.id) {
        setLoadingProfile(false);
        return;
      }

      try {
        // 🔧 CORREÇÃO: NÃO carregar automaticamente os dados do perfil
        // Apenas inicializar o email para notificações
        setPersonalInfo(prev => ({
          ...prev,
          notificationEmail: user.email || ''
        }));
        
        console.log('✅ Dashboard initialized with empty form');
      } catch (error) {
        console.error('Error initializing dashboard:', error);
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchProfile();
  }, [user]);

  return (
    <>
      <Helmet>
        <title>Client Dashboard - DuoPro Services</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Admin Status Banner */}
        {user && isAdminEmail(user.email) && (
          <AdminStatusBanner userEmail={user.email} />
        )}

        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="bg-blue-600 text-white px-3 py-2 rounded-lg font-bold text-xl">
                  DuoPro
                </div>
                <span className="text-gray-900 font-semibold">Services</span>
              </div>

              <div className="flex items-center gap-4">
                {/* Admin Panel - Only visible to admins */}
                {isAdminEmail(user?.email) && (
                  <button
                    onClick={() => navigate('/admin/control-panel')}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-100 rounded-lg font-medium transition-colors"
                  >
                    <Users className="w-4 h-4" />
                    <span>Admin Panel</span>
                  </button>
                )}

                <button
                  onClick={() => setLanguage(language === 'en' ? 'fr' : 'en')}
                  className="px-3 py-2 rounded-lg border border-gray-300 hover:border-blue-600 hover:bg-blue-50 transition-colors text-sm font-medium"
                >
                  {language === 'en' ? 'FR' : 'EN'}
                </button>
                
                <button
                  onClick={() => navigate('/')}
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-blue-600 transition-colors"
                >
                  <Home className="w-4 h-4" />
                  <span>{t('nav.home')}</span>
                </button>

                <button
                  onClick={() => navigate('/login')}
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-red-600 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>{t('nav.logout')}</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">
            {language === 'en' ? 'Client Portal' : 'Portail client'}
          </h1>

          {/* Tabs */}
          <div className="bg-white rounded-lg shadow-sm mb-6">
            <div className="flex border-b border-gray-200 overflow-x-auto">
              <button
                onClick={() => setActiveTab('personal')}
                className={`px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                  activeTab === 'personal'
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <User className="w-4 h-4 inline-block mr-2" />
                {language === 'en' ? 'Personal Info' : 'Infos personnelles'}
              </button>
              <button
                onClick={() => setActiveTab('filings')}
                className={`px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                  activeTab === 'filings'
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Calendar className="w-4 h-4 inline-block mr-2" />
                {language === 'en' ? 'Tax Filings' : 'Déclarations'}
              </button>
              <button
                onClick={() => setActiveTab('documents')}
                className={`px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                  activeTab === 'documents'
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <FileText className="w-4 h-4 inline-block mr-2" />
                {t('portal.documents')}
              </button>
              <button
                onClick={() => setActiveTab('payments')}
                className={`px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                  activeTab === 'payments'
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <CreditCard className="w-4 h-4 inline-block mr-2" />
                {t('portal.payments')}
              </button>
              <button
                onClick={() => setActiveTab('messages')}
                className={`px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                  activeTab === 'messages'
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <MessageSquare className="w-4 h-4 inline-block mr-2" />
                {t('portal.messages')}
              </button>
              <button
                onClick={() => setActiveTab('status')}
                className={`px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                  activeTab === 'status'
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Clock className="w-4 h-4 inline-block mr-2" />
                {t('portal.status')}
              </button>
            </div>

            <div className="p-6">
              {/* PERSONAL INFORMATION TAB */}
              {activeTab === 'personal' && (
                <PersonalInfoTab
                  language={language}
                  personalInfo={personalInfo}
                  updatePersonalField={updatePersonalField}
                  expandedPersonalSection={expandedPersonalSection}
                  togglePersonalSection={togglePersonalSection}
                  CANADIAN_PROVINCES={CANADIAN_PROVINCES}
                />
              )}

              {/* TAX FILINGS TAB */}
              {activeTab === 'filings' && (
                <TaxFilingsTab
                  language={language}
                  taxYears={taxYears}
                />
              )}

              {/* DOCUMENTS TAB - Overview of all uploaded documents */}
              {activeTab === 'documents' && (
                <DocumentsTab
                  language={language}
                  taxYears={taxYears}
                  documentCategories={documentCategories}
                  uploadedFiles={uploadedFiles}
                  expandedYear={expandedYear}
                  expandedCategory={expandedCategory}
                  toggleYear={toggleYear}
                  toggleCategory={toggleCategory}
                  handleFileUpload={handleFileUpload}
                  handleRemoveFile={handleRemoveFile}
                  getFilesForDocType={getFilesForDocType}
                  isUploading={isUploading}
                />
              )}

              {/* PAYMENTS TAB */}
              {activeTab === 'payments' && (
                <PaymentsTab
                  language={language}
                  taxYears={taxYears}
                  handleSubmitTaxReturn={handleSubmitTaxReturn}
                  isSubmitting={isSubmitting}
                />
              )}

              {/* MESSAGES TAB */}
              {activeTab === 'messages' && (
                <div className="text-center py-12">
                  <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    {language === 'en' ? 'No messages yet' : 'Aucun message pour le moment'}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {language === 'en'
                      ? 'Messages from our team will appear here'
                      : 'Les messages de notre équipe apparaîtront ici'}
                  </p>
                </div>
              )}

              {/* STATUS TAB */}
              {activeTab === 'status' && (
                <div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                    <h3 className="font-semibold text-blue-900 mb-2">
                      {language === 'en' ? 'Current Status: Ready to Submit' : 'Statut actuel: Prêt à soumettre'}
                    </h3>
                    <p className="text-sm text-blue-700">
                      {language === 'en'
                        ? 'Upload your documents and submit your tax return. You will be charged $50 CAD initial fee upon submission.'
                        : 'Téléversez vos documents et soumettez votre déclaration d\'impôts. Des frais initiaux de 50 $ CAD vous seront facturés lors de la soumission.'}
                    </p>
                  </div>

                  {/* Timeline */}
                  <div>
                    <h3 className="font-semibold mb-4">
                      {language === 'en' ? 'Progress Timeline' : 'Chronologie des progrès'}
                    </h3>
                    <div className="space-y-4">
                      {steps.map((step) => (
                        <div key={step.id} className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            step.status === 'completed' ? 'bg-green-100 text-green-600' :
                            step.status === 'current' ? 'bg-blue-100 text-blue-600' :
                            'bg-gray-100 text-gray-400'
                          }`}>
                            {step.status === 'completed' ? (
                              <CheckCircle className="w-5 h-5" />
                            ) : (
                              <span className="text-sm font-semibold">{step.id}</span>
                            )}
                          </div>
                          <div>
                            <p className={`font-medium ${
                              step.status === 'current' ? 'text-blue-600' : 'text-gray-700'
                            }`}>
                              {step.title}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}