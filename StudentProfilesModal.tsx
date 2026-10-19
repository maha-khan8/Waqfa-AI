import React from 'react';
import { Users, UserPlus, Check, Calendar, ArrowRight, Trash2, X, MapPin } from 'lucide-react';
import { SavedStudentSession } from '../types';

interface StudentProfilesModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessions: SavedStudentSession[];
  activeSessionId: string | null;
  onSelectSession: (sessionId: string) => void;
  onStartNewSession: () => void;
  onDeleteSession: (sessionId: string) => void;
}

export const StudentProfilesModal: React.FC<StudentProfilesModalProps> = ({
  isOpen,
  onClose,
  sessions,
  activeSessionId,
  onSelectSession,
  onStartNewSession,
  onDeleteSession,
}) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="profiles-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-slate-50 border-b border-slate-200 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center border border-teal-200">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3
                id="profiles-modal-title"
                className="text-base sm:text-lg font-bold text-slate-900 font-['Space_Grotesk']"
              >
                Saved Student Profiles
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Profiles saved locally in this browser
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Profiles list */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-3 flex-1">
          {sessions.length === 0 ? (
            <div className="text-center py-8 text-slate-500 space-y-3">
              <p className="text-xs">No saved student roadmaps found on this device yet.</p>
              <button
                onClick={() => {
                  onStartNewSession();
                  onClose();
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 text-white text-xs font-semibold hover:bg-teal-700 transition-colors"
              >
                <UserPlus className="w-4 h-4" />
                <span>Create First Roadmap</span>
              </button>
            </div>
          ) : (
            sessions.map((session) => {
              const isActive = session.id === activeSessionId;
              const hasRoadmap = !!session.roadmap;
              const name = session.studentName || 'Unnamed Student';

              return (
                <div
                  key={session.id}
                  className={`p-4 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                    isActive
                      ? 'border-teal-500 bg-teal-50/50 shadow-xs ring-1 ring-teal-500'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60'
                  }`}
                >
                  <div
                    onClick={() => {
                      onSelectSession(session.id);
                      onClose();
                    }}
                    className="flex-1 cursor-pointer min-w-0"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900 truncate">{name}</span>
                      {isActive && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-600 text-white">
                          <Check className="w-3 h-3" />
                          Active
                        </span>
                      )}
                    </div>

                    <div className="text-xs text-slate-600 truncate mt-0.5">
                      {session.qualification || 'Gap Year Student'}{' '}
                      {session.targetField ? `• ${session.targetField}` : ''}
                    </div>

                    <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1.5">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-teal-600" />
                        {hasRoadmap ? '12-Month Roadmap Ready' : 'Blueprint in progress'}
                      </span>
                      <span>
                        Apps:{' '}
                        <strong className="text-slate-600">{session.applications.length}</strong>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {!isActive ? (
                      <button
                        onClick={() => {
                          onSelectSession(session.id);
                          onClose();
                        }}
                        className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold transition-colors flex items-center gap-1"
                      >
                        <span>Switch</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    ) : (
                      <span className="text-xs text-teal-700 font-semibold px-2 py-1">Loaded</span>
                    )}

                    {sessions.length > 1 && (
                      <button
                        onClick={() => {
                          if (
                            window.confirm(
                              `Are you sure you want to remove ${name}'s saved session from this device?`
                            )
                          ) {
                            onDeleteSession(session.id);
                          }
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Delete session"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer with "+ Start for Another Student" */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-[11px] text-slate-500 text-center sm:text-left">
            Data is stored privately in your browser storage.
          </div>
          <button
            onClick={() => {
              onClose();
              onStartNewSession();
            }}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
          >
            <UserPlus className="w-4 h-4" />
            <span>Start for Another Student</span>
          </button>
        </div>
      </div>
    </div>
  );
};
