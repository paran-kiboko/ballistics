import { BallisticsState } from '@/types/ballistics';

const STORAGE_KEY = 'ballistics-data';

export function saveBallisticsData(state: BallisticsState): void {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(STORAGE_KEY, serializedState);
  } catch (error) {
    console.error('Error saving ballistics data to localStorage:', error);
  }
}

export function loadBallisticsData(): BallisticsState | null {
  try {
    const serializedState = localStorage.getItem(STORAGE_KEY);
    if (serializedState === null) {
      return null;
    }
    return JSON.parse(serializedState);
  } catch (error) {
    console.error('Error loading ballistics data from localStorage:', error);
    return null;
  }
}

export function clearBallisticsData(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing ballistics data from localStorage:', error);
  }
}

// 개별 데이터 저장/로드 함수들
export function saveUsers(users: any[]): void {
  try {
    localStorage.setItem('ballistics-users', JSON.stringify(users));
  } catch (error) {
    console.error('Error saving users data:', error);
  }
}

export function loadUsers(): any[] {
  try {
    const data = localStorage.getItem('ballistics-users');
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading users data:', error);
    return [];
  }
}

export function saveGames(games: any[]): void {
  try {
    localStorage.setItem('ballistics-games', JSON.stringify(games));
  } catch (error) {
    console.error('Error saving games data:', error);
  }
}

export function loadGames(): any[] {
  try {
    const data = localStorage.getItem('ballistics-games');
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading games data:', error);
    return [];
  }
}