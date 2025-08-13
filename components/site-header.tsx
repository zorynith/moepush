import Link from "next/link";
import { UserNav } from "@/components/user-nav";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { User } from "next-auth";
import { cn } from "@/lib/utils";

interface SiteHeaderProps {
  user?: User | null;
  variant?: "home" | "dashboard";
  nav?: React.ReactNode;
}

export function SiteHeader({ user, variant = "home", nav }: SiteHeaderProps) {
  return (
    <header className={cn(
      "sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
      variant === "home" && "border-blue-100 bg-white/95 supports-[backdrop-filter]:bg-white/60"
    )}>
      <div className="container flex items-center justify-between h-14">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center space-x-2 transition-colors hover:opacity-80">
            <Image src="/logo.png" alt="MoePush" width={36} height={36} />
            <span className={cn(
              "font-bold bg-gradient-to-r from-blue-500 to-indigo-500 text-transparent bg-clip-text",
              variant === "dashboard" && "hidden sm:inline-block"
            )}>
              Minelibs
            </span>
          </Link>
          {nav}
        </div>

        <div className="flex items-center space-x-6">
          
          {user ? (
            <UserNav user={user} />
          ) : (
            variant === "home" && (
              <div className="flex gap-4">
                <Link href="/login">
                  <Button variant="ghost">登录</Button>
                </Link>
                <Link href="/register">
                  <Button>注册</Button>
                </Link>
              </div>
            )
          )}
        </div>
      </div>
    </header>
  );
}
