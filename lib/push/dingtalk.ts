interface DingTalkMessage {
  msgtype: string
  text?: {
    content: string
  }
  markdown?: {
    title: string
    text: string
  }
  link?: {
    title: string
    text: string
    picUrl?: string
    messageUrl: string
  }
  at?: {
    atMobiles?: string[]
    atUserIds?: string[]
    isAtAll?: boolean
  }
}

async function generateDingTalkSign(secret: string, timestamp: number): Promise<string> {
  const encoder = new TextEncoder()
  const keyData = encoder.encode(secret)
  const msgData = encoder.encode(`${timestamp}\n${secret}`)

  const key = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )

  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    msgData
  )

  return btoa(String.fromCharCode(...new Uint8Array(signature)))
}

export async function sendDingTalkMessage(
  webhook: string,
  message: DingTalkMessage,
  secret?: string | null
) {
  try {
    let url = webhook
    // 如果提供了加签密钥，添加签名参数
    if (secret) {
      const timestamp = Date.now()
      const sign = await generateDingTalkSign(secret, timestamp)
      // 使用新的URL对象来处理参数拼接
      const urlObj = new URL(webhook)
      urlObj.searchParams.append('timestamp', timestamp.toString())
      urlObj.searchParams.append('sign', sign)
      url = urlObj.toString()
    }

    console.log('Sending DingTalk message to:', url)
    console.log('Message:', message)

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    })

    const data = await response.json() as { errcode: number, errmsg: string }
    if (data.errcode !== 0) {
      throw new Error(`钉钉消息推送失败: ${data.errmsg}`)
    }

    return response
  } catch (error) {
    console.error('DingTalk error:', error)
    throw error
  }
} 