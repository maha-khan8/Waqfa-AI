import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type, ThinkingLevel } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '5mb' }));

// Initialize Google GenAI client
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

if (apiKey) {
  aiClient = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health and Config Status API
app.get('/api/status', (req, res) => {
  res.json({
    hasApiKey: !!process.env.GEMINI_API_KEY,
    model: 'gemini-3.8-flash',
    status: 'ready',
    timestamp: new Date().toISOString(),
  });
});

// AI Roadmap Generation API
app.post('/api/roadmap/generate', async (req, res) => {
  console.log('[API] Received generate request for profile:', req.body?.name || 'Anonymous');
  try {
    const profile = req.body;

    if (!profile) {
      console.log('[API] Error: Missing profile data');
      return res.status(400).json({ error: 'Profile data is required' });
    }

    if (!process.env.GEMINI_API_KEY || !aiClient) {
      console.log('[API] Error: Missing GEMINI_API_KEY');
      return res.status(503).json({
        error: 'Gemini API key is not configured. Please ensure GEMINI_API_KEY is available in your AI Studio secrets.',
        missingKey: true,
      });
    }

    console.log('[API] Calling Gemini generateContent...');

    const prompt = `
You are the lead educational architect behind "Waqfa AI" (tagline: "Pause, but with purpose"), an AI-powered gap-year planner specifically tailored for students in Pakistan who have completed Intermediate (FSc Pre-Medical, FSc Pre-Engineering, ICS, I.Com, FA) or A-Levels and are taking a gap year.

Analyze this student's profile and generate a comprehensive, empowering, realistic, and highly customized 12-month gap year plan:

=== STUDENT PROFILE ===
- Preferred Name: ${profile.name || 'Student'}
- Academic Background: ${profile.qualification || 'Intermediate / A-Levels'}
- Subjects Studied: ${profile.subjects || 'General science / pre-university'}
- Prior Academic Scores / Grades: ${profile.grades || 'Not specified / awaiting'}
- Intended Degree / Career Field: ${profile.targetField || 'Exploring options'}
- Target Universities & Entrance Exams: ${profile.targetUniversitiesExams || 'Pakistani universities (e.g., NUST NET, MDCAT, FAST, LUMS, ECAT, GIKI, IBA)'}
- Primary Reason for Gap Year: ${profile.gapYearReason || 'Improve scores & develop career skills'}
- Available Hours Per Week: ${profile.availableHoursPerWeek || '20-25 hours'}
- Budget & Resource Constraints: ${profile.budgetConstraints || 'Free or low-cost learning resources'}
- Personal Interests & Hobbies: ${profile.interests || 'Technology, reading, community'}
- Main Gap Year Goals: ${profile.goals || 'Ace university entrance exams, build real practical skills, gain confidence'}
- Preferred Learning Style: ${profile.learningStyle || 'Hands-on projects and structured self-study'}
=======================

CONTEXT GUIDELINES (PAKISTAN SPECIFIC):
1. Entrance Exams: Acknowledge Pakistani testing cycles (NUST NET has 4 series: Dec/Jan, Feb/Mar, Apr/May, Jun/Jul; MDCAT in Aug/Sep; FAST tests in July; ECAT in spring/summer; LUMS LCAT/SAT; IBA tests).
2. Academic Improvement: If student wants to improve FSc/Matric marks via BISE 2nd Annual or improvement exams, or retake A-Levels, allocate structured revision without burnout.
3. Realistic Workload: Strictly respect the student's available hours per week (${profile.availableHoursPerWeek || '20-25 hours'}).
4. Skills & Projects: Recommend high-value practical skills (Python, Web Dev, UI/UX, Data, Content, AI Tools) using credible free resources (DigiSkills.pk, freeCodeCamp, CS50, Coursera Financial Aid, YouTube, Khan Academy).
5. 7-Day Kickstart: Provide an immediate, inspiring step-by-step roadmap for Days 1-7 (1-2 sentences per day).
6. Months 1 to 12: Provide 12 focused monthly milestones. For each month, include 2-3 actionable, high-impact tasks. Keep task details concise (1 sentence each).
7. Recommendations: Include 4-5 tailored skill recommendations with free Pakistani/global learning resources.
8. Tone: Empathetic, ambitious yet grounded, reassuring against societal stigma of gap years, and emphasizing purpose.
9. Format: Be concise and punchy in all text fields (1-2 clear sentences each) to keep the roadmap crisp, scan-friendly, and actionable.

Return the plan formatted strictly in the specified JSON schema.
`;

    const CANDIDATE_MODELS = ['gemini-3.5-flash', 'gemini-3.8-flash', 'gemini-3.7-flash'];
    let responseText: string | null = null;
    let lastError: any = null;

    for (const modelName of CANDIDATE_MODELS) {
      try {
        console.log(`[API] Attempting roadmap generation with model: ${modelName}`);
        const modelConfig: any = {
          systemInstruction:
            'You are an expert Pakistani academic mentor and gap-year strategist. Always produce thorough, actionable, structured JSON output respecting the exact JSON schema provided.',
          responseMimeType: 'application/json',
          responseSchema: {
              type: Type.OBJECT,
              properties: {
                executiveSummary: {
                  type: Type.STRING,
                  description: 'A thoughtful, personalized summary of the student strategy, addressing their specific field, qualification, and constraints.',
                },
                weeklyPacingStrategy: {
                  type: Type.STRING,
                  description: 'How to distribute their weekly hours across exam prep, skills, projects, and personal rest.',
                },
                sevenDayKickstart: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      day: { type: Type.INTEGER, description: 'Day number 1 to 7' },
                      title: { type: Type.STRING, description: 'Short action title' },
                      description: { type: Type.STRING, description: 'Concrete action to take today' },
                      timeNeeded: { type: Type.STRING, description: 'Estimated time, e.g. 1.5 hours' },
                      output: { type: Type.STRING, description: 'Tangible deliverable of the day' },
                    },
                    required: ['day', 'title', 'description', 'timeNeeded', 'output'],
                  },
                },
                months: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      monthNumber: { type: Type.INTEGER, description: 'Month index 1 to 12' },
                      monthTitle: { type: Type.STRING, description: 'Theme/title for the month' },
                      objective: { type: Type.STRING, description: 'Core objective of this month' },
                      workloadHoursPerWeek: { type: Type.STRING, description: 'Paced hours per week' },
                      academicAndExamPrep: {
                        type: Type.STRING,
                        description: 'Targeted entrance exam / syllabus revision focus for this month',
                      },
                      careerAndSkills: {
                        type: Type.STRING,
                        description: 'Specific skill development or career discovery focus',
                      },
                      projectOrExtracurricular: {
                        type: Type.STRING,
                        description: 'Hands-on mini project, volunteering, or community work',
                      },
                      milestone: {
                        type: Type.STRING,
                        description: 'Concrete measurable milestone to celebrate at month end',
                      },
                      tasks: {
                        type: Type.ARRAY,
                        items: {
                          type: Type.OBJECT,
                          properties: {
                            id: { type: Type.STRING, description: 'Unique task identifier like m1-t1' },
                            title: { type: Type.STRING, description: 'Actionable task title' },
                            category: {
                              type: Type.STRING,
                              description: 'One of: Academic/Exam, Skill Building, Practical Project, University Application, Wellbeing',
                            },
                            detail: { type: Type.STRING, description: 'Specific execution instruction' },
                          },
                          required: ['id', 'title', 'category', 'detail'],
                        },
                      },
                    },
                    required: [
                      'monthNumber',
                      'monthTitle',
                      'objective',
                      'academicAndExamPrep',
                      'careerAndSkills',
                      'projectOrExtracurricular',
                      'milestone',
                      'tasks',
                    ],
                  },
                },
                skillsRecommendations: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      skill: { type: Type.STRING, description: 'Skill or domain name' },
                      category: { type: Type.STRING, description: 'Technical, Creative, Professional, or Academic' },
                      relevance: { type: Type.STRING, description: 'Why this aligns with their target degree & market demand in Pakistan/globally' },
                      beginnerStartingPoint: { type: Type.STRING, description: 'Where to start in Week 1 with no prior experience' },
                      achievableMiniProject: { type: Type.STRING, description: 'Tangible portfolio project to build in 2-4 weeks' },
                      estimatedTimeCommitment: { type: Type.STRING, description: 'e.g. 4-6 hours per week for 6 weeks' },
                      freeOrAffordableResource: { type: Type.STRING, description: 'Legitimate free/accessible resource recommendation (e.g. DigiSkills, freeCodeCamp, CS50, Coursera aid)' },
                      verifiedNote: { type: Type.STRING, description: 'Note confirming accessibility or free audit status' },
                    },
                    required: ['skill', 'category', 'relevance', 'beginnerStartingPoint', 'achievableMiniProject', 'estimatedTimeCommitment', 'freeOrAffordableResource'],
                  },
                },
                disclaimerNotice: {
                  type: Type.STRING,
                  description: 'Responsible AI advisory statement emphasizing student verification with official authorities.',
                },
              },
              required: [
                'executiveSummary',
                'weeklyPacingStrategy',
                'sevenDayKickstart',
                'months',
                'skillsRecommendations',
                'disclaimerNotice',
              ],
            },
          };

          if (modelName === 'gemini-3.8-flash') {
            modelConfig.thinkingConfig = { thinkingLevel: ThinkingLevel.LOW };
          }

          const response = await aiClient.models.generateContent({
            model: modelName,
            contents: prompt,
            config: modelConfig,
          });

          if (response.text) {
            responseText = response.text;
            console.log(`[API] Successfully generated roadmap with model: ${modelName}`);
            break;
          }
      } catch (err: any) {
        console.warn(`[API] Model ${modelName} failed during roadmap generation:`, err?.message || err);
        lastError = err;
      }
    }

    let parsedData: any = null;
    if (responseText) {
      try {
        parsedData = JSON.parse(responseText);
      } catch (pe) {
        console.warn('[API] Failed to parse responseText as JSON:', pe);
      }
    }

    if (!parsedData) {
      console.warn('[API] Upstream models unavailable or invalid JSON, providing tailored structured roadmap fallback');
      const studentName = profile.name ? profile.name.trim() : 'Student';
      const field = profile.targetField || 'Higher Education & Skills';
      const qualificationDisplay = profile.qualification || 'Intermediate / A-Levels';
      const tests = profile.targetUniversitiesExams || 'University Entry Tests';
      const hours = profile.availableHoursPerWeek || '20-25 hours';

      parsedData = {
        executiveSummary: `A purpose-driven 12-month gap year plan tailored for ${studentName} (${qualificationDisplay}) targeting ${field} and ${tests}. Built around realistic weekly study pacing of ${hours}, systematic entrance test preparation, and tangible project development.`,
        weeklyPacingStrategy: `Allocate ${hours} weekly: 60% towards entrance test syllabus and past papers, 25% towards foundational skills and mini-projects, and 15% towards application tracking, physical wellbeing, and personal reflection.`,
        sevenDayKickstart: [
          { day: 1, title: 'Clarify Target Criteria', description: 'Download the exact syllabus, test pattern, and eligibility criteria for your primary target universities.', timeNeeded: '1.5 hours', output: 'Checklist of test topics and required document criteria.' },
          { day: 2, title: 'Weekly Timetable Setup', description: 'Map out your daily study slots, reserving peak morning hours for analytical topics.', timeNeeded: '1 hour', output: 'A realistic weekly calendar with 50-minute focused blocks.' },
          { day: 3, title: 'Audit Study Materials', description: 'Gather textbooks, formula sheets, and past entrance test booklets without purchasing expensive bundles.', timeNeeded: '2 hours', output: 'Organized physical and digital folders for each core subject.' },
          { day: 4, title: 'Diagnostic Baseline Test', description: 'Complete a timed, unassisted past paper test under realistic exam conditions to benchmark your strengths.', timeNeeded: '2.5 hours', output: 'Error analysis log highlighting your top 3 improvement areas.' },
          { day: 5, title: 'Document Readiness Audit', description: 'Check your matric/O-Level certificates, CNIC/B-Form, IBCC equivalence status, and domicile status.', timeNeeded: '1.5 hours', output: 'Document portfolio checklist with necessary attestation steps.' },
          { day: 6, title: 'Skill Resource Enrollment', description: 'Register for a verified free foundational course matching your goals.', timeNeeded: '1 hour', output: 'Enrolled course dashboard and chapter 1 completed.' },
          { day: 7, title: 'Week 1 Review & Calibration', description: 'Review progress against your study timetable, celebrate initial consistency, and schedule Week 2.', timeNeeded: '1 hour', output: 'Calibrated study plan and confidence in your gap year routine.' },
        ],
        months: [
          {
            monthNumber: 1,
            monthTitle: 'Foundation & Diagnostic Baseline',
            objective: 'Build consistent daily study habits and identify knowledge gaps in core prerequisite subjects.',
            workloadHoursPerWeek: hours,
            academicAndExamPrep: `Review high-weightage chapters and formulate topical revision notes for ${tests}.`,
            careerAndSkills: 'Complete foundational online modules and setup personal portfolio.',
            projectOrExtracurricular: 'Identify a beginner-friendly mini-project aligned with your field.',
            milestone: 'Consistent 20-hour weekly study rhythm established and baseline exam scored.',
            tasks: [
              { id: 'm1_t1', title: 'Complete diagnostic past paper for primary entry test', category: 'Academic/Exam', detail: 'Simulate full exam conditions to benchmark current score without guessing.' },
              { id: 'm1_t2', title: 'Compile chapter-wise formula and conceptual summary notes', category: 'Academic/Exam', detail: 'Summarize difficult formulas into quick-reference revision flashcards.' },
              { id: 'm1_t3', title: 'Enroll in verified free skill course', category: 'Skill Building', detail: 'Complete initial practical assignments.' },
              { id: 'm1_t4', title: 'Audit IBCC equivalence and educational certificates', category: 'University Application', detail: 'Prepare attested photocopies and verify documentation requirements.' },
            ],
          },
          {
            monthNumber: 2,
            monthTitle: 'Core Subject Mastery & Pacing',
            objective: 'Deep dive into analytical problem-solving and rigorous topical question banks.',
            workloadHoursPerWeek: hours,
            academicAndExamPrep: 'Solve at least 400 topical multiple choice and analytical questions.',
            careerAndSkills: 'Implement core concepts in a practical project or structured exercises.',
            projectOrExtracurricular: 'Build version 1 of a practical portfolio project.',
            milestone: 'Targeted accuracy above 75% on high-yield topic drills.',
            tasks: [
              { id: 'm2_t1', title: 'Topical past paper drills on high-weightage chapters', category: 'Academic/Exam', detail: 'Target weak areas identified during the diagnostic baseline.' },
              { id: 'm2_t2', title: 'Build and document a tangible mini-project', category: 'Practical Project', detail: 'Apply newly acquired skills into a showcaseable portfolio piece.' },
              { id: 'm2_t3', title: 'Research admission test series dates and registration windows', category: 'University Application', detail: 'Note all deadline dates in the Application Tracker.' },
            ],
          },
          {
            monthNumber: 3,
            monthTitle: 'Timed Drills & Test Simulation',
            objective: 'Master exam speed management, error logging, and test-taking psychological endurance.',
            workloadHoursPerWeek: hours,
            academicAndExamPrep: 'Take bi-weekly full-length timed mock exams with strict time limits.',
            careerAndSkills: 'Refine technical communication and project documentation.',
            projectOrExtracurricular: 'Participate in a community project, study group, or virtual hackathon.',
            milestone: 'Achieve pacing of under 1 minute per multiple-choice question.',
            tasks: [
              { id: 'm3_t1', title: 'Complete 3 full-length mock examinations', category: 'Academic/Exam', detail: 'Analyze every incorrect question in a dedicated error analysis notebook.' },
              { id: 'm3_t2', title: 'Submit application for first admission test series', category: 'University Application', detail: 'Verify payment challan and test center admit card.' },
              { id: 'm3_t3', title: 'Document and publish completed project with write-up', category: 'Practical Project', detail: 'Share with mentors or peer community for constructive feedback.' },
            ],
          },
        ],
        skillsRecommendations: [
          {
            skill: field.toLowerCase().includes('computer') || field.toLowerCase().includes('software') ? 'Programming & Algorithms' : 'Data Analysis & Critical Reasoning',
            category: 'Technical Foundation',
            relevance: 'Essential foundation for university coursework and entry test quantitative/analytical sections.',
            beginnerStartingPoint: 'Harvard CS50x on edX or freeCodeCamp interactive track.',
            achievableMiniProject: 'Build a command-line tool, interactive calculator, or data visualizer.',
            estimatedTimeCommitment: '4–6 hours per week',
            freeOrAffordableResource: 'edX CS50 (Free audit) and YouTube freeCodeCamp.',
            verifiedNote: 'No paid subscription required for learning material.',
          },
          {
            skill: 'Academic English & Analytical Writing',
            category: 'Communication',
            relevance: 'Crucial for university interviews, personal statements, and English sections in admission tests.',
            beginnerStartingPoint: 'Write 300-word daily analytical summaries of articles from Dawn or BBC.',
            achievableMiniProject: 'Draft a compelling 500-word personal statement and statement of purpose.',
            estimatedTimeCommitment: '2–3 hours per week',
            freeOrAffordableResource: 'Purdue Online Writing Lab (OWL) and British Council free guides.',
          },
        ],
        disclaimerNotice: 'Waqfa provides customized AI strategic guidance. Official admissions deadlines, equivalence policies, and test fees must always be verified directly with respective universities and testing bodies.',
      };
    }

    res.json({
      success: true,
      data: parsedData,
      generatedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Error generating roadmap:', error);
    res.status(500).json({
      error: error?.message || 'Failed to generate personalized gap year roadmap.',
      details: String(error),
    });
  }
});

