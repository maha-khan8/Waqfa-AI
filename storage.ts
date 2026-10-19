import {
  StudentProfile,
  GeneratedRoadmap,
  ApplicationEntry,
  SavedStudentSession,
} from '../types';

const STORAGE_KEYS = {
  PROFILE: 'waqfa_clean_profile',
  ROADMAP: 'waqfa_clean_roadmap',
  APPLICATIONS: 'waqfa_clean_applications',
  INTRO_SEEN: 'waqfa_intro_seen',
  SESSIONS: 'waqfa_student_sessions',
  ACTIVE_SESSION_ID: 'waqfa_active_session_id',
};

// Clean legacy localStorage keys from prior development iterations to guarantee a fresh experience
export const purgeLegacyData = () => {
  try {
    const legacyKeys = [
      'waqfa_student_profile',
      'waqfa_generated_roadmap',
      'waqfa_applications',
      'waqfa_active_tab',
    ];
    legacyKeys.forEach((key) => localStorage.removeItem(key));
  } catch (e) {
    // Ignore storage access errors in restricted iframe
  }
};

export const DEFAULT_BLANK_PROFILE: StudentProfile = {
  name: '',
  qualification: '',
  subjects: '',
  grades: '',
  targetField: '',
  targetUniversitiesExams: '',
  interests: '',
  gapYearReason: '',
  availableHoursPerWeek: '20-25 hours',
  budgetConstraints: 'Free learning resources preferred',
  goals: '',
  learningStyle: 'Hybrid: Morning theory, afternoon practical application',
  isCustom: true,
};

/**
 * Generate a unique session ID for a student
 */
export const generateSessionId = (): string => {
  return 'session_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
};

/**
 * Retrieve all saved student sessions from local storage
 */
export const getSavedSessions = (): SavedStudentSession[] => {
  purgeLegacyData();
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SESSIONS);
    if (raw) {
      const parsed: SavedStudentSession[] = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }

    // Auto-migration: if no sessions array yet, but existing profile/roadmap is in storage,
    // wrap it into an initial saved session so previous student work is preserved!
    const legacyRoadmap = getStoredRoadmap();
    const legacyProfile = getStoredProfile();
    const legacyApps = getStoredApplications();

    if (legacyRoadmap || legacyProfile.name.trim() || legacyProfile.qualification.trim()) {
      const initialSession: SavedStudentSession = {
        id: 'session_primary',
        studentName: legacyProfile.name.trim() || 'Student',
        qualification: legacyProfile.qualification.trim() || 'Gap Year Student',
        targetField: legacyProfile.targetField.trim() || 'University Prep',
        createdAt: legacyRoadmap?.generatedAt || new Date().toISOString(),
        lastActiveAt: new Date().toISOString(),
        profile: legacyProfile,
        roadmap: legacyRoadmap,
        applications: legacyApps,
      };
      saveSavedSessions([initialSession]);
      setActiveSessionId(initialSession.id);
      return [initialSession];
    }
  } catch (e) {
    console.error('Failed to load saved sessions', e);
  }
  return [];
};

/**
 * Persist the full array of saved student sessions
 */
export const saveSavedSessions = (sessions: SavedStudentSession[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
  } catch (e) {
    console.error('Failed to save sessions', e);
  }
};

/**
 * Retrieve active session ID
 */
export const getActiveSessionId = (): string | null => {
  try {
    return localStorage.getItem(STORAGE_KEYS.ACTIVE_SESSION_ID);
  } catch (e) {
    return null;
  }
};

/**
 * Set active session ID
 */
export const setActiveSessionId = (id: string | null) => {
  try {
    if (id) {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_SESSION_ID, id);
    } else {
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_SESSION_ID);
    }
  } catch (e) {
    // Ignore
  }
};

/**
 * Sync active student data into both the active session and top-level storage keys
 */
