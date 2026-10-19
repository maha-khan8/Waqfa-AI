import React, { useState } from 'react';
import {
  BookOpen,
  Calendar,
  ShieldCheck,
  Award,
  Heart,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  HelpCircle,
  Clock,
  Compass,
} from 'lucide-react';

export const GapYearGuideView: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const FAQS = [
    {
      question: 'How do I handle the societal pressure of taking a gap year?',
      answer:
        'Taking a gap year is often misunderstood as delay rather than strategic preparation. Reframe your message with clarity: "I am completing targeted preparation for entrance exams while building real technical skills through Harvard CS50 and DigiSkills." When you have a structured daily schedule, a portfolio, and measurable weekly progress, your confidence will speak for itself.',
    },
    {
      question: 'How do NUST NET Series 1, 2, 3, and 4 work?',
      answer:
        'NUST conducts 4 computer-based test series annually in Islamabad (and paper-based in Karachi/Quetta): Series 1 (Dec-Jan), Series 2 (Feb-Mar), Series 3 (Apr-May), and Series 4 (Jun-Jul). NUST considers your single highest score among all attempted series for merit calculation! Taking at least two series (e.g. Series 2 and Series 3 or 4) gives you an enormous tactical advantage to experience test conditions and adjust your preparation.',
    },
    {
      question: 'What is the Intermediate Board Improvement Exam Policy (2nd Annual)?',
      answer:
        'Most Intermediate Boards (such as FBISE, BISE Lahore, Rawalpindi, Karachi, etc.) allow students up to 4 chances within 3 years to appear for subject improvement or full part-1/part-2 improvement in 1st Annual or 2nd Annual exams. Your previous marks are protected — if your new marks are lower, the board retains your higher previous score on your marks sheet.',
    },
    {
      question: 'How should MDCAT Repeaters prevent burnout and test anxiety?',
      answer:
        'Repeating MDCAT is mentally challenging because competition is fierce. The top two mistakes repeaters make are: 1) passively reading the same textbooks line by line without active recall, and 2) isolating themselves completely. Balance your day: spend 4 hours in the morning on high-yield biology/chemistry error logs, 2 hours on past papers, and dedicate the afternoon to learning Python/Data or volunteering. Having a secondary skill protects your mental health.',
    },
    {
      question: 'What is the IBCC Equivalence procedure for A-Level students?',
      answer:
        'Students with Cambridge or Edexcel O and A Levels must obtain Equivalence Certificates from the Inter Board Coordination Commission (IBCC). You will need your original Statement of Results, verified Cambridge certificates, and CNIC/B-Form. Engineering universities require 3 full A-Level subjects (Physics, Maths, Chemistry/CS), and medical universities require Biology, Chemistry, and Physics/Maths.',
    },
    {
      question: 'Are free resources really sufficient to build university-level skills?',
      answer:
        'Yes, 100%. The global standard for introductory computer science is Harvard CS50x (completely free on edX/YouTube). The Government of Pakistan offers free training via DigiSkills.pk with verified certificates. Platforms like freeCodeCamp, Kaggle Micro-Courses, and MIT OpenCourseWare provide world-class education without requiring expensive academy fees.',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Light Clean Header */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 shadow-xs border border-slate-200">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider bg-teal-100 text-teal-800 border border-teal-200 rounded-md">
            Student Strategy Playbook
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 font-['Space_Grotesk']">
          Gap Year Navigation & Test Guide
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-3xl leading-relaxed">
          Proven strategies for entrance examinations (NET, MDCAT, FAST, LUMS, ECAT), board
          improvement policies, mental wellbeing, and transforming uncertainty into purposeful
          confidence.
        </p>
      </div>

      {/* Strategic Pillars in Light Styling */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2.5">
          <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
            <Calendar className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 font-['Space_Grotesk']">
            Master Multi-Series Testing
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Pakistani tests are not one-shot anymore. NUST NET offers 4 series, FAST accepts both its
            NU test and SAT scores, and several universities have Spring and Fall intakes. Plan your
            roadmap around multiple attempts rather than placing all pressure on a single day.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
            <Award className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 font-['Space_Grotesk']">
            Build Real "Proof of Work"
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            University interviews at LUMS, GIKI, IBA, and top software companies look for what you
            built with your time. Having a public GitHub profile or a community project proves
            self-direction, curiosity, and initiative.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2.5">
          <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center font-bold">
            <Heart className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 font-['Space_Grotesk']">
            Protect Your Mental Sanity
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Studying in isolation leads to burnout. Maintain a consistent 7-hour sleep schedule,
            exercise 30 minutes every evening, and remember that one year is a small fraction of your
            career. A thoughtful pause now saves decades of mismatched choices.
          </p>
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-5">
        <div>
          <h2 className="text-lg font-bold text-slate-900 font-['Space_Grotesk']">
            Frequently Asked Questions by Gap-Year Students
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Key insights on entrance tests, board improvement rules, and study habits.
          </p>
        </div>

        <div className="divide-y divide-slate-100">
          {FAQS.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div key={index} className="py-3.5">
                <button
                  type="button"
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between text-left gap-4 group"
                >
                  <span className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                    {faq.question}
                  </span>
                  <span className="text-slate-400 group-hover:text-teal-600 shrink-0">
                    {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </span>
                </button>
                {isOpen && (
                  <p className="mt-2.5 text-xs text-slate-600 leading-relaxed font-normal bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                    {faq.answer}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Official Verification Advisory */}
      <div className="p-4 rounded-xl bg-teal-50 border border-teal-200 text-xs text-teal-950 flex items-start gap-2.5">
        <ShieldCheck className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Official Verification Advisory: </span>
          Waqfa AI encourages every student to verify entrance test dates, fees, and eligibility
          criteria on official institution portals (e.g., nust.edu.pk, admissions.fast.nu,
          lums.edu.pk, uhs.edu.pk, and your respective BISE board).
        </div>
      </div>
    </div>
  );
};
