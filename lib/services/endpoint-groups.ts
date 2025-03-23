import { EndpointGroupWithEndpoints } from "@/types/endpoint-group"

const API_URL = '/api/endpoint-groups'

interface EndpointGroupResponse {
  id: string
  name: string
  userId: string
  status: "active" | "inactive"
  createdAt: string
  updatedAt: string
  endpointIds: string[]
  endpoints: any[]
}

interface ToggleEndpointGroupResponse extends EndpointGroupResponse {
  status: "active" | "inactive"
}

export async function getEndpointGroups(): Promise<EndpointGroupWithEndpoints[]> {
  const response = await fetch(API_URL)
  if (!response.ok) {
    const error = await response.json() as { error: string }
    throw new Error(error.error || '获取接口组失败')
  }
  const data = await response.json() as EndpointGroupResponse[]
  return data.map(group => ({
    ...group,
    createdAt: new Date(group.createdAt),
    updatedAt: new Date(group.updatedAt)
  }))
}

export interface CreateEndpointGroupData {
  name: string
  endpointIds: string[]
}

export async function createEndpointGroup(data: CreateEndpointGroupData): Promise<{ id: string }> {
  if (!data.endpointIds.length) {
    throw new Error('请至少选择一个接口')
  }

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...data,
    }),
  })

  if (!response.ok) {
    const error = await response.json() as { error: string }
    throw new Error(error.error || '创建接口组失败')
  }

  return response.json() as Promise<{ id: string }>
}

export async function deleteEndpointGroup(id: string): Promise<{ success: boolean }> {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    const error = await response.json() as { error: string }
    throw new Error(error.error || '删除接口组失败')
  }

  return response.json() as Promise<{ success: boolean }>
}

export async function toggleEndpointGroupStatus(id: string): Promise<EndpointGroupWithEndpoints> {
  const response = await fetch(`${API_URL}/${id}/toggle`, {
    method: 'POST',
  })

  if (!response.ok) {
    const error = await response.json() as { error: string }
    throw new Error(error.error || '切换状态失败')
  }

  const data = await response.json() as ToggleEndpointGroupResponse
  return {
    ...data,
    createdAt: new Date(data.createdAt),
    updatedAt: new Date(data.updatedAt),
    endpointIds: data.endpointIds,
    endpoints: data.endpoints
  }
} 