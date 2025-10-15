import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface LastAction {
  type: 'contact' | 'deal' | 'payment' | 'event' | 'task';
  id?: string;
  timestamp: number;
}

interface LastActionStore {
  lastAction: LastAction | null;
  setLastAction: (action: LastAction) => void;
  clearLastAction: () => void;
}

export const useLastAction = create<LastActionStore>()(
  persist(
    (set) => ({
      lastAction: null,
      setLastAction: (action) => set({ lastAction: action }),
      clearLastAction: () => set({ lastAction: null }),
    }),
    {
      name: 'last-action-storage',
    }
  )
);
