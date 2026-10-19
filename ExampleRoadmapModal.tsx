import React, { useState } from 'react';
import {
  X,
  Sparkles,
  BookOpen,
  Briefcase,
  Layers,
  Award,
  CheckCircle2,
  Clock,
  ArrowRight,
  Info,
} from 'lucide-react';
import { INITIAL_SAMPLE_ROADMAP } from '../data/samples';

interface ExampleRoadmapModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateOwn: () => void;
}

export const ExampleRoadmapModal: React.FC<ExampleRoadmapModalProps> = ({
  isOpen,
  onClose,
  onCreateOwn,
}) => {
  const [selectedMonth, setSelectedMonth] = useState<number>(1);

  if (!isOpen) return null;

  const sample = INITIAL_SAMPLE_ROADMAP;
  const currentMonthData = sample.months.find((m) => m.monthNumber === selectedMonth) || sample.months[0];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-slate-200">
        {/* Demonstration Disclaimer Header */}
        <div className="p-4 sm:p-5 bg-amber-50/80 border-b border-amber-200/80 flex items-start justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <Info className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-900 block">
                Demonstration Roadmap — Example Preview
              </span>
              <p className="text-xs text-amber-800 mt-0.5">
                This is an illustrative preview showing how Waqfa structures a 12-month gap year.
                Viewing this preview does not change or affect your personal profile.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-amber-700 hover:text-amber-900 hover:bg-amber-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Example Content Body */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-100 pb-5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded border border-teal-200">
              Sample Track: Science & Technology Transition
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-['Space_Grotesk'] mt-2">
              Illustrative 12-Month Purposeful Gap Year
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
              {sample.executiveSummary}
            </p>
          </div>

          {/* 7-Day Kickstart Highlight */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Sample 7-Day Kickstart Protocol
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs">
              {sample.sevenDayKickstart.slice(0, 4).map((d) => (
                <div key={d.day} className="bg-white p-2.5 rounded-lg border border-slate-200">
                  <div className="font-semibold text-slate-900">
                    Day {d.day}: {d.title}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">
                    {d.description}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Month Navigator */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Month-by-Month Plan (Months 1–12)
              </h3>
              <span className="text-xs text-slate-500">Select month to preview</span>
            </div>

            <div className="flex flex-wrap gap-1.5 pb-2">
              {sample.months.map((m) => (
                <button
                  key={m.monthNumber}
                  onClick={() => setSelectedMonth(m.monthNumber)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                    selectedMonth === m.monthNumber
                      ? 'bg-teal-600 text-white font-bold'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Month {m.monthNumber}
                </button>
              ))}
            </div>

            {/* Selected Month Detail */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-4 mt-2">
              <div>
                <h4 className="text-base font-bold text-slate-900 font-['Space_Grotesk']">
                  Month {currentMonthData.monthNumber}: {currentMonthData.monthTitle}
                </h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  <span className="font-semibold text-slate-700">Objective: </span>
                  {currentMonthData.objective}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200/70">
                  <span className="font-bold text-amber-900 block mb-0.5">Academic & Exam Prep</span>
                  <p className="text-amber-950/80">{currentMonthData.academicAndExamPrep}</p>
                </div>
                <div className="p-3 rounded-xl bg-teal-50/60 border border-teal-200/70">
                  <span className="font-bold text-teal-900 block mb-0.5">Skill & Career Action</span>
                  <p className="text-teal-950/80">{currentMonthData.careerAndSkills}</p>
                </div>
              </div>

              <div className="space-y-1.5 pt-1">
                <span className="text-xs font-semibold text-slate-800 block">Sample Key Tasks:</span>
                {currentMonthData.tasks.map((t) => (
                  <div
                    key={t.id}
                    className="flex items-start gap-2 p-2 rounded-lg bg-slate-50 border border-slate-100 text-xs text-slate-700"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 mt-0.5 shrink-0" />
                    <div>
                      <span className="font-semibold text-slate-900">{t.title}</span>
                      <p className="text-slate-500 text-[11px] mt-0.5">{t.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-500">
            Ready to generate your own personalized roadmap?
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-200 rounded-xl"
            >
              Close Preview
            </button>
            <button
              onClick={() => {
                onClose();
                onCreateOwn();
              }}
              className="px-5 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-xs flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Create My Personalized Roadmap</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
