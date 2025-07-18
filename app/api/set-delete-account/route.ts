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
        // 요청 본문에서 사용자 ID 추출
        const { userId } = await request.json();

        // 필수 필드 검증
        if (!userId) {
            return NextResponse.json(
                { error: 'User ID is required' },
                { status: 400 }
            );
        }

        const client = await pool.connect();

        try {
            // 트랜잭션 시작
            await client.query('BEGIN');

            // 사용자 존재 여부 확인
            const userCheckResult = await client.query(
                `SELECT user_id FROM users${database_suffixes} WHERE user_id = $1`,
                [userId]
            );

            if (userCheckResult.rows.length === 0) {
                return NextResponse.json(
                    { error: 'User not found' },
                    { status: 404 }
                );
            }

            // diaries 테이블에서 사용자 데이터 삭제
            // (ON DELETE CASCADE가 설정되어 있지만, 명시적으로 삭제)
            await client.query(
                `DELETE FROM diaries${database_suffixes} WHERE user_id = $1`,
                [userId]
            );

            // users 테이블에서 사용자 삭제
            await client.query(
                `DELETE FROM users${database_suffixes} WHERE user_id = $1`,
                [userId]
            );

            // 트랜잭션 커밋
            await client.query('COMMIT');

            return NextResponse.json({
                message: 'Account deleted successfully'
            });
        } catch (error) {
            // 오류 발생 시 롤백
            await client.query('ROLLBACK');
            console.error('Error deleting account:', error);
            throw error;
        } finally {
            client.release();
        }
    } catch (error) {
        console.error('Error processing delete account request:', error);
        return NextResponse.json(
            { error: 'An unexpected error occurred' },
            { status: 500 }
        );
    }
}
