import { NextRequest, NextResponse } from 'next/server';
import { BigQuery } from '@google-cloud/bigquery';




// const datasetId = 'reno_basic_log';
// const tableId = 'event_log';
// const credentials = JSON.parse(
//     Buffer.from(process.env.GOOGLE_APPLICATION_CREDENTIALS!, 'base64').toString('utf8')
// );

// const bigquery = new BigQuery({
//     credentials,
//     projectId: 'reco-456707', // 또는 하드코딩
// });
// // const bigquery = new BigQuery(); // GOOGLE_APPLICATION_CREDENTIALS 환경변수 필요



export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        if (!body.event_time || !body.event_name) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const rows = [{
            event_time: Array.isArray(body.event_time) ? body.event_time : [body.event_time],
            user_id: body.user_id || null,
            event_name: Array.isArray(body.event_name) ? body.event_name : [body.event_name],
            event_params: body.event_params || null,
            event_type: body.event_type || null,
        }];

        // await bigquery
        //     .dataset(datasetId)
        //     .table(tableId)
        //     .insert(rows);

        return NextResponse.json({ status: 'success' });
    } catch (error) {
        console.error('BigQuery Insert Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
