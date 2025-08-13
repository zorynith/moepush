import { Button } from "@/components/ui/button";
import { ArrowRight, Heart } from "lucide-react";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { SiteHeader } from "@/components/site-header";

export const runtime = "edge";

export default async function Home() {
  const session = await auth();

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-blue-50 to-indigo-50">
      <SiteHeader user={session?.user} variant="home" />

      <main className="flex-1">
        <section className="relative overflow-hidden min-h-screen flex items-center">
          <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center pt-14 pb-24 md:pb-32">
            <h1 className="font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
              <span className="bg-gradient-to-r from-blue-500 to-indigo-500 text-transparent bg-clip-text">
                消息推送
              </span>
            </h1>
            <p className="max-w-[42rem] leading-normal text-gray-600 sm:text-xl sm:leading-8">
              支持多种消息推送方式
            </p>
            <div className="space-x-4">
              <Link href="/moe">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:opacity-90 gap-2 transition-all duration-300"
                >
                  进入控制台 <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-blue-100 bg-white">
        <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
          <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
            <Heart className="h-6 w-6 text-blue-500 animate-pulse" />
            <p className="text-center text-sm text-gray-600 md:text-left">
              Minelibs
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
