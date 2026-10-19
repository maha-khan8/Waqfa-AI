import React, { useState } from 'react';
import {
  Sparkles,
  BookOpen,
  Laptop,
  Briefcase,
  Layers,
  Clock,
  ExternalLink,
  CheckCircle2,
  Bookmark,
  BookmarkCheck,
  Search,
  Filter,
  ShieldCheck,
  Award,
  ArrowRight,
} from 'lucide-react';
import { SkillRecommendation } from '../types';

interface SkillsBuilderViewProps {
  skills?: SkillRecommendation[];
  studentName?: string;
  targetField?: string;
  onNavigateToBlueprint?: () => void;
}

export const SkillsBuilderView: React.FC<SkillsBuilderViewProps> = ({
  skills = [],
  studentName,
  targetField,
  onNavigateToBlueprint,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [bookmarkedSkills, setBookmarkedSkills] = useState<Record<string, boolean>>({});
  const [copiedSkill, setCopiedSkill] = useState<string | null>(null);

  const toggleBookmark = (skillName: string) => {
    setBookmarkedSkills((prev) => ({
      ...prev,
      [skillName]: !prev[skillName],
    }));
  };

  const handleCopyProject = (skill: SkillRecommendation) => {
    const text = `Waqfa AI Project Brief: ${skill.skill}\nMini-Project: ${skill.achievableMiniProject}\nStarting Point: ${skill.beginnerStartingPoint}\nResource: ${skill.freeOrAffordableResource}\nTime: ${skill.estimatedTimeCommitment}`;
    navigator.clipboard.writeText(text);
    setCopiedSkill(skill.skill);
    setTimeout(() => setCopiedSkill(null), 2000);
  };

  const filteredSkills = skills.filter((item) => {
    if (selectedCategory === 'all') return true;
    return item.category.toLowerCase().includes(selectedCategory.toLowerCase());
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Light Header */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 shadow-xs border border-slate-200">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider bg-teal-100 text-teal-800 border border-teal-200 rounded-md">
            Portfolio & Skill Accelerator
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 font-['Space_Grotesk']">
          High-Yield Skills & Mini-Projects
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-3xl leading-relaxed">
          {targetField
            ? `Tailored to your target degree (${targetField}). Instead of only studying theory, build tangible proof of work that differentiates your profile for university admissions and internships.`
            : 'Explore practical skills and beginner projects to build a tangible portfolio before university begins.'}
        </p>

        {/* Free Resource Integrity Tag */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-3 text-xs text-slate-600">
          <div className="flex items-center gap-1.5 text-teal-700 font-medium">
            <ShieldCheck className="w-4 h-4 text-teal-600" />
            <span>Curated with verified free & accessible resources</span>
          </div>
          <div className="text-slate-400">
            (DigiSkills.pk, freeCodeCamp, Harvard CS50, Coursera Financial Aid, Kaggle)
          </div>
        </div>
      </div>

      {/* Category Filter Tabs */}
      {skills.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 p-2 bg-white rounded-xl border border-slate-200">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-2.5 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Filter:
          </span>
          {[
            { id: 'all', label: 'All Opportunities' },
            { id: 'technical', label: 'Technical & Coding' },
            { id: 'academic', label: 'Academic & Tests' },
            { id: 'professional', label: 'Professional & Freelance' },
            { id: 'extracurricular', label: 'Extracurricular & Impact' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedCategory(tab.id)}
              className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
                selectedCategory === tab.id
                  ? 'bg-slate-900 text-white font-semibold'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* Skills Recommendations Grid */}
      {skills.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-4">
          <Sparkles className="w-10 h-10 text-teal-600 mx-auto" />
          <div className="max-w-md mx-auto space-y-1">
            <h3 className="text-base font-bold text-slate-900">
              Personalized Skills Generate with Your Roadmap
            </h3>
            <p className="text-xs text-slate-500">
              Once you submit your Student Blueprint, Waqfa AI will recommend 4–5 specific skills,
              beginner entry points, mini-projects, and free resources tailored to your intended
              degree.
            </p>
          </div>
          {onNavigateToBlueprint && (
            <button
              onClick={onNavigateToBlueprint}
              className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs shadow-xs inline-flex items-center gap-1.5"
            >
              <span>Create Student Blueprint</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredSkills.map((item, idx) => {
            const isSaved = !!bookmarkedSkills[item.skill];
            const isJustCopied = copiedSkill === item.skill;

            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all p-5 flex flex-col justify-between space-y-4"
              >
                <div>
                  {/* Header & Category */}
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <span className="px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider bg-teal-50 text-teal-800 border border-teal-200 rounded-md">
                      {item.category}
                    </span>
                    <button
                      onClick={() => toggleBookmark(item.skill)}
                      className="p-1 text-slate-400 hover:text-teal-600 rounded-lg hover:bg-slate-100 transition-colors"
                      title={isSaved ? 'Remove bookmark' : 'Bookmark this skill'}
                    >
                      {isSaved ? (
                        <BookmarkCheck className="w-4 h-4 text-teal-600" />
                      ) : (
                        <Bookmark className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 font-['Space_Grotesk'] mb-2">
                    {item.skill}
                  </h3>

                  {/* Relevance explanation */}
                  <div className="text-xs text-slate-600 leading-relaxed mb-3">
                    <span className="font-semibold text-slate-800 block mb-0.5">
                      Why this matters for your path:
                    </span>
                    {item.relevance}
                  </div>

                  {/* Beginner Starting Point */}
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs mb-2.5">
                    <div className="flex items-center gap-1.5 font-bold text-slate-800 mb-0.5">
                      <BookOpen className="w-3.5 h-3.5 text-teal-600" />
                      <span>Beginner Starting Point</span>
                    </div>
                    <p className="text-slate-600 leading-relaxed text-[11px]">
                      {item.beginnerStartingPoint}
                    </p>
                  </div>

                  {/* Achievable Mini-Project */}
                  <div className="p-2.5 rounded-xl bg-indigo-50/50 border border-indigo-100 text-xs mb-2.5">
                    <div className="flex items-center gap-1.5 font-bold text-indigo-900 mb-0.5">
                      <Layers className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Mini-Project for Portfolio</span>
                    </div>
                    <p className="text-indigo-950/80 leading-relaxed text-[11px]">
                      {item.achievableMiniProject}
                    </p>
                  </div>

                  {/* Resource suggestion */}
                  <div className="text-xs space-y-1 pt-1">
                    <div className="flex items-center justify-between text-slate-500 text-[11px]">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {item.estimatedTimeCommitment}
                      </span>
                      <span className="text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded">
                        Free / Low-Cost
                      </span>
                    </div>
                    <div className="text-slate-700 font-medium pt-0.5 text-xs">
                      <span className="text-slate-400">Resource: </span>
                      {item.freeOrAffordableResource}
                    </div>
                    {item.verifiedNote && (
                      <p className="text-[11px] text-teal-700 italic">{item.verifiedNote}</p>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleCopyProject(item)}
                    className="px-2.5 py-1 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
                  >
                    {isJustCopied ? 'Copied Brief!' : 'Copy Brief'}
                  </button>

                  <button
                    onClick={() => toggleBookmark(item.skill)}
                    className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                      isSaved
                        ? 'bg-teal-600 text-white font-bold'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {isSaved ? 'In My Focus' : 'Add to Focus'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
