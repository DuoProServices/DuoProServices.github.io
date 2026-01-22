<<<<<<< HEAD
import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
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
                {/* 🔧 BOTÃO DE DEBUG TEMPORÁRIO */}
                <button
                  onClick={() => {
                    console.log('🔧 DEBUG: User:', user);
                    console.log('🔧 DEBUG: Email:', user?.email);
                    console.log('🔧 DEBUG: Is admin?', isAdminEmail(user?.email));
                    navigate('/admin/control-panel');
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-yellow-100 border-2 border-yellow-400 text-yellow-800 hover:bg-yellow-200 rounded-lg font-semibold transition-colors"
                >
                  <Users className="w-4 h-4" />
                  <span>🔧 DEBUG: Admin Panel</span>
                </button>

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
=======
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { projectId, publicAnonKey } from "../../../utils/supabase/info";
import { supabase } from "../utils/supabaseClient";
import { API_ENDPOINTS } from "../../config/api";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Progress } from "../components/ui/progress";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Textarea } from "../components/ui/textarea";
import { CheckCircle2, Circle, Upload, FileText, Trash2, Eye, Send, Download, MessageSquare } from "lucide-react";
import { toast } from "sonner";

interface Message {
  id: string;
  clientId: string;
  senderId: string;
  senderRole: 'admin' | 'client';
  senderName: string;
  subject: string;
  content: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Document {
  id: string;
  fileName: string;
  category: string;
  description: string;
  uploadedAt: string;
  size: number;
  url: string;
  storagePath?: string;
}

interface TimelineStatus {
  step: number;
  updatedAt: string;
}

interface DocumentCategory {
  id: string;
  key: string;
  required: boolean;
}

const DOCUMENT_CATEGORIES: DocumentCategory[] = [
  { id: "t4", key: "docCategory.t4", required: true },
  { id: "t5", key: "docCategory.t5", required: false },
  { id: "medical", key: "docCategory.medical", required: false },
  { id: "charity", key: "docCategory.charity", required: false },
  { id: "rrsp", key: "docCategory.rrsp", required: false },
  { id: "education", key: "docCategory.education", required: false },
  { id: "t4a", key: "docCategory.t4a", required: false },
  { id: "rental", key: "docCategory.rental", required: false },
  { id: "selfEmployed", key: "docCategory.selfEmployed", required: false },
  { id: "other", key: "docCategory.other", required: false },
];

const STEPS = [
  { key: "step1", titleKey: "process.step1Title", descKey: "process.step1Desc" },
  { key: "step2", titleKey: "process.step2Title", descKey: "process.step2Desc" },
  { key: "step3", titleKey: "process.step3Title", descKey: "process.step3Desc" },
  { key: "step4", titleKey: "process.step4Title", descKey: "process.step4Desc" },
  { key: "step5", titleKey: "process.step5Title", descKey: "process.step5Desc" },
];

export function DashboardPage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [timelineStatus, setTimelineStatus] = useState<TimelineStatus>({ step: 1, updatedAt: new Date().toISOString() });
  const [loading, setLoading] = useState(false);
  const [uploadingCategories, setUploadingCategories] = useState<Record<string, boolean>>({});
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [updatingTimeline, setUpdatingTimeline] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);

  const BUCKET_NAME = "make-c2a25be0-client-documents";

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    checkProfileCompletion();
  }, [user, navigate]);

  const checkProfileCompletion = async () => {
    if (!user?.id) return;

    try {
      // Get user metadata from Supabase Auth
      const { data: sessionData } = await supabase.auth.getSession();
      
      if (!sessionData?.session) {
        console.log("No active session, redirecting to login");
        navigate("/login");
        return;
      }

      const { data, error } = await supabase.auth.getUser();

      if (error) {
        console.error("Error checking profile:", error);
        navigate("/login");
        return;
      }

      const profile = data?.user?.user_metadata?.profile;
      
      if (!profile || !profile.onboardingCompleted) {
        // No profile or profile incomplete, redirect to onboarding
        console.log("Profile incomplete, redirecting to onboarding");
        navigate("/onboarding");
        return;
      }

      // Profile complete, proceed with normal initialization
      initializeBucket();
      fetchDocuments();
      fetchTimelineStatus();
    } catch (error) {
      console.error("Error checking profile:", error);
    }
  };

  const initializeBucket = async () => {
    try {
      console.log("🔍 Checking buckets...");
      
      // Check if bucket exists
      const { data: buckets, error: listError } = await supabase.storage.listBuckets();
      
      if (listError) {
        console.warn("⚠️ Could not list buckets (this is ok):", listError.message);
        console.log("ℹ️ Assuming bucket exists. Upload will verify.");
        return;
      }
      
      console.log("📦 Available buckets:", buckets);
      console.log("📦 Bucket names:", buckets?.map(b => b.name));
      console.log("📦 Looking for bucket:", BUCKET_NAME);
      console.log("📦 Bucket name length:", BUCKET_NAME.length);
      console.log("📦 Bucket name chars:", BUCKET_NAME.split('').map((c, i) => `[${i}]="${c}" (${c.charCodeAt(0)})`));
      
      const bucketExists = buckets?.some(bucket => bucket.name === BUCKET_NAME);
      
      if (bucketExists) {
        console.log(`✅ Bucket "${BUCKET_NAME}" found!`);
      } else {
        console.warn(`⚠️ Bucket "${BUCKET_NAME}" not found in list.`);
        console.log("ℹ️ Available bucket details:");
        buckets?.forEach(b => {
          console.log(`  - Name: "${b.name}" (length: ${b.name.length})`);
          console.log(`  - Chars:`, b.name.split('').map((c, i) => `[${i}]="${c}" (${c.charCodeAt(0)})`));
        });
      }
    } catch (error) {
      console.warn("⚠️ Error checking buckets:", error);
      console.log("ℹ️ This is OK - upload will verify bucket exists.");
    }
  };

  const fetchDocuments = async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      
      // Get documents from user metadata
      const { data, error } = await supabase.auth.getUser();

      if (error) {
        console.error("Error fetching user:", error);
        return;
      }

      const docs = data?.user?.user_metadata?.documents || [];
      setDocuments(docs);
    } catch (error) {
      console.error("Error fetching documents:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTimelineStatus = async () => {
    if (!user?.id) return;
    
    try {
      // Get timeline from user metadata
      const { data, error } = await supabase.auth.getUser();

      if (error) {
        console.error("Error fetching timeline:", error);
        return;
      }

      const timeline = data?.user?.user_metadata?.timeline || { step: 1, updatedAt: new Date().toISOString() };
      setTimelineStatus(timeline);
    } catch (error) {
      console.error("Error fetching timeline:", error);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !category) {
      toast.error("Please select a file and category");
      return;
    }

    setUploadingCategories((prev) => ({ ...prev, [category]: true }));

    try {
      const session = await supabase.auth.getSession();
      const accessToken = session.data.session?.access_token;

      if (!accessToken) {
        throw new Error("No access token");
      }

      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("category", category);
      formData.append("description", description);

      const response = await fetch(
        API_ENDPOINTS.documentsUpload,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          body: formData,
        }
      );

      const data = await response.json();
      if (response.ok) {
        const wasOnStep1 = timelineStatus.step === 1;
        
        toast.success("Document uploaded successfully!");
        setSelectedFile(null);
        setCategory("");
        setDescription("");
        
        // Auto-advance to step 2 if still on step 1
        if (wasOnStep1) {
          await advanceTimeline(2, false);
          toast.success("✅ Advancing to Document Review stage!", { duration: 4000 });
        }
        
        // Fetch documents after advancing timeline
        await fetchDocuments();
      } else {
        throw new Error(data.error || "Upload failed");
      }
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error(error.message || "Failed to upload document");
    } finally {
      setUploadingCategories((prev) => ({ ...prev, [category]: false }));
    }
  };

  const getDocumentsForCategory = (categoryId: string) => {
    return documents.filter((doc) => doc.category === categoryId);
  };

  const handleCategoryUpload = async (categoryId: string, file: File) => {
    if (!user?.id) return;
    
    setUploadingCategories((prev) => ({ ...prev, [categoryId]: true }));

    try {
      console.log("Starting upload for category:", categoryId);
      console.log("File:", file.name, "Size:", file.size);
      console.log("User ID:", user.id);
      
      // Generate unique file path
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${categoryId}_${Date.now()}.${fileExt}`;
      
      console.log("Uploading to bucket:", BUCKET_NAME, "Path:", fileName);
      
      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(fileName, file);

      if (uploadError) {
        console.error("Upload error details:", uploadError);
        throw new Error(`Upload failed: ${uploadError.message}`);
      }

      console.log("Upload successful! Getting signed URL...");

      // Get signed URL (valid for 1 year)
      const { data: urlData, error: urlError } = await supabase.storage
        .from(BUCKET_NAME)
        .createSignedUrl(fileName, 31536000); // 1 year in seconds

      if (urlError) {
        console.error("Signed URL error:", urlError);
        throw new Error(`Failed to generate URL: ${urlError.message}`);
      }

      if (!urlData?.signedUrl) {
        throw new Error("No signed URL returned");
      }

      console.log("Signed URL created. Saving metadata to user...");

      // Create document metadata
      const docId = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const documentData = {
        id: docId,
        fileName: file.name,
        category: categoryId,
        description: "",
        uploadedAt: new Date().toISOString(),
        size: file.size,
        url: urlData.signedUrl,
        storagePath: fileName,
      };

      // Get current documents from user metadata
      const { data: userData } = await supabase.auth.getUser();
      const currentDocs = userData?.user?.user_metadata?.documents || [];
      
      // Add new document
      const updatedDocs = [...currentDocs, documentData];

      // Update user metadata with new document list
      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          documents: updatedDocs,
        },
      });

      if (updateError) {
        console.error("Update user error:", updateError);
        // If update fails, delete the uploaded file
        await supabase.storage.from(BUCKET_NAME).remove([fileName]);
        throw new Error(`Failed to save document: ${updateError.message}`);
      }

      console.log("✅ Upload complete!");
      toast.success(`${t(`docCategory.${categoryId}`)} uploaded successfully!`);
      await fetchDocuments();
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error(error.message || "Failed to upload document");
    } finally {
      setUploadingCategories((prev) => ({ ...prev, [categoryId]: false }));
    }
  };

  const handleDelete = async (documentId: string) => {
    if (!confirm("Are you sure you want to delete this document?")) return;
    if (!user?.id) return;

    try {
      // Find the document to get storage path
      const doc = documents.find(d => d.id === documentId);
      if (!doc) {
        throw new Error("Document not found");
      }

      // Delete from storage (if we have storagePath)
      if (doc.storagePath) {
        await supabase.storage.from(BUCKET_NAME).remove([doc.storagePath]);
      }

      // Remove from user metadata
      const { data: userData } = await supabase.auth.getUser();
      const currentDocs = userData?.user?.user_metadata?.documents || [];
      const updatedDocs = currentDocs.filter((d: Document) => d.id !== documentId);

      // Update user metadata
      const { error } = await supabase.auth.updateUser({
        data: {
          documents: updatedDocs,
        },
      });

      if (error) {
        throw error;
      }

      toast.success("Document deleted");
      await fetchDocuments();
    } catch (error: any) {
      console.error("Delete error:", error);
      toast.error(error.message || "Failed to delete document");
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  const advanceTimeline = async (nextStep: number, showToast: boolean = true) => {
    if (nextStep > 5 || nextStep < 1 || !user?.id) return;
    
    setUpdatingTimeline(true);
    try {
      const newTimeline = {
        step: nextStep,
        updatedAt: new Date().toISOString(),
      };

      // Update timeline in user metadata
      const { error } = await supabase.auth.updateUser({
        data: {
          timeline: newTimeline,
        },
      });

      if (error) throw error;

      setTimelineStatus(newTimeline);
      if (showToast) {
        toast.success("Progress updated!");
      }
    } catch (error: any) {
      console.error("Timeline update error:", error);
      toast.error(error.message || "Failed to update progress");
    } finally {
      setUpdatingTimeline(false);
    }
  };

  const fetchMessages = async () => {
    if (!user?.id) return;
    
    setLoadingMessages(true);
    try {
      const response = await fetch(
        `${API_ENDPOINTS.BASE_URL}/messages/${user.id}`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          }
        }
      );

      if (!response.ok) throw new Error('Failed to fetch messages');

      const data = await response.json();
      setMessages(data.messages || []);
    } catch (error: any) {
      console.error('Error fetching messages:', error);
      toast.error('Failed to load messages');
    } finally {
      setLoadingMessages(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !user?.id) return;
    
    setSendingMessage(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      const userName = userData?.user?.user_metadata?.name || user.email || 'Client';

      const response = await fetch(
        `${API_ENDPOINTS.BASE_URL}/messages/send`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            clientId: user.id,
            senderId: user.id,
            senderRole: 'client',
            senderName: userName,
            subject: 'Client Message',
            content: newMessage,
          })
        }
      );

      if (!response.ok) throw new Error('Failed to send message');

      setNewMessage('');
      toast.success('Message sent successfully!');
      await fetchMessages();
    } catch (error: any) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setSendingMessage(false);
    }
  };

  const canAdvanceToNextStep = () => {
    const currentStep = timelineStatus.step;
    
    // Step 1 -> 2: Need at least 1 document
    if (currentStep === 1) {
      return documents.length > 0;
    }
    
    // Step 2 -> 3: Need at least 3 documents
    if (currentStep === 2) {
      return documents.length >= 3;
    }
    
    // Can't advance from step 3, 4, or 5 (admin controlled)
    return false;
  };

  const handleSubmitForReview = () => {
    if (!confirm("Are you sure you want to submit all documents for review? You can still add more documents later.")) {
      return;
    }
    advanceTimeline(2);
  };

  const uploadedCount = documents.length;
  const totalCategories = DOCUMENT_CATEGORIES.length;
  const uploadProgress = Math.round((uploadedCount / totalCategories) * 100);

  const progressPercentage = (timelineStatus.step / STEPS.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl">{t("clientPortal.title")}</h1>
            <p className="text-gray-600">
              {t("clientPortal.welcomeBack")}, {user?.email}
            </p>
          </div>
          <Button onClick={handleLogout} variant="outline">
            {t("clientPortal.logout")}
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Timeline */}
        <Card className="p-8 mb-8">
          <h2 className="text-2xl mb-6">Tax Return Progress</h2>
          <Progress value={progressPercentage} className="mb-8 h-3" />

          <div className="space-y-6">
            {STEPS.map((step, index) => {
              const stepNumber = index + 1;
              const isComplete = stepNumber < timelineStatus.step;
              const isCurrent = stepNumber === timelineStatus.step;

              return (
                <div key={step.key} className="flex gap-4">
                  <div className="flex-shrink-0">
                    {isComplete ? (
                      <CheckCircle2 className="w-8 h-8 text-green-600" />
                    ) : (
                      <Circle className={`w-8 h-8 ${isCurrent ? "text-blue-600" : "text-gray-300"}`} />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className={isCurrent ? "text-blue-600" : ""}>{t(step.titleKey)}</h3>
                      {isCurrent && <Badge>Current</Badge>}
                      {isComplete && <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Complete</Badge>}
                    </div>
                    <p className="text-gray-600">{t(step.descKey)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Documents Section */}
        <Card className="p-8">
          <Tabs defaultValue="upload" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="upload">{t("clientPortal.uploadDocuments")}</TabsTrigger>
              <TabsTrigger value="documents">{t("clientPortal.myDocuments")}</TabsTrigger>
              <TabsTrigger value="messages" onClick={fetchMessages}>
                <MessageSquare className="w-4 h-4 mr-2" />
                {t("messages.title")}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upload">
              <div className="space-y-6">
                {/* Header with Progress */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg">Upload Your Tax Documents</h3>
                    <Badge variant="outline">{uploadedCount} of {totalCategories} uploaded</Badge>
                  </div>
                  <Progress value={uploadProgress} className="h-2" />
                  <p className="text-sm text-gray-600 mt-2">
                    Upload all required documents. Optional documents can be added if applicable.
                  </p>
                </div>

                {/* Document Categories List */}
                <div className="space-y-3">
                  {DOCUMENT_CATEGORIES.map((cat) => {
                    const categoryDocs = getDocumentsForCategory(cat.id);
                    const hasDocument = categoryDocs.length > 0;
                    const isUploading = uploadingCategories[cat.id];

                    return (
                      <div
                        key={cat.id}
                        className={`border rounded-lg p-4 transition-colors ${
                          hasDocument ? "bg-green-50 border-green-200" : "bg-white"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          {/* Checkbox Icon */}
                          <div className="flex-shrink-0 mt-1">
                            {hasDocument ? (
                              <CheckCircle2 className="w-6 h-6 text-green-600" />
                            ) : (
                              <Circle className="w-6 h-6 text-gray-300" />
                            )}
                          </div>

                          {/* Content */}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium">{t(cat.key)}</h4>
                              {cat.required && (
                                <Badge variant="destructive" className="text-xs">Required</Badge>
                              )}
                            </div>

                            {/* Show uploaded documents */}
                            {hasDocument ? (
                              <div className="space-y-2 mt-3">
                                {categoryDocs.map((doc) => (
                                  <div
                                    key={doc.id}
                                    className="flex items-center justify-between bg-white border border-green-200 rounded px-3 py-2"
                                  >
                                    <div className="flex items-center gap-2">
                                      <FileText className="w-4 h-4 text-green-600" />
                                      <span className="text-sm">{doc.fileName}</span>
                                      <span className="text-xs text-gray-500">
                                        ({(doc.size / 1024).toFixed(1)} KB)
                                      </span>
                                    </div>
                                    <div className="flex gap-1">
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-7 w-7 p-0"
                                        onClick={() => window.open(doc.url, "_blank")}
                                      >
                                        <Eye className="w-3.5 h-3.5" />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-7 w-7 p-0"
                                        onClick={() => handleDelete(doc.id)}
                                      >
                                        <Trash2 className="w-3.5 h-3.5 text-red-600" />
                                      </Button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              /* Upload Button */
                              <div className="mt-3">
                                <label
                                  htmlFor={`file-${cat.id}`}
                                  className={`flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                                    isUploading
                                      ? "bg-gray-50 border-gray-300 cursor-not-allowed"
                                      : "hover:bg-gray-50 hover:border-blue-400"
                                  }`}
                                >
                                  <Upload className="w-4 h-4 text-gray-500" />
                                  <span className="text-sm text-gray-600">
                                    {isUploading ? "Uploading..." : "Upload File"}
                                  </span>
                                </label>
                                <input
                                  id={`file-${cat.id}`}
                                  type="file"
                                  className="hidden"
                                  accept=".pdf,.jpg,.jpeg,.png"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      handleCategoryUpload(cat.id, file);
                                    }
                                    e.target.value = "";
                                  }}
                                  disabled={isUploading}
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Additional Notes */}
                <div className="border-t pt-6">
                  <Label htmlFor="notes">Additional Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    value={additionalNotes}
                    onChange={(e) => setAdditionalNotes(e.target.value)}
                    className="mt-2"
                    placeholder="Add any additional information for your tax specialist..."
                    rows={3}
                  />
                </div>

                {/* Submit Button */}
                {documents.length > 0 && timelineStatus.step === 1 && (
                  <div className="border-t pt-6">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                      <p className="text-sm text-blue-900">
                        ✓ You have uploaded {uploadedCount} document{uploadedCount !== 1 ? "s" : ""}. 
                        Click below to submit for review.
                      </p>
                    </div>
                    <Button
                      onClick={handleSubmitForReview}
                      disabled={updatingTimeline}
                      className="w-full"
                      size="lg"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      {updatingTimeline ? "Submitting..." : "Submit All Documents for Review"}
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="documents">
              {documents.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">{t("clientPortal.noDocuments")}</p>
                </div>
              ) : (
                <>
                  <div className="space-y-4 mb-6">
                    {documents.map((doc) => (
                      <div key={doc.id} className="border rounded-lg p-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <FileText className="w-10 h-10 text-blue-600" />
                          <div>
                            <h4>{doc.fileName}</h4>
                            <p className="text-sm text-gray-600">
                              {t("clientPortal.category")}: {t(`docCategory.${doc.category}` as any)}
                            </p>
                            <p className="text-sm text-gray-500">
                              {t("clientPortal.uploadedOn")} {new Date(doc.uploadedAt).toLocaleDateString()} •{" "}
                              {(doc.size / 1024).toFixed(2)} KB
                            </p>
                            {doc.description && (
                              <p className="text-sm text-gray-600 mt-1">{doc.description}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(doc.url, "_blank")}
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(doc.id)}
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Request Review Button */}
                  {canAdvanceToNextStep() && (
                    <div className="border-t pt-6">
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                        <p className="text-sm text-blue-900">
                          {timelineStatus.step === 1 && "You have uploaded documents. Click below to move to the next step."}
                          {timelineStatus.step === 2 && "You have uploaded 3+ documents. Ready to submit for review?"}
                        </p>
                      </div>
                      <Button
                        onClick={() => advanceTimeline(timelineStatus.step + 1)}
                        disabled={updatingTimeline}
                        className="w-full"
                      >
                        {updatingTimeline ? "Updating..." : timelineStatus.step === 2 ? "Submit for Review" : "Continue to Document Collection"}
                      </Button>
                    </div>
                  )}
                </>
              )}
            </TabsContent>

            <TabsContent value="messages">
              <div className="space-y-6">
                {/* Messages Header */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold">{t("messages.title")}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Chat with your tax advisor
                    </p>
                  </div>
                </div>

                {/* Messages List */}
                <div className="bg-gray-50 rounded-lg p-4 min-h-[400px] max-h-[500px] overflow-y-auto space-y-4">
                  {loadingMessages ? (
                    <div className="text-center py-8 text-gray-500">
                      Loading messages...
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="text-center py-12">
                      <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">{t("messages.noMessages")}</p>
                    </div>
                  ) : (
                    messages.map((msg) => {
                      const isFromClient = msg.senderRole === 'client';
                      const date = new Date(msg.createdAt);
                      const today = new Date();
                      const yesterday = new Date(today);
                      yesterday.setDate(yesterday.getDate() - 1);
                      
                      let dateLabel = date.toLocaleDateString();
                      if (date.toDateString() === today.toDateString()) {
                        dateLabel = t("messages.today");
                      } else if (date.toDateString() === yesterday.toDateString()) {
                        dateLabel = t("messages.yesterday");
                      }

                      return (
                        <div
                          key={msg.id}
                          className={`flex ${isFromClient ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[70%] rounded-lg p-4 ${
                              isFromClient
                                ? 'bg-blue-600 text-white'
                                : 'bg-white border border-gray-200'
                            }`}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-semibold">
                                {isFromClient ? t("messages.you") : t("messages.admin")}
                              </span>
                              <span className={`text-xs ${isFromClient ? 'text-blue-100' : 'text-gray-500'}`}>
                                {dateLabel} • {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <p className="whitespace-pre-wrap">{msg.content}</p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Message Input */}
                <div className="flex gap-2">
                  <Textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder={t("messages.writeMessage")}
                    className="flex-1 min-h-[80px] resize-none"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                  />
                  <Button
                    onClick={sendMessage}
                    disabled={!newMessage.trim() || sendingMessage}
                    className="h-[80px]"
                  >
                    {sendingMessage ? (
                      <span>{t("messages.sending")}</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        {t("messages.send")}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </main>
    </div>
>>>>>>> 4611dd44203dcbfb0e686683575a9f9bd31460a8
  );
}