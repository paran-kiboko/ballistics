import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const matchId = searchParams.get('match_id');
  
  if (!matchId) {
    return NextResponse.json(
      { success: false, error: 'match_id is required' },
      { status: 400 }
    );
  }
  
  let connection;
  
  try {
    connection = await pool.getConnection();
    
    // 1. Get match info
    const [matchData] = await connection.execute(
      'SELECT * FROM matches WHERE match_id = ?',
      [matchId]
    );
    
    if ((matchData as any[]).length === 0) {
      return NextResponse.json(
        { success: false, error: 'Match not found' },
        { status: 404 }
      );
    }
    
    const match = (matchData as any[])[0];
    
    // 2. Get teams
    const [teams] = await connection.execute(
      `SELECT t.*, mt.is_home 
       FROM team t 
       JOIN match_team mt ON t.team_id = mt.team_id 
       WHERE mt.match_id = ?`,
      [matchId]
    );
    
    // 3. Get all stats with player and team info
    const [stats] = await connection.execute(
      `SELECT s.*, p.name as player_name, t.name as team_name 
       FROM stats s 
       LEFT JOIN player p ON s.player_id = p.player_id 
       LEFT JOIN team t ON s.team_id = t.team_id 
       WHERE s.match_id = ?
       ORDER BY s.quarter, s.type`,
      [matchId]
    );
    
    // 4. Get team members
    const teamIds = (teams as any[]).map(t => t.team_id);
    const [teamMembers] = await connection.execute(
      `SELECT tm.team_id, p.player_id, p.name 
       FROM teammate tm 
       JOIN player p ON tm.player_id = p.player_id 
       WHERE tm.team_id IN (${teamIds.map(() => '?').join(',')})`,
      teamIds
    );
    
    // Process data
    const teamsData = (teams as any[]).map(team => {
      const members = (teamMembers as any[])
        .filter(m => m.team_id === team.team_id)
        .map(m => m.name);
      
      const teamStats = (stats as any[]).filter(s => s.team_id === team.team_id);
      
      // Get OGs for this team (OGs are stored with the benefiting team's ID)
      const opposingTeam = (teams as any[]).find(t => t.team_id !== team.team_id);
      const ogsForThisTeam = teamStats
        .filter(s => s.type === 'og')
        .map(og => ({
          ...og,
          team_name: opposingTeam?.name || 'Unknown'
        }));
      
      return {
        ...team,
        members,
        goals: teamStats.filter(s => s.type === 'goal'),
        ogs: ogsForThisTeam, // OGs scored by opposing team
        assists: teamStats.filter(s => s.type === 'assist'),
        semiAssists: teamStats.filter(s => s.type === 'semi assist'),
        goalkeepers: teamStats.filter(s => s.type === 'GK')
      };
    });
    
    // Get referees and no-shows
    const referees = (stats as any[]).filter(s => s.type === 'referee');
    const assistantReferees = (stats as any[]).filter(s => s.type === 'assistance referee');
    const noShows = (stats as any[]).filter(s => s.type === 'no show');
    
    return NextResponse.json({
      success: true,
      data: {
        match,
        teams: teamsData,
        referees,
        assistantReferees,
        noShows
      }
    });
    
  } catch (error) {
    console.error('Error fetching match data:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch match data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  } finally {
    if (connection) connection.release();
  }
}