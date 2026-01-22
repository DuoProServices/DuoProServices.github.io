import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { supabase } from "../utils/supabaseClient";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Progress } from "../components/ui/progress";
import { User, MapPin, Home, Users, FileText, Globe, Mail } from "lucide-react";
import { toast } from "sonner";

interface ProfileData {
  // Step 1: Personal Information
  firstName: string;
  middleName: string;
  lastName: string;
  sin: string;
  dateOfBirth: string;
  preferredLanguage: string;
  gender: string;
  
  // Step 2: Mailing Address
  careOf: string;
  addressUnit: string;
  streetNumber: string;
  streetName: string;
  city: string;
  province: string;
  postalCode: string;
  homePhoneArea: string;
  homePhoneNumber: string;
  hasNonCanadianAddress: string;
  
  // Step 3: Residency
  canadianResidentAllYear: string;
  provinceOnDec31: string;
  provinceMovedDate: string;
  homeAddressSameAsMailing: string;
  addressChangedInYear: string;
  currentProvince: string;
  
  // Step 4: Marital Status & Dependents
  maritalStatus: string;
  maritalStatusChanged: string;
  hasDependents: string;
  
  // Step 5: General Questions
  firstTimeFilingCRA: string;
  canadianCitizen: string;
  registeredIndianAct: string;
  foreignPropertyOver100k: string;
  disposedPrincipalResidence: string;
  flippedProperty: string;
  firstHomeSavingsAccount: string;
  virtualCurrency: string;
  confinedToPrison: string;
  
  // Step 6: Revenu Québec
  singleParentOrLivedAlone: string;
  firstTimeFilingRQ: string;
  claimSolidarityTaxCredit: string;
  prescriptionDrugInsurance: string;
  workTelephoneArea: string;
  workTelephoneNumber: string;
  workTelephoneExt: string;
  
  // Step 7: Online Accounts
  signupCRAOnlineMail: string;
  signupRQOnlineMail: string;
  receiveRQNotifications: string;
  notificationEmail: string;
  
  // Metadata
  email: string;
  onboardingCompleted: boolean;
}

const CANADIAN_PROVINCES = [
  { value: "AB", label: "Alberta" },
  { value: "BC", label: "British Columbia" },
  { value: "MB", label: "Manitoba" },
  { value: "NB", label: "New Brunswick" },
  { value: "NL", label: "Newfoundland and Labrador" },
  { value: "NS", label: "Nova Scotia" },
  { value: "ON", label: "Ontario" },
  { value: "PE", label: "Prince Edward Island" },
  { value: "QC", label: "Québec" },
  { value: "SK", label: "Saskatchewan" },
  { value: "NT", label: "Northwest Territories" },
  { value: "NU", label: "Nunavut" },
  { value: "YT", label: "Yukon" },
];

export default function OnboardingPageNew() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    // Step 1
    firstName: "",
    middleName: "",
    lastName: "",
    sin: "",
    dateOfBirth: "",
    preferredLanguage: "English",
    gender: "",
    
    // Step 2
    careOf: "",
    addressUnit: "",
    streetNumber: "",
    streetName: "",
    city: "",
    province: "",
    postalCode: "",
    homePhoneArea: "",
    homePhoneNumber: "",
    hasNonCanadianAddress: "no",
    
    // Step 3
    canadianResidentAllYear: "",
    provinceOnDec31: "",
    provinceMovedDate: "",
    homeAddressSameAsMailing: "yes",
    addressChangedInYear: "no",
    currentProvince: "",
    
    // Step 4
    maritalStatus: "",
    maritalStatusChanged: "no",
    hasDependents: "no",
    
    // Step 5
    firstTimeFilingCRA: "",
    canadianCitizen: "",
    registeredIndianAct: "no",
    foreignPropertyOver100k: "no",
    disposedPrincipalResidence: "no",
    flippedProperty: "no",
    firstHomeSavingsAccount: "",
    virtualCurrency: "no",
    confinedToPrison: "no",
    
    // Step 6
    singleParentOrLivedAlone: "no",
    firstTimeFilingRQ: "",
    claimSolidarityTaxCredit: "",
    prescriptionDrugInsurance: "",
    workTelephoneArea: "",
    workTelephoneNumber: "",
    workTelephoneExt: "",
    
    // Step 7
    signupCRAOnlineMail: "yes",
    signupRQOnlineMail: "yes",
    receiveRQNotifications: "email",
    notificationEmail: "",
    
    // Metadata
    email: user?.email || "",
    onboardingCompleted: false,
  });

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    checkExistingProfile();
  }, [user, navigate]);

  const checkExistingProfile = async () => {
    if (!user?.id) return;

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      
      if (!sessionData?.session) {
        console.log("No active session");
        return;
      }

      const { data, error } = await supabase.auth.getUser();

      if (error) {
        if (error.message?.includes('session') || 
            error.message?.includes('Auth') || 
            error.message?.includes('authenticated')) {
          return;
        }
        console.error("Error fetching user:", error);
        return;
      }

      if (data?.user?.user_metadata?.profile) {
        const profile = data.user.user_metadata.profile;
        if (profile.onboardingCompleted) {
          navigate("/dashboard");
        } else {
          setProfileData({ ...profileData, ...profile });
        }
      }
    } catch (error) {
      console.error("Error checking profile:", error);
    }
  };

  const updateField = (field: keyof ProfileData, value: any) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  const validateStep = (step: number) => {
    if (step === 1) {
      const { firstName, lastName, sin, dateOfBirth, preferredLanguage, gender } = profileData;
      if (!firstName || !lastName || !sin || !dateOfBirth || !preferredLanguage || !gender) {
        toast.error("Please fill all required fields");
        return false;
      }
      if (sin.length !== 9) {
        toast.error("SIN must be 9 digits");
        return false;
      }
      return true;
    }
    
    if (step === 2) {
      const { streetNumber, streetName, city, province, postalCode, homePhoneArea, homePhoneNumber } = profileData;
      if (!streetNumber || !streetName || !city || !province || !postalCode || !homePhoneArea || !homePhoneNumber) {
        toast.error("Please fill all required fields");
        return false;
      }
      return true;
    }
    
    if (step === 3) {
      const { canadianResidentAllYear, provinceOnDec31, homeAddressSameAsMailing, addressChangedInYear, currentProvince } = profileData;
      if (!canadianResidentAllYear || !provinceOnDec31 || !homeAddressSameAsMailing || !addressChangedInYear || !currentProvince) {
        toast.error("Please answer all questions");
        return false;
      }
      return true;
    }
    
    if (step === 4) {
      const { maritalStatus, maritalStatusChanged, hasDependents } = profileData;
      if (!maritalStatus || !maritalStatusChanged || !hasDependents) {
        toast.error("Please answer all questions");
        return false;
      }
      return true;
    }
    
    if (step === 5) {
      const { firstTimeFilingCRA, canadianCitizen, firstHomeSavingsAccount } = profileData;
      if (!firstTimeFilingCRA || !canadianCitizen || !firstHomeSavingsAccount) {
        toast.error("Please answer all questions");
        return false;
      }
      return true;
    }
    
    if (step === 6) {
      const { firstTimeFilingRQ, claimSolidarityTaxCredit, prescriptionDrugInsurance } = profileData;
      if (!firstTimeFilingRQ || !claimSolidarityTaxCredit || !prescriptionDrugInsurance) {
        toast.error("Please answer all questions");
        return false;
      }
      return true;
    }
    
    if (step === 7) {
      const { notificationEmail } = profileData;
      if (!notificationEmail) {
        toast.error("Please provide your email address");
        return false;
      }
      if (!notificationEmail.includes('@')) {
        toast.error("Please provide a valid email address");
        return false;
      }
      return true;
    }
    
    return true;
  };

  const handleNext = async () => {
    if (!validateStep(currentStep)) return;
    
    if (currentStep === 7) {
      await saveProfile(true);
      return;
    }
    
    setCurrentStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const saveProfile = async (completed: boolean = false) => {
    if (!user?.id) return;

    setLoading(true);
    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !sessionData?.session) {
        console.error("No active session:", sessionError);
        toast.error("Session expired. Please log in again.");
        navigate("/login");
        return;
      }

      const finalProfile = {
        ...profileData,
        onboardingCompleted: completed,
        updatedAt: new Date().toISOString(),
      };

      const { error } = await supabase.auth.updateUser({
        data: {
          profile: finalProfile,
        },
      });

      if (error) throw error;

      if (completed) {
        toast.success("Profile completed successfully!");
        navigate("/onboarding-success");
      } else {
        toast.success("Progress saved");
      }
    } catch (error: any) {
      console.error("Error saving profile:", error);
      toast.error(error.message || "Failed to save profile");
    } finally {
      setLoading(false);
    }
  };

  const totalSteps = 7;
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-3xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Tax Return Profile</h1>
          <p className="text-gray-600">Complete your information for tax filing</p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">
              Step {currentStep} of {totalSteps}
            </span>
            <span className="text-sm text-gray-600">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* STEP 1: Personal Information */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Personal Information</h2>
                <p className="text-sm text-gray-600">Tell us about yourself</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="firstName">First name *</Label>
                <Input
                  id="firstName"
                  value={profileData.firstName}
                  onChange={(e) => updateField("firstName", e.target.value)}
                  placeholder="veronica"
                />
              </div>

              <div>
                <Label htmlFor="middleName">Middle name</Label>
                <Input
                  id="middleName"
                  value={profileData.middleName}
                  onChange={(e) => updateField("middleName", e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="lastName">Last name *</Label>
                <Input
                  id="lastName"
                  value={profileData.lastName}
                  onChange={(e) => updateField("lastName", e.target.value)}
                  placeholder="Prass"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="sin">Social insurance number *</Label>
                <Input
                  id="sin"
                  value={profileData.sin}
                  onChange={(e) => updateField("sin", e.target.value.replace(/\D/g, ""))}
                  placeholder="327800579"
                  maxLength={9}
                />
                <p className="text-xs text-gray-500 mt-1">Required to auto-fill return.</p>
              </div>

              <div>
                <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={profileData.dateOfBirth}
                  onChange={(e) => updateField("dateOfBirth", e.target.value)}
                  placeholder="YYYY-MM-DD"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="preferredLanguage">Preferred language *</Label>
                <Select value={profileData.preferredLanguage} onValueChange={(value) => updateField("preferredLanguage", value)}>
                  <SelectTrigger id="preferredLanguage">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="English">English</SelectItem>
                    <SelectItem value="French">Français</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="gender">Gender *</Label>
                <Select value={profileData.gender} onValueChange={(value) => updateField("gender", value)}>
                  <SelectTrigger id="gender">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Mailing Address */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <MapPin className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Mailing Address</h2>
                <p className="text-sm text-gray-600">Where should we send your documents?</p>
              </div>
            </div>

            <div>
              <Label htmlFor="careOf">C/O (Care of)</Label>
              <Input
                id="careOf"
                value={profileData.careOf}
                onChange={(e) => updateField("careOf", e.target.value)}
                placeholder="Veronica Prass"
              />
            </div>

            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-2">
                <Label htmlFor="addressUnit">Unit</Label>
                <Input
                  id="addressUnit"
                  value={profileData.addressUnit}
                  onChange={(e) => updateField("addressUnit", e.target.value)}
                  placeholder="E"
                />
              </div>

              <div className="col-span-3">
                <Label htmlFor="streetNumber">Street number *</Label>
                <Input
                  id="streetNumber"
                  value={profileData.streetNumber}
                  onChange={(e) => updateField("streetNumber", e.target.value)}
                  placeholder="1189"
                />
              </div>

              <div className="col-span-7">
                <Label htmlFor="streetName">Street name *</Label>
                <Input
                  id="streetName"
                  value={profileData.streetName}
                  onChange={(e) => updateField("streetName", e.target.value)}
                  placeholder="charlevoix"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  value={profileData.city}
                  onChange={(e) => updateField("city", e.target.value)}
                  placeholder="Montreal"
                />
              </div>

              <div>
                <Label htmlFor="province">Province *</Label>
                <Select value={profileData.province} onValueChange={(value) => updateField("province", value)}>
                  <SelectTrigger id="province">
                    <SelectValue placeholder="Québec" />
                  </SelectTrigger>
                  <SelectContent>
                    {CANADIAN_PROVINCES.map((prov) => (
                      <SelectItem key={prov.value} value={prov.value}>
                        {prov.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="postalCode">Postal code *</Label>
                <Input
                  id="postalCode"
                  value={profileData.postalCode}
                  onChange={(e) => updateField("postalCode", e.target.value.toUpperCase())}
                  placeholder="H3K2Z6"
                  maxLength={7}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="homePhone">Home telephone number *</Label>
              <div className="grid grid-cols-4 gap-2">
                <Input
                  id="homePhoneArea"
                  value={profileData.homePhoneArea}
                  onChange={(e) => updateField("homePhoneArea", e.target.value.replace(/\D/g, ""))}
                  placeholder="514"
                  maxLength={3}
                />
                <Input
                  className="col-span-3"
                  id="homePhoneNumber"
                  value={profileData.homePhoneNumber}
                  onChange={(e) => updateField("homePhoneNumber", e.target.value.replace(/\D/g, ""))}
                  placeholder="5627838"
                  maxLength={7}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="hasNonCanadianAddress">Do you have a non-Canadian mailing address?</Label>
              <Select value={profileData.hasNonCanadianAddress} onValueChange={(value) => updateField("hasNonCanadianAddress", value)}>
                <SelectTrigger id="hasNonCanadianAddress">
                  <SelectValue placeholder="No" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="no">No</SelectItem>
                  <SelectItem value="yes">Yes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {/* STEP 3: Residency */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Home className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">About Your Residency</h2>
                <p className="text-sm text-gray-600">Tell us about your residency status</p>
              </div>
            </div>

            <div>
              <Label htmlFor="canadianResidentAllYear">Were you a Canadian resident for all of 2025? *</Label>
              <Select value={profileData.canadianResidentAllYear} onValueChange={(value) => updateField("canadianResidentAllYear", value)}>
                <SelectTrigger id="canadianResidentAllYear">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="provinceOnDec31">In which province or territory did you live on December 31, 2025? *</Label>
              <Select value={profileData.provinceOnDec31} onValueChange={(value) => updateField("provinceOnDec31", value)}>
                <SelectTrigger id="provinceOnDec31">
                  <SelectValue placeholder="Québec" />
                </SelectTrigger>
                <SelectContent>
                  {CANADIAN_PROVINCES.map((prov) => (
                    <SelectItem key={prov.value} value={prov.value}>
                      {prov.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500 mt-1">This question reflects the selection made in the About you section above.</p>
            </div>

            <div>
              <Label htmlFor="provinceMovedDate">If your province or territory of residence changed in 2025, enter the date of your move</Label>
              <Input
                id="provinceMovedDate"
                type="date"
                value={profileData.provinceMovedDate}
                onChange={(e) => updateField("provinceMovedDate", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="homeAddressSameAsMailing">Is your home address the same as your mailing address? *</Label>
              <Select value={profileData.homeAddressSameAsMailing} onValueChange={(value) => updateField("homeAddressSameAsMailing", value)}>
                <SelectTrigger id="homeAddressSameAsMailing">
                  <SelectValue placeholder="Yes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="addressChangedInYear">Did your address change in 2025? *</Label>
              <Select value={profileData.addressChangedInYear} onValueChange={(value) => updateField("addressChangedInYear", value)}>
                <SelectTrigger id="addressChangedInYear">
                  <SelectValue placeholder="No" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="currentProvince">In which province or territory do you currently live? *</Label>
              <Select value={profileData.currentProvince} onValueChange={(value) => updateField("currentProvince", value)}>
                <SelectTrigger id="currentProvince">
                  <SelectValue placeholder="Québec" />
                </SelectTrigger>
                <SelectContent>
                  {CANADIAN_PROVINCES.map((prov) => (
                    <SelectItem key={prov.value} value={prov.value}>
                      {prov.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {/* STEP 4: You and Your Family */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">You and Your Family</h2>
                <p className="text-sm text-gray-600">Tell us about your family situation</p>
              </div>
            </div>

            <div>
              <Label htmlFor="maritalStatus">Marital status on December 31, 2025 *</Label>
              <Select value={profileData.maritalStatus} onValueChange={(value) => updateField("maritalStatus", value)}>
                <SelectTrigger id="maritalStatus">
                  <SelectValue placeholder="Single" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single">Single</SelectItem>
                  <SelectItem value="married">Married</SelectItem>
                  <SelectItem value="common-law">Common-law</SelectItem>
                  <SelectItem value="divorced">Divorced</SelectItem>
                  <SelectItem value="separated">Separated</SelectItem>
                  <SelectItem value="widowed">Widowed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="maritalStatusChanged">Did your marital status change in 2025? *</Label>
              <Select value={profileData.maritalStatusChanged} onValueChange={(value) => updateField("maritalStatusChanged", value)}>
                <SelectTrigger id="maritalStatusChanged">
                  <SelectValue placeholder="No" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="hasDependents">Do you have any dependants? *</Label>
              <Select value={profileData.hasDependents} onValueChange={(value) => updateField("hasDependents", value)}>
                <SelectTrigger id="hasDependents">
                  <SelectValue placeholder="No" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {/* STEP 5: General Questions */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Other stuff we have to ask</h2>
                <p className="text-sm text-gray-600">General questions</p>
              </div>
            </div>

            <div>
              <Label htmlFor="firstTimeFilingCRA">Are you filing an income tax return with the CRA for the first time? *</Label>
              <Select value={profileData.firstTimeFilingCRA} onValueChange={(value) => updateField("firstTimeFilingCRA", value)}>
                <SelectTrigger id="firstTimeFilingCRA">
                  <SelectValue placeholder="No" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="canadianCitizen">Are you a Canadian citizen? *</Label>
              <Select value={profileData.canadianCitizen} onValueChange={(value) => updateField("canadianCitizen", value)}>
                <SelectTrigger id="canadianCitizen">
                  <SelectValue placeholder="No" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="registeredIndianAct">Are you a person registered under the Indian Act?</Label>
              <Select value={profileData.registeredIndianAct} onValueChange={(value) => updateField("registeredIndianAct", value)}>
                <SelectTrigger id="registeredIndianAct">
                  <SelectValue placeholder="No" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-medium mb-3">Property and things you may have invested in</h3>
            </div>

            <div>
              <Label htmlFor="foreignPropertyOver100k">Did you own or hold specified foreign property where the total cost amount of all such property, at any time in the year, was more than CAN$100,000 in 2025?</Label>
              <Select value={profileData.foreignPropertyOver100k} onValueChange={(value) => updateField("foreignPropertyOver100k", value)}>
                <SelectTrigger id="foreignPropertyOver100k">
                  <SelectValue placeholder="No" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="disposedPrincipalResidence">Did you dispose of your principal residence in 2025?</Label>
              <Select value={profileData.disposedPrincipalResidence} onValueChange={(value) => updateField("disposedPrincipalResidence", value)}>
                <SelectTrigger id="disposedPrincipalResidence">
                  <SelectValue placeholder="No" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="flippedProperty">Did you flip a property in 2025?</Label>
              <Select value={profileData.flippedProperty} onValueChange={(value) => updateField("flippedProperty", value)}>
                <SelectTrigger id="flippedProperty">
                  <SelectValue placeholder="No" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="firstHomeSavingsAccount">Did you open your first First Home Savings Account (FHSA) in 2025, or become a successor holder in 2025 and did not open another FHSA of your own in 2024 or 2025? *</Label>
              <Select value={profileData.firstHomeSavingsAccount} onValueChange={(value) => updateField("firstHomeSavingsAccount", value)}>
                <SelectTrigger id="firstHomeSavingsAccount">
                  <SelectValue placeholder="Yes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="virtualCurrency">Did you receive, hold, or dispose of virtual currency (by selling, transferring, exchanging, giving, etc.) in 2025?</Label>
              <Select value={profileData.virtualCurrency} onValueChange={(value) => updateField("virtualCurrency", value)}>
                <SelectTrigger id="virtualCurrency">
                  <SelectValue placeholder="No" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-medium mb-3">We have to ask because it affects some calculations</h3>
            </div>

            <div>
              <Label htmlFor="confinedToPrison">Were you confined to a prison for a period of 90 days or more in 2025?</Label>
              <Select value={profileData.confinedToPrison} onValueChange={(value) => updateField("confinedToPrison", value)}>
                <SelectTrigger id="confinedToPrison">
                  <SelectValue placeholder="No" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {/* STEP 6: Revenu Québec */}
        {currentStep === 6 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Globe className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Revenu Québec</h2>
                <p className="text-sm text-gray-600">Provincial tax information</p>
              </div>
            </div>

            <div>
              <Label htmlFor="workTelephone">Work Telephone</Label>
              <div className="grid grid-cols-12 gap-2">
                <Input
                  className="col-span-2"
                  id="workTelephoneArea"
                  value={profileData.workTelephoneArea}
                  onChange={(e) => updateField("workTelephoneArea", e.target.value.replace(/\D/g, ""))}
                  placeholder="514"
                  maxLength={3}
                />
                <Input
                  className="col-span-8"
                  id="workTelephoneNumber"
                  value={profileData.workTelephoneNumber}
                  onChange={(e) => updateField("workTelephoneNumber", e.target.value.replace(/\D/g, ""))}
                  placeholder="5627838"
                  maxLength={7}
                />
                <Input
                  className="col-span-2"
                  id="workTelephoneExt"
                  value={profileData.workTelephoneExt}
                  onChange={(e) => updateField("workTelephoneExt", e.target.value)}
                  placeholder="Ext"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="singleParentOrLivedAlone">Were you a single parent or did you live alone for all of 2025?</Label>
              <Select value={profileData.singleParentOrLivedAlone} onValueChange={(value) => updateField("singleParentOrLivedAlone", value)}>
                <SelectTrigger id="singleParentOrLivedAlone">
                  <SelectValue placeholder="No" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="firstTimeFilingRQ">Are you filing an income tax return with Revenu Québec for the first time? *</Label>
              <Select value={profileData.firstTimeFilingRQ} onValueChange={(value) => updateField("firstTimeFilingRQ", value)}>
                <SelectTrigger id="firstTimeFilingRQ">
                  <SelectValue placeholder="No" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="claimSolidarityTaxCredit">Will you claim the Solidarity Tax Credit? *</Label>
              <Select value={profileData.claimSolidarityTaxCredit} onValueChange={(value) => updateField("claimSolidarityTaxCredit", value)}>
                <SelectTrigger id="claimSolidarityTaxCredit">
                  <SelectValue placeholder="Yes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="prescriptionDrugInsurance">Did you have basic prescription drug insurance through a group insurance plan in 2025? *</Label>
              <Select value={profileData.prescriptionDrugInsurance} onValueChange={(value) => updateField("prescriptionDrugInsurance", value)}>
                <SelectTrigger id="prescriptionDrugInsurance">
                  <SelectValue placeholder="Yes, by my group insurance plan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes-group">Yes, by my group insurance plan</SelectItem>
                  <SelectItem value="yes-spouse">Yes, by my spouse's group insurance plan</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {/* STEP 7: Online Accounts */}
        {currentStep === 7 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Mail className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">CRA and Revenu Québec My Account</h2>
                <p className="text-sm text-gray-600">Online mail preferences</p>
              </div>
            </div>

            <div>
              <Label htmlFor="signupCRAOnlineMail">Do you want to sign up for online mail to get your federal notice of assessment through CRA My Account?</Label>
              <Select value={profileData.signupCRAOnlineMail} onValueChange={(value) => updateField("signupCRAOnlineMail", value)}>
                <SelectTrigger id="signupCRAOnlineMail">
                  <SelectValue placeholder="Yes, sign me up" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes, sign me up</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="signupRQOnlineMail">Do you want to receive all communications, including notices, through Revenu Québec My Account?</Label>
              <Select value={profileData.signupRQOnlineMail} onValueChange={(value) => updateField("signupRQOnlineMail", value)}>
                <SelectTrigger id="signupRQOnlineMail">
                  <SelectValue placeholder="Yes, sign me up" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes, sign me up</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="receiveRQNotifications">Do you want to receive notifications from Revenu Québec?</Label>
              <Select value={profileData.receiveRQNotifications} onValueChange={(value) => updateField("receiveRQNotifications", value)}>
                <SelectTrigger id="receiveRQNotifications">
                  <SelectValue placeholder="Yes, via email" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">Yes, via email</SelectItem>
                  <SelectItem value="sms">Yes, via SMS</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="notificationEmail">Email address *</Label>
              <Input
                id="notificationEmail"
                type="email"
                value={profileData.notificationEmail}
                onChange={(e) => updateField("notificationEmail", e.target.value)}
                placeholder="veprass@gmail.com"
              />
            </div>

            <div>
              <Label htmlFor="confirmEmail">Confirm email address *</Label>
              <Input
                id="confirmEmail"
                type="email"
                placeholder="veprass@gmail.com"
              />
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-4 mt-8 pt-6 border-t">
          {currentStep > 1 && (
            <Button variant="outline" onClick={handleBack} disabled={loading} className="flex-1">
              Back
            </Button>
          )}
          <Button onClick={handleNext} disabled={loading} className="flex-1">
            {loading
              ? "Saving..."
              : currentStep === totalSteps
              ? "Complete Profile"
              : "Continue"}
          </Button>
        </div>

        {/* Save Progress */}
        {currentStep > 1 && (
          <div className="text-center mt-4">
            <button
              onClick={() => saveProfile(false)}
              disabled={loading}
              className="text-sm text-blue-600 hover:underline disabled:opacity-50"
            >
              Save Progress
            </button>
          </div>
        )}
      </Card>
    </div>
  );
}