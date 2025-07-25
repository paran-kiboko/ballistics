import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BallisticsState, User, Game, GameStat, Team, Quarter, StatType } from '@/types/ballistics';
import { saveBallisticsData, loadBallisticsData } from '@/lib/ballistics-storage';

// 초기 상태 정의
const getInitialState = (): BallisticsState => {
  // 클라이언트 사이드에서만 로컬 스토리지 로드 시도
  if (typeof window !== 'undefined') {
    const loadedState = loadBallisticsData();
    if (loadedState) {
      return loadedState;
    }
  }
  
  // 기본 초기 상태
  return {
    users: [

    ],
    games: [],
    currentGame: null,
    selectedDate: new Date().toISOString().split('T')[0],
    activeTab: 'leaderboard',
  };
};

const initialState: BallisticsState = getInitialState();

export const ballisticsSlice = createSlice({
  name: 'ballistics',
  initialState,
  reducers: {
    addUser: (state, action: PayloadAction<{ name: string }>) => {
      const newUser: User = {
        id: Date.now().toString(),
        name: action.payload.name,
      };
      state.users.push(newUser);
    },
    
    setSelectedDate: (state, action: PayloadAction<string>) => {
      state.selectedDate = action.payload;
    },
    
    setActiveTab: (state, action: PayloadAction<'leaderboard' | 'add-stats'>) => {
      state.activeTab = action.payload;
    },
    
    createGame: (state, action: PayloadAction<{
      date: string;
      referee: string;
      assistantReferee: string;
    }>) => {
      const newGame: Game = {
        id: Date.now().toString(),
        date: action.payload.date,
        referee: action.payload.referee,
        assistantReferee: action.payload.assistantReferee,
        attendees: [],
        noShows: [],
        yellowTeam: [],
        blueTeam: [],
        yellowScore: 0,
        blueScore: 0,
        stats: [],
        isCompleted: false,
      };
      state.games.push(newGame);
      state.currentGame = newGame;
    },
    
    updateCurrentGame: (state, action: PayloadAction<Partial<Game>>) => {
      if (state.currentGame) {
        Object.assign(state.currentGame, action.payload);
        // 게임 목록에서도 업데이트
        const gameIndex = state.games.findIndex(g => g.id === state.currentGame!.id);
        if (gameIndex !== -1) {
          Object.assign(state.games[gameIndex], action.payload);
        }
      }
    },
    
    addAttendee: (state, action: PayloadAction<string>) => {
      if (state.currentGame && !state.currentGame.attendees.includes(action.payload)) {
        state.currentGame.attendees.push(action.payload);
      }
    },
    
    removeAttendee: (state, action: PayloadAction<string>) => {
      if (state.currentGame) {
        state.currentGame.attendees = state.currentGame.attendees.filter(id => id !== action.payload);
        state.currentGame.yellowTeam = state.currentGame.yellowTeam.filter(id => id !== action.payload);
        state.currentGame.blueTeam = state.currentGame.blueTeam.filter(id => id !== action.payload);
      }
    },
    
    assignToTeam: (state, action: PayloadAction<{ userId: string; team: Team }>) => {
      if (state.currentGame) {
        const { userId, team } = action.payload;
        
        // 다른 팀에서 제거
        state.currentGame.yellowTeam = state.currentGame.yellowTeam.filter(id => id !== userId);
        state.currentGame.blueTeam = state.currentGame.blueTeam.filter(id => id !== userId);
        
        // 새 팀에 추가
        if (team === 'yellow') {
          state.currentGame.yellowTeam.push(userId);
        } else {
          state.currentGame.blueTeam.push(userId);
        }
      }
    },
    
    addGameStat: (state, action: PayloadAction<{
      userId: string;
      quarter: Quarter;
      type: StatType;
    }>) => {
      if (state.currentGame) {
        const newStat: GameStat = {
          id: Date.now().toString(),
          userId: action.payload.userId,
          quarter: action.payload.quarter,
          type: action.payload.type,
          timestamp: Date.now(),
        };
        state.currentGame.stats.push(newStat);
        
        // 골 기록시 점수 업데이트
        if (action.payload.type === 'goal') {
          const userTeam = state.currentGame.yellowTeam.includes(action.payload.userId) ? 'yellow' : 'blue';
          if (userTeam === 'yellow') {
            state.currentGame.yellowScore++;
          } else {
            state.currentGame.blueScore++;
          }
        }
      }
    },
    
    addNoShow: (state, action: PayloadAction<string>) => {
      if (state.currentGame && !state.currentGame.noShows.includes(action.payload)) {
        state.currentGame.noShows.push(action.payload);
      }
    },
    
    removeNoShow: (state, action: PayloadAction<string>) => {
      if (state.currentGame) {
        state.currentGame.noShows = state.currentGame.noShows.filter(id => id !== action.payload);
      }
    },
    
    // 로컬 스토리지 저장 액션
    saveToStorage: (state) => {
      saveBallisticsData(state);
    },
    
    // 전체 상태 로드 액션
    loadFromStorage: (state) => {
      const loadedData = loadBallisticsData();
      if (loadedData) {
        return loadedData;
      }
      return state;
    },
  },
});

export const {
  addUser,
  setSelectedDate,
  setActiveTab,
  createGame,
  updateCurrentGame,
  addAttendee,
  removeAttendee,
  assignToTeam,
  addGameStat,
  addNoShow,
  removeNoShow,
  saveToStorage,
  loadFromStorage,
} = ballisticsSlice.actions;

export default ballisticsSlice.reducer;