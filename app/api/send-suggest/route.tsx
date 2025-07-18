import { NextResponse } from 'next/server';

// Slack 알림 전송 함수
async function sendSlackNotification(message: string) {
    try {
        const response = await fetch('https://slack.com/api/chat.postMessage', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.SLACK_BOT_TOKEN}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                channel: 'reno_general',
                text: message,
            }),
        });

        if (!response.ok) {
            throw new Error('Slack API 호출 실패');
        }
        console.log('슬랙 알림 전송 성공');
    } catch (error) {
        console.error('슬랙 알림 전송 실패:', error);
    }
}

export async function POST(request: Request) {
    try {
        const { suggestType, message, userId } = await request.json();

        // Slack 메시지 구성
        const slackMessage = `
새로운 제안이 접수되었습니다.
유형: ${suggestType}
사용자: ${userId || '익명'}
내용: ${message}
        `;

        // Slack 알림 전송
        await sendSlackNotification(slackMessage);

        return NextResponse.json({ success: true, message: '제안이 성공적으로 전송되었습니다.' });
    } catch (error) {
        console.error('제안 전송 오류:', error);
        return NextResponse.json({ message: '제안 전송 중 오류가 발생했습니다.' }, { status: 500 });
    }
}

export async function GET(request: Request) {
    return NextResponse.json({ message: 'POST 요청만 지원됩니다.' }, { status: 405 });
}