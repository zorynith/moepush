import { ChannelType, CHANNEL_TYPES } from "./channels"

export interface TemplateField {
  key: string
  description?: string
  required?: boolean
  component?: 'input' | 'textarea' | 'checkbox' | 'select' | 'hidden'
  defaultValue?: string
}

export interface TemplateVariable {
  key: string
  description: string
  example: string
}

export interface MessageTemplate {
  type: string
  name: string
  description: string
  fields: TemplateField[]
}

export const DINGTALK_TEMPLATES = {
  TEXT: "text",
  MARKDOWN: "markdown",
} as const

export const WECOM_APP_TEMPLATES = {
  TEXT: "text",
  MARKDOWN: "markdown",
} as const

export const TELEGRAM_TEMPLATES = {
  HTML: "HTML",
  MARKDOWN: "MarkdownV2",
} as const

export const CHANNEL_TEMPLATES: Record<ChannelType, MessageTemplate[]> = {
  [CHANNEL_TYPES.DINGTALK]: [
    {
      type: DINGTALK_TEMPLATES.TEXT,
      name: "文本消息",
      description: "最基础的消息类型",
      fields: [
        { key: "text.content", description: "消息内容", required: true, component: 'textarea' },
        { key: "at.atMobiles", description: "被@人的手机号" },
        { key: "at.atUserIds", description: "被@人的用户ID" },
        { key: "at.isAtAll", description: "是否@所有人", component: 'checkbox' },
        { key: "msgtype", component: 'hidden', defaultValue: "text" },
      ],
    },
    {
      type: DINGTALK_TEMPLATES.MARKDOWN,
      name: "Markdown消息",
      description: "支持Markdown格式的富文本消息",
      fields: [
        { key: "markdown.title", description: "首屏会话透出的展示内容", required: true },
        { key: "markdown.text", description: "markdown格式的消息内容", required: true, component: 'textarea' },
        { key: "at.atMobiles", description: "被@人的手机号" },
        { key: "at.atUserIds", description: "被@人的用户ID" },
        { key: "at.isAtAll", description: "是否@所有人", component: 'checkbox' },
        { key: "msgtype", component: 'hidden', defaultValue: "markdown" },
      ],
    },
  ],
  [CHANNEL_TYPES.WECOM]: [
    {
      type: "text",
      name: "文本消息",
      description: "发送普通文本消息，支持@用户",
      fields: [
        {
          key: "text.content",
          description: "消息内容",
          required: true,
          component: "textarea"
        },
        {
          key: "text.mentioned_list",
          description: "需要@的用户ID列表，使用逗号分隔",
          component: "input"
        },
        {
          key: "text.mentioned_mobile_list",
          description: "需要@的手机号列表，使用逗号分隔",
          component: "input"
        },
        { key: "msgtype", component: 'hidden', defaultValue: "text" },
      ]
    },
    {
      type: "markdown",
      name: "Markdown消息",
      description: "发送Markdown格式的消息, 支持在content中使用<@userid>扩展语法来@群成员",
      fields: [
        {
          key: "markdown.content",
          description: "Markdown内容",
          required: true,
          component: "textarea"
        },
        { key: "msgtype", component: 'hidden', defaultValue: "markdown" },
      ]
    }
  ],
  [CHANNEL_TYPES.WECOM_APP]: [
    {
      type: WECOM_APP_TEMPLATES.TEXT,
      name: "文本消息",
      description: "最基础的消息类型",
      fields: [
        { key: "text.content", description: "消息内容", required: true, component: 'textarea' },
        { key: "touser", description: "指定接收消息的成员", component: 'input' },
        { key: "toparty", description: "指定接收消息的部门", component: 'input' },
        { key: "totag", description: "指定接收消息的标签", component: 'input' },
        { key: "safe", description: "是否保密消息", component: 'checkbox' },
        { key: "msgtype", component: 'hidden', defaultValue: "text" },
      ],
    },
    {
      type: WECOM_APP_TEMPLATES.MARKDOWN,
      name: "Markdown消息",
      description: "支持Markdown格式的富文本消息",
      fields: [
        { key: "markdown.content", description: "markdown格式的消息内容", required: true, component: 'textarea' },
        { key: "touser", description: "指定接收消息的成员" },
        { key: "toparty", description: "指定接收消息的部门" },
        { key: "totag", description: "指定接收消息的标签" },
        { key: "msgtype", component: 'hidden', defaultValue: "markdown" },
      ],
    },
  ],
  [CHANNEL_TYPES.TELEGRAM]: [
    {
      type: TELEGRAM_TEMPLATES.HTML,
      name: "文本消息",
      description: "文本消息，支持 HTML 标签",
      fields: [
        { key: "text", description: "HTML内容", required: true, component: 'textarea' },
        { key: "disable_notification", description: "静默发送", component: 'checkbox' },
        { key: "parse_mode", component: 'hidden', defaultValue: "HTML" },
      ],
    },
    {
      type: TELEGRAM_TEMPLATES.MARKDOWN,
      name: "Markdown消息",
      description: "支持 MarkdownV2 格式的富文本消息",
      fields: [
        {
          key: "text",
          description: "Markdown 消息内容",
          required: true,
          component: 'textarea'
        },
        {
          key: "disable_notification",
          description: "静默发送",
          component: 'checkbox'
        },
        {
          key: "parse_mode",
          component: 'hidden',
          defaultValue: "MarkdownV2"
        },
      ],
    },
  ],
} as const
