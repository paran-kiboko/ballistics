export type Team = 'yellow' | 'blue';

export type Quarter = '1Q' | '2Q' | '3Q' | '4Q';

export type StatType = 'goal' | 'assist' | 'semi_assist';

export interface User {
  id: string;
  name: string;
  team?: Team;
}

export interface GameStat {
  id: string;
  userId: string;
  quarter: Quarter;
  type: StatType;
  timestamp: number;
}

export interface Game {
  id: string;
  date: string;
  referee: string;
  assistantReferee: string;
  attendees: string[]; // user IDs
  noShows: string[]; // user IDs
  yellowTeam: string[]; // user IDs
  blueTeam: string[]; // user IDs
  yellowScore: number;
  blueScore: number;
  stats: GameStat[];
  isCompleted: boolean;
}

export interface UserStats {
  userId: string;
  gamesPlayed: number;
  wins: number;
  draws: number;
  losses: number;
  points: number; // 승점
  goals: number;
  assists: number;
  semiAssists: number;
  noShows: number;
}

export interface BallisticsState {
  users: User[];
  games: Game[];
  currentGame: Game | null;
  selectedDate: string;
  activeTab: 'leaderboard' | 'add-stats';
}