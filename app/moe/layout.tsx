import { auth } from "@/lib/auth"
import { Sparkles, LayoutGrid, Key } from "lucide-react"
import { UserNav } from "@/components/user-nav"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { cn } from "@/lib/utils"

export default async function MoeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  return (
    <div className="relative flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 transition-colors hover:opacity-80">
              <Sparkles className="h-6 w-6 text-blue-500" />
              <span className="hidden font-bold bg-gradient-to-r from-blue-500 to-indigo-500 text-transparent bg-clip-text sm:inline-block">
                MoePush
              </span>
            </Link>
            <nav className="hidden md:flex items-center gap-1">
              <Link href="/moe/endpoints">
                <Button variant="ghost" size="sm" className={cn(
                  "gap-2 text-muted-foreground hover:text-foreground",
                  // 可以根据当前路径添加激活状态
                  // pathname === "/moe/endpoints" && "bg-muted text-foreground"
                )}>
                  <Key className="h-4 w-4" />
                  接口管理
                </Button>
              </Link>
              <Link href="/moe/channels">
                <Button variant="ghost" size="sm" className={cn(
                  "gap-2 text-muted-foreground hover:text-foreground",
                  // pathname === "/moe/channels" && "bg-muted text-foreground"
                )}>
                  <LayoutGrid className="h-4 w-4" />
                  渠道管理
                </Button>
              </Link>
            </nav>
          </div>
          <UserNav user={session!.user} />
        </div>
      </header>

      <main className="container flex-1 py-8">
        {children}
      </main>
    </div>
  );
} 