import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { IntroScreen } from './components/IntroScreen';
import { LandingView } from './components/LandingView';
import { DashboardView } from './components/DashboardView';
import { BlueprintForm } from './components/BlueprintForm';
import { RoadmapView } from './components/RoadmapView';
import { ApplicationTrackerView } from './components/ApplicationTrackerView';
import { SkillsBuilderView } from './components/SkillsBuilderView';
import { GapYearGuideView } from './components/GapYearGuideView';
import { ExampleRoadmapModal } from './components/ExampleRoadmapModal';
import { MentorChatbot } from './components/MentorChatbot';
import { NewStudentConfirmModal } from './components/NewStudentConfirmModal';
import { StudentProfilesModal } from './components/StudentProfilesModal';
import {
  StudentProfile,
  GeneratedRoadmap,
  ApplicationEntry,
  SavedStudentSession,
} from './types';
import {
  DEFAULT_BLANK_PROFILE,
  getStoredProfile,
  saveStoredProfile,
  getStoredRoadmap,
  saveStoredRoadmap,
  getStoredApplications,
  saveStoredApplications,
  getSavedSessions,
  saveSavedSessions,
  getActiveSessionId,
  setActiveSessionId,
  syncActiveSession,
  deleteSavedSession,
  generateSessionId,
  hasSeenIntro,
  setSeenIntro,
} from './utils/storage';
import { CheckCircle2 } from 'lucide-react';