export const syncActiveSession = (
  sessionId: string,
  profile: StudentProfile,
  roadmap: GeneratedRoadmap | null,
  applications: ApplicationEntry[]
) => {
  try {
    const sessions = getSavedSessions();
    const existingIndex = sessions.findIndex((s) => s.id === sessionId);

    const studentName = profile.name.trim() || (roadmap?.studentName?.trim() ?? 'Student');
    const qualification = profile.qualification.trim();
    const targetField = profile.targetField.trim();

    const updatedSession: SavedStudentSession = {
      id: sessionId,
      studentName: studentName || 'Student',
      qualification,
      targetField,
      createdAt:
        existingIndex >= 0 ? sessions[existingIndex].createdAt : new Date().toISOString(),
      lastActiveAt: new Date().toISOString(),
      profile,
      roadmap,
      applications,
    };

    let updatedSessions: SavedStudentSession[];
    if (existingIndex >= 0) {
      updatedSessions = [...sessions];
      updatedSessions[existingIndex] = updatedSession;
    } else {
      // If student has meaningful information or a roadmap, record them as a saved session
      if (roadmap || studentName || qualification) {
        updatedSessions = [updatedSession, ...sessions];
      } else {
        updatedSessions = sessions;
      }
    }

    saveSavedSessions(updatedSessions);
    setActiveSessionId(sessionId);
    saveStoredProfile(profile);
    saveStoredRoadmap(roadmap);
    saveStoredApplications(applications);
  } catch (e) {
    console.error('Failed to sync active session', e);
  }
};

/**
 * Delete a saved student session
 */
export const deleteSavedSession = (sessionId: string) => {
  try {
    const sessions = getSavedSessions().filter((s) => s.id !== sessionId);
    saveSavedSessions(sessions);
    if (getActiveSessionId() === sessionId) {
      const nextActive = sessions[0] || null;
      setActiveSessionId(nextActive ? nextActive.id : null);
      if (nextActive) {
        saveStoredProfile(nextActive.profile);
        saveStoredRoadmap(nextActive.roadmap);
        saveStoredApplications(nextActive.applications);
      } else {
        saveStoredProfile(DEFAULT_BLANK_PROFILE);
        saveStoredRoadmap(null);
        saveStoredApplications([]);
      }
    }
  } catch (e) {
    console.error('Failed to delete session', e);
  }
};

export const getStoredProfile = (): StudentProfile => {
  purgeLegacyData();
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Failed to load stored profile', e);
  }
  return DEFAULT_BLANK_PROFILE;
};

export const saveStoredProfile = (profile: StudentProfile) => {
  try {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  } catch (e) {
    console.error('Failed to save profile', e);
  }
};

export const getStoredRoadmap = (): GeneratedRoadmap | null => {
  purgeLegacyData();
  try {
    const data = localStorage.getItem(STORAGE_KEYS.ROADMAP);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Failed to load stored roadmap', e);
  }
  return null;
};

export const saveStoredRoadmap = (roadmap: GeneratedRoadmap | null) => {
  try {
    if (roadmap) {
      localStorage.setItem(STORAGE_KEYS.ROADMAP, JSON.stringify(roadmap));
    } else {
      localStorage.removeItem(STORAGE_KEYS.ROADMAP);
    }
  } catch (e) {
    console.error('Failed to save roadmap', e);
  }
};

export const getStoredApplications = (): ApplicationEntry[] => {
  purgeLegacyData();
  try {
    const data = localStorage.getItem(STORAGE_KEYS.APPLICATIONS);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Failed to load stored applications', e);
  }
  return [];
};

export const saveStoredApplications = (applications: ApplicationEntry[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(applications));
  } catch (e) {
    console.error('Failed to save applications', e);
  }
};

export const hasSeenIntro = (): boolean => {
  try {
    return sessionStorage.getItem(STORAGE_KEYS.INTRO_SEEN) === 'true';
  } catch (e) {
    return false;
  }
};

export const setSeenIntro = () => {
  try {
    sessionStorage.setItem(STORAGE_KEYS.INTRO_SEEN, 'true');
  } catch (e) {
    // Ignore
  }
};
