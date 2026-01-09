/// <reference types="@cloudflare/workers-types" />

interface NotificationEvent {
    event: 'miniapp.added' | 'miniapp.removed';
    notificationDetails?: {
        url: string;
        token: string;
    };
    data: {
        fid: number;
        timestamp: number;
    };
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
        const event: NotificationEvent = await context.request.json();

        console.log('📥 Webhook event received:', event);

        if (event.event === 'miniapp.added' && event.notificationDetails) {
            const { fid } = event.data;
            const { url, token } = event.notificationDetails;

            // Store notification token in KV
            await context.env.NOTIFICATION_TOKENS.put(
                `fid:${fid}`,
                JSON.stringify({
                    url,
                    token,
                    addedAt: Date.now(),
                })
            );

            console.log(`✅ Notification token saved for FID ${fid}`);

            return Response.json(
                { success: true, message: 'Token stored' },
                { headers: corsHeaders }
            );
        }

        if (event.event === 'miniapp.removed') {
            const { fid } = event.data;

            await context.env.NOTIFICATION_TOKENS.delete(`fid:${fid}`);

            console.log(`❌ Notification token removed for FID ${fid}`);

            return Response.json(
                { success: true, message: 'Token removed' },
                { headers: corsHeaders }
            );
        }

        return Response.json(
            { success: true },
            { headers: corsHeaders }
        );
    } catch (error: any) {
        console.error('❌ Webhook error:', error);
        return Response.json(
            { error: error.message },
            { status: 500, headers: corsHeaders }
        );
    }
};
