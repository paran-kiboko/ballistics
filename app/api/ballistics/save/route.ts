import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(request: NextRequest) {
  let connection;
  
  try {
    const data = await request.json();
    connection = await pool.getConnection();
    
    // Start transaction
    await connection.beginTransaction();
    
    try {
      // 1. Insert match
      console.log(`INSERT INTO matches (match_datetime, match_type) VALUES ('${data.match.match_datetime}', '${data.match.match_type}')`);
      const [matchResult] = await connection.execute(
        'INSERT INTO matches (match_datetime, match_type) VALUES (?, ?)',
        [data.match.match_datetime, data.match.match_type]
      );
      const matchId = (matchResult as any).insertId;
      
      // 2. Insert or get teams
      const teamIds: { [key: string]: number } = {};
      
      for (const team of data.teams) {
        // Check if team exists
        const [existingTeam] = await connection.execute(
          'SELECT team_id FROM team WHERE name = ?',
          [team.name]
        );
        
        if ((existingTeam as any[]).length > 0) {
          teamIds[team.name] = (existingTeam as any[])[0].team_id;
        } else {
          // Insert new team
          console.log(`INSERT INTO team (name) VALUES ('${team.name}')`);
          const [teamResult] = await connection.execute(
            'INSERT INTO team (name) VALUES (?)',
            [team.name]
          );
          teamIds[team.name] = (teamResult as any).insertId;
        }
      }
      
      // 3. Insert match_team relationships
      for (const matchTeam of data.match_teams) {
        const teamId = teamIds[data.teams.find((t: any) => t.team_id === matchTeam.team_id)?.name || ''];
        console.log(`INSERT INTO match_team (match_id, team_id, is_home) VALUES (${matchId}, ${teamId}, ${matchTeam.is_home})`);
        await connection.execute(
          'INSERT INTO match_team (match_id, team_id, is_home) VALUES (?, ?, ?)',
          [matchId, teamId, matchTeam.is_home]
        );
      }
      
      // 4. Insert players if they don't exist
      const playerIds: { [key: string]: number } = {};
      const allPlayers = new Set<string>();
      
      // Collect all player names from teams AND stats
      data.yellowTeamMembers.forEach((name: string) => allPlayers.add(name));
      data.blueTeamMembers.forEach((name: string) => allPlayers.add(name));
      data.unassignedMembers.forEach((name: string) => allPlayers.add(name));
      
      // Also collect from stats
      data.stats.forEach((stat: any) => {
        if (stat.player_id) {
          const playerName = getPlayerNameById(stat.player_id, data);
          if (playerName) allPlayers.add(playerName);
        }
      });
      
      // Insert or get player IDs
      for (const playerName of Array.from(allPlayers)) {
        const [existingPlayer] = await connection.execute(
          'SELECT player_id FROM player WHERE name = ?',
          [playerName]
        );
        
        if ((existingPlayer as any[]).length > 0) {
          playerIds[playerName] = (existingPlayer as any[])[0].player_id;
        } else {
          console.log(`INSERT INTO player (name) VALUES ('${playerName}')`);
          const [playerResult] = await connection.execute(
            'INSERT INTO player (name) VALUES (?)',
            [playerName]
          );
          playerIds[playerName] = (playerResult as any).insertId;
        }
      }
      
      // 5. Insert stats
      for (const stat of data.stats) {
        const playerName = getPlayerNameById(stat.player_id, data);
        const playerId = playerName ? playerIds[playerName] : null;
        const teamId = stat.team_id ? teamIds[data.teams.find((t: any) => t.team_id === stat.team_id)?.name || ''] : null;
        
        // For stats that don't require player_id (like OG with team name)
        if (stat.type === 'og' && !playerId) {
          console.log(`INSERT INTO stats (match_id, team_id, player_id, quarter, type) VALUES (${matchId}, ${teamId}, NULL, ${stat.quarter}, '${stat.type}')`);
          await connection.execute(
            'INSERT INTO stats (match_id, team_id, player_id, quarter, type) VALUES (?, ?, ?, ?, ?)',
            [matchId, teamId, null, stat.quarter, stat.type]
          );
        } else {
          console.log(`INSERT INTO stats (match_id, team_id, player_id, quarter, type) VALUES (${matchId}, ${teamId}, ${playerId}, ${stat.quarter}, '${stat.type}')`);
          await connection.execute(
            'INSERT INTO stats (match_id, team_id, player_id, quarter, type) VALUES (?, ?, ?, ?, ?)',
            [matchId, teamId, playerId, stat.quarter, stat.type]
          );
        }
      }
      
      // 6. Insert team members
      // Yellow team members
      const yellowTeamId = teamIds[data.teams[0].name];
      for (const memberName of data.yellowTeamMembers) {
        const playerId = playerIds[memberName];
        if (playerId) {
          // Check if already a teammate
          const [existing] = await connection.execute(
            'SELECT * FROM teammate WHERE team_id = ? AND player_id = ?',
            [yellowTeamId, playerId]
          );
          
          if ((existing as any[]).length === 0) {
            console.log(`INSERT INTO teammate (team_id, player_id) VALUES (${yellowTeamId}, ${playerId})`);
            await connection.execute(
              'INSERT INTO teammate (team_id, player_id) VALUES (?, ?)',
              [yellowTeamId, playerId]
            );
          }
        }
      }
      
      // Blue team members
      const blueTeamId = teamIds[data.teams[1].name];
      for (const memberName of data.blueTeamMembers) {
        const playerId = playerIds[memberName];
        if (playerId) {
          // Check if already a teammate
          const [existing] = await connection.execute(
            'SELECT * FROM teammate WHERE team_id = ? AND player_id = ?',
            [blueTeamId, playerId]
          );
          
          if ((existing as any[]).length === 0) {
            console.log(`INSERT INTO teammate (team_id, player_id) VALUES (${blueTeamId}, ${playerId})`);
            await connection.execute(
              'INSERT INTO teammate (team_id, player_id) VALUES (?, ?)',
              [blueTeamId, playerId]
            );
          }
        }
      }
      
      // Commit transaction
      await connection.commit();
      
      return NextResponse.json({ 
        success: true, 
        message: 'Game data saved successfully',
        matchId: matchId 
      });
      
    } catch (error) {
      // Rollback on error
      await connection.rollback();
      throw error;
    }
    
  } catch (error) {
    console.error('Error saving game data:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to save game data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  } finally {
    if (connection) connection.release();
  }
}

// Helper function to get player name by ID from the data
function getPlayerNameById(playerId: number, data: any): string | null {
  // This is a simplified version - you might need to adjust based on your actual data structure
  const allPlayers = [
    ...(data.yellowTeamMembers || []),
    ...(data.blueTeamMembers || []),
    ...(data.unassignedMembers || [])
  ];
  
  const participantsData = data.participantsData || [];
  if (playerId <= participantsData.length) {
    return participantsData[playerId - 1]?.name || null;
  }
  
  return null;
}