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


export async function POST(request: Request) {
    try {
        // 요청 본문에서 사용자 정보 추출
        const { userId, username, email } = await request.json();

        // 필수 필드 검증
        if (!userId || !email) {
            return NextResponse.json(
                { error: 'User ID and email are required' },
                { status: 400 }
            );
        }

        const client = await pool.connect();

        try {
            // 이미 존재하는 사용자인지 확인
            const checkResult = await client.query(
                `SELECT user_id FROM users${database_suffixes} WHERE user_id = $1`,
                [userId]
            );

            if (checkResult.rows.length > 0) {
                // 기존 사용자 정보 업데이트
                if (username) {
                    await client.query(
                        `UPDATE users${database_suffixes} SET username = $1, email = $2, updated_at = CURRENT_TIMESTAMP, subscription_status = $4 WHERE user_id = $3`,
                        [username, email, userId, 'free']
                    );
                } else {
                    await client.query(
                        `UPDATE users${database_suffixes} SET email = $1, updated_at = CURRENT_TIMESTAMP, subscription_status = $3 WHERE user_id = $2`,
                        [email, userId, 'free']
                    );
                }

                return NextResponse.json({
                    message: 'User updated successfully',
                    userId: userId
                });
            } else {
                // 새 사용자 추가
                await client.query(
                    `INSERT INTO users${database_suffixes} (user_id, username, email, subscription_status) VALUES ($1, $2, $3, $4)`,
                    [userId, username || email.split('@')[0], email, 'free']
                );

                return NextResponse.json({
                    message: 'User created successfully',
                    userId: userId
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
