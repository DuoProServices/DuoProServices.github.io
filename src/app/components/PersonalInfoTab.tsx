import { ChevronDown, ChevronUp, User, MapPin, Home, Users as UsersIcon, FileText, Globe, Mail } from 'lucide-react';
import { useState } from 'react';
import { API_ENDPOINTS } from '@/config/api';
import { publicAnonKey } from '/utils/supabase/info';
import { supabase } from '@/app/utils/supabaseClient';

interface PersonalInfoTabProps {
  language: 'en' | 'fr';
  personalInfo: any;
  updatePersonalField: (field: string, value: any) => void;
  expandedPersonalSection: string | null;
  togglePersonalSection: (section: string) => void;
  CANADIAN_PROVINCES: Array<{ value: string; label: string }>;
}

export default function PersonalInfoTab({
  language,
  personalInfo,
  updatePersonalField,
  expandedPersonalSection,
  togglePersonalSection,
  CANADIAN_PROVINCES
}: PersonalInfoTabProps) {
  
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleLoadPreviousInfo = async () => {
    setIsLoading(true);
    try {
      // Buscar dados do user_metadata do Supabase Auth
      const { data, error } = await supabase.auth.getUser();

      if (error) {
        console.error('Error fetching user profile:', error);
        alert(language === 'en' 
          ? '❌ Failed to load previous information' 
          : '❌ Échec du chargement des informations précédentes');
        return;
      }

      const profile = data?.user?.user_metadata?.profile;
      
      if (profile) {
        console.log('✅ Profile loaded:', profile);
        // Carregar TODOS os campos do perfil anterior
        Object.keys(profile).forEach(key => {
          updatePersonalField(key, profile[key]);
        });
        alert(language === 'en' 
          ? '✅ Previous information loaded successfully!' 
          : '✅ Informations précédentes chargées avec succès!');
      } else {
        alert(language === 'en' 
          ? '⚠️ No previous information found' 
          : '⚠️ Aucune information précédente trouvée');
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      alert(language === 'en' 
        ? `❌ Failed to load: ${error instanceof Error ? error.message : 'Unknown error'}` 
        : `❌ Échec du chargement: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSaveInformation = async () => {
    setIsSaving(true);
    try {
      console.log('💾 Saving personal info:', personalInfo);
      console.log('📡 API URL:', `${API_ENDPOINTS.personalInfo}/save`);
      
      const response = await fetch(`${API_ENDPOINTS.personalInfo}/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify(personalInfo),
      });

      console.log('📥 Response status:', response.status);
      console.log('📥 Response ok:', response.ok);
      console.log('📥 Response headers:', response.headers);
      
      // Try to get response text first to see what's coming back
      const responseText = await response.text();
      console.log('📥 Response text:', responseText);
      
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('❌ Failed to parse JSON:', parseError);
        console.error('❌ Response was:', responseText);
        throw new Error(`Invalid JSON response: ${responseText.substring(0, 100)}`);
      }
      
      console.log('📥 Response data:', data);

      if (response.ok) {
        alert(language === 'en' 
          ? '✅ Information saved successfully!' 
          : '✅ Informations enregistrées avec succès!');
      } else {
        throw new Error(data.error || 'Failed to save');
      }
    } catch (error) {
      console.error('❌ Save error:', error);
      console.error('❌ Error type:', error?.constructor?.name);
      console.error('❌ Error message:', error?.message);
      alert(language === 'en' 
        ? `❌ Failed to save: ${error instanceof Error ? error.message : 'Unknown error'}` 
        : `❌ Échec de l'enregistrement: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveDraft = async () => {
    // Same as save for now - could be enhanced to save as draft status
    await handleSaveInformation();
  };
  
  return (
    <div className="space-y-4">
      {/* SECTION 1: PERSONAL INFORMATION */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <button
          onClick={() => togglePersonalSection('personal')}
          className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors bg-white"
        >
          <div className="flex items-center gap-3">
            <User className="w-5 h-5 text-blue-600" />
            <span className="font-semibold">
              {language === 'en' ? '1. Personal Information' : '1. Informations personnelles'}
            </span>
          </div>
          {expandedPersonalSection === 'personal' ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </button>

        {expandedPersonalSection === 'personal' && (
          <div className="bg-gray-50 p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'en' ? 'First name *' : 'Prénom *'}
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  value={personalInfo.firstName}
                  onChange={(e) => updatePersonalField('firstName', e.target.value)}
                  placeholder=""
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'en' ? 'Middle name' : 'Deuxième prénom'}
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  value={personalInfo.middleName}
                  onChange={(e) => updatePersonalField('middleName', e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'en' ? 'Last name *' : 'Nom de famille *'}
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  value={personalInfo.lastName}
                  onChange={(e) => updatePersonalField('lastName', e.target.value)}
                  placeholder=""
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'en' ? 'Social Insurance Number (SIN) *' : 'Numéro d\'assurance sociale (NAS) *'}
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  value={personalInfo.sin}
                  onChange={(e) => updatePersonalField('sin', e.target.value.replace(/\D/g, ''))}
                  placeholder=""
                  maxLength={9}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {language === 'en' ? 'Required to auto-fill your tax return' : 'Requis pour remplir automatiquement votre déclaration'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'en' ? 'Date of Birth *' : 'Date de naissance *'}
                </label>
                <input
                  type="date"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  value={personalInfo.dateOfBirth}
                  onChange={(e) => updatePersonalField('dateOfBirth', e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'en' ? 'Preferred Language *' : 'Langue préférée *'}
                </label>
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  value={personalInfo.preferredLanguage}
                  onChange={(e) => updatePersonalField('preferredLanguage', e.target.value)}
                >
                  <option value="English">{language === 'en' ? 'English' : 'Anglais'}</option>
                  <option value="French">{language === 'en' ? 'French' : 'Français'}</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'en' ? 'Gender *' : 'Genre *'}
                </label>
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  value={personalInfo.gender}
                  onChange={(e) => updatePersonalField('gender', e.target.value)}
                >
                  <option value="">{language === 'en' ? 'Select gender' : 'Sélectionnez le genre'}</option>
                  <option value="Female">{language === 'en' ? 'Female' : 'Femme'}</option>
                  <option value="Male">{language === 'en' ? 'Male' : 'Homme'}</option>
                  <option value="Other">{language === 'en' ? 'Other' : 'Autre'}</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* SECTION 2: MAILING ADDRESS */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <button
          onClick={() => togglePersonalSection('address')}
          className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors bg-white"
        >
          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-blue-600" />
            <span className="font-semibold">
              {language === 'en' ? '2. Mailing Address' : '2. Adresse postale'}
            </span>
          </div>
          {expandedPersonalSection === 'address' ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </button>

        {expandedPersonalSection === 'address' && (
          <div className="bg-gray-50 p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'en' ? 'C/O (Care of)' : 'Aux soins de (C/O)'}
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                value={personalInfo.careOf}
                onChange={(e) => updatePersonalField('careOf', e.target.value)}
              />
            </div>

            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'en' ? 'Unit' : 'Unité'}
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  value={personalInfo.addressUnit}
                  onChange={(e) => updatePersonalField('addressUnit', e.target.value)}
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'en' ? 'Street # *' : 'No rue *'}
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  value={personalInfo.streetNumber}
                  onChange={(e) => updatePersonalField('streetNumber', e.target.value)}
                  placeholder="123"
                />
              </div>

              <div className="col-span-8">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'en' ? 'Street Name *' : 'Nom de la rue *'}
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  value={personalInfo.streetName}
                  onChange={(e) => updatePersonalField('streetName', e.target.value)}
                  placeholder="Main Street"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'en' ? 'City *' : 'Ville *'}
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  value={personalInfo.city}
                  onChange={(e) => updatePersonalField('city', e.target.value)}
                  placeholder="Toronto"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'en' ? 'Province *' : 'Province *'}
                </label>
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  value={personalInfo.province}
                  onChange={(e) => updatePersonalField('province', e.target.value)}
                >
                  <option value="">{language === 'en' ? 'Select province' : 'Sélectionnez la province'}</option>
                  {CANADIAN_PROVINCES.map((prov) => (
                    <option key={prov.value} value={prov.value}>
                      {prov.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'en' ? 'Postal Code *' : 'Code postal *'}
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  value={personalInfo.postalCode}
                  onChange={(e) => updatePersonalField('postalCode', e.target.value.toUpperCase())}
                  placeholder="M5H 2N2"
                  maxLength={7}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'en' ? 'Home Phone (Area Code) *' : 'Téléphone domicile (indicatif) *'}
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  value={personalInfo.homePhoneArea}
                  onChange={(e) => updatePersonalField('homePhoneArea', e.target.value.replace(/\D/g, ''))}
                  placeholder="416"
                  maxLength={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'en' ? 'Phone Number *' : 'Numéro de téléphone *'}
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  value={personalInfo.homePhoneNumber}
                  onChange={(e) => updatePersonalField('homePhoneNumber', e.target.value.replace(/\D/g, ''))}
                  placeholder="5551234"
                  maxLength={7}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* SECTION 3: RESIDENCY */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <button
          onClick={() => togglePersonalSection('residency')}
          className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors bg-white"
        >
          <div className="flex items-center gap-3">
            <Home className="w-5 h-5 text-blue-600" />
            <span className="font-semibold">
              {language === 'en' ? '3. About Your Residency' : '3. À propos de votre résidence'}
            </span>
          </div>
          {expandedPersonalSection === 'residency' ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </button>

        {expandedPersonalSection === 'residency' && (
          <div className="bg-gray-50 p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'en' 
                  ? 'Were you a resident of Canada for all of 2025? *' 
                  : 'Étiez-vous un résident du Canada pour toute l\'année 2025? *'}
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="canadianResidentAllYear"
                    value="yes"
                    checked={personalInfo.canadianResidentAllYear === 'yes'}
                    onChange={(e) => updatePersonalField('canadianResidentAllYear', e.target.value)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">{language === 'en' ? 'Yes' : 'Oui'}</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="canadianResidentAllYear"
                    value="no"
                    checked={personalInfo.canadianResidentAllYear === 'no'}
                    onChange={(e) => updatePersonalField('canadianResidentAllYear', e.target.value)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">{language === 'en' ? 'No' : 'Non'}</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'en' 
                  ? 'What province did you live in on December 31, 2025? *' 
                  : 'Dans quelle province habitiez-vous le 31 décembre 2025? *'}
              </label>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                value={personalInfo.provinceOnDec31}
                onChange={(e) => updatePersonalField('provinceOnDec31', e.target.value)}
              >
                <option value="">{language === 'en' ? 'Select province' : 'Sélectionnez la province'}</option>
                {CANADIAN_PROVINCES.map((prov) => (
                  <option key={prov.value} value={prov.value}>
                    {prov.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'en' 
                  ? 'Is your home address the same as your mailing address? *' 
                  : 'Votre adresse de domicile est-elle la même que votre adresse postale? *'}
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="homeAddressSameAsMailing"
                    value="yes"
                    checked={personalInfo.homeAddressSameAsMailing === 'yes'}
                    onChange={(e) => updatePersonalField('homeAddressSameAsMailing', e.target.value)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">{language === 'en' ? 'Yes' : 'Oui'}</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="homeAddressSameAsMailing"
                    value="no"
                    checked={personalInfo.homeAddressSameAsMailing === 'no'}
                    onChange={(e) => updatePersonalField('homeAddressSameAsMailing', e.target.value)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">{language === 'en' ? 'No' : 'Non'}</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'en' 
                  ? 'Did your address change during the tax year? *' 
                  : 'Votre adresse a-t-elle changé pendant l\'année d\'imposition? *'}
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="addressChangedInYear"
                    value="yes"
                    checked={personalInfo.addressChangedInYear === 'yes'}
                    onChange={(e) => updatePersonalField('addressChangedInYear', e.target.value)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">{language === 'en' ? 'Yes' : 'Oui'}</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="addressChangedInYear"
                    value="no"
                    checked={personalInfo.addressChangedInYear === 'no'}
                    onChange={(e) => updatePersonalField('addressChangedInYear', e.target.value)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">{language === 'en' ? 'No' : 'Non'}</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'en' 
                  ? 'What is your current province of residence? *' 
                  : 'Quelle est votre province de résidence actuelle? *'}
              </label>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                value={personalInfo.currentProvince}
                onChange={(e) => updatePersonalField('currentProvince', e.target.value)}
              >
                <option value="">{language === 'en' ? 'Select province' : 'Sélectionnez la province'}</option>
                {CANADIAN_PROVINCES.map((prov) => (
                  <option key={prov.value} value={prov.value}>
                    {prov.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* SECTION 4: MARITAL STATUS & DEPENDENTS */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <button
          onClick={() => togglePersonalSection('marital')}
          className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors bg-white"
        >
          <div className="flex items-center gap-3">
            <UsersIcon className="w-5 h-5 text-blue-600" />
            <span className="font-semibold">
              {language === 'en' ? '4. You and Your Family' : '4. Vous et votre famille'}
            </span>
          </div>
          {expandedPersonalSection === 'marital' ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </button>

        {expandedPersonalSection === 'marital' && (
          <div className="bg-gray-50 p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'en' ? 'Marital Status *' : 'État matrimonial *'}
              </label>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                value={personalInfo.maritalStatus}
                onChange={(e) => updatePersonalField('maritalStatus', e.target.value)}
              >
                <option value="">{language === 'en' ? 'Select status' : 'Sélectionnez l\'état'}</option>
                <option value="single">{language === 'en' ? 'Single' : 'Célibataire'}</option>
                <option value="married">{language === 'en' ? 'Married' : 'Marié(e)'}</option>
                <option value="common-law">{language === 'en' ? 'Common-law' : 'Union de fait'}</option>
                <option value="divorced">{language === 'en' ? 'Divorced' : 'Divorcé(e)'}</option>
                <option value="widowed">{language === 'en' ? 'Widowed' : 'Veuf/Veuve'}</option>
                <option value="separated">{language === 'en' ? 'Separated' : 'Séparé(e)'}</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'en' 
                  ? 'Did your marital status change in 2025? *' 
                  : 'Votre état matrimonial a-t-il changé en 2025? *'}
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="maritalStatusChanged"
                    value="yes"
                    checked={personalInfo.maritalStatusChanged === 'yes'}
                    onChange={(e) => updatePersonalField('maritalStatusChanged', e.target.value)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">{language === 'en' ? 'Yes' : 'Oui'}</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="maritalStatusChanged"
                    value="no"
                    checked={personalInfo.maritalStatusChanged === 'no'}
                    onChange={(e) => updatePersonalField('maritalStatusChanged', e.target.value)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">{language === 'en' ? 'No' : 'Non'}</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'en' 
                  ? 'Do you have children or dependents? *' 
                  : 'Avez-vous des enfants ou des personnes à charge? *'}
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="hasDependents"
                    value="yes"
                    checked={personalInfo.hasDependents === 'yes'}
                    onChange={(e) => updatePersonalField('hasDependents', e.target.value)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">{language === 'en' ? 'Yes' : 'Oui'}</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="hasDependents"
                    value="no"
                    checked={personalInfo.hasDependents === 'no'}
                    onChange={(e) => updatePersonalField('hasDependents', e.target.value)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">{language === 'en' ? 'No' : 'Non'}</span>
                </label>
              </div>
              {personalInfo.hasDependents === 'yes' && (
                <p className="text-xs text-gray-500 mt-2">
                  {language === 'en' 
                    ? 'Please upload dependent information documents in the "Documents" section.' 
                    : 'Veuillez téléverser les documents d\'information sur les personnes à charge dans la section "Documents".'}
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* SECTION 5: GENERAL QUESTIONS (CRA) */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <button
          onClick={() => togglePersonalSection('general')}
          className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors bg-white"
        >
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-blue-600" />
            <span className="font-semibold">
              {language === 'en' ? '5. General Questions (CRA)' : '5. Questions générales (ARC)'}
            </span>
          </div>
          {expandedPersonalSection === 'general' ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </button>

        {expandedPersonalSection === 'general' && (
          <div className="bg-gray-50 p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'en' 
                  ? 'Is this your first time filing taxes with CRA? *' 
                  : 'Est-ce votre première déclaration d\'impôts avec l\'ARC? *'}
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="firstTimeFilingCRA"
                    value="yes"
                    checked={personalInfo.firstTimeFilingCRA === 'yes'}
                    onChange={(e) => updatePersonalField('firstTimeFilingCRA', e.target.value)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">{language === 'en' ? 'Yes' : 'Oui'}</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="firstTimeFilingCRA"
                    value="no"
                    checked={personalInfo.firstTimeFilingCRA === 'no'}
                    onChange={(e) => updatePersonalField('firstTimeFilingCRA', e.target.value)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">{language === 'en' ? 'No' : 'Non'}</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'en' 
                  ? 'Are you a Canadian citizen? *' 
                  : 'Êtes-vous citoyen canadien? *'}
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="canadianCitizen"
                    value="yes"
                    checked={personalInfo.canadianCitizen === 'yes'}
                    onChange={(e) => updatePersonalField('canadianCitizen', e.target.value)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">{language === 'en' ? 'Yes' : 'Oui'}</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="canadianCitizen"
                    value="no"
                    checked={personalInfo.canadianCitizen === 'no'}
                    onChange={(e) => updatePersonalField('canadianCitizen', e.target.value)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">{language === 'en' ? 'No' : 'Non'}</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'en' 
                  ? 'Do you own foreign property worth over $100,000 CAD?' 
                  : 'Possédez-vous des biens étrangers d\'une valeur supérieure à 100 000 $ CAD?'}
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="foreignPropertyOver100k"
                    value="yes"
                    checked={personalInfo.foreignPropertyOver100k === 'yes'}
                    onChange={(e) => updatePersonalField('foreignPropertyOver100k', e.target.value)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">{language === 'en' ? 'Yes' : 'Oui'}</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="foreignPropertyOver100k"
                    value="no"
                    checked={personalInfo.foreignPropertyOver100k === 'no'}
                    onChange={(e) => updatePersonalField('foreignPropertyOver100k', e.target.value)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">{language === 'en' ? 'No' : 'Non'}</span>
                </label>
              </div>
              {personalInfo.foreignPropertyOver100k === 'yes' && (
                <p className="text-xs text-red-600 mt-2">
                  {language === 'en' 
                    ? '⚠️ You will need to file Form T1135 (Foreign Income Verification Statement)' 
                    : '⚠️ Vous devrez produire le formulaire T1135 (État de vérification du revenu étranger)'}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'en' 
                  ? 'Did you sell your principal residence in 2025?' 
                  : 'Avez-vous vendu votre résidence principale en 2025?'}
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="disposedPrincipalResidence"
                    value="yes"
                    checked={personalInfo.disposedPrincipalResidence === 'yes'}
                    onChange={(e) => updatePersonalField('disposedPrincipalResidence', e.target.value)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">{language === 'en' ? 'Yes' : 'Oui'}</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="disposedPrincipalResidence"
                    value="no"
                    checked={personalInfo.disposedPrincipalResidence === 'no'}
                    onChange={(e) => updatePersonalField('disposedPrincipalResidence', e.target.value)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">{language === 'en' ? 'No' : 'Non'}</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'en' 
                  ? 'Do you have a First Home Savings Account (FHSA)?' 
                  : 'Avez-vous un compte d\'épargne libre d\'impôt pour l\'achat d\'une première propriété (CELIAPP)?'}
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="firstHomeSavingsAccount"
                    value="yes"
                    checked={personalInfo.firstHomeSavingsAccount === 'yes'}
                    onChange={(e) => updatePersonalField('firstHomeSavingsAccount', e.target.value)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">{language === 'en' ? 'Yes' : 'Oui'}</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="firstHomeSavingsAccount"
                    value="no"
                    checked={personalInfo.firstHomeSavingsAccount === 'no'}
                    onChange={(e) => updatePersonalField('firstHomeSavingsAccount', e.target.value)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">{language === 'en' ? 'No' : 'Non'}</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'en' 
                  ? 'Did you buy or sell cryptocurrency or NFTs in 2025?' 
                  : 'Avez-vous acheté ou vendu des cryptomonnaies ou des NFT en 2025?'}
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="virtualCurrency"
                    value="yes"
                    checked={personalInfo.virtualCurrency === 'yes'}
                    onChange={(e) => updatePersonalField('virtualCurrency', e.target.value)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">{language === 'en' ? 'Yes' : 'Oui'}</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="virtualCurrency"
                    value="no"
                    checked={personalInfo.virtualCurrency === 'no'}
                    onChange={(e) => updatePersonalField('virtualCurrency', e.target.value)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">{language === 'en' ? 'No' : 'Non'}</span>
                </label>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* SECTION 6: REVENU QUÉBEC */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <button
          onClick={() => togglePersonalSection('quebec')}
          className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors bg-white"
        >
          <div className="flex items-center gap-3">
            <Globe className="w-5 h-5 text-blue-600" />
            <span className="font-semibold">
              {language === 'en' ? '6. Revenu Québec (QC Residents Only)' : '6. Revenu Québec (résidents du QC seulement)'}
            </span>
          </div>
          {expandedPersonalSection === 'quebec' ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </button>

        {expandedPersonalSection === 'quebec' && (
          <div className="bg-gray-50 p-6 space-y-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
              <p className="text-sm text-yellow-800">
                {language === 'en' 
                  ? '⚠️ These questions are only for Québec residents. Skip this section if you don\'t live in Québec.' 
                  : '⚠️ Ces questions sont uniquement pour les résidents du Québec. Sautez cette section si vous n\'habitez pas au Québec.'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'en' 
                  ? 'Is this your first time filing taxes with Revenu Québec?' 
                  : 'Est-ce votre première déclaration d\'impôts avec Revenu Québec?'}
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="firstTimeFilingRQ"
                    value="yes"
                    checked={personalInfo.firstTimeFilingRQ === 'yes'}
                    onChange={(e) => updatePersonalField('firstTimeFilingRQ', e.target.value)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">{language === 'en' ? 'Yes' : 'Oui'}</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="firstTimeFilingRQ"
                    value="no"
                    checked={personalInfo.firstTimeFilingRQ === 'no'}
                    onChange={(e) => updatePersonalField('firstTimeFilingRQ', e.target.value)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">{language === 'en' ? 'No' : 'Non'}</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'en' 
                  ? 'Do you want to claim the solidarity tax credit?' 
                  : 'Voulez-vous demander le crédit d\'impôt pour solidarité?'}
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="claimSolidarityTaxCredit"
                    value="yes"
                    checked={personalInfo.claimSolidarityTaxCredit === 'yes'}
                    onChange={(e) => updatePersonalField('claimSolidarityTaxCredit', e.target.value)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">{language === 'en' ? 'Yes' : 'Oui'}</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="claimSolidarityTaxCredit"
                    value="no"
                    checked={personalInfo.claimSolidarityTaxCredit === 'no'}
                    onChange={(e) => updatePersonalField('claimSolidarityTaxCredit', e.target.value)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">{language === 'en' ? 'No' : 'Non'}</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'en' 
                  ? 'Do you have prescription drug insurance?' 
                  : 'Avez-vous une assurance médicaments?'}
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="prescriptionDrugInsurance"
                    value="yes"
                    checked={personalInfo.prescriptionDrugInsurance === 'yes'}
                    onChange={(e) => updatePersonalField('prescriptionDrugInsurance', e.target.value)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">{language === 'en' ? 'Yes' : 'Oui'}</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="prescriptionDrugInsurance"
                    value="no"
                    checked={personalInfo.prescriptionDrugInsurance === 'no'}
                    onChange={(e) => updatePersonalField('prescriptionDrugInsurance', e.target.value)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">{language === 'en' ? 'No' : 'Non'}</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'en' ? 'Work Telephone (Optional)' : 'Téléphone au travail (optionnel)'}
              </label>
              <div className="grid grid-cols-3 gap-4">
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  value={personalInfo.workTelephoneArea}
                  onChange={(e) => updatePersonalField('workTelephoneArea', e.target.value.replace(/\D/g, ''))}
                  placeholder="514"
                  maxLength={3}
                />
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  value={personalInfo.workTelephoneNumber}
                  onChange={(e) => updatePersonalField('workTelephoneNumber', e.target.value.replace(/\D/g, ''))}
                  placeholder="5551234"
                  maxLength={7}
                />
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  value={personalInfo.workTelephoneExt}
                  onChange={(e) => updatePersonalField('workTelephoneExt', e.target.value)}
                  placeholder="Ext"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* SECTION 7: ONLINE ACCOUNTS */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <button
          onClick={() => togglePersonalSection('online')}
          className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors bg-white"
        >
          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-blue-600" />
            <span className="font-semibold">
              {language === 'en' ? '7. CRA & RQ My Account Setup' : '7. Configuration Mon dossier ARC & RQ'}
            </span>
          </div>
          {expandedPersonalSection === 'online' ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </button>

        {expandedPersonalSection === 'online' && (
          <div className="bg-gray-50 p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'en' 
                  ? 'Do you want to sign up for CRA online mail?' 
                  : 'Voulez-vous vous inscrire au courrier en ligne de l\'ARC?'}
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="signupCRAOnlineMail"
                    value="yes"
                    checked={personalInfo.signupCRAOnlineMail === 'yes'}
                    onChange={(e) => updatePersonalField('signupCRAOnlineMail', e.target.value)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">{language === 'en' ? 'Yes' : 'Oui'}</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="signupCRAOnlineMail"
                    value="no"
                    checked={personalInfo.signupCRAOnlineMail === 'no'}
                    onChange={(e) => updatePersonalField('signupCRAOnlineMail', e.target.value)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">{language === 'en' ? 'No' : 'Non'}</span>
                </label>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {language === 'en' 
                  ? 'Recommended: Receive your notices and tax documents electronically' 
                  : 'Recommandé: Recevez vos avis et documents fiscaux électroniquement'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'en' 
                  ? 'Do you want to sign up for Revenu Québec online mail?' 
                  : 'Voulez-vous vous inscrire au courrier en ligne de Revenu Québec?'}
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="signupRQOnlineMail"
                    value="yes"
                    checked={personalInfo.signupRQOnlineMail === 'yes'}
                    onChange={(e) => updatePersonalField('signupRQOnlineMail', e.target.value)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">{language === 'en' ? 'Yes' : 'Oui'}</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="signupRQOnlineMail"
                    value="no"
                    checked={personalInfo.signupRQOnlineMail === 'no'}
                    onChange={(e) => updatePersonalField('signupRQOnlineMail', e.target.value)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">{language === 'en' ? 'No' : 'Non'}</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'en' ? 'Notification Email' : 'Courriel de notification'}
              </label>
              <input
                type="email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                value={personalInfo.notificationEmail}
                onChange={(e) => updatePersonalField('notificationEmail', e.target.value)}
                placeholder="your.email@example.com"
              />
              <p className="text-xs text-gray-500 mt-1">
                {language === 'en' 
                  ? 'This email will be used for CRA and Revenu Québec notifications' 
                  : 'Ce courriel sera utilisé pour les notifications de l\'ARC et de Revenu Québec'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* SAVE BUTTON */}
      <div className="flex justify-end gap-3 mt-6">
        <button
          className="px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
          onClick={handleSaveDraft}
        >
          {language === 'en' ? 'Save Draft' : 'Enregistrer le brouillon'}
        </button>
        <button
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          onClick={handleSaveInformation}
          disabled={isSaving}
        >
          {isSaving ? (
            <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.928l3-2.647z"></path>
            </svg>
          ) : (
            language === 'en' ? 'Save All Information' : 'Enregistrer toutes les informations'
          )}
        </button>
        <button
          className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
          onClick={handleLoadPreviousInfo}
          disabled={isLoading}
        >
          {isLoading ? (
            <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.928l3-2.647z"></path>
            </svg>
          ) : (
            language === 'en' ? 'Load Previous Information' : 'Charger les informations précédentes'
          )}
        </button>
      </div>
    </div>
  );
}