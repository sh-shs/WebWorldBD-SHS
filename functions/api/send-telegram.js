export async function onRequestPost(context) {
  const { request, env } = context;
  try {
    // Debug logging (boolean presence check only - visible in Cloudflare Function logs)
    console.log('TELEGRAM_BOT_TOKEN defined:', !!env.TELEGRAM_BOT_TOKEN);
    console.log('TELEGRAM_CHAT_ID defined:', !!env.TELEGRAM_CHAT_ID);

    // Sanitize Telegram Bot Token & Chat ID environment variables
    let botToken = (env.TELEGRAM_BOT_TOKEN || '').trim().replace(/^["']|["']$/g, '');
    if (botToken.toLowerCase().startsWith('bot')) {
      botToken = botToken.slice(3);
    }

    let chatId = (env.TELEGRAM_CHAT_ID || '').trim().replace(/^["']|["']$/g, '');

    if (!botToken || !chatId) {
      console.error('Telegram Bot configuration missing in server environment variables.');
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Telegram Bot configuration missing in server environment variables.',
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const formData = await request.formData(); // supports text fields + file upload together
    const name = formData.get('name') || '';
    const mobile = formData.get('mobile') || formData.get('contact') || '';
    const email = formData.get('email') || '';
    const projectType = formData.get('projectType') || formData.get('category') || '';
    const requirements = formData.get('requirements') || formData.get('description') || '';
    const file = formData.get('file'); // may be null

    const formattedEmail = email ? email : 'প্রদান করা হয়নি';

    const text =
      `*New Project Request — WebWorldBD*\n\n` +
      `*Name:* ${name}\n` +
      `*Mobile:* ${mobile}\n` +
      `*Email:* ${formattedEmail}\n` +
      `*Project Category:* ${projectType}\n` +
      `*Requirements:* ${requirements}`;

    const TELEGRAM_API = `https://api.telegram.org/bot${botToken}`;

    if (file && file.size > 0) {
      const tgForm = new FormData();
      tgForm.append('chat_id', chatId);
      tgForm.append('caption', text.slice(0, 1024));
      tgForm.append('parse_mode', 'Markdown');
      tgForm.append('document', file, file.name);

      const res = await fetch(`${TELEGRAM_API}/sendDocument`, { method: 'POST', body: tgForm });
      const tgData = await res.json().catch(() => ({}));
      if (!res.ok || tgData.ok === false) {
        console.error('Telegram sendDocument failed:', tgData);
        throw new Error(tgData.description || `Telegram API sendDocument failed (${res.status})`);
      }
    } else {
      const res = await fetch(`${TELEGRAM_API}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'Markdown' }),
      });
      const tgData = await res.json().catch(() => ({}));
      if (!res.ok || tgData.ok === false) {
        console.error('Telegram sendMessage failed:', tgData);
        throw new Error(tgData.description || `Telegram API sendMessage failed (${res.status})`);
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Error in send-telegram function:', err.message);
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
