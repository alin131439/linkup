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

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: number;
}

export interface ConnectionNote {
  memberId: string;
  note: string;
  tags: string[];
  createdAt: number;
}

export interface LightConnection {
  memberId: string;
  lit: boolean;
  mutual: boolean;
  litAt?: number;
  matchedAt?: number;
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

  // Connection (留灯) state
  lightsRemaining: number;
  maxLightsPerDay: number;
  lightConnections: LightConnection[];

  // Chat state
  activeChatMemberId: string | null;
  chatMessages: Record<string, ChatMessage[]>;

  // Connection notes
  connectionNotes: ConnectionNote[];

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

  // Connection actions
  giveLight: (memberId: string) => { success: boolean; reason?: string };
  cancelLight: (memberId: string) => void;
  markMutual: (memberId: string) => void;

  // Chat actions
  openChat: (memberId: string) => void;
  closeChat: () => void;
  sendMessage: (memberId: string, text: string) => void;

  // Notes actions
  saveNote: (memberId: string, note: string, tags: string[]) => void;
  getNote: (memberId: string) => ConnectionNote | undefined;
}

const MOCK_MEMBERS: Omit<Member, 'joinedAt'>[] = [
  { id: 'm1', name: '张同学', avatar: '👩', isOrganizer: false },
  { id: 'm2', name: '李同学', avatar: '🧑', isOrganizer: false },
  { id: 'm3', name: '王同学', avatar: '👨', isOrganizer: false },
  { id: 'm4', name: '赵同学', avatar: '👩‍🦰', isOrganizer: false },
  { id: 'm5', name: '陈同学', avatar: '🧔', isOrganizer: false },
  { id: 'm6', name: '刘同学', avatar: '👩‍🦱', isOrganizer: false },
  { id: 'm7', name: '周同学', avatar: '🧑‍🦰', isOrganizer: false },
  { id: 'm8', name: '吴同学', avatar: '👨‍💼', isOrganizer: false },
  { id: 'm9', name: '郑同学', avatar: '👩‍💻', isOrganizer: false },
  { id: 'm10', name: '孙同学', avatar: '🧑‍🎨', isOrganizer: false },
  { id: 'm11', name: '林同学', avatar: '👨‍🚀', isOrganizer: false },
  { id: 'm12', name: '黄同学', avatar: '👩‍🔬', isOrganizer: false },
];

function generateRoomCode(): string {
  return String(Math.floor(1000 + Math.random() * 9000));
}

function generateMockMembers(): Member[] {
  return MOCK_MEMBERS.map((m) => ({
    ...m,
    joinedAt: Date.now() + Math.floor(Math.random() * 5000),
  }));
}

const MOCK_INITIAL_MESSAGES: Record<string, ChatMessage[]> = {
  m1: [
    {
      id: 'welcome-1',
      senderId: 'm1',
      text: '嗨！很高兴和你连上 ☀️',
      timestamp: Date.now() - 300000,
    },
    {
      id: 'welcome-2',
      senderId: 'me',
      text: '你好！看到我们都对 AI 工具感兴趣，太好了',
      timestamp: Date.now() - 240000,
    },
    {
      id: 'welcome-3',
      senderId: 'm1',
      text: '是啊！你最近有在用什么有趣的 AI 工具吗？',
      timestamp: Date.now() - 180000,
    },
  ],
};

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

      lightsRemaining: 3,
      maxLightsPerDay: 3,
      lightConnections: [],

      activeChatMemberId: null,
      chatMessages: MOCK_INITIAL_MESSAGES,

      connectionNotes: [],

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
          lightsRemaining: 3,
          maxLightsPerDay: 3,
          lightConnections: [],
          activeChatMemberId: null,
          chatMessages: MOCK_INITIAL_MESSAGES,
          connectionNotes: [],
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
          lightsRemaining: 3,
          maxLightsPerDay: 3,
          lightConnections: [],
          activeChatMemberId: null,
          chatMessages: MOCK_INITIAL_MESSAGES,
          connectionNotes: [],
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
          lightsRemaining: 3,
          lightConnections: [],
          activeChatMemberId: null,
          chatMessages: {},
          connectionNotes: [],
        });
      },

      giveLight: (memberId) => {
        const state = get();
        const existing = state.lightConnections.find((l) => l.memberId === memberId);
        if (existing?.lit) return { success: false, reason: 'already_lit' };
        if (state.lightsRemaining <= 0) return { success: false, reason: 'no_lights' };

        const newConnection: LightConnection = {
          memberId,
          lit: true,
          mutual: existing?.mutual || false,
          litAt: Date.now(),
        };

        const updated = state.lightConnections.filter((l) => l.memberId !== memberId);
        updated.push(newConnection);

        set({
          lightConnections: updated,
          lightsRemaining: state.lightsRemaining - 1,
        });

        return { success: true };
      },

      cancelLight: (memberId) => {
        const state = get();
        const conn = state.lightConnections.find((l) => l.memberId === memberId);
        if (!conn?.lit) return;

        if (!conn.mutual) {
          set({
            lightConnections: state.lightConnections.filter((l) => l.memberId !== memberId),
            lightsRemaining: state.lightsRemaining + 1,
          });
        }
      },

      markMutual: (memberId) => {
        const state = get();
        const existing = state.lightConnections.find((l) => l.memberId === memberId);
        const updated = state.lightConnections.map((l) =>
          l.memberId === memberId ? { ...l, mutual: true, matchedAt: Date.now() } : l
        );

        if (existing) {
          set({ lightConnections: updated });
        } else {
          const newConn: LightConnection = {
            memberId,
            lit: false,
            mutual: true,
            matchedAt: Date.now(),
          };
          set({ lightConnections: [...updated, newConn] });
        }
      },

      openChat: (memberId) => {
        set({ activeChatMemberId: memberId });
      },

      closeChat: () => {
        set({ activeChatMemberId: null });
      },

      sendMessage: (memberId, text) => {
        const state = get();
        const msg: ChatMessage = {
          id: `msg-${Date.now()}`,
          senderId: 'me',
          text,
          timestamp: Date.now(),
        };
        const existing = state.chatMessages[memberId] || [];
        set({
          chatMessages: {
            ...state.chatMessages,
            [memberId]: [...existing, msg],
          },
        });
      },

      saveNote: (memberId, note, tags) => {
        const state = get();
        const updated = state.connectionNotes.filter((n) => n.memberId !== memberId);
        updated.push({ memberId, note, tags, createdAt: Date.now() });
        set({ connectionNotes: updated });
      },

      getNote: (memberId) => {
        return get().connectionNotes.find((n) => n.memberId === memberId);
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
        lightsRemaining: state.lightsRemaining,
        maxLightsPerDay: state.maxLightsPerDay,
        lightConnections: state.lightConnections,
        activeChatMemberId: state.activeChatMemberId,
        chatMessages: state.chatMessages,
        connectionNotes: state.connectionNotes,
      }),
    }
  )
);
