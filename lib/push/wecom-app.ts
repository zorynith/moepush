interface WecomAppMessage {
  msgtype: string
  touser?: string
  toparty?: string
  totag?: string
  agentid: number
  text?: {
    content: string
  }
  markdown?: {
    content: string
  }
  textcard?: {
    title: string
    description: string
    url: string
    btntxt?: string
  }
  safe?: number
}

export async function sendWecomAppMessage(
  corpId: string,
  agentId: string,
  secret: string,
  message: WecomAppMessage
) {
  console.log('sendWecomAppMessage message:', message)

  const tokenResponse = await fetch(
    `https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid=${corpId}&corpsecret=${secret}`
  )
  const tokenData = await tokenResponse.json() as { access_token: string, errcode: number, errmsg: string }
  
  if (!tokenResponse.ok || !tokenData.access_token) {
    throw new Error(`获取访问令牌失败: ${tokenData.errmsg}`)
  }

  const response = await fetch(
    `https://qyapi.weixin.qq.com/cgi-bin/message/send?access_token=${tokenData.access_token}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...message,
        agentid: parseInt(agentId),
        touser: message.touser || "@all",
      }),
    }
  )

  const data = await response.json() as { errcode: number, errmsg: string }
  if (data.errcode !== 0) {
    throw new Error(`企业微信应用消息推送失败: ${data.errmsg}`)
  }

  return response
} 