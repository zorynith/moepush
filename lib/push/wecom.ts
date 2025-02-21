interface WecomMessage {
  msgtype: "text" | "markdown"
  text?: {
    content: string
    mentioned_list?: string[]
    mentioned_mobile_list?: string[]
  }
  markdown?: {
    content: string
  }
}

export async function sendWecomMessage(
  webhook: string,
  message: WecomMessage
) {
  console.log('sendWecomMessage message:', message)

  const response = await fetch(webhook, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  })

  if (!response.ok) {
    const data = await response.json() as { errmsg: string }
    throw new Error(`企业微信机器人消息推送失败: ${data.errmsg}`)
  }

  return response
} 