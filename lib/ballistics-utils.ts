import { Game, User, UserStats } from '@/types/ballistics';

export function calculateUserStats(users: User[], games: Game[]): UserStats[] {
  return users.map(user => {
    const userStats: UserStats = {
      userId: user.id,
      gamesPlayed: 0,
      wins: 0,
      draws: 0,
      losses: 0,
      points: 0,
      goals: 0,
      assists: 0,
      semiAssists: 0,
      noShows: 0,
    };

    // 완료된 게임들만 계산
    const completedGames = games.filter(game => game.isCompleted);

    completedGames.forEach(game => {
      // No Show 체크
      if (game.noShows.includes(user.id)) {
        userStats.noShows++;
        userStats.points -= 1; // No Show: -1점
        return; // No Show인 경우 다른 통계는 계산하지 않음
      }

      // 참석한 게임만 계산
      if (game.attendees.includes(user.id)) {
        userStats.gamesPlayed++;

        // 승부 판정
        const isYellowTeam = game.yellowTeam.includes(user.id);
        const isBlueTeam = game.blueTeam.includes(user.id);

        if (isYellowTeam || isBlueTeam) {
          const userTeamScore = isYellowTeam ? game.yellowScore : game.blueScore;
          const opponentScore = isYellowTeam ? game.blueScore : game.yellowScore;

          if (userTeamScore > opponentScore) {
            userStats.wins++;
            userStats.points += 3; // 승: 3점
          } else if (userTeamScore === opponentScore) {
            userStats.draws++;
            userStats.points += 2; // 무: 2점
          } else {
            userStats.losses++;
            userStats.points += 1; // 패: 1점
          }
        }

        // 개인 기록 통계
        game.stats.forEach(stat => {
          if (stat.userId === user.id) {
            switch (stat.type) {
              case 'goal':
                userStats.goals++;
                break;
              case 'assist':
                userStats.assists++;
                break;
              case 'semi_assist':
                userStats.semiAssists++;
                break;
            }
          }
        });
      }
    });

    return userStats;
  });
}

export function getQuarterStats(game: Game, quarter: string) {
  return game.stats.filter(stat => stat.quarter === quarter);
}

export function getUserName(users: User[], userId: string): string {
  const user = users.find(u => u.id === userId);
  return user?.name || '알 수 없음';
}

export function formatStatDisplay(stat: any, users: User[]): string {
  const userName = getUserName(users, stat.userId);
  const time = new Date(stat.timestamp).toLocaleTimeString('ko-KR', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  switch (stat.type) {
    case 'goal':
      return `⚽ ${userName} (${time})`;
    case 'assist':
      return `📤 ${userName} (${time})`;
    case 'semi_assist':
      return `🔄 ${userName} (${time})`;
    default:
      return `${userName} (${time})`;
  }
}

export function getTeamColor(team: 'yellow' | 'blue'): string {
  return team === 'yellow' ? 'text-yellow-600' : 'text-blue-600';
}

export function getTeamBgColor(team: 'yellow' | 'blue'): string {
  return team === 'yellow' ? 'bg-yellow-50 border-yellow-400' : 'bg-blue-50 border-blue-400';
}