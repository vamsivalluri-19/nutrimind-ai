import React from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Profile = {
  weight?: number;
  height?: number;
  goal?: string;
};

type ProfileContextValue = {
  profile: Profile;
  updateProfile: (patch: Partial<Profile>) => void;
};

const ProfileContext = React.createContext<ProfileContextValue | null>(null);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = React.useState<Profile | null>(null);

  // Load from storage on mount
  React.useEffect(() => {
    let mounted = true;
    AsyncStorage.getItem('profile')
      .then((raw) => {
        if (!mounted) return;
        if (raw) {
          try {
            const parsed = JSON.parse(raw);
            setProfile(parsed);
          } catch (e) {
            setProfile({ weight: 75, height: 175, goal: 'weight loss' });
          }
        } else {
          setProfile({ weight: 75, height: 175, goal: 'weight loss' });
        }
      })
      .catch(() => {
        if (mounted) setProfile({ weight: 75, height: 175, goal: 'weight loss' });
      });
    return () => { mounted = false; };
  }, []);

  const updateProfile = (patch: Partial<Profile>) => {
    setProfile((p) => {
      const next = { ...(p ?? {}), ...patch } as Profile;
      AsyncStorage.setItem('profile', JSON.stringify(next)).catch(() => {
        Alert.alert('Save failed', 'Unable to persist profile locally.');
      });
      return next;
    });
  };

  return <ProfileContext.Provider value={{ profile: profile ?? { weight: 75, height: 175, goal: 'weight loss' }, updateProfile }}>{children}</ProfileContext.Provider>;
}

export function useProfile() {
  const ctx = React.useContext(ProfileContext);
  if (!ctx) throw new Error('useProfile must be used within ProfileProvider');
  return ctx;
}

export default ProfileProvider;
