import { NextResponse } from 'next/server';
import { Pool } from 'pg';

// PostgreSQL 연결 설정 - SSL 관련 모든 오류 무시
const pool = new Pool({
    user: process.env.C_POSTGRES_USER,
    password: process.env.C_POSTGRES_PASSWORD,
    host: process.env.C_POSTGRES_HOST,
    port: parseInt(process.env.C_POSTGRES_PORT || '5432'),
    database: process.env.C_POSTGRES_DATABASE,
    ssl: {
        rejectUnauthorized: false
    }
});

const database_suffixes = process.env.C_POSTGRES_DATABASE_SUFFIXES || '';

// 연결 테스트
pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
    // process.exit(-1); // 서비스 중단되지 않도록 제거
});

// 초기 연결 테스트
try {
    pool.query('SELECT NOW()')
        .then(res => {
            console.log('Database connection successful, server time:', res.rows[0].now);
        })
        .catch(err => {
            console.error('Database connection test failed:', err);
        });
} catch (error) {
    console.error('Error during test query:', error);
}

export async function GET(request: Request) {
    try {
        // URL에서 쿼리 파라미터 추출
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        // 필수 파라미터 검증
        if (!userId) {
            return NextResponse.json(
                { error: 'User ID is required' },
                { status: 400 }
            );
        }

        const client = await pool.connect();

        try {
            // 사용자 정보 조회
            const result = await client.query(
                `SELECT user_id, username, email, created_at, updated_at FROM users${database_suffixes} WHERE user_id = $1`,
                [userId]
            );

            if (result.rows.length === 0) {
                return NextResponse.json(
                    { error: 'User not found' },
                    { status: 404 }
                );
            }

            return NextResponse.json({
                message: 'User retrieved successfully',
                user: result.rows[0]
            });
        } finally {
            client.release();
        }
    } catch (error) {
        console.error('Error retrieving user:', error);
        return NextResponse.json(
            { message: 'An unexpected error occurred' },
            { status: 500 }
        );
    }
}