export default function App() {
  const [showIntro, setShowIntro] = useState<boolean>(!hasSeenIntro());
  // Default to 'home' landing page for predictable, fresh session entry
  const [activeTab, setActiveTab] = useState<string>('home');

  // Multi-session student state management
  const [sessions, setSessions] = useState<SavedStudentSession[]>(() => getSavedSessions());
  const [activeSessionId, setCurrentActiveSessionId] = useState<string>(() => {
    const existing = getActiveSessionId();
    if (existing) return existing;
    const all = getSavedSessions();
    if (all.length > 0) return all[0].id;
    return generateSessionId();
  });

  const [profile, setProfile] = useState<StudentProfile>(() => getStoredProfile());
  const [roadmap, setRoadmap] = useState<GeneratedRoadmap | null>(() => getStoredRoadmap());
  const [applications, setApplications] = useState<ApplicationEntry[]>(() => getStoredApplications());

  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Modals
  const [isExampleModalOpen, setIsExampleModalOpen] = useState<boolean>(false);
  const [isNewStudentModalOpen, setIsNewStudentModalOpen] = useState<boolean>(false);
  const [isProfilesModalOpen, setIsProfilesModalOpen] = useState<boolean>(false);

  // Keep storage in sync with active session state
  useEffect(() => {
    syncActiveSession(activeSessionId, profile, roadmap, applications);
    setSessions(getSavedSessions());
  }, [activeSessionId, profile, roadmap, applications]);

  // Show temporary toast message
  const triggerToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => {
      setSuccessToast(null);
    }, 3500);
  };

  const handleFinishIntro = () => {
    setSeenIntro();
    setShowIntro(false);
  };

  // Switch to another saved student session safely
  const handleSelectSession = (sessionId: string) => {
    const targetSession = sessions.find((s) => s.id === sessionId);
    if (!targetSession) return;

    setCurrentActiveSessionId(targetSession.id);
    setActiveSessionId(targetSession.id);
    setProfile(targetSession.profile);
    setRoadmap(targetSession.roadmap);
    setApplications(targetSession.applications);

    if (targetSession.roadmap) {
      setActiveTab('dashboard');
    } else {
      setActiveTab('blueprint');
    }

    triggerToast(`Loaded planning session for ${targetSession.studentName || 'student'}.`);
  };

  // Start planning for another student safely without overwriting current student's work
  const handleConfirmStartNewStudent = () => {
    // Current session is already synced via the useEffect
    const newId = generateSessionId();
    setCurrentActiveSessionId(newId);
    setActiveSessionId(newId);

    setProfile(DEFAULT_BLANK_PROFILE);
    setRoadmap(null);
    setApplications([]);
    setActiveTab('blueprint');

    triggerToast('Started fresh Student Blueprint for another student.');
  };

  // Delete a saved session with safety check
  const handleDeleteSession = (sessionId: string) => {
    deleteSavedSession(sessionId);
    const updated = getSavedSessions();
    setSessions(updated);

    if (activeSessionId === sessionId) {
      if (updated.length > 0) {
        handleSelectSession(updated[0].id);
      } else {
        const freshId = generateSessionId();
        setCurrentActiveSessionId(freshId);
        setActiveSessionId(freshId);
        setProfile(DEFAULT_BLANK_PROFILE);
        setRoadmap(null);
        setApplications([]);
        setActiveTab('home');
      }
    }
    triggerToast('Student session removed.');
  };

  // AI Roadmap Generation Call using the user's submitted profile
  const handleGenerateRoadmap = async (submittedProfile: StudentProfile) => {
    setIsGenerating(true);
    setGenerationError(null);
    setProfile(submittedProfile);

    try {
      const response = await fetch('/api/roadmap/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submittedProfile),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.error ||
            'Failed to generate roadmap from AI model. Please check connection and try again.'
        );
      }

      const generatedData = result.data;

      // Ensure all tasks and kickstart days in newly generated roadmap start with completed: false
      const uncompletedKickstart = (generatedData.sevenDayKickstart || []).map((d: any) => ({
        ...d,
        completed: false,
      }));

      const uncompletedMonths = (generatedData.months || []).map((m: any) => ({
        ...m,
        tasks: (m.tasks || []).map((t: any) => ({
          ...t,
          completed: false,
        })),
      }));

      const completeRoadmap: GeneratedRoadmap = {
        ...generatedData,
        sevenDayKickstart: uncompletedKickstart,
        months: uncompletedMonths,
        studentName: submittedProfile.name ? submittedProfile.name.trim() : '',
        studentProfile: submittedProfile,
        generatedAt: new Date().toISOString(),
      };

      setRoadmap(completeRoadmap);
      setActiveTab('dashboard'); // Take user to their personalized dashboard after roadmap creation
      triggerToast('Your personalized roadmap has been generated successfully!');
    } catch (err: any) {
      console.error('Generation failed:', err);
      setGenerationError(
        err.message || 'An unexpected error occurred during generation. Please try again.'
      );
    } finally {
      setIsGenerating(false);
    }
  };

  // Toggle tasks in roadmap
  const handleToggleTask = (monthNumber: number, taskId: string) => {
    if (!roadmap) return;
    setRoadmap((prev) => {
      if (!prev) return null;
      const updatedMonths = prev.months.map((m) => {
        if (m.monthNumber === monthNumber) {
          const updatedTasks = m.tasks.map((t) => {
            if (t.id === taskId) {
              return { ...t, completed: !t.completed };
            }
            return t;
          });
          return { ...m, tasks: updatedTasks };
        }
        return m;
      });
      return { ...prev, months: updatedMonths };
    });
  };

  // Toggle 7-Day kickstart items
  const handleToggleKickstart = (dayNumber: number) => {
    if (!roadmap) return;
    setRoadmap((prev) => {
      if (!prev) return null;
      const updatedKickstart = prev.sevenDayKickstart.map((d) => {
        if (d.day === dayNumber) {
          return { ...d, completed: !d.completed };
        }
        return d;
      });
      return { ...prev, sevenDayKickstart: updatedKickstart };
    });
  };

  // Application tracker handlers
  const handleAddApplication = (newEntry: ApplicationEntry) => {
    setApplications((prev) => [newEntry, ...prev]);
    triggerToast(`Added ${newEntry.universityName} to your applications.`);
  };

  const handleUpdateApplication = (updatedEntry: ApplicationEntry) => {
    setApplications((prev) =>
      prev.map((app) => (app.id === updatedEntry.id ? updatedEntry : app))
    );
  };

  const handleDeleteApplication = (id: string) => {
    setApplications((prev) => prev.filter((app) => app.id !== id));
    triggerToast('Application removed.');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans selection:bg-teal-500 selection:text-white">
      {/* Short Introductory Screen for new visitors */}
      {showIntro && <IntroScreen onComplete={handleFinishIntro} />}

      {/* Top Navbar with Plain Text "Waqfa" Branding and Home navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        profile={profile}
        hasRoadmap={!!roadmap}
        isGenerating={isGenerating}
        savedSessionsCount={sessions.length}
        onStartNewRoadmap={() => setIsNewStudentModalOpen(true)}
        onOpenProfilesModal={() => setIsProfilesModalOpen(true)}
      />

      {/* Toast Notification (offset above bottom-right floating widget) */}
      {successToast && (
        <div className="fixed bottom-20 right-5 sm:bottom-22 sm:right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-lg border border-teal-500/30 flex items-center gap-2 text-xs animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Floating AI Mentor Chatbot (Fixed bottom-right across all screens) */}
      <MentorChatbot
        profile={profile}
        roadmap={roadmap}
        onNavigate={(tab) => setActiveTab(tab)}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-20">
        {/* Loading Overlay during AI generation */}
        {isGenerating && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-white text-center">
            <div className="w-12 h-12 rounded-full border-3 border-teal-400 border-t-transparent animate-spin mb-4" />
            <h3 className="text-lg font-bold font-['Space_Grotesk'] text-white">
              Generating Your Personalized Roadmap
            </h3>
            <p className="text-xs text-slate-300 max-w-sm mt-1.5 leading-relaxed">
              Waqfa is analyzing your academic background, target degrees, and available study hours
              to generate your customized 12-month journey...
            </p>
          </div>
        )}

        {/* VIEW ROUTING */}
        {activeTab === 'home' && (
          <LandingView
            profile={profile}
            hasRoadmap={!!roadmap}
            savedSessionsCount={sessions.length}
            onNavigate={setActiveTab}
            onOpenExampleRoadmap={() => setIsExampleModalOpen(true)}
            onStartNewRoadmap={() => setIsNewStudentModalOpen(true)}
            onOpenProfilesModal={() => setIsProfilesModalOpen(true)}
          />
        )}

        {activeTab === 'dashboard' && (
          <DashboardView
            profile={profile}
            roadmap={roadmap}
            applications={applications}
            savedSessionsCount={sessions.length}
            onNavigate={setActiveTab}
            onToggleKickstart={handleToggleKickstart}
            onOpenExampleRoadmap={() => setIsExampleModalOpen(true)}
            onStartNewRoadmap={() => setIsNewStudentModalOpen(true)}
            onOpenProfilesModal={() => setIsProfilesModalOpen(true)}
          />
        )}

        {activeTab === 'blueprint' && (
          <BlueprintForm
            initialProfile={profile}
            onSubmit={handleGenerateRoadmap}
            isGenerating={isGenerating}
            error={generationError}
          />
        )}

        {activeTab === 'roadmap' && (
          <RoadmapView
            roadmap={roadmap}
            onRegenerate={() => handleGenerateRoadmap(profile)}
            onEditBlueprint={() => setActiveTab('blueprint')}
            onToggleTask={handleToggleTask}
            onToggleKickstart={handleToggleKickstart}
            onLoadSampleRoadmap={() => setIsExampleModalOpen(true)}
            isGenerating={isGenerating}
          />
        )}

        {activeTab === 'tracker' && (
          <ApplicationTrackerView
            applications={applications}
            onAddApplication={handleAddApplication}
            onUpdateApplication={handleUpdateApplication}
            onDeleteApplication={handleDeleteApplication}
          />
        )}

        {activeTab === 'skills' && (
          <SkillsBuilderView
            skills={roadmap ? roadmap.skillsRecommendations : []}
            studentName={profile.name}
            targetField={profile.targetField}
            onNavigateToBlueprint={() => setActiveTab('blueprint')}
          />
        )}

        {activeTab === 'guide' && <GapYearGuideView />}
      </main>

      {/* Optional Demonstration Roadmap Modal */}
      <ExampleRoadmapModal
        isOpen={isExampleModalOpen}
        onClose={() => setIsExampleModalOpen(false)}
        onCreateOwn={() => setActiveTab('blueprint')}
      />

      {/* Confirmation Modal when Starting for Another Student */}
      <NewStudentConfirmModal
        isOpen={isNewStudentModalOpen}
        onClose={() => setIsNewStudentModalOpen(false)}
        onConfirm={handleConfirmStartNewStudent}
        currentStudentName={profile.name}
        hasRoadmap={!!roadmap}
      />

      {/* Modal to Switch Between Saved Student Profiles */}
      <StudentProfilesModal
        isOpen={isProfilesModalOpen}
        onClose={() => setIsProfilesModalOpen(false)}
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSelectSession={handleSelectSession}
        onStartNewSession={() => setIsNewStudentModalOpen(true)}
        onDeleteSession={handleDeleteSession}
      />

      {/* Clean Light Footer with Plain Text Branding */}
      <footer className="bg-white border-t border-slate-200 text-slate-500 text-xs py-8 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-baseline gap-2">
              <span
                onClick={() => setActiveTab('home')}
                className="font-bold text-slate-900 text-sm font-['Space_Grotesk'] cursor-pointer hover:text-teal-700 transition-colors"
                title="Return to Home"
              >
                Waqfa
              </span>
              <span className="text-slate-400 text-xs">— Pause, but with purpose.</span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-600">
              <button
                onClick={() => setActiveTab('home')}
                className="hover:text-teal-700 transition-colors cursor-pointer"
              >
                Home
              </button>
              {roadmap && (
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className="hover:text-teal-700 transition-colors cursor-pointer"
                >
                  Dashboard
                </button>
              )}
              <button
                onClick={() => setActiveTab('blueprint')}
                className="hover:text-teal-700 transition-colors cursor-pointer"
              >
                Student Blueprint
              </button>
              {roadmap && (
                <>
                  <button
                    onClick={() => setActiveTab('roadmap')}
                    className="hover:text-teal-700 transition-colors cursor-pointer"
                  >
                    My Roadmap
                  </button>
                  <button
                    onClick={() => setActiveTab('tracker')}
                    className="hover:text-teal-700 transition-colors cursor-pointer"
                  >
                    Applications
                  </button>
                  <button
                    onClick={() => setActiveTab('skills')}
                    className="hover:text-teal-700 transition-colors cursor-pointer"
                  >
                    Skills & Projects
                  </button>
                </>
              )}
              <button
                onClick={() => setActiveTab('guide')}
                className="hover:text-teal-700 transition-colors cursor-pointer"
              >
                Planning Guide
              </button>
              <button
                onClick={() => setShowIntro(true)}
                className="text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
              >
                Replay Intro
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-400">
            <p>
              Dedicated to gap-year students navigating university preparation, skill exploration,
              and personal growth.
            </p>
            <p>Private & local browser storage • Multiple student profiles supported</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
