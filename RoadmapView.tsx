import React, { useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  Circle,
  Clock,
  Sparkles,
  BookOpen,
  Briefcase,
  Award,
  Layers,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Printer,
  Download,
  AlertCircle,
  ArrowRight,
  Filter,
  CheckSquare,
  Search,
  Compass,
} from 'lucide-react';
import { GeneratedRoadmap } from '../types';

interface RoadmapViewProps {
  roadmap: GeneratedRoadmap | null;
  onRegenerate: () => void;
  onEditBlueprint: () => void;
  onToggleTask: (monthNumber: number, taskId: string) => void;
  onToggleKickstart: (dayNumber: number) => void;
  onLoadSampleRoadmap?: () => void;
  isGenerating?: boolean;
}

export const RoadmapView: React.FC<RoadmapViewProps> = ({
  roadmap,
  onRegenerate,
  onEditBlueprint,
  onToggleTask,
  onToggleKickstart,
  onLoadSampleRoadmap,
  isGenerating,
}) => {
  const [selectedQuarter, setSelectedQuarter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedMonths, setExpandedMonths] = useState<Record<number, boolean>>({
    1: true,
    2: true,
  });

  if (!roadmap) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center mx-auto shadow-xs">
          <Compass className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-slate-900 font-['Space_Grotesk']">
            Your Personalized Gap Year Roadmap Awaits
          </h2>
          <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
            Fill in your Student Blueprint with your qualification, target universities, and study
            hours. Waqfa AI will use Gemini AI to architect your custom 12-month timeline.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={onEditBlueprint}
            className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-xs flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Start My Blueprint</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          {onLoadSampleRoadmap && (
            <button
              onClick={onLoadSampleRoadmap}
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-medium text-sm transition-colors"
            >
              Preview An Example Roadmap
            </button>
          )}
        </div>
      </div>
    );
  }

  const toggleMonthExpand = (monthNumber: number) => {
    setExpandedMonths((prev) => ({
      ...prev,
      [monthNumber]: !prev[monthNumber],
    }));
  };

  const expandAll = () => {
    const allExpanded: Record<number, boolean> = {};
    roadmap.months.forEach((m) => {
      allExpanded[m.monthNumber] = true;
    });
    setExpandedMonths(allExpanded);
  };

  const collapseAll = () => {
    setExpandedMonths({});
  };

  // Filter months based on quarter
  const filteredMonths = roadmap.months.filter((month) => {
    if (selectedQuarter === 'q1' && (month.monthNumber < 1 || month.monthNumber > 3)) return false;
    if (selectedQuarter === 'q2' && (month.monthNumber < 4 || month.monthNumber > 6)) return false;
    if (selectedQuarter === 'q3' && (month.monthNumber < 7 || month.monthNumber > 9)) return false;
    if (selectedQuarter === 'q4' && (month.monthNumber < 10 || month.monthNumber > 12)) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchesTitle = month.monthTitle.toLowerCase().includes(q);
      const matchesObj = month.objective.toLowerCase().includes(q);
      const matchesExam = month.academicAndExamPrep.toLowerCase().includes(q);
      const matchesTask = month.tasks.some(
        (t) => t.title.toLowerCase().includes(q) || t.detail.toLowerCase().includes(q)
      );
      if (!matchesTitle && !matchesObj && !matchesExam && !matchesTask) return false;
    }

    return true;
  });

  // Calculate overall task progress
  const allTasks = roadmap.months.flatMap((m) => m.tasks);
  const completedTasks = allTasks.filter((t) => t.completed).length;
  const progressPercent = allTasks.length > 0 ? Math.round((completedTasks / allTasks.length) * 100) : 0;

  // Kickstart progress
  const completedDays = roadmap.sevenDayKickstart.filter((d) => d.completed).length;
  const kickstartPercent = Math.round((completedDays / 7) * 100);

  const handlePrint = () => {
    window.print();
  };

  const handleExportMarkdown = () => {
    let md = `# Waqfa AI Gap Year Roadmap for ${roadmap.studentName || 'Student'}\n\n`;
    md += `*Generated: ${new Date(roadmap.generatedAt).toLocaleDateString()}*\n\n`;
    md += `## Executive Strategy\n${roadmap.executiveSummary}\n\n`;
    md += `## Weekly Rhythm\n${roadmap.weeklyPacingStrategy}\n\n`;
    md += `## 7-Day Kickstart Plan\n`;
    roadmap.sevenDayKickstart.forEach((k) => {
      md += `- [${k.completed ? 'x' : ' '}] **Day ${k.day}: ${k.title}** (${k.timeNeeded})\n  ${k.description}\n  *Deliverable:* ${k.output}\n\n`;
    });
    md += `## 12-Month Detailed Timeline\n`;
    roadmap.months.forEach((m) => {
      md += `### Month ${m.monthNumber}: ${m.monthTitle}\n`;
      md += `**Objective:** ${m.objective}\n`;
      md += `**Pace:** ${m.workloadHoursPerWeek}\n`;
      md += `**Academic & Exam Prep:** ${m.academicAndExamPrep}\n`;
      md += `**Skills & Career:** ${m.careerAndSkills}\n`;
      md += `**Practical Project:** ${m.projectOrExtracurricular}\n`;
      md += `**Milestone:** ${m.milestone}\n`;
      md += `**Key Tasks:**\n`;
      m.tasks.forEach((t) => {
        md += `- [${t.completed ? 'x' : ' '}] [${t.category}] ${t.title}: ${t.detail}\n`;
      });
      md += `\n`;
    });
    md += `\n---\n*Disclaimer: ${roadmap.disclaimerNotice}*\n`;

    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Waqfa-AI-Roadmap-${(roadmap.studentName || 'Plan').replace(/\s+/g, '_')}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner: Light, Crisp Modern Styling */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 shadow-xs border border-slate-200">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider bg-teal-100 text-teal-800 border border-teal-200 rounded-md">
                Personalized AI Roadmap
              </span>
              <span className="text-xs text-slate-500">
                Generated {new Date(roadmap.generatedAt).toLocaleDateString()}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 font-['Space_Grotesk']">
              {roadmap.studentName ? `${roadmap.studentName}'s Gap Year Roadmap` : 'Your 12-Month Purposeful Plan'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-3xl leading-relaxed">
              {roadmap.executiveSummary}
            </p>
          </div>

          <div className="flex flex-wrap lg:flex-col gap-2 shrink-0">
            <button
              onClick={onEditBlueprint}
              className="px-3.5 py-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors"
            >
              Edit Student Blueprint
            </button>
            <button
              onClick={onRegenerate}
              disabled={isGenerating}
              className="px-3.5 py-2 text-xs font-semibold bg-teal-600 hover:bg-teal-700 text-white rounded-xl flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
              <span>{isGenerating ? 'Regenerating...' : 'Regenerate Plan'}</span>
            </button>
            <div className="flex gap-2">
              <button
                onClick={handlePrint}
                className="px-3 py-1.5 text-xs font-medium bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg flex items-center gap-1"
                title="Print your roadmap"
              >
                <Printer className="w-3.5 h-3.5 text-slate-500" />
                <span>Print</span>
              </button>
              <button
                onClick={handleExportMarkdown}
                className="px-3 py-1.5 text-xs font-medium bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg flex items-center gap-1"
                title="Export as Markdown"
              >
                <Download className="w-3.5 h-3.5 text-slate-500" />
                <span>Export (.md)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Pacing & Progress Metrics in Light Tones */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-5">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block mb-1">
              Weekly Pacing Strategy
            </span>
            <p className="text-xs text-slate-700 leading-snug font-medium">
              {roadmap.weeklyPacingStrategy}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                7-Day Kickstart
              </span>
              <span className="text-xs font-semibold text-teal-700">
                {completedDays}/7 Days ({kickstartPercent}%)
              </span>
            </div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-teal-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${kickstartPercent}%` }}
              />
            </div>
            <span className="text-[11px] text-slate-500 mt-1.5 block">
              {kickstartPercent === 100
                ? 'Kickstart completed! You have built your foundation.'
                : 'Complete first 7 days to overcome inertia.'}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                Tasks Completed
              </span>
              <span className="text-xs font-semibold text-teal-700">
                {completedTasks}/{allTasks.length} ({progressPercent}%)
              </span>
            </div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-teal-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-[11px] text-slate-500 mt-1.5 block">
              Check tasks as you conquer them throughout your year.
            </span>
          </div>
        </div>
      </div>

      {/* 7-DAY KICKSTART SECTION */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 shadow-xs border border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-600" />
              <h2 className="text-lg font-bold text-slate-900 font-['Space_Grotesk']">
                Day 1 to 7: Immediate Kickstart Protocol
              </h2>
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              The first 7 days are about momentum, clarity, and building your study sanctuary.
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full self-start">
            {completedDays} of 7 Completed
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {roadmap.sevenDayKickstart.map((day) => {
            const isDone = !!day.completed;
            return (
              <div
                key={day.day}
                onClick={() => onToggleKickstart(day.day)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer select-none flex flex-col justify-between ${
                  isDone
                    ? 'bg-teal-50/60 border-teal-200'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded ${
                        isDone ? 'bg-teal-200 text-teal-900' : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      Day {day.day}
                    </span>
                    <button
                      type="button"
                      className="text-slate-400 hover:text-teal-600 transition-colors"
                    >
                      {isDone ? (
                        <CheckCircle2 className="w-4 h-4 text-teal-600" />
                      ) : (
                        <Circle className="w-4 h-4 text-slate-300" />
                      )}
                    </button>
                  </div>
                  <h3
                    className={`text-xs font-semibold mb-1 ${
                      isDone ? 'text-teal-950 line-through opacity-80' : 'text-slate-900'
                    }`}
                  >
                    {day.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-3">
                    {day.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 text-[11px] space-y-0.5">
                  <div className="flex items-center gap-1 text-slate-500">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>{day.timeNeeded}</span>
                  </div>
                  <div className="text-slate-700 font-medium truncate" title={day.output}>
                    <span className="text-slate-400">Output: </span>
                    {day.output}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* FILTER & SEARCH CONTROLS */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 rounded-xl bg-white border border-slate-200">
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5" /> View:
          </span>
          {[
            { id: 'all', label: 'All 12 Months' },
            { id: 'q1', label: 'Q1 (M1-3)' },
            { id: 'q2', label: 'Q2 (M4-6)' },
            { id: 'q3', label: 'Q3 (M7-9)' },
            { id: 'q4', label: 'Q4 (M10-12)' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedQuarter(tab.id)}
              className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors ${
                selectedQuarter === tab.id
                  ? 'bg-slate-900 text-white font-semibold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-60">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tasks, exams, topics..."
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-teal-500 bg-white"
            />
          </div>

          <div className="flex gap-1 shrink-0">
            <button
              onClick={expandAll}
              className="px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Expand All
            </button>
            <button
              onClick={collapseAll}
              className="px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Collapse
            </button>
          </div>
        </div>
      </div>

      {/* MONTHLY ROADMAP TIMELINE */}
      <div className="space-y-5">
        {filteredMonths.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
            <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <h3 className="text-base font-semibold text-slate-800">No matching months found</h3>
            <p className="text-xs text-slate-500 mt-1">Try clearing your search query or filters.</p>
            <button
              onClick={() => {
                setSelectedQuarter('all');
                setSearchQuery('');
              }}
              className="mt-3 px-3 py-1.5 text-xs font-medium bg-slate-900 text-white rounded-lg"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredMonths.map((month) => {
            const isExpanded = !!expandedMonths[month.monthNumber];
            const monthTasks = month.tasks || [];
            const doneTasks = monthTasks.filter((t) => t.completed).length;
            const monthProgress =
              monthTasks.length > 0 ? Math.round((doneTasks / monthTasks.length) * 100) : 0;

            return (
              <div
                key={month.monthNumber}
                className="roadmap-card bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden transition-all"
              >
                {/* Month Card Header in Light Crisp Tones */}
                <div
                  onClick={() => toggleMonthExpand(month.monthNumber)}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer hover:bg-slate-50/70 border-b border-slate-100"
                >
                  <div className="flex items-start sm:items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-800 border border-teal-200 font-bold flex flex-col items-center justify-center shrink-0">
                      <span className="text-[9px] uppercase tracking-wider text-teal-600 font-semibold">M</span>
                      <span className="text-base leading-none font-['Space_Grotesk']">
                        {month.monthNumber}
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-base font-bold text-slate-900 font-['Space_Grotesk']">
                          {month.monthTitle}
                        </h2>
                        <span className="text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium hidden sm:inline-block">
                          {month.workloadHoursPerWeek}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5 max-w-2xl font-medium">
                        Objective: {month.objective}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                    <div className="text-right">
                      <div className="text-xs font-semibold text-slate-700">
                        {doneTasks}/{monthTasks.length} Tasks
                      </div>
                      <div className="w-20 bg-slate-200 h-1.5 rounded-full mt-1 overflow-hidden">
                        <div
                          className="bg-teal-600 h-full rounded-full transition-all"
                          style={{ width: `${monthProgress}%` }}
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                    >
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Collapsible Content */}
                {isExpanded && (
                  <div className="p-4 sm:p-5 space-y-5">
                    {/* 4 Pillars of the Month */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2.5">
                      {/* Academic Pillar */}
                      <div className="p-3 rounded-xl bg-amber-50/50 border border-amber-200/70 text-xs">
                        <div className="flex items-center gap-1.5 font-bold text-amber-900 mb-1">
                          <BookOpen className="w-3.5 h-3.5 text-amber-600" />
                          <span>Academic & Exam Focus</span>
                        </div>
                        <p className="text-amber-950/80 leading-relaxed">
                          {month.academicAndExamPrep}
                        </p>
                      </div>

                      {/* Career & Skills Pillar */}
                      <div className="p-3 rounded-xl bg-teal-50/50 border border-teal-200/70 text-xs">
                        <div className="flex items-center gap-1.5 font-bold text-teal-900 mb-1">
                          <Briefcase className="w-3.5 h-3.5 text-teal-600" />
                          <span>Career & Skill Building</span>
                        </div>
                        <p className="text-teal-950/80 leading-relaxed">
                          {month.careerAndSkills}
                        </p>
                      </div>

                      {/* Practical Project Pillar */}
                      <div className="p-3 rounded-xl bg-indigo-50/50 border border-indigo-200/70 text-xs">
                        <div className="flex items-center gap-1.5 font-bold text-indigo-900 mb-1">
                          <Layers className="w-3.5 h-3.5 text-indigo-600" />
                          <span>Project / Extracurricular</span>
                        </div>
                        <p className="text-indigo-950/80 leading-relaxed">
                          {month.projectOrExtracurricular}
                        </p>
                      </div>

                      {/* Measurable Milestone */}
                      <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200/70 text-xs">
                        <div className="flex items-center gap-1.5 font-bold text-emerald-900 mb-1">
                          <Award className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Month-End Milestone</span>
                        </div>
                        <p className="text-emerald-950/80 leading-relaxed font-medium">
                          {month.milestone}
                        </p>
                      </div>
                    </div>

                    {/* Actionable Checkable Tasks */}
                    <div>
                      <div className="flex items-center justify-between mb-2.5">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                          <CheckSquare className="w-3.5 h-3.5 text-teal-600" />
                          Actionable Tasks for Month {month.monthNumber}
                        </h4>
                        <span className="text-[11px] text-slate-400">
                          Click checkbox to mark done
                        </span>
                      </div>

                      <div className="space-y-2">
                        {monthTasks.map((task) => {
                          const isTaskDone = !!task.completed;
                          return (
                            <div
                              key={task.id}
                              onClick={() => onToggleTask(month.monthNumber, task.id)}
                              className={`p-3 rounded-xl border transition-all cursor-pointer select-none flex items-start gap-2.5 ${
                                isTaskDone
                                  ? 'bg-slate-50 border-slate-200 text-slate-400'
                                  : 'bg-white border-slate-200 hover:border-slate-300 text-slate-800'
                              }`}
                            >
                              <button
                                type="button"
                                className="mt-0.5 shrink-0 text-slate-400 hover:text-teal-600"
                              >
                                {isTaskDone ? (
                                  <CheckCircle2 className="w-4 h-4 text-teal-600" />
                                ) : (
                                  <Circle className="w-4 h-4 text-slate-300" />
                                )}
                              </button>

                              <div className="flex-1">
                                <div className="flex flex-wrap items-center gap-2 mb-0.5">
                                  <span
                                    className={`text-xs font-semibold ${
                                      isTaskDone ? 'line-through text-slate-500' : 'text-slate-900'
                                    }`}
                                  >
                                    {task.title}
                                  </span>
                                  <span
                                    className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                                      task.category.includes('Academic')
                                        ? 'bg-amber-100 text-amber-800'
                                        : task.category.includes('Skill')
                                        ? 'bg-teal-100 text-teal-800'
                                        : task.category.includes('Project')
                                        ? 'bg-indigo-100 text-indigo-800'
                                        : 'bg-slate-100 text-slate-700'
                                    }`}
                                  >
                                    {task.category}
                                  </span>
                                </div>
                                <p
                                  className={`text-xs leading-relaxed ${
                                    isTaskDone ? 'text-slate-400 line-through' : 'text-slate-600'
                                  }`}
                                >
                                  {task.detail}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Responsible Planning Notice in Light Tones */}
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 text-xs flex items-start gap-2.5">
        <AlertCircle className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-slate-800">Responsible Planning Notice: </span>
          {roadmap.disclaimerNotice ||
            'Waqfa AI provides structural gap-year planning. Admissions criteria, test schedules, and merit formulas vary across universities and change annually. Always verify official notifications on institution portals (e.g. nust.edu.pk, pmc.gov.pk, uet.edu.pk).'}
        </div>
      </div>
    </div>
  );
};
