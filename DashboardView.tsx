import React from 'react';
import {
  Compass,
  Sparkles,
  MapPin,
  ClipboardList,
  CheckCircle2,
  Clock,
  ArrowRight,
  ArrowLeft,
  BookOpen,
  Calendar,
  Layers,
  ChevronRight,
  Eye,
  CheckSquare,
  UserPlus,
  Users,
} from 'lucide-react';
import { StudentProfile, GeneratedRoadmap, ApplicationEntry } from '../types';

interface DashboardViewProps {
  profile: StudentProfile;
  roadmap: GeneratedRoadmap | null;
  applications: ApplicationEntry[];
  savedSessionsCount?: number;
  onNavigate: (tab: string) => void;
  onToggleKickstart: (dayNumber: number) => void;
  onOpenExampleRoadmap: () => void;
  onStartNewRoadmap?: () => void;
  onOpenProfilesModal?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  profile,
  roadmap,
  applications,
  savedSessionsCount = 0,
  onNavigate,
  onToggleKickstart,
  onOpenExampleRoadmap,
  onStartNewRoadmap,
  onOpenProfilesModal,
}) => {
  const hasRoadmap = !!roadmap;

  // Personalized Dashboard Calculations (starts at 0% when newly generated)
  const kickstartTotal = roadmap ? roadmap.sevenDayKickstart.length : 0;
  const kickstartDone = roadmap
    ? roadmap.sevenDayKickstart.filter((d) => d.completed).length
    : 0;
  const kickstartPercent =
    kickstartTotal > 0 ? Math.round((kickstartDone / kickstartTotal) * 100) : 0;

  const allRoadmapTasks = roadmap ? roadmap.months.flatMap((m) => m.tasks) : [];
  const tasksCompleted = allRoadmapTasks.filter((t) => t.completed).length;
  const tasksPercent =
    allRoadmapTasks.length > 0 ? Math.round((tasksCompleted / allRoadmapTasks.length) * 100) : 0;

  const totalApps = applications.length;
  const submittedApps = applications.filter(
    (a) => a.status === 'Submitted' || a.status === 'Accepted'
  ).length;

  const studentDisplayName = profile.name.trim();

  // ==========================================
  // STATE A: FIRST-TIME USER HOME DASHBOARD
  // ==========================================
  if (!hasRoadmap) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-12">
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
            <button
              onClick={() => onNavigate('blueprint')}
              className="px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-bold text-sm shadow-sm shadow-teal-600/20 flex items-center gap-2 transition-all cursor-pointer"
            >
              <span>Create My Roadmap</span>
              <ArrowRight className="w-4 h-4" />
            </button>

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
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                Share your qualification, target degrees, available weekly study hours, and resource
                preferences. Select "Not sure yet" for anything you're still considering.
              </p>
            </div>

            {/* Card 2: Build your plan */}
            <div
              onClick={() => onNavigate('blueprint')}
              className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-teal-300 hover:shadow-sm transition-all cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 font-bold flex items-center justify-center mb-3">
                <span className="text-sm font-['Space_Grotesk']">2</span>
              </div>
              <h3 className="text-base font-bold text-slate-900 font-['Space_Grotesk'] group-hover:text-teal-800 transition-colors">
                Build your plan — Personalized Monthly Roadmap
              </h3>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                Receive an actionable 12-month timeline powered by Gemini AI, organized into academic
                drills, projects, and a concrete first-seven-days action plan.
              </p>
            </div>

            {/* Card 3: Stay organized */}
            <div
              onClick={() => onNavigate('blueprint')}
              className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-teal-300 hover:shadow-sm transition-all cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 font-bold flex items-center justify-center mb-3">
                <span className="text-sm font-['Space_Grotesk']">3</span>
              </div>
              <h3 className="text-base font-bold text-slate-900 font-['Space_Grotesk'] group-hover:text-teal-800 transition-colors">
                Stay organized — University & Application Tracker
              </h3>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                Track your actual target universities, entrance examinations, attested document
                checklists, and verified deadlines in one clean, private place.
              </p>
            </div>

            {/* Card 4: Grow your potential */}
            <div
              onClick={() => onNavigate('blueprint')}
              className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-teal-300 hover:shadow-sm transition-all cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 font-bold flex items-center justify-center mb-3">
                <span className="text-sm font-['Space_Grotesk']">4</span>
              </div>
              <h3 className="text-base font-bold text-slate-900 font-['Space_Grotesk'] group-hover:text-teal-800 transition-colors">
                Grow your potential — Skills, Projects & Experiences
              </h3>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                Discover beginner-friendly technical, creative, and professional skills with practical
                mini-projects and verified free or affordable learning resources.
              </p>
            </div>
          </div>
        </div>

        {/* Clean Privacy & Trust Guarantee */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-500 max-w-xl mx-auto">
          Private to your device. No account or payment required. Your plan is generated directly
          from your answers using Google Gemini AI.
        </div>
      </div>
    );
  }

  // ==========================================
  // STATE B: PERSONALIZED WORKSPACE DASHBOARD
  // ==========================================
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Personalized Welcome Header */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 shadow-xs border border-slate-200 space-y-4">
        {/* Subtle Top Utility Bar: Return to Home & Profiles */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 text-xs">
          <button
            onClick={() => onNavigate('home')}
            className="inline-flex items-center gap-1.5 text-slate-500 hover:text-teal-700 transition-colors font-medium group cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            <span>Return to Home</span>
          </button>

          {savedSessionsCount > 1 && onOpenProfilesModal && (
            <button
              onClick={onOpenProfilesModal}
              className="inline-flex items-center gap-1.5 text-xs text-teal-800 hover:text-teal-900 bg-teal-50 hover:bg-teal-100/70 px-2.5 py-1 rounded-lg border border-teal-200 transition-colors cursor-pointer"
            >
              <Users className="w-3.5 h-3.5 text-teal-600" />
              <span>Saved Students ({savedSessionsCount})</span>
            </button>
          )}
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider bg-teal-100 text-teal-800 border border-teal-200 rounded-md">
                Your Personalized Workspace
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 font-['Space_Grotesk']">
              {studentDisplayName ? `Welcome, ${studentDisplayName}` : 'Your Gap Year Dashboard'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
              "Pause, but with purpose." Your roadmap is active and calibrated to your goals.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {onStartNewRoadmap && (
              <button
                onClick={onStartNewRoadmap}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Start a separate planning session for another student without overwriting current data"
              >
                <UserPlus className="w-3.5 h-3.5 text-teal-700" />
                <span>Start for Another Student</span>
              </button>
            )}
            <button
              onClick={() => onNavigate('blueprint')}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
            >
              Review Blueprint
            </button>
            <button
              onClick={() => onNavigate('roadmap')}
              className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Open My Roadmap</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Neutral Progress Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Blueprint Card */}
        <div
          onClick={() => onNavigate('blueprint')}
          className="p-4 rounded-xl bg-white border border-slate-200 hover:border-teal-300 shadow-xs cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Your Blueprint</span>
            <span className="text-teal-700 font-semibold group-hover:translate-x-0.5 transition-transform text-xs">
              View &rarr;
            </span>
          </div>
          <div className="text-sm font-bold text-slate-900 truncate">
            {studentDisplayName || 'Active Profile'}
          </div>
          <div className="text-xs text-teal-700 font-medium truncate mt-0.5">
            {profile.qualification || 'Targeting University'}
          </div>
          <div className="mt-2 pt-2 border-t border-slate-100 text-[11px] text-slate-500 truncate">
            Target: {profile.targetField || 'Customized Path'}
          </div>
        </div>

        {/* 7-Day Kickstart */}
        <div
          onClick={() => onNavigate('roadmap')}
          className="p-4 rounded-xl bg-white border border-slate-200 hover:border-teal-300 shadow-xs cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-semibold uppercase tracking-wider text-[10px]">7-Day Kickstart</span>
            <span className="text-teal-700 font-semibold text-xs">
              {kickstartDone}/{kickstartTotal} Days
            </span>
          </div>
          <div className="text-xl font-bold text-slate-900 font-['Space_Grotesk']">
            {kickstartPercent}% Done
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-teal-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${kickstartPercent}%` }}
            />
          </div>
          <div className="mt-2 text-[11px] text-slate-500">
            {kickstartPercent === 100 ? 'Kickstart completed!' : 'Immediate momentum steps'}
          </div>
        </div>

        {/* Roadmap Tasks */}
        <div
          onClick={() => onNavigate('roadmap')}
          className="p-4 rounded-xl bg-white border border-slate-200 hover:border-teal-300 shadow-xs cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Your Tasks</span>
            <span className="text-teal-700 font-semibold text-xs">
              {tasksCompleted}/{allRoadmapTasks.length} Done
            </span>
          </div>
          <div className="text-xl font-bold text-slate-900 font-['Space_Grotesk']">
            {tasksPercent}% Completed
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-teal-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${tasksPercent}%` }}
            />
          </div>
          <div className="mt-2 text-[11px] text-slate-500">
            12 months paced to your capacity
          </div>
        </div>

        {/* Applications */}
        <div
          onClick={() => onNavigate('tracker')}
          className="p-4 rounded-xl bg-white border border-slate-200 hover:border-teal-300 shadow-xs cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Your Applications</span>
            <span className="text-teal-700 font-semibold group-hover:translate-x-0.5 transition-transform text-xs">
              Manage &rarr;
            </span>
          </div>
          <div className="text-xl font-bold text-slate-900 font-['Space_Grotesk']">
            {totalApps} Added
          </div>
          <div className="text-xs text-slate-600 font-medium mt-0.5">
            {submittedApps > 0 ? `${submittedApps} Submitted` : 'Add your targets'}
          </div>
          <div className="mt-2 pt-2 border-t border-slate-100 text-[11px] text-slate-500">
            Checklist & deadlines verified locally
          </div>
        </div>
      </div>

      {/* TWO COLUMN WORKSPACE: 7-Day Kickstart & Next Targets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 spans): 7-Day Action Protocol */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 font-['Space_Grotesk']">
                Immediate 7-Day Kickstart Protocol
              </h2>
              <p className="text-xs text-slate-500">
                Complete these initial actions to build momentum and avoid hesitation.
              </p>
            </div>
            <button
              onClick={() => onNavigate('roadmap')}
              className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1"
            >
              <span>Full Roadmap</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2">
            {roadmap.sevenDayKickstart.slice(0, 4).map((day) => {
              const isDone = !!day.completed;
              return (
                <div
                  key={day.day}
                  onClick={() => onToggleKickstart(day.day)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer select-none flex items-start gap-2.5 ${
                    isDone
                      ? 'bg-slate-50 border-slate-200 text-slate-400'
                      : 'bg-white border-slate-200 hover:border-slate-300 text-slate-800'
                  }`}
                >
                  <button type="button" className="mt-0.5 shrink-0">
                    {isDone ? (
                      <CheckCircle2 className="w-4 h-4 text-teal-600" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border-2 border-slate-300" />
                    )}
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                      <span
                        className={`text-xs font-semibold ${
                          isDone ? 'line-through text-slate-400' : 'text-slate-900'
                        }`}
                      >
                        Day {day.day}: {day.title}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium shrink-0">
                        {day.timeNeeded}
                      </span>
                    </div>
                    <p
                      className={`text-xs line-clamp-1 ${
                        isDone ? 'line-through text-slate-400' : 'text-slate-600'
                      }`}
                    >
                      {day.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-2">
            <button
              onClick={() => onNavigate('roadmap')}
              className="w-full py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 border border-slate-200 flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>View All 7 Kickstart Days & 12 Months</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right Column: Applications Tracker & Skills */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 font-['Space_Grotesk'] flex items-center gap-1.5">
                <ClipboardList className="w-4 h-4 text-teal-600" />
                Your Applications
              </h3>
              <button
                onClick={() => onNavigate('tracker')}
                className="text-xs font-semibold text-teal-700 hover:underline"
              >
                View
              </button>
            </div>

            {applications.length === 0 ? (
              <div className="text-center py-4 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-xs text-slate-500">No universities added yet</p>
                <button
                  onClick={() => onNavigate('tracker')}
                  className="mt-2 text-xs font-semibold text-teal-700 underline"
                >
                  + Add your first university
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {applications.slice(0, 3).map((app) => (
                  <div
                    key={app.id}
                    onClick={() => onNavigate('tracker')}
                    className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 hover:border-slate-200 cursor-pointer text-xs"
                  >
                    <div className="flex items-center justify-between font-semibold text-slate-900">
                      <span className="truncate">{app.universityName}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-white border border-slate-200 text-slate-700">
                        {app.status}
                      </span>
                    </div>
                    <div className="text-[11px] text-teal-700 font-medium truncate mt-0.5">
                      {app.degreeProgram}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 font-['Space_Grotesk'] flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-teal-600" />
                Recommended Skills
              </h3>
              <button
                onClick={() => onNavigate('skills')}
                className="text-xs font-semibold text-teal-700 hover:underline"
              >
                Explore
              </button>
            </div>

            <div className="space-y-2">
              {roadmap.skillsRecommendations.slice(0, 2).map((sk, idx) => (
                <div
                  key={idx}
                  onClick={() => onNavigate('skills')}
                  className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 hover:border-slate-200 cursor-pointer text-xs"
                >
                  <div className="font-semibold text-slate-900">{sk.skill}</div>
                  <p className="text-slate-500 text-[11px] line-clamp-1 mt-0.5">
                    {sk.achievableMiniProject}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
