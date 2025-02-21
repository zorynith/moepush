import { NextRequest } from "next/server"
import { getDb } from "@/lib/db"
import { endpoints } from "@/lib/db/schema/endpoints"
import { CHANNEL_TYPES } from "@/lib/constants/channels"
import { sendDingTalkMessage } from "@/lib/push/dingtalk"
import { sendWecomAppMessage } from "@/lib/push/wecom-app"
import { eq } from "drizzle-orm"
import { safeInterpolate } from "@/lib/template"
import { sendWecomMessage } from "@/lib/push/wecom"
import { sendTelegramMessage } from "@/lib/push/telegram"

export const runtime = "edge"

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const db = await getDb()
    const endpoint = await db.query.endpoints.findFirst({
      where: eq(endpoints.id, id),
      with: {
        channel: true,
      },
    })

    if (!endpoint || !endpoint.channel) {
      return new Response("接口不存在", { status: 404 })
    }

    if (endpoint.status !== "active") {
      return new Response("接口已禁用", { status: 403 })
    }

    const body = await request.json()
    console.log('body:', body)

    const processedTemplate = safeInterpolate(endpoint.rule, {
      body,
    })

    const messageObj = JSON.parse(processedTemplate)

    switch (endpoint.channel.type) {
      case CHANNEL_TYPES.DINGTALK:
        if (!endpoint.channel.webhook) {
          return new Response("缺少 Webhook 地址", { status: 400 })
        }
        await sendDingTalkMessage(endpoint.channel.webhook, messageObj, endpoint.channel.secret)
        break
      case CHANNEL_TYPES.WECOM:
        if (!endpoint.channel.webhook) {
          return new Response("缺少 Webhook 地址", { status: 400 })
        }
        await sendWecomMessage(endpoint.channel.webhook, messageObj)
        break
      case CHANNEL_TYPES.WECOM_APP:
        if (!endpoint.channel.corpId || !endpoint.channel.agentId || !endpoint.channel.secret) {
          return new Response("缺少必要的配置信息", { status: 400 })
        }

        console.log('Wecom message:', messageObj)
        await sendWecomAppMessage(
          endpoint.channel.corpId,
          endpoint.channel.agentId,
          endpoint.channel.secret,
          messageObj
        )
        break
      case CHANNEL_TYPES.TELEGRAM:
        if (!endpoint.channel.botToken || !endpoint.channel.chatId) {
          return new Response("缺少 Bot Token 或 Chat ID", { status: 400 })
        }
        await sendTelegramMessage(endpoint.channel.botToken, {
          chat_id: endpoint.channel.chatId,
          ...messageObj,
        })
        break
      default:
        break
    }

    return new Response(JSON.stringify({ message: "推送成功" }), { status: 200 })

  } catch (error) {
    console.error("Push error:", error)
    return new Response(
      JSON.stringify({ message: error instanceof Error ? error.message : "推送失败" }),
      { status: 500 }
    )
  }
} 