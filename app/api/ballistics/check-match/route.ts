import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const datetime = searchParams.get('datetime');
  
  if (!datetime) {
    return NextResponse.json(
      { success: false, error: 'datetime is required' },
      { status: 400 }
    );
  }
  
  let connection;
  
  try {
    connection = await pool.getConnection();
    
    // Check if a match exists with the given datetime
    const [matches] = await connection.execute(
      'SELECT match_id FROM matches WHERE DATE(match_datetime) = DATE(?)',
      [datetime]
    );
    
    if ((matches as any[]).length > 0) {
      return NextResponse.json({
        success: true,
        exists: true,
        matchId: (matches as any[])[0].match_id
      });
    } else {
      return NextResponse.json({
        success: true,
        exists: false
      });
    }
    
  } catch (error) {
    console.error('Error checking match:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to check match',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  } finally {
    if (connection) connection.release();
  }
}