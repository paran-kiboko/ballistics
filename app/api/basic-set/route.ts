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

export async function POST(request: Request) {
    try {
        // 요청 본문에서 사용자 정보 추출
        const { username, email } = await request.json();

        // 필수 필드 검증
        if (!username || !email) {
            return NextResponse.json(
                { error: 'Username and email are required' },
                { status: 400 }
            );
        }

        const client = await pool.connect();

        try {
            // 이미 존재하는 사용자인지 확인
            const checkResult = await client.query(
                `SELECT user_id FROM users${database_suffixes} WHERE email = $1`,
                [email]
            );

            if (checkResult.rows.length > 0) {
                // 기존 사용자의 updated_at 갱신
                await client.query(
                    'UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE email = $1',
                    [email]
                );

                return NextResponse.json({
                    message: 'User updated successfully',
                    userId: checkResult.rows[0].user_id
                });
            } else {
                // 새 사용자 추가
                const result = await client.query(
                    'INSERT INTO users (username, email) VALUES ($1, $2) RETURNING user_id',
                    [username, email]
                );

                return NextResponse.json({
                    message: 'User created successfully',
                    userId: result.rows[0].user_id
                });
            }
        } finally {
            client.release();
        }
    } catch (error) {
        console.error('Error setting user:', error);
        return NextResponse.json(
            { message: 'An unexpected error occurred' },
            { status: 500 }
        );
    }
}
