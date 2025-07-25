import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request: NextRequest) {
  let connection;
  
  try {
    connection = await pool.getConnection();
    
    // Get player statistics
    const [playerStats] = await connection.execute(`
      SELECT 
        p.player_id,
        p.name,
        COUNT(DISTINCT CASE WHEN s.type IN ('goal', 'assist', 'semi assist', 'GK', 'referee', 'assistance referee') THEN s.match_id END) as matches_played,
        COUNT(CASE WHEN s.type = 'goal' THEN 1 END) as goals,
        COUNT(CASE WHEN s.type = 'assist' THEN 1 END) as assists,
        COUNT(CASE WHEN s.type = 'semi assist' THEN 1 END) as semi_assists,
        COUNT(CASE WHEN s.type = 'GK' THEN 1 END) as gk_quarters,
        COUNT(CASE WHEN s.type = 'referee' THEN 1 END) as referee_quarters,
        COUNT(CASE WHEN s.type = 'assistance referee' THEN 1 END) as assistant_referee_quarters,
        COUNT(CASE WHEN s.type = 'no show' THEN 1 END) as no_shows,
        -- Calculate points: 3 for goal, 2 for assist, 1 for semi-assist
        (COUNT(CASE WHEN s.type = 'goal' THEN 1 END) * 3 + 
         COUNT(CASE WHEN s.type = 'assist' THEN 1 END) * 2 + 
         COUNT(CASE WHEN s.type = 'semi assist' THEN 1 END) * 1) as points
      FROM player p
      LEFT JOIN stats s ON p.player_id = s.player_id
      GROUP BY p.player_id, p.name
      HAVING matches_played > 0 OR no_shows > 0
      ORDER BY points DESC, goals DESC, assists DESC
    `);
    
    // Get team statistics
    const [teamStats] = await connection.execute(`
      SELECT 
        t.team_id,
        t.name,
        COUNT(DISTINCT mt.match_id) as matches_played,
        SUM(CASE WHEN mt.is_home = 1 THEN 1 ELSE 0 END) as home_games,
        SUM(CASE WHEN mt.is_home = 0 THEN 1 ELSE 0 END) as away_games,
        COUNT(DISTINCT tm.player_id) as total_players
      FROM team t
      LEFT JOIN match_team mt ON t.team_id = mt.team_id
      LEFT JOIN teammate tm ON t.team_id = tm.team_id
      GROUP BY t.team_id, t.name
      ORDER BY matches_played DESC
    `);
    
    // Get recent matches
    const [recentMatches] = await connection.execute(`
      SELECT 
        m.match_id,
        m.match_datetime,
        m.match_type,
        GROUP_CONCAT(
          CONCAT(t.name, ':', 
            (SELECT COUNT(*) FROM stats s2 
             WHERE s2.match_id = m.match_id 
             AND s2.team_id = t.team_id 
             AND s2.type = 'goal')
          ) SEPARATOR ' vs '
        ) as score_summary
      FROM matches m
      JOIN match_team mt ON m.match_id = mt.match_id
      JOIN team t ON mt.team_id = t.team_id
      GROUP BY m.match_id, m.match_datetime, m.match_type
      ORDER BY m.match_datetime DESC
      LIMIT 10
    `);
    
    // Get MVP candidates (players with highest points per match)
    const [mvpStats] = await connection.execute(`
      SELECT 
        p.name,
        COUNT(DISTINCT s.match_id) as matches,
        SUM(CASE WHEN s.type = 'goal' THEN 3 
            WHEN s.type = 'assist' THEN 2 
            WHEN s.type = 'semi assist' THEN 1 
            ELSE 0 END) as total_points,
        ROUND(SUM(CASE WHEN s.type = 'goal' THEN 3 
                  WHEN s.type = 'assist' THEN 2 
                  WHEN s.type = 'semi assist' THEN 1 
                  ELSE 0 END) / COUNT(DISTINCT s.match_id), 2) as points_per_match
      FROM player p
      JOIN stats s ON p.player_id = s.player_id
      WHERE s.type IN ('goal', 'assist', 'semi assist')
      GROUP BY p.player_id, p.name
      HAVING matches >= 3
      ORDER BY points_per_match DESC
      LIMIT 5
    `);
    
    return NextResponse.json({
      success: true,
      data: {
        players: playerStats,
        teams: teamStats,
        recentMatches: recentMatches,
        mvpCandidates: mvpStats
      }
    });
    
  } catch (error) {
    console.error('Error fetching leaderboard data:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch leaderboard data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  } finally {
    if (connection) connection.release();
  }
}