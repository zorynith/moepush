export const HTTP_METHODS = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  DELETE: "DELETE",
} as const

export type HttpMethod = typeof HTTP_METHODS[keyof typeof HTTP_METHODS]

export const METHOD_LABELS: Record<HttpMethod, string> = {
  [HTTP_METHODS.GET]: "GET",
  [HTTP_METHODS.POST]: "POST",
  [HTTP_METHODS.PUT]: "PUT",
  [HTTP_METHODS.DELETE]: "DELETE",
}

export const METHOD_COLORS: Record<HttpMethod, string> = {
  [HTTP_METHODS.GET]: "bg-green-50 text-green-700 ring-green-600/20",
  [HTTP_METHODS.POST]: "bg-blue-50 text-blue-700 ring-blue-600/20",
  [HTTP_METHODS.PUT]: "bg-yellow-50 text-yellow-700 ring-yellow-600/20",
  [HTTP_METHODS.DELETE]: "bg-red-50 text-red-700 ring-red-600/20",
}

export const ENDPOINT_STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive",
} as const

export type EndpointStatus = typeof ENDPOINT_STATUS[keyof typeof ENDPOINT_STATUS]

export const STATUS_LABELS: Record<EndpointStatus, string> = {
  [ENDPOINT_STATUS.ACTIVE]: "正常",
  [ENDPOINT_STATUS.INACTIVE]: "禁用",
}

export const STATUS_COLORS: Record<EndpointStatus, string> = {
  [ENDPOINT_STATUS.ACTIVE]: "bg-green-50 text-green-700 ring-green-600/20",
  [ENDPOINT_STATUS.INACTIVE]: "bg-red-50 text-red-700 ring-red-600/20",
} 