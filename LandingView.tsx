import React from 'react';
import {
  Sparkles,
  ArrowRight,
  Eye,
  MapPin,
  ClipboardList,
  Compass,
  CheckCircle2,
  Users,
  UserPlus,
  Layers,
} from 'lucide-react';
import { StudentProfile } from '../types';

interface LandingViewProps {
  profile: StudentProfile;
  hasRoadmap: boolean;
  savedSessionsCount: number;
  onNavigate: (tab: string) => void;
  onOpenExampleRoadmap: () => void;
  onStartNewRoadmap: () => void;
  onOpenProfilesModal: () => void;
}

export const LandingView: React.FC<LandingViewProps> = ({
  profile,
  hasRoadmap,
  savedSessionsCount,
  onNavigate,
  onOpenExampleRoadmap,
  onStartNewRoadmap,
  onOpenProfilesModal,
}) => {
  const studentDisplayName = profile.name.trim();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-12">
      {/* If a saved roadmap exists on this device, show a clean, non-intrusive resume bar */}
      {hasRoadmap && (
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-teal-200/90 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in duration-300">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 flex items-center justify-center shrink-0">
              <Compass className="w-5 h-5 text-teal-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-teal-900 font-['Space_Grotesk']">
                  Active Gap-Year Plan
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-teal-100 text-teal-800">
                  Saved on Device
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                {studentDisplayName
                  ? `Welcome back, ${studentDisplayName}! Your roadmap is ready to continue.`
                  : 'Your customized 12-month roadmap is ready to continue.'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
            {savedSessionsCount > 1 && (
              <button
                onClick={onOpenProfilesModal}
                className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Users className="w-3.5 h-3.5" />
                <span>Saved Students ({savedSessionsCount})</span>
              </button>
            )}
            <button
              onClick={() => onNavigate('dashboard')}
              className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all"
            >
              <span>Open Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div className="text-center space-y-5 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200/80 text-teal-800 text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-teal-600" />
          <span>Gap Year Planning Assistant</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 font-['Space_Grotesk'] leading-tight">
          Your gap year. Your direction. Your next chapter.
        </h1>

        <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
          Waqfa helps you turn your gap year into a purposeful plan for university preparation,
          career exploration, skill development, and personal growth — built around your goals and
          circumstances.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          {!hasRoadmap ? (
            <button
              onClick={() => onNavigate('blueprint')}
              className="px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-bold text-sm shadow-sm shadow-teal-600/20 flex items-center gap-2 transition-all cursor-pointer"
            >
              <span>Create My Roadmap</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <>
              <button
                onClick={() => onNavigate('dashboard')}
                className="px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-bold text-sm shadow-sm shadow-teal-600/20 flex items-center gap-2 transition-all cursor-pointer"
              >
                <span>Continue to Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={onStartNewRoadmap}
                className="px-5 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm border border-slate-300 shadow-xs flex items-center gap-2 transition-colors cursor-pointer"
              >
                <UserPlus className="w-4 h-4 text-teal-600" />
                <span>Start for Another Student</span>
              </button>
            </>
          )}

          <button
            onClick={onOpenExampleRoadmap}
            className="px-5 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm border border-slate-300 shadow-xs flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Eye className="w-4 h-4 text-slate-500" />
            <span>View example roadmap</span>
          </button>
        </div>
      </div>

      {/* The Four Core Parts of Waqfa */}
      <div className="space-y-4">
        <div className="text-center space-y-1">
          <h2 className="text-xl font-bold text-slate-900 font-['Space_Grotesk']">
            How Waqfa Structures Your Gap Year
          </h2>
          <p className="text-xs text-slate-500">
            Four connected tools designed to keep your preparation focused and actionable.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {/* Card 1: Understand your goals */}
          <div
            onClick={() => onNavigate('blueprint')}
            className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-teal-300 hover:shadow-sm transition-all cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 font-bold flex items-center justify-center mb-3">
              <span className="text-sm font-['Space_Grotesk']">1</span>
            </div>
            <h3 className="text-base font-bold text-slate-900 font-['Space_Grotesk'] group-hover:text-teal-800 transition-colors">
              Understand your goals — Student Blueprint
            </h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Capture your qualifications, target universities, entrance exams, available weekly
              study hours, budget constraints, and personal interests.
            </p>
            <div className="mt-4 flex items-center text-xs font-semibold text-teal-700 group-hover:underline">
              <span>{hasRoadmap ? 'View blueprint' : 'Fill blueprint'}</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2: Build your plan */}
          <div
            onClick={() => (hasRoadmap ? onNavigate('roadmap') : onNavigate('blueprint'))}
            className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-teal-300 hover:shadow-sm transition-all cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 font-bold flex items-center justify-center mb-3">
              <span className="text-sm font-['Space_Grotesk']">2</span>
            </div>
            <h3 className="text-base font-bold text-slate-900 font-['Space_Grotesk'] group-hover:text-teal-800 transition-colors">
              Build your plan — personalized monthly roadmap
            </h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              A structured 12-month timeline tailored to Pakistani university cycles (NUST NET, FAST
              NU, IBA, MDCAT, ECAT, LUMS) with realistic weekly pacing and a 7-day kickstart.
            </p>
            <div className="mt-4 flex items-center text-xs font-semibold text-teal-700 group-hover:underline">
              <span>{hasRoadmap ? 'View monthly plan' : 'Requires blueprint'}</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 3: Stay organized */}
          <div
            onClick={() => onNavigate('tracker')}
            className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-teal-300 hover:shadow-sm transition-all cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 font-bold flex items-center justify-center mb-3">
              <span className="text-sm font-['Space_Grotesk']">3</span>
            </div>
            <h3 className="text-base font-bold text-slate-900 font-['Space_Grotesk'] group-hover:text-teal-800 transition-colors">
              Stay organized — university and application tracker
            </h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Track deadlines, admission test dates, required documents (IBCC equivalence, domicile,
              certificates), and personal application status.
            </p>
            <div className="mt-4 flex items-center text-xs font-semibold text-teal-700 group-hover:underline">
              <span>Open application tracker</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 4: Grow your potential */}
          <div
            onClick={() => (hasRoadmap ? onNavigate('skills') : onNavigate('blueprint'))}
            className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-teal-300 hover:shadow-sm transition-all cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 font-bold flex items-center justify-center mb-3">
              <span className="text-sm font-['Space_Grotesk']">4</span>
            </div>
            <h3 className="text-base font-bold text-slate-900 font-['Space_Grotesk'] group-hover:text-teal-800 transition-colors">
              Grow your potential — skills, projects, and experiences
            </h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Targeted skill recommendations with beginner starting points, practical mini-projects,
              and verified free or affordable learning resources.
            </p>
            <div className="mt-4 flex items-center text-xs font-semibold text-teal-700 group-hover:underline">
              <span>{hasRoadmap ? 'Explore skills' : 'Requires blueprint'}</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>

      {/* Clean Privacy & Trust Guarantee */}
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-500 max-w-xl mx-auto space-y-1">
        <div>
          Private to your device. No account or payment required. Your plan is generated directly
          from your answers using Google Gemini AI.
        </div>
        <div className="text-[11px] text-slate-400">
          Supports multiple student profiles on the same browser without losing previous data.
        </div>
      </div>
    </div>
  );
};
