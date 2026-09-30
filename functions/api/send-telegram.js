export async function onRequestPost(context) {
  const { request, env } = context;
  try {
    const formData = await request.formData(); // supports text fields + file upload together
    const name = formData.get('name') || '';
    const mobile = formData.get('mobile') || formData.get('contact') || '';
    const email = formData.get('email') || '';
    const projectType = formData.get('projectType') || '';
    const budget = formData.get('budget') || '';
    const requirements = formData.get('requirements') || '';
    const file = formData.get('file'); // may be null

    const formattedEmail = email ? email : 'প্রদান করা হয়নি';

    const text =
      `*New Project Request — WebWorldBD*\n\n` +
      `*Name:* ${name}\n` +
      `*Mobile:* ${mobile}\n` +
      `*Email:* ${formattedEmail}\n` +
      `*Project Type:* ${projectType}\n` +
      `*Budget:* ${budget}\n` +
      `*Requirements:* ${requirements}`;

    const TELEGRAM_API = `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}`;

    if (file && file.size > 0) {
      const tgForm = new FormData();
      tgForm.append('chat_id', env.TELEGRAM_CHAT_ID);
      tgForm.append('caption', text.slice(0, 1024));
      tgForm.append('parse_mode', 'Markdown');
      tgForm.append('document', file, file.name);

      const res = await fetch(`${TELEGRAM_API}/sendDocument`, { method: 'POST', body: tgForm });
      if (!res.ok) throw new Error('Telegram sendDocument failed');
    } else {
      const res = await fetch(`${TELEGRAM_API}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: env.TELEGRAM_CHAT_ID, text, parse_mode: 'Markdown' }),
      });
      if (!res.ok) throw new Error('Telegram sendMessage failed');
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
