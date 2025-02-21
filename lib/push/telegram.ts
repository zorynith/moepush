interface TelegramMessage {
  chat_id: string
  text: string
  parse_mode?: "HTML" | "Markdown" | "MarkdownV2"
  disable_web_page_preview?: boolean
  disable_notification?: boolean
}

export async function sendTelegramMessage(
  botToken: string,
  message: TelegramMessage
) {
  console.log('sendTelegramMessage message:', message)

  const response = await fetch(
    `https://api.telegram.org/bot${botToken}/sendMessage`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    }
  )

  if (!response.ok) {
    const data = await response.json() as { description: string }
    throw new Error(`Telegram 消息推送失败: ${data.description}`)
  }

  return response
} 