import { create } from 'zustand';

export type CompanionStateType = 'happy' | 'idle' | 'sad' | 'coughing';

interface CarbonState {
  healthIndex: number;
  ecoCredits: number;
  treeCount: number;
  factoryCount: number;
  windmillCount: number;
  creatures: {
    birds: number;
    butterflies: number;
    sheep: number;
  };
  companionState: CompanionStateType;
  earnCredits: (amount: number) => void;
  buyItem: (itemType: 'tree' | 'windmill' | 'bird' | 'butterfly' | 'sheep', cost: number) => boolean;
  buildFactory: () => void;
  triggerDeforestation: () => void;
  updateHealthAndCompanion: () => void;
}

export const useCarbonStore = create<CarbonState>((set, get) => ({
  healthIndex: 0.8,
  ecoCredits: 20, // Start with some pocket credits
  treeCount: 2,
  factoryCount: 0,
  windmillCount: 0,
  creatures: {
    birds: 0,
    butterflies: 0,
    sheep: 0,
  },
  companionState: 'idle',

  earnCredits: (amount) => set((state) => ({ ecoCredits: state.ecoCredits + amount })),

  buyItem: (itemType, cost) => {
    const state = get();
    if (state.ecoCredits < cost) return false;

    set((state) => {
      const nextCredits = state.ecoCredits - cost;
      let nextTrees = state.treeCount;
      let nextWindmills = state.windmillCount;
      const nextCreatures = { ...state.creatures };

      if (itemType === 'tree') nextTrees++;
      else if (itemType === 'windmill') nextWindmills++;
      else if (itemType === 'bird') nextCreatures.birds++;
      else if (itemType === 'butterfly') nextCreatures.butterflies++;
      else if (itemType === 'sheep') nextCreatures.sheep++;

      return {
        ecoCredits: nextCredits,
        treeCount: nextTrees,
        windmillCount: nextWindmills,
        creatures: nextCreatures,
      };
    });

    get().updateHealthAndCompanion();
    return true;
  },

  buildFactory: () => {
    set((state) => ({ factoryCount: state.factoryCount + 1 }));
    get().updateHealthAndCompanion();
  },

  triggerDeforestation: () => {
    set((state) => ({ treeCount: Math.max(0, state.treeCount - 1) }));
    get().updateHealthAndCompanion();
  },

  updateHealthAndCompanion: () => {
    set((state) => {
      // Calculate health:
      // Trees add health (+0.08 each)
      // Windmills add health (+0.12 each)
      // Factories subtract health (-0.20 each)
      // Creatures add a minor health boost (+0.02 each)
      const totalCreatures = state.creatures.birds + state.creatures.butterflies + state.creatures.sheep;
      
      const rawHealth = 0.5 
        + (state.treeCount * 0.08) 
        + (state.windmillCount * 0.12) 
        - (state.factoryCount * 0.20)
        + (totalCreatures * 0.02);

      const nextHealth = Math.max(0, Math.min(1, rawHealth));

      // Determine Companion State
      let nextCompanionState: CompanionStateType = 'idle';
      if (nextHealth > 0.8) {
        nextCompanionState = 'happy';
      } else if (nextHealth < 0.4) {
        nextCompanionState = state.factoryCount > 0 ? 'coughing' : 'sad';
      }

      return {
        healthIndex: nextHealth,
        companionState: nextCompanionState,
      };
    });
  },
}));