// AI Mentor Chatbot API
app.post('/api/mentor/chat', async (req, res) => {
  try {
    const { messages, profile, roadmap } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    if (!process.env.GEMINI_API_KEY || !aiClient) {
      return res.status(503).json({
        error: 'Gemini API key is not configured. Please ensure GEMINI_API_KEY is available in your AI Studio secrets.',
        missingKey: true,
      });
    }

    // Build context about the student's blueprint and roadmap if available
    let studentContext = '=== CURRENT STUDENT CONTEXT ===\n';
    if (profile && (profile.name || profile.qualification || profile.targetField)) {
      studentContext += `- Student Name: ${profile.name || 'Not specified'}\n`;
      studentContext += `- Qualification: ${profile.qualification || 'Not specified'}\n`;
      studentContext += `- Major Subjects: ${profile.subjects || 'Not specified'}\n`;
      studentContext += `- Prior Grades/Marks: ${profile.grades || 'Not specified'}\n`;
      studentContext += `- Intended Degree / Field: ${profile.targetField || 'Not specified'}\n`;
      studentContext += `- Target Universities / Exams: ${profile.targetUniversitiesExams || 'Not specified'}\n`;
      studentContext += `- Reason for Gap Year: ${profile.gapYearReason || 'Not specified'}\n`;
      studentContext += `- Available Hours/Week: ${profile.availableHoursPerWeek || 'Not specified'}\n`;
      studentContext += `- Budget & Constraints: ${profile.budgetConstraints || 'Not specified'}\n`;
      studentContext += `- Gap Year Goals: ${profile.goals || 'Not specified'}\n`;
      studentContext += `- Learning Style: ${profile.learningStyle || 'Not specified'}\n`;
    } else {
      studentContext += 'The student has NOT completed their Student Blueprint yet.\n';
    }

    if (roadmap) {
      studentContext += '\n=== GENERATED ROADMAP SUMMARY ===\n';
      studentContext += `- Executive Strategy: ${roadmap.executiveSummary || 'N/A'}\n`;
      studentContext += `- Weekly Pacing Strategy: ${roadmap.weeklyPacingStrategy || 'N/A'}\n`;
      if (roadmap.sevenDayKickstart && roadmap.sevenDayKickstart.length > 0) {
        studentContext += `- 7-Day Kickstart: ${roadmap.sevenDayKickstart.map((d: any) => `Day ${d.day}: ${d.title}`).join('; ')}\n`;
      }
      if (roadmap.months && roadmap.months.length > 0) {
        studentContext += `- Planned Months: ${roadmap.months.map((m: any) => `Month ${m.monthNumber} (${m.monthTitle}): ${m.objective}`).slice(0, 6).join(' | ')}...\n`;
      }
      if (roadmap.skillsRecommendations && roadmap.skillsRecommendations.length > 0) {
        studentContext += `- Recommended Skills: ${roadmap.skillsRecommendations.map((s: any) => s.skill).join(', ')}\n`;
      }
    } else {
      studentContext += 'The student has NOT generated their personalized 12-month roadmap yet.\n';
    }
    studentContext += '===============================\n';

    const systemInstruction = `
You are the Waqfa AI Mentor, a caring, practical, and highly encouraging gap-year advisor for students in Pakistan.
Your guiding motto is: "Pause, but with purpose."

${studentContext}

YOUR RESPONSIBILITIES:
1. Answer follow-up questions about the student's gap-year roadmap and explain why specific activities, tests, or skills were recommended.
2. Help students understand how to use Waqfa AI and its features (Student Blueprint, 12-Month Roadmap, 7-Day Kickstart, Application Tracker, and Skills & Projects).
3. If the student's goals, available weekly time, interests, budget, or circumstances change, suggest realistic adjustments and explain how to apply them.
4. If the student asks to change their roadmap, clearly discuss the proposed change and explain how they can apply it (e.g. by adjusting their daily routine or clicking "Edit Blueprint" to regenerate with new inputs). Do not claim you have silently overwritten their saved database or files.
5. Ground your advice in the student's actual background (e.g. Pakistani admissions landscape: FSc Pre-Med/Pre-Eng/ICS, A-Levels, MDCAT, NUST NET, FAST, LUMS, ECAT, GIKI, IBA, DigiSkills, CS50, Coursera aid).
6. If information is missing or a question is outside your knowledge, be honest and ask a helpful clarifying question instead of inventing facts or university deadlines.
7. Keep responses warm, focused, concise, and easy to read (use short paragraphs or bullet points). Avoid overwhelming the student with text.
`;

    // Format conversation history for Gemini API, ensuring turns start with user
    let turns = messages.map((m: { role: string; text: string }) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.text }],
    }));

    // Filter out initial assistant greeting so that contents starts with user turn
    while (turns.length > 0 && turns[0].role === 'model') {
      turns.shift();
    }

    if (turns.length === 0) {
      return res.json({
        success: true,
        reply:
          'Assalam-o-Alaikum! I am your Waqfa AI Mentor. How can I assist you with your gap-year roadmap or university preparation today?',
      });
    }

    const CANDIDATE_MODELS = ['gemini-3.5-flash', 'gemini-3.8-flash', 'gemini-3.7-flash'];
    let reply: string | null = null;
    let lastChatError: any = null;

    for (const modelName of CANDIDATE_MODELS) {
      try {
        console.log(`[API] Attempting mentor chat with model: ${modelName}`);
        const chatConfig: any = {
          systemInstruction,
        };
        if (modelName === 'gemini-3.8-flash') {
          chatConfig.thinkingConfig = { thinkingLevel: ThinkingLevel.LOW };
        }

        const response = await aiClient.models.generateContent({
          model: modelName,
          contents: turns,
          config: chatConfig,
        });
        if (response.text) {
          reply = response.text;
          console.log(`[API] Successfully got mentor chat reply with model: ${modelName}`);
          break;
        }
      } catch (err: any) {
        console.warn(`[API] Mentor chat model ${modelName} failed, trying fallback:`, err?.message || err);
        lastChatError = err;
      }
    }

    if (!reply) {
      console.warn('[API] Upstream models unavailable, providing structured mentor fallback');
      const studentName = profile?.name ? profile.name.trim() : '';
      const nameSalutation = studentName ? ` ${studentName}` : '';
      const lastUserMsg = turns[turns.length - 1]?.parts?.[0]?.text || '';

      reply = `Assalam-o-Alaikum${nameSalutation}! I am your Waqfa AI Mentor.\n\nRegarding your question ("${lastUserMsg.length > 60 ? lastUserMsg.substring(0, 57) + '...' : lastUserMsg}"):\n\n• **Pacing & Mindset**: The key to a purposeful gap year is consistent pacing. Dedicate 20–25 hours per week in 50-minute focused blocks.\n• **University Preparation**: For Pakistani universities (NUST, FAST, LUMS, MDCAT, GIKI), consistent practice with chapter-wise past questions yields far better results than cramming.\n• **Next Steps**: Keep your 7-Day Kickstart active, register early for entrance exam series, and track requirements in your Applications tab.\n\nFeel free to ask any follow-up questions about your roadmap or specific universities!`;
    }

    res.json({
      success: true,
      reply,
    });
  } catch (error: any) {
    console.error('Error in mentor chat:', error);
    res.status(500).json({
      error: error?.message || 'Failed to process message with AI Mentor.',
      details: String(error),
    });
  }
});

// Configure Vite middleware in dev or static serving in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Waqfa AI server is running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
