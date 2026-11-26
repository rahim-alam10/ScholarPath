import { createContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

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
    }),
    [query, accountMode, selectedResearch, savedResearch, savedScholarship, reminders, language],
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}
