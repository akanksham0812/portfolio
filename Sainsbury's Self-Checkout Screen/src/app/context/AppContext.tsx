import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

interface AppContextType {
  soundOn: boolean;
  setSoundOn: (v: boolean) => void;
  language: string;
  setLanguage: (v: string) => void;
  visualAlerts: boolean;
  setVisualAlerts: (v: boolean) => void;
  screenReader: boolean;
  setScreenReader: (v: boolean) => void;
  largeText: boolean;
  setLargeText: (v: boolean) => void;
}

const AppContext = createContext<AppContextType>({
  soundOn: true,
  setSoundOn: () => {},
  language: 'en',
  setLanguage: () => {},
  visualAlerts: false,
  setVisualAlerts: () => {},
  screenReader: false,
  setScreenReader: () => {},
  largeText: false,
  setLargeText: () => {},
});

export function AppProvider({ children }: { children: ReactNode }) {
  const [soundOn, setSoundOn]           = useState(true);
  const [language, setLanguage]         = useState('en');
  const [visualAlerts, setVisualAlerts] = useState(false);
  const [screenReader, setScreenReader] = useState(false);
  const [largeText, setLargeText]       = useState(false);

  return (
    <AppContext.Provider value={{
      soundOn, setSoundOn,
      language, setLanguage,
      visualAlerts, setVisualAlerts,
      screenReader, setScreenReader,
      largeText, setLargeText,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useAppContext = () => useContext(AppContext);
