export const CHANNEL_TYPES = {
  DINGTALK: "dingtalk",
  WECOM: "wecom",
  WECOM_APP: "wecom_app",
  TELEGRAM: "telegram",
} as const

export type ChannelType = typeof CHANNEL_TYPES[keyof typeof CHANNEL_TYPES]

export const CHANNEL_LABELS: Record<ChannelType, string> = {
  [CHANNEL_TYPES.DINGTALK]: "钉钉群机器人",
  [CHANNEL_TYPES.WECOM]: "企业微信群机器人",
  [CHANNEL_TYPES.WECOM_APP]: "企业微信应用",
  [CHANNEL_TYPES.TELEGRAM]: "Telegram 机器人",
}

export interface Channel {
  id: string
  name: string
  type: ChannelType
  webhook: string
  secret?: string  // 钉钉机器人的加签密钥
  corpId?: string
  agentId?: string
  status: "active" | "inactive"
  createdAt: string
  botToken?: string
  chatId?: string
} 