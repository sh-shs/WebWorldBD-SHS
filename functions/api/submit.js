// Cloudflare Pages Function: functions/api/submit.js

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json',
};

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: CORS_HEADERS,
  });
}

export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    // Sanitize Telegram Bot Token & Chat ID environment variables
    let botToken = (env.TELEGRAM_BOT_TOKEN || '').trim().replace(/^["']|["']$/g, '');
    if (botToken.toLowerCase().startsWith('bot')) {
      botToken = botToken.slice(3);
    }

    let chatId = (env.TELEGRAM_CHAT_ID || '').trim().replace(/^["']|["']$/g, '');

    if (!botToken || !chatId) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Telegram Bot configuration missing in server environment variables.',
        }),
        {
          status: 500,
          headers: CORS_HEADERS,
        }
      );
    }

    const formData = await request.formData();

    const name = formData.get('name') || formData.get('fullName') || 'প্রদান করা হয়নি';
    const mobile = formData.get('mobile') || formData.get('contact') || formData.get('phone') || 'প্রদান করা হয়নি';
    const email = formData.get('email') || 'প্রদান করা হয়নি';
    const category = formData.get('category') || formData.get('projectType') || formData.get('serviceType') || 'অন্যান্য / Custom';
    const description = formData.get('description') || formData.get('requirements') || formData.get('desc') || 'কোন বিবরণ দেওয়া হয়নি';
    const file = formData.get('file') || formData.get('attachment');

    const formattedMessage =
      `🚀 নতুন প্রজেক্ট রিকোয়েস্ট!\n\n` +
      `👤 নাম: ${name}\n` +
      `📞 মোবাইল: ${mobile}\n` +
      `📧 ইমেইল: ${email}\n` +
      `📁 ক্যাটাগরি: ${category}\n` +
      `📝 বিবরণ: ${description}`;

    const TELEGRAM_API = `https://api.telegram.org/bot${botToken}`;

    let telegramSuccess = false;
    let telegramErrorMsg = '';

    // If file is attached and valid size
    if (file && typeof file === 'object' && typeof file.size === 'number' && file.size > 0) {
      try {
        const tgDocForm = new FormData();
        tgDocForm.append('chat_id', chatId);
        tgDocForm.append('caption', formattedMessage.slice(0, 1024));
        tgDocForm.append('document', file, file.name || 'attachment');

        const tgRes = await fetch(`${TELEGRAM_API}/sendDocument`, {
          method: 'POST',
          body: tgDocForm,
        });

        const tgData = await tgRes.json();

        if (tgRes.ok && tgData.ok) {
          telegramSuccess = true;
        } else {
          console.warn('sendDocument failed, falling back to sendMessage:', tgData);
          telegramErrorMsg = tgData.description || `HTTP ${tgRes.status}: sendDocument API error`;
        }
      } catch (docErr) {
        console.warn('Exception during sendDocument, falling back to sendMessage:', docErr);
        telegramErrorMsg = docErr.message || 'File upload error';
      }
    }

    // Fallback or No-File path: Send text message
    if (!telegramSuccess) {
      const fallbackNote = (file && typeof file === 'object' && typeof file.size === 'number' && file.size > 0)
        ? `\n\n⚠️ নোট: ফাইলটি টেলিগ্রামে পাঠাতে সমস্যা হয়েছে (${telegramErrorMsg || 'ফাইল সাইজ বা সার্ভার ইস্যু'}), শুধুমাত্র বিবরণী পাঠানো হলো।`
        : '';

      const tgMsgRes = await fetch(`${TELEGRAM_API}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: formattedMessage + fallbackNote,
        }),
      });

      const tgMsgData = await tgMsgRes.json();

      if (tgMsgRes.ok && tgMsgData.ok) {
        telegramSuccess = true;
      } else {
        const errDetail = tgMsgData.description || `Telegram API Error (${tgMsgRes.status})`;
        return new Response(
          JSON.stringify({
            success: false,
            error: errDetail,
          }),
          {
            status: tgMsgRes.status === 401 ? 401 : 500,
            headers: CORS_HEADERS,
          }
        );
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'প্রজেক্ট রিকোয়েস্ট সফলভাবে পাঠানো হয়েছে।',
      }),
      {
        status: 200,
        headers: CORS_HEADERS,
      }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({
        success: false,
        error: err.message || 'Internal Server Error',
      }),
      {
        status: 500,
        headers: CORS_HEADERS,
      }
    );
  }
}
