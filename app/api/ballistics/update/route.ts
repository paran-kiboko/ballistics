import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(request: NextRequest) {
  let connection;
  
  try {
    const { matchId, changes } = await request.json();
    
    if (!matchId) {
      return NextResponse.json(
        { success: false, error: 'matchId is required' },
        { status: 400 }
      );
    }
    
    connection = await pool.getConnection();
    
    // Start transaction
    await connection.beginTransaction();
    
    try {
      // 1. Update match if needed
      if (changes.match) {
        console.log(`UPDATE matches SET match_type = '${changes.match.match_type}' WHERE match_id = ${matchId}`);
        await connection.execute(
          'UPDATE matches SET match_type = ? WHERE match_id = ?',
          [changes.match.match_type, matchId]
        );
      }
      
      // 2. Update teams if needed
      if (changes.teams && changes.teams.length > 0) {
        for (const team of changes.teams) {
          if (team.name && team.team_id) {
            console.log(`UPDATE team SET name = '${team.name}' WHERE team_id = ${team.team_id}`);
            await connection.execute(
              'UPDATE team SET name = ? WHERE team_id = ?',
              [team.name, team.team_id]
            );
          }
        }
      }
      
      // 3. Handle player changes
      if (changes.players) {
        const playerIds: { [key: string]: number } = {};
        
        // Add new players
        for (const playerName of changes.players.added || []) {
          // Check if player exists
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
      }
      
      // 4. Handle team member changes
      if (changes.teamMembers) {
        // Remove team members
        for (const removal of changes.teamMembers.removed || []) {
          console.log(`DELETE FROM teammate WHERE team_id = ${removal.team_id} AND player_id = ${removal.player_id}`);
          await connection.execute(
            'DELETE FROM teammate WHERE team_id = ? AND player_id = ?',
            [removal.team_id, removal.player_id]
          );
        }
        
        // Add team members
        for (const addition of changes.teamMembers.added || []) {
          // Check if already exists
          const [existing] = await connection.execute(
            'SELECT * FROM teammate WHERE team_id = ? AND player_id = ?',
            [addition.team_id, addition.player_id]
          );
          
          if ((existing as any[]).length === 0) {
            console.log(`INSERT INTO teammate (team_id, player_id) VALUES (${addition.team_id}, ${addition.player_id})`);
            await connection.execute(
              'INSERT INTO teammate (team_id, player_id) VALUES (?, ?)',
              [addition.team_id, addition.player_id]
            );
          }
        }
      }
      
      // 5. Handle stats changes
      if (changes.stats) {
        // Remove deleted stats
        for (const statId of changes.stats.removed || []) {
          console.log(`DELETE FROM stats WHERE stat_id = ${statId}`);
          await connection.execute(
            'DELETE FROM stats WHERE stat_id = ?',
            [statId]
          );
        }
        
        // Add new stats
        for (const stat of changes.stats.added || []) {
          console.log(`INSERT INTO stats (match_id, team_id, player_id, quarter, type) VALUES (${matchId}, ${stat.team_id}, ${stat.player_id}, ${stat.quarter}, '${stat.type}')`);
          await connection.execute(
            'INSERT INTO stats (match_id, team_id, player_id, quarter, type) VALUES (?, ?, ?, ?, ?)',
            [matchId, stat.team_id, stat.player_id, stat.quarter, stat.type]
          );
        }
      }
      
      // Commit transaction
      await connection.commit();
      
      return NextResponse.json({ 
        success: true, 
        message: 'Match data updated successfully',
        matchId: matchId 
      });
      
    } catch (error) {
      // Rollback on error
      await connection.rollback();
      throw error;
    }
    
  } catch (error) {
    console.error('Error updating match data:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update match data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  } finally {
    if (connection) connection.release();
  }
}