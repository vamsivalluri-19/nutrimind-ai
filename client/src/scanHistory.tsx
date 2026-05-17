import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

export type SavedScan = {
  id: string;
  timestamp: string;
  result: any;
};

type ScanHistoryContextValue = {
  scans: SavedScan[];
  addScan: (result: any) => void;
  clearScans: () => void;
};

const ScanHistoryContext = React.createContext<ScanHistoryContextValue | null>(null);

export function ScanHistoryProvider({ children }: { children: React.ReactNode }) {
  const [scans, setScans] = React.useState<SavedScan[]>([]);

  // Load saved scans from AsyncStorage
  React.useEffect(() => {
    let mounted = true;
    AsyncStorage.getItem('scanHistory')
      .then((raw) => {
        if (!mounted) return;
        if (raw) {
          try {
            const parsed = JSON.parse(raw) as SavedScan[];
            setScans(parsed);
          } catch (e) {
            setScans([]);
          }
        }
      })
      .catch(() => {
        // ignore
      });
    return () => { mounted = false; };
  }, []);

  const addScan = (result: any) => {
    const entry: SavedScan = { id: String(Date.now()), timestamp: new Date().toISOString(), result };
    setScans((cur) => {
      const next = [entry, ...cur];
      AsyncStorage.setItem('scanHistory', JSON.stringify(next)).catch(() => {
        Alert.alert('Save failed', 'Unable to persist scan history locally.');
      });
      return next;
    });
  };

  const clearScans = () => setScans([]);

  // persist clears
  React.useEffect(() => {
    AsyncStorage.setItem('scanHistory', JSON.stringify(scans)).catch(() => {});
  }, [scans]);

  return <ScanHistoryContext.Provider value={{ scans, addScan, clearScans }}>{children}</ScanHistoryContext.Provider>;
}

export function useScanHistory() {
  const ctx = React.useContext(ScanHistoryContext);
  if (!ctx) throw new Error('useScanHistory must be used within ScanHistoryProvider');
  return ctx;
}

export default ScanHistoryProvider;
