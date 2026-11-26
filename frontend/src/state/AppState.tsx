import { createContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { UserProfile } from '../api/userApi';
import { ApiError } from '../api/client';
import { getProfile } from '../api/userApi';
import {
  getStoredAuthToken,
  removeStoredAuthToken,
  storeAuthToken,
} from '../utils/authTokenStorage';

export type ProfileData = {
  fullName: string;
  email: string;
  qualification: string;
  fieldOfStudy: string;
};

type AppStateValue = {
  query: string;
  setQuery: (value: string) => void;
  accountMode: 'create' | 'login';
  setAccountMode: (value: 'create' | 'login') => void;
  selectedResearch: string | null;
  setSelectedResearch: (value: string | null) => void;
  savedResearch: boolean;
  setSavedResearch: (value: boolean) => void;
  savedScholarship: boolean;
  setSavedScholarship: (value: boolean) => void;
  reminders: boolean[];
  setReminders: (value: boolean[]) => void;
  language: 'English' | 'اردو';
  setLanguage: (value: 'English' | 'اردو') => void;
  profile: ProfileData;
  updateProfile: (value: ProfileData) => void;
  authToken: string | null;
  authenticatedUser: UserProfile | null;
  authReady: boolean;
  setAuthenticatedSession: (token: string, user: UserProfile) => Promise<void>;
  signOut: () => Promise<void>;
};

export const AppStateContext = createContext<AppStateValue | null>(null);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [query, setQuery] = useState('');
  const [accountMode, setAccountMode] = useState<'create' | 'login'>('create');
  const [selectedResearch, setSelectedResearch] = useState<string | null>(null);
  const [savedResearch, setSavedResearch] = useState(false);
  const [savedScholarship, setSavedScholarship] = useState(false);
  const [reminders, setReminders] = useState([true, true, true]);
  const [language, setLanguage] = useState<'English' | 'اردو'>('English');
  const [profile, updateProfile] = useState<ProfileData>({
    fullName: '',
    email: '',
    qualification: '',
    fieldOfStudy: '',
  });
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [authenticatedUser, setAuthenticatedUser] = useState<UserProfile | null>(null);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    let active = true;
    async function restoreSession() {
      try {
        const token = await getStoredAuthToken();
        if (!token) return;
        const user = await getProfile(token);
        if (!active) return;
        setAuthToken(token);
        setAuthenticatedUser(user);
        updateProfile({
          fullName: user.name,
          email: user.email,
          qualification: user.academicProfile?.qualification ?? '',
          fieldOfStudy: user.academicProfile?.fieldOfStudy ?? '',
        });
      } catch (error) {
        if (!active) return;
        if (error instanceof ApiError && error.statusCode === 401) {
          await removeStoredAuthToken();
        } else {
          console.warn('Could not restore the saved ScholarPath session.', error);
        }
      } finally {
        if (active) setAuthReady(true);
      }
    }

    void restoreSession();
    return () => {
      active = false;
    };
  }, []);

  const setAuthenticatedSession = async (token: string, user: UserProfile) => {
    await storeAuthToken(token);
    setAuthToken(token);
    setAuthenticatedUser(user);
    updateProfile({
      fullName: user.name,
      email: user.email,
      qualification: user.academicProfile?.qualification ?? '',
      fieldOfStudy: user.academicProfile?.fieldOfStudy ?? '',
    });
    setAuthReady(true);
  };

  const signOut = async () => {
    await removeStoredAuthToken();
    setAuthToken(null);
    setAuthenticatedUser(null);
  };

  const value = useMemo(
    () => ({
      query,
      setQuery,
      accountMode,
      setAccountMode,
      selectedResearch,
      setSelectedResearch,
      savedResearch,
      setSavedResearch,
      savedScholarship,
      setSavedScholarship,
      reminders,
      setReminders,
      language,
      setLanguage,
      profile,
      updateProfile,
      authToken,
      authenticatedUser,
      authReady,
      setAuthenticatedSession,
      signOut,
    }),
    [
      query,
      accountMode,
      selectedResearch,
      savedResearch,
      savedScholarship,
      reminders,
      language,
      profile,
      authToken,
      authenticatedUser,
      authReady,
    ],
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}
