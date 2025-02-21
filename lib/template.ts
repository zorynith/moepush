// 内置函数定义
const BUILT_IN_FUNCTIONS = {
  // 截断字符串,超过maxLength的部分用...替代
  truncate: (str: string, maxLength: number) => {
    if (!str || str.length <= maxLength) return str
    return str.slice(0, maxLength) + '...'
  },
  
  // 获取当前时间,支持自定义格式
  now: (format = 'YYYY-MM-DD HH:mm:ss') => {
    const date = new Date()
    const tokens: Record<string, () => string> = {
      YYYY: () => date.getFullYear().toString(),
      MM: () => (date.getMonth() + 1).toString().padStart(2, '0'),
      DD: () => date.getDate().toString().padStart(2, '0'),
      HH: () => date.getHours().toString().padStart(2, '0'),
      mm: () => date.getMinutes().toString().padStart(2, '0'),
      ss: () => date.getSeconds().toString().padStart(2, '0')
    }
    
    return format.replace(/YYYY|MM|DD|HH|mm|ss/g, match => tokens[match]())
  }
} as const

type BuiltInFunction = keyof typeof BUILT_IN_FUNCTIONS

// 函数调用正则表达式
const FUNCTION_CALL_REGEX = /\${(\w+)\((.*?)\)}/g
// 变量替换正则表达式
const VARIABLE_REGEX = /\${([\w.]+)}/g

export function safeInterpolate(
    template: string,
    data: Record<string, any>,
    fallback = ''
): string {
    console.log('safeInterpolate template:', template)
    
    // 先处理函数调用
    let result = template.replace(FUNCTION_CALL_REGEX, (_, fnName, argsStr) => {
        try {
            // 解析函数名
            const fn = BUILT_IN_FUNCTIONS[fnName as BuiltInFunction]
            if (!fn) throw new Error(`未知的函数: ${fnName}`)
            
            // 解析参数
            const args = argsStr.split(',').map((arg: string) => {
                const trimmed = arg.trim()
                // 处理变量路径
                const parts = trimmed.split('.')
                if (parts.length > 1) {
                    return parts.reduce((acc: any, part: string) => {
                        if (acc === null || acc === undefined) {
                            throw new Error(`Cannot read property '${part}' of ${acc}`)
                        }
                        return acc[part]
                    }, data)
                }
                // 处理数字
                if (/^\d+$/.test(trimmed)) {
                    return parseInt(trimmed, 10)
                }
                // 处理字符串字面量
                return trimmed.replace(/^["']|["']$/g, '')
            })
            // @ts-expect-error "ignore" 
            return fn(...args)
        } catch (error: any) {
            console.warn(`函数调用错误: ${error.message}`)
            return fallback
        }
    })
    
    // 再处理变量替换
    result = result.replace(VARIABLE_REGEX, (_, path) => {
        try {
            const value = path.split('.').reduce((acc: any, part: string) => {
                if (acc === null || acc === undefined) {
                    throw new Error(`Cannot read property '${part}' of ${acc}`)
                }
                return acc[part]
            }, data)

            return value === undefined ? fallback : String(value)
        } catch (error: any) {
            console.warn(`变量解析错误: ${error.message}`)
            return fallback
        }
    })

    console.log('safeInterpolate result:', result)
    return result
}

