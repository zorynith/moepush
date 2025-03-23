import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { getDb } from "@/lib/db"
import { endpointGroups, endpointToGroup } from "@/lib/db/schema/endpoint-groups"
import { eq } from "drizzle-orm"

// 添加 edge runtime 声明
export const runtime = 'edge'

// 删除接口组
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "未授权" }, { status: 401 })
    }

    const db = await getDb()

    const { id } = await params
    
    // 验证接口组存在且属于当前用户
    const group = await db.query.endpointGroups.findFirst({
      where: (groups, { and, eq }) => and(
        eq(groups.id, id),
        eq(groups.userId, session.user.id!)
      )
    })

    if (!group) {
      return NextResponse.json(
        { error: "接口组不存在或无权访问" },
        { status: 404 }
      )
    }

    // 删除关联关系
    await db.delete(endpointToGroup).where(eq(endpointToGroup.groupId, id))
    
    // 删除接口组
    await db.delete(endpointGroups).where(eq(endpointGroups.id, id))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('删除接口组失败:', error)
    return NextResponse.json(
      { error: '删除接口组失败' },
      { status: 500 }
    )
  }
} 