import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { authSchema } from "@/lib/validation";
import { eq } from "drizzle-orm";
import { hashPassword } from "@/lib/utils";

export const runtime = "edge";

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const { username, password } = authSchema.parse(json);

    const db = getDb();
    const existingUser = await db.query.users.findFirst({
      where: eq(users.username, username),
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "用户名已存在" },
        { status: 400 }
      );
    }

    const hashedPassword = await hashPassword(password);

    await db.insert(users).values({
      username,
      password: hashedPassword,
      name: username,
    });

    return NextResponse.json(
      { message: "注册成功" },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "注册失败" },
      { status: 500 }
    );
  }
} 