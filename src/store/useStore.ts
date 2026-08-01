import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type SceneType = 'course' | 'project' | 'industry' | 'hobby';
export type UserRole = 'organizer' | 'participant';
export type RoomPhase = 'lobby' | 'warmup' | 'icebreak' | 'frequency-map' | 'connections' | 'profile';

export interface Member {
  id: string;
  name: string;
  avatar: string;
  isOrganizer: boolean;
  mood?: number;
  energy?: number;
  joinedAt: number;
}

export interface RoomState {
  roomCode: string;
  sceneType: SceneType;
  sceneTitle: string;
  userRole: UserRole;
  username: string;
  members: Member[];
  currentPhase: RoomPhase;
  warmupStep: number;
  moodResults: Record<string, { mood: number; energy: number }>;
  wouldYouRatherAnswers: Record<string, { choice: 'A' | 'B' }>;
  
  // Actions
  createRoom: (sceneType: SceneType, sceneTitle: string) => string;
  joinRoom: (code: string) => boolean;
  setUsername: (name: string) => void;
  addMember: (member: Partial<Member>) => void;
  startWarmup: () => void;
  setWarmupStep: (step: number) => void;
  setMoodResult: (memberId: string, mood: number, energy: number) => void;
  setWouldYouRather: (memberId: string, choice: 'A' | 'B') => void;
  goToPhase: (phase: RoomPhase) => void;
  leaveRoom: () => void;
}

const MOCK_MEMBERS: Omit<Member, 'joinedAt'>[] = [
  { id: 'm1', name: '张同学', avatar: '👩', isOrganizer: false },
  { id: 'm2', name: '李同学', avatar: '🧑', isOrganizer: false },
  { id: 'm3', name: '王同学', avatar: '👨', isOrganizer: false },
  { id: 'm4', name: '赵同学', avatar: '👩‍🦰', isOrganizer: false },
];

function generateRoomCode(): string {
  return String(Math.floor(1000 + Math.random() * 9000));
}

function generateMockMembers(): Member[] {
  const count = 3 + Math.floor(Math.random() * 2);
  return MOCK_MEMBERS.slice(0, count).map((m) => ({
    ...m,
    joinedAt: Date.now() + Math.floor(Math.random() * 3000),
  }));
}

export const useStore = create<RoomState>()(
  persist(
    (set, get) => ({
      roomCode: '',
      sceneType: 'course',
      sceneTitle: '',
      userRole: 'participant',
      username: '',
      members: [],
      currentPhase: 'lobby',
      warmupStep: 0,
      moodResults: {},
      wouldYouRatherAnswers: {},

      createRoom: (sceneType, sceneTitle) => {
        const code = generateRoomCode();
        const state = get();
        const organizerMember: Member = {
          id: 'me',
          name: state.username || '组织者',
          avatar: '🧑‍💻',
          isOrganizer: true,
          joinedAt: Date.now(),
        };
        const mockMembers = generateMockMembers();
        set({
          roomCode: code,
          sceneType,
          sceneTitle,
          userRole: 'organizer',
          members: [organizerMember, ...mockMembers],
          currentPhase: 'lobby',
          warmupStep: 0,
          moodResults: {},
          wouldYouRatherAnswers: {},
        });
        return code;
      },

      joinRoom: (code) => {
        if (!/^\d{4}$/.test(code)) return false;
        const state = get();
        const mockMembers = generateMockMembers();
        const selfMember: Member = {
          id: 'me',
          name: state.username || '我',
          avatar: '🧑',
          isOrganizer: false,
          joinedAt: Date.now(),
        };
        set({
          roomCode: code,
          userRole: 'participant',
          currentPhase: 'lobby',
          warmupStep: 0,
          moodResults: {},
          wouldYouRatherAnswers: {},
          members: [selfMember, ...mockMembers],
        });
        return true;
      },

      setUsername: (name) => {
        set({ username: name });
        const state = get();
        if (state.userRole === 'organizer' && state.members.length > 0) {
          set({
            members: state.members.map((m) =>
              m.id === 'me' ? { ...m, name } : m
            ),
          });
        }
      },

      addMember: (member) => {
        const state = get();
        if (!state.members.find((m) => m.id === member.id)) {
          set({
            members: [
              ...state.members,
              {
                id: member.id || `u${Date.now()}`,
                name: member.name || '新成员',
                avatar: member.avatar || '🧑',
                isOrganizer: member.isOrganizer || false,
                joinedAt: Date.now(),
              },
            ],
          });
        }
      },

      startWarmup: () => {
        set({ currentPhase: 'warmup', warmupStep: 0 });
      },

      setWarmupStep: (step) => set({ warmupStep: step }),

      setMoodResult: (memberId, mood, energy) => {
        set({
          moodResults: {
            ...get().moodResults,
            [memberId]: { mood, energy },
          },
        });
      },

      setWouldYouRather: (memberId, choice) => {
        set({
          wouldYouRatherAnswers: {
            ...get().wouldYouRatherAnswers,
            [memberId]: { choice },
          },
        });
      },

      goToPhase: (phase) => set({ currentPhase: phase }),

      leaveRoom: () => {
        set({
          roomCode: '',
          sceneType: 'course',
          sceneTitle: '',
          userRole: 'participant',
          username: '',
          members: [],
          currentPhase: 'lobby',
          warmupStep: 0,
          moodResults: {},
          wouldYouRatherAnswers: {},
        });
      },
    }),
    {
      name: 'linkup-room',
      partialize: (state) => ({
        roomCode: state.roomCode,
        sceneType: state.sceneType,
        sceneTitle: state.sceneTitle,
        userRole: state.userRole,
        username: state.username,
        members: state.members,
        currentPhase: state.currentPhase,
        moodResults: state.moodResults,
        wouldYouRatherAnswers: state.wouldYouRatherAnswers,
      }),
    }
  )
);
