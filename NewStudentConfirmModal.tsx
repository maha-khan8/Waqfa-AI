import React from 'react';
import { UserPlus, CheckCircle2, ShieldCheck, X } from 'lucide-react';

interface NewStudentConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  currentStudentName: string;
  hasRoadmap: boolean;
}

export const NewStudentConfirmModal: React.FC<NewStudentConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  currentStudentName,
  hasRoadmap,
}) => {
  if (!isOpen) return null;

  const displayName = currentStudentName.trim() || 'Current Student';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="new-student-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header decoration */}
        <div className="p-6 bg-linear-to-r from-teal-50/80 via-emerald-50/50 to-white border-b border-teal-100/60 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-xs">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3
                id="new-student-modal-title"
                className="text-lg font-bold text-slate-900 font-['Space_Grotesk']"
              >
                Start for Another Student
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Create a separate, fresh gap-year planning session
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal content */}
        <div className="p-6 space-y-4">
          <div className="rounded-xl bg-teal-50/70 border border-teal-200/80 p-4 space-y-2">
            <div className="flex items-start gap-2.5">
              <ShieldCheck className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
              <div className="text-xs text-teal-950 leading-relaxed">
                {hasRoadmap ? (
                  <>
                    <span className="font-bold">Your existing work is safe: </span>
                    The active roadmap, tasks, and applications for{' '}
                    <span className="font-bold text-teal-900">{displayName}</span> remain saved on
                    this device. Starting a new roadmap will{' '}
                    <span className="font-semibold underline decoration-teal-500">
                      not overwrite
                    </span>{' '}
                    their profile.
                  </>
                ) : (
                  <>
                    <span className="font-bold">Fresh session: </span>
                    Starting a new session will open a clean Student Blueprint form for the next
                    student.
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="text-xs text-slate-600 space-y-2">
            <p>
              Each student receives their own customized 12-month roadmap, 7-day kickstart, and
              application tracker based on their specific academic subjects, target degrees, and
              study hours.
            </p>
            <p className="text-slate-500">
              You can easily switch back between saved student roadmaps at any time using the student
              menu.
            </p>
          </div>
        </div>

        {/* Modal footer actions */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors"
          >
            Keep Current Session
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-1.5"
          >
            <UserPlus className="w-4 h-4" />
            <span>Confirm & Start New Roadmap</span>
          </button>
        </div>
      </div>
    </div>
  );
};
