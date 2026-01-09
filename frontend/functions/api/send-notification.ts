/// <reference types="@cloudflare/workers-types" />

interface NotificationRequest {
    fid: number;
    title: string;
    body: string;
    targetUrl?: string;
}

interface Env {
    NOTIFICATION_TOKENS: KVNamespace;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (context.request.method === 'OPTIONS') {
        return new Response(null, { status: 204, headers: corsHeaders });
    }

    try {
        const { fid, title, body, targetUrl }: NotificationRequest =
            await context.request.json();

        if (!fid || !title || !body) {
            return Response.json(
                { error: 'Missing required fields: fid, title, body' },
                { status: 400, headers: corsHeaders }
            );
        }

        // Get notification token for this FID from KV
        const tokenData = await context.env.NOTIFICATION_TOKENS.get(`fid:${fid}`);

        if (!tokenData) {
            return Response.json(
                { error: 'User has not enabled notifications' },
                { status: 404, headers: corsHeaders }
            );
        }

        const { url, token } = JSON.parse(tokenData);

        // Send notification to Farcaster
        const notificationPayload = {
            notificationId: crypto.randomUUID(),
            title,
            body,
            targetUrl: targetUrl || 'https://fb8f2d60.zeroquest.pages.dev',
            tokens: [token],
        };

        console.log('📤 Sending notification:', notificationPayload);

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(notificationPayload),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Notification failed: ${response.statusText} - ${errorText}`);
        }

        console.log(`✅ Notification sent to FID ${fid}`);

        return Response.json(
            { success: true, message: 'Notification sent' },
            { headers: corsHeaders }
        );
    } catch (error: any) {
        console.error('❌ Send notification error:', error);
        return Response.json(
            { error: error.message },
            { status: 500, headers: corsHeaders }
        );
    }
};
