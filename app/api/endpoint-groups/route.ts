import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { getDb } from "@/lib/db"
import { endpointGroups, endpointToGroup } from "@/lib/db/schema/endpoint-groups"
import { endpoints } from "@/lib/db/schema/endpoints"
import { eq, and, inArray } from "drizzle-orm"
import { generateId } from "@/lib/utils"
import { z } from "zod"

// 添加 edge runtime 声明
export const runtime = 'edge'

// 获取接口组列表
export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "未授权" }, { status: 401 })
    }

    const db = await getDb()
    
    // 获取用户所有接口组
    const groups = await db.query.endpointGroups.findMany({
      where: eq(endpointGroups.userId, session.user.id),
      orderBy: (endpointGroups, { desc }) => [desc(endpointGroups.createdAt)]
    })
    
    const result = []
    
    // 对于每个接口组，获取其关联的接口
    for (const group of groups) {
      const relations = await db.query.endpointToGroup.findMany({
        where: eq(endpointToGroup.groupId, group.id),
        with: {
          endpoint: true
        }
      })
      
      const groupEndpoints = relations
        .map(r => r.endpoint)
        .filter((endpoint): endpoint is NonNullable<typeof endpoint> => endpoint != null)
      
      result.push({
        id: group.id,
        name: group.name,
        userId: group.userId,
        status: group.status,
        createdAt: group.createdAt ?? new Date(),
        updatedAt: group.updatedAt ?? new Date(),
        endpointIds: groupEndpoints.map(e => e.id),
        endpoints: groupEndpoints
      })
    }
    
    return NextResponse.json(result)
  } catch (error) {
    console.error('获取接口组失败:', error)
    return NextResponse.json(
      { error: '获取接口组失败' },
      { status: 500 }
    )
  }
}

// 更新验证 schema
const createEndpointGroupSchema = z.object({
  name: z.string().min(1),
  endpointIds: z.array(z.string()).min(1),
  id: z.string().optional().nullable()
})

// 创建接口组
export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "未授权" }, { status: 401 })
    }

    const data = await request.json() as {
      name: string
      endpointIds: string[]
      id?: string | null
    }
    // // 验证请求数据
    const result = createEndpointGroupSchema.safeParse(data)
    if (!result.success) {
      return NextResponse.json(
        { error: "无效的请求数据" },
        { status: 400 }
      )
    }
    
    console.log('result', result)

    const db = await getDb()
    const groupId = generateId()

    // 验证所有的 endpointIds 是否存在且属于当前用户
    const validEndpoints = await db.query.endpoints.findMany({
      where: and(
        eq(endpoints.userId, session.user.id),
        inArray(endpoints.id, data.endpointIds)
      )
    })

    console.log('validEndpoints', validEndpoints)

    if (validEndpoints.length !== data.endpointIds.length) {
      return NextResponse.json(
        { error: "部分接口不存在或无权访问" },
        { status: 400 }
      )
    }

    console.log('groupId111', groupId)

    // 创建接口组（移除 description 字段）
    await db.insert(endpointGroups).values({
      id: groupId,
      name: data.name,
      userId: session.user.id,
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    console.log('groupId', groupId)
    console.log('endpointIds', data.endpointIds)

    // 创建关联关系
    await db.insert(endpointToGroup).values(
      data.endpointIds.map(endpointId => ({
        endpointId,
        groupId
      }))
    )

    return NextResponse.json({ id: groupId })
  } catch (error) {
    console.error('创建接口组失败:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '创建接口组失败' },
      { status: 500 }
    )
  }
} 