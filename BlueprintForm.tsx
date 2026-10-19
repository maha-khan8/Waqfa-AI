import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Info,
  RotateCcw,
  BookOpen,
  AlertCircle,
  FileCheck,
  HelpCircle,
} from 'lucide-react';
import { StudentProfile } from '../types';

interface BlueprintFormProps {
  initialProfile: StudentProfile;
  onSubmit: (profile: StudentProfile) => void;
  isGenerating: boolean;
  error?: string | null;
}

const QUALIFICATIONS = [
  'FSc Pre-Medical',
  'FSc Pre-Engineering',
  'ICS (Computer Science, Math, Physics/Stats)',
  'A-Levels (Cambridge / Edexcel)',
  'I.Com (Commerce / Accounting)',
  'FA (Humanities / Arts)',
  'DAE (Diploma of Associate Engineer)',
  'Not sure yet / Other',
];

const TARGET_FIELDS = [
  'Computer Science / Software Engineering / AI',
  'Medicine / MBBS / BDS / Allied Health',
  'Data Science & Bioinformatics',
  'Electrical / Mechanical / Civil Engineering',
  'Business Administration / Finance / Fintech',
  'UI/UX Design & Digital Media',
  'Law / International Relations',
  'Pure Sciences (Physics, Chemistry, Math)',
  'Not sure yet / Exploring Options',
];

const GAP_YEAR_REASONS = [
  'Improve entrance examination scores (MDCAT, NET, ECAT, SAT)',
  'Improve Intermediate / A-Level grades (Board Improvement / Retakes)',
  'Explore emerging fields and discover true career passion',
  'Build practical technical skills & freelance portfolio',
  'Financial preparation / work and save for university tuition',
  'Prevent academic burnout and focus on physical/mental clarity',
  'Awaiting international or spring admission intake',
  'Not sure yet / Still deciding',
];

const LEARNING_STYLES = [
  'Hands-on building & mini-projects',
  'Video lectures followed by practice test drills',
  'Self-paced textbook reading with notes & flashcards',
  'Structured daily accountability with timed mock tests',
  'Hybrid: Morning theory, afternoon practical application',
  'Not sure yet',
];

export const BlueprintForm: React.FC<BlueprintFormProps> = ({
  initialProfile,
  onSubmit,
  isGenerating,
  error,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [profile, setProfile] = useState<StudentProfile>(initialProfile);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const handleFieldChange = (field: keyof StudentProfile, value: string) => {
    setProfile((prev) => ({
      ...prev,
      [field]: value,
      isCustom: true,
    }));
    if (validationErrors[field]) {
      setValidationErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleResetBlank = () => {
    setProfile({
      name: '',
      qualification: '',
      subjects: '',
      grades: '',
      targetField: '',
      targetUniversitiesExams: '',
      interests: '',
      gapYearReason: '',
      availableHoursPerWeek: '20-25 hours',
      budgetConstraints: 'Free learning resources preferred',
      goals: '',
      learningStyle: 'Hybrid: Morning theory, afternoon practical application',
      isCustom: true,
    });
    setValidationErrors({});
    setCurrentStep(1);
  };

  const validateStep = (step: number): boolean => {
    const errors: Record<string, string> = {};

    if (step === 1) {
      if (!profile.qualification.trim()) {
        errors.qualification = 'Please select your current qualification or "Not sure yet".';
      }
      if (!profile.subjects.trim()) {
        errors.subjects = 'Please enter your major subjects or select "Not sure yet".';
      }
    } else if (step === 2) {
      if (!profile.targetField.trim()) {
        errors.targetField = 'Please select or enter your field of interest or "Not sure yet".';
      }
      if (!profile.targetUniversitiesExams.trim()) {
        errors.targetUniversitiesExams = 'Please enter your target tests or select "Not sure yet".';
      }
    } else if (step === 3) {
      if (!profile.gapYearReason.trim()) {
        errors.gapYearReason = 'Please select your primary reason or "Not sure yet".';
      }
      if (!profile.availableHoursPerWeek.trim()) {
        errors.availableHoursPerWeek = 'Please specify your available weekly hours.';
      }
    } else if (step === 4) {
      if (!profile.goals.trim()) {
        errors.goals = 'Please write 1 or 2 main objectives or select "Not sure yet".';
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 4));
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep(4)) {
      onSubmit(profile);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      {/* Wizard Form Card */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
        {/* Wizard Header */}
        <div className="p-6 sm:p-7 bg-slate-50/80 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-0.5 text-xs font-semibold bg-teal-100 text-teal-800 border border-teal-200 rounded-md">
              Student Blueprint • Step {currentStep} of 4
            </span>
            <button
              type="button"
              onClick={handleResetBlank}
              className="text-xs text-slate-500 hover:text-slate-800 underline flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Clear Form</span>
            </button>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold mt-2 text-slate-900 font-['Space_Grotesk']">
            {currentStep === 1 && 'Academic Qualification & Subjects'}
            {currentStep === 2 && 'Intended Degree & Target Universities'}
            {currentStep === 3 && 'Gap Year Reasons & Weekly Pacing'}
            {currentStep === 4 && 'Interests, Goals & Final Review'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
            {currentStep === 1 &&
              'Tell us about your educational background so your plan starts with the right academic baseline.'}
            {currentStep === 2 &&
              'Specify where you want to go. Select "Not sure yet" for any decisions you are still exploring.'}
            {currentStep === 3 &&
              'Choose your weekly study hours and budget preference to ensure a realistic, sustainable workload.'}
            {currentStep === 4 &&
              'Review your information before generating your custom 12-month roadmap.'}
          </p>

          {/* Stepper Progress Bar */}
          <div className="flex items-center gap-2 mt-5">
            {[1, 2, 3, 4].map((step) => (
              <button
                key={step}
                type="button"
                onClick={() => {
                  if (step < currentStep || validateStep(currentStep)) {
                    setCurrentStep(step);
                  }
                }}
                className={`flex-1 h-1.5 rounded-full transition-all ${
                  step === currentStep
                    ? 'bg-teal-600'
                    : step < currentStep
                    ? 'bg-teal-300'
                    : 'bg-slate-200'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Error Notification if any */}
        {error && (
          <div className="m-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Generation Notice</p>
              <p className="text-xs text-rose-700 mt-0.5">{error}</p>
            </div>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-7 space-y-6">
          {/* STEP 1 */}
          {currentStep === 1 && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-slate-900 mb-1">
                  Your Name or Preferred Name <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => handleFieldChange('name', e.target.value)}
                  placeholder="Enter your name or leave blank"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm bg-white"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Your name is private and stored only in your local browser.
                </p>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold text-slate-900 mb-1">
                  Current Academic Qualification <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {QUALIFICATIONS.map((qual) => (
                    <button
                      key={qual}
                      type="button"
                      onClick={() => handleFieldChange('qualification', qual)}
                      className={`px-3.5 py-2.5 rounded-xl border text-left text-xs sm:text-sm transition-all flex items-center justify-between ${
                        profile.qualification === qual
                          ? 'border-teal-600 bg-teal-50 text-teal-900 font-semibold ring-1 ring-teal-600'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                      }`}
                    >
                      <span>{qual}</span>
                      {profile.qualification === qual && (
                        <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
                {validationErrors.qualification && (
                  <p className="text-xs text-rose-600 mt-1 font-medium">
                    {validationErrors.qualification}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold text-slate-900 mb-1">
                  Major Subjects Studied <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={profile.subjects}
                  onChange={(e) => handleFieldChange('subjects', e.target.value)}
                  placeholder="e.g. Biology, Chemistry, Physics or Math, Physics, Computing"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm bg-white"
                />
                <div className="flex flex-wrap gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => handleFieldChange('subjects', 'Not sure yet')}
                    className="text-xs text-teal-700 hover:underline"
                  >
                    Select "Not sure yet"
                  </button>
                </div>
                {validationErrors.subjects && (
                  <p className="text-xs text-rose-600 mt-1 font-medium">
                    {validationErrors.subjects}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold text-slate-900 mb-1">
                  Prior Academic Grades or Marks <span className="text-slate-400 font-normal">(if known)</span>
                </label>
                <input
                  type="text"
                  value={profile.grades}
                  onChange={(e) => handleFieldChange('grades', e.target.value)}
                  placeholder="e.g. 85%, A-Levels: ABB, or Awaiting results"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm bg-white"
                />
                <button
                  type="button"
                  onClick={() => handleFieldChange('grades', 'Not sure yet / Result awaiting')}
                  className="text-xs text-teal-700 hover:underline mt-1 inline-block"
                >
                  Select "Not sure yet / Result awaiting"
                </button>
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {currentStep === 2 && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-slate-900 mb-1">
                  Intended Degree or Career Field <span className="text-rose-500">*</span>
                </label>
                <div className="space-y-1.5 mb-3">
                  {TARGET_FIELDS.slice(0, 6).map((field) => (
                    <button
                      key={field}
                      type="button"
                      onClick={() => handleFieldChange('targetField', field)}
                      className={`w-full px-3.5 py-2 rounded-xl border text-left text-xs sm:text-sm transition-all flex items-center justify-between ${
                        profile.targetField === field
                          ? 'border-teal-600 bg-teal-50 text-teal-900 font-semibold'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                      }`}
                    >
                      <span>{field}</span>
                      {profile.targetField === field && (
                        <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={profile.targetField}
                  onChange={(e) => handleFieldChange('targetField', e.target.value)}
                  placeholder="Or enter your custom field..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm bg-white"
                />
                <button
                  type="button"
                  onClick={() => handleFieldChange('targetField', 'Not sure yet / Exploring Options')}
                  className="text-xs text-teal-700 hover:underline mt-1 inline-block"
                >
                  Select "Not sure yet / Exploring Options"
                </button>
                {validationErrors.targetField && (
                  <p className="text-xs text-rose-600 mt-1 font-medium">
                    {validationErrors.targetField}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold text-slate-900 mb-1">
                  Target Universities & Entrance Examinations <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  value={profile.targetUniversitiesExams}
                  onChange={(e) => handleFieldChange('targetUniversitiesExams', e.target.value)}
                  placeholder="e.g. NUST (NET), FAST-NU, MDCAT, LUMS, ECAT, GIKI, or Not sure yet"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm bg-white"
                />
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  <button
                    type="button"
                    onClick={() => handleFieldChange('targetUniversitiesExams', 'Not sure yet')}
                    className="px-2 py-0.5 text-xs rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium"
                  >
                    Select "Not sure yet"
                  </button>
                </div>
                {validationErrors.targetUniversitiesExams && (
                  <p className="text-xs text-rose-600 mt-1 font-medium">
                    {validationErrors.targetUniversitiesExams}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {currentStep === 3 && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-slate-900 mb-1">
                  Primary Reason for Taking a Gap Year <span className="text-rose-500">*</span>
                </label>
                <div className="space-y-1.5">
                  {GAP_YEAR_REASONS.map((reason) => (
                    <button
                      key={reason}
                      type="button"
                      onClick={() => handleFieldChange('gapYearReason', reason)}
                      className={`w-full px-3.5 py-2 rounded-xl border text-left text-xs sm:text-sm transition-all flex items-center justify-between ${
                        profile.gapYearReason === reason
                          ? 'border-teal-600 bg-teal-50 text-teal-900 font-semibold'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                      }`}
                    >
                      <span>{reason}</span>
                      {profile.gapYearReason === reason && (
                        <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={profile.gapYearReason}
                  onChange={(e) => handleFieldChange('gapYearReason', e.target.value)}
                  placeholder="Or enter your custom reason..."
                  className="w-full mt-2 px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 bg-white"
                />
                {validationErrors.gapYearReason && (
                  <p className="text-xs text-rose-600 mt-1 font-medium">
                    {validationErrors.gapYearReason}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-slate-900 mb-1">
                    Available Hours Per Week <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={profile.availableHoursPerWeek}
                    onChange={(e) => handleFieldChange('availableHoursPerWeek', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm bg-white"
                  >
                    <option value="10-15 hours">10-15 hours (Light / Part-time)</option>
                    <option value="20-25 hours">20-25 hours (Balanced standard pace)</option>
                    <option value="30-35 hours">30-35 hours (Full-time intensive)</option>
                    <option value="40+ hours">40+ hours (High intensity)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-slate-900 mb-1">
                    Budget & Resource Constraints <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={profile.budgetConstraints}
                    onChange={(e) => handleFieldChange('budgetConstraints', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm bg-white"
                  >
                    <option value="Strictly free learning resources (DigiSkills, YouTube, freeCodeCamp, CS50)">
                      Strictly free learning resources
                    </option>
                    <option value="Low budget (< Rs. 5,000/mo for books/materials)">
                      Low budget (&lt; Rs. 5,000/mo)
                    </option>
                    <option value="Flexible budget for tests/courses">
                      Flexible budget for tests/courses
                    </option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold text-slate-900 mb-1">
                  Preferred Learning Style
                </label>
                <div className="space-y-1.5">
                  {LEARNING_STYLES.map((style) => (
                    <button
                      key={style}
                      type="button"
                      onClick={() => handleFieldChange('learningStyle', style)}
                      className={`w-full px-3.5 py-2 rounded-xl border text-left text-xs sm:text-sm transition-all flex items-center justify-between ${
                        profile.learningStyle === style
                          ? 'border-teal-600 bg-teal-50 text-teal-900 font-semibold'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                      }`}
                    >
                      <span>{style}</span>
                      {profile.learningStyle === style && (
                        <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4 */}
          {currentStep === 4 && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-slate-900 mb-1">
                  Interests, Hobbies & Existing Skills
                </label>
                <textarea
                  rows={2}
                  value={profile.interests}
                  onChange={(e) => handleFieldChange('interests', e.target.value)}
                  placeholder="e.g. Mathematics, reading, coding, graphic design, writing, or Not sure yet"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm bg-white"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold text-slate-900 mb-1">
                  Main Goals for This Year <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  value={profile.goals}
                  onChange={(e) => handleFieldChange('goals', e.target.value)}
                  placeholder="e.g. 1) Achieve a competitive entrance test score, 2) Learn foundational programming, 3) Maintain mental clarity"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm bg-white"
                />
                <button
                  type="button"
                  onClick={() => handleFieldChange('goals', 'Not sure yet / Clarifying my priorities')}
                  className="text-xs text-teal-700 hover:underline mt-1 inline-block"
                >
                  Select "Not sure yet"
                </button>
                {validationErrors.goals && (
                  <p className="text-xs text-rose-600 mt-1 font-medium">
                    {validationErrors.goals}
                  </p>
                )}
              </div>

              {/* Review Summary */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                    <FileCheck className="w-4 h-4 text-teal-600" />
                    Review Your Information
                  </span>
                  <span className="text-xs text-slate-500">Ready to generate plan</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-500 block">Name:</span>
                    <span className="font-semibold text-slate-900">
                      {profile.name || 'Not provided'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Qualification:</span>
                    <span className="font-semibold text-slate-900">
                      {profile.qualification || 'Not selected'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Target Field:</span>
                    <span className="font-semibold text-teal-800">
                      {profile.targetField || 'Not specified'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Target Universities / Tests:</span>
                    <span className="font-semibold text-slate-900">
                      {profile.targetUniversitiesExams || 'Not specified'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Weekly Paced Hours:</span>
                    <span className="font-semibold text-slate-900">
                      {profile.availableHoursPerWeek}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Budget Mode:</span>
                    <span className="font-semibold text-slate-900">
                      {profile.budgetConstraints.split('(')[0]}
                    </span>
                  </div>
                </div>
              </div>

              {/* Transparent AI Advisory */}
              <div className="p-3 rounded-xl bg-teal-50 border border-teal-200 text-xs text-teal-900 flex items-start gap-2.5">
                <Info className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold">Planning Assistance Advisory:</span> Waqfa AI
                  builds a structured, customized plan based on your answers. You can edit this profile
                  and regenerate your plan at any time.
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                disabled={isGenerating}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs sm:text-sm font-medium hover:bg-slate-50 flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            ) : (
              <div />
            )}

            {currentStep < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-5 py-2 rounded-xl bg-slate-900 text-white text-xs sm:text-sm font-semibold hover:bg-slate-800 flex items-center gap-1.5 shadow-xs"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isGenerating}
                className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white text-xs sm:text-sm font-bold shadow-xs flex items-center gap-2 disabled:opacity-50 transition-all cursor-pointer"
              >
                {isGenerating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Generating Your Roadmap...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Create My Roadmap</span>
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
