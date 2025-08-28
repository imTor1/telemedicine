import { NextResponse } from "next/server";

type LoginBody = { email?: string; password?: string };

function createMockToken(email: string) {
  const payload = {
    email,
    exp: Date.now() + 60 * 60 * 1000,
  };
  const base64 = Buffer.from(JSON.stringify(payload)).toString("base64");
  return `mockupToken.${base64}`;
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as LoginBody;
  const { email, password } = body;

  console.log("Request body:", body);
  if (!email || !password) {
    console.log("Validation error: email or password is missing");
    return NextResponse.json(
      { error: "email และ password จำเป็น" },
      { status: 400 }
    );
  }

  const ALLOWED_USER = "pakonchai@gmail.com";
  const ALLOWED_PASS = "1234";

  if (email !== ALLOWED_USER || password !== ALLOWED_PASS) {
    console.log("Invalid credentials");
    return NextResponse.json(
      { error: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" },
      { status: 401 }
    );
  }

  const token = createMockToken(email);
  const responseUsers = {
    token,
    user: { email, name: email.split("@")[0] },
  };

  console.log("Response user:", responseUsers);
  return NextResponse.json(responseUsers);
}
