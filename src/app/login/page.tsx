"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSPA } from "../context/SPAContext";
import { Mail, Lock, Eye, EyeOff, LogIn, ShieldCheck, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const sp = useSearchParams();
  const { authed, login } = useSPA();

  const redirect = useMemo(() => sp.get("redirect") || "/", [sp]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authed) router.replace(redirect);
  }, [authed, redirect, router]);

  const emailValid = /.+@.+\..+/.test(email);
  const pwValid = password.length >= 3; 
  const formValid = emailValid && pwValid && !loading;

  async function handleSubmitLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!formValid) return;
    setError(null);
    setLoading(true);
    try {
      const users = { email, password };

      const res = await fetch(`/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(users),
      });
      const data = await res.json().catch(() => undefined as any);
      if (!res.ok) {
        throw new Error(data?.error || "เข้าสู่ระบบไม่สำเร็จ");
      }

      if (data?.token) localStorage.setItem("token", data.token);
      const displayName = data?.user?.name ?? email.split("@")[0];
      login(displayName);

      router.replace(redirect);
    } catch (err: any) {
      console.error("[Login] Error:", err);
      setError(err?.message || "เกิดข้อผิดพลาด กรุณาลองใหม่");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,rgba(16,185,129,0.08),transparent_45%)] grid place-items-center">
      <main className="w-full max-w-md px-4">
        <div className="text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">เข้าสู่ระบบ</h1>
          <p className="mt-2 text-gray-600">ลงชื่อเข้าใช้เพื่อจองนัดและดูรายการนัดหมายของคุณ</p>
        </div>

        <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <form onSubmit={handleSubmitLogin} noValidate>
            <label className="block text-sm font-medium text-gray-700" htmlFor="email">อีเมล</label>
            <div className="mt-1 relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-xl border border-gray-300 bg-white pl-10 pr-3 py-2 text-sm outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-400"
                placeholder="you@example.com"
              />
            </div>
            {!emailValid && email !== "" && (
              <p className="mt-1 text-xs text-red-600">รูปแบบอีเมลไม่ถูกต้อง</p>
            )}

            <label className="block mt-4 text-sm font-medium text-gray-700" htmlFor="password">รหัสผ่าน</label>
            <div className="mt-1 relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                id="password"
                type={showPw ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={3}
                className="w-full rounded-xl border border-gray-300 bg-white pl-10 pr-10 py-2 text-sm outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-400"
                placeholder="อย่างน้อย 3 ตัวอักษร"
              />
              <button
                type="button"
                onClick={() => setShowPw((s) => !s)}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-gray-500 hover:bg-gray-100"
                aria-label={showPw ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน"}
              >
                {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            {error && (
              <div
                className="mt-4 inline-flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
                role="alert"
                aria-live="assertive"
              >
                <AlertCircle className="h-4 w-4" /> {error}
              </div>
            )}

            <button
              type="submit"
              disabled={!formValid}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-300 bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                </svg>
              ) : (
                <LogIn className="h-4 w-4" />
              )}
              เข้าสู่ระบบ
            </button>
            <div className="mt-4 flex items-center justify-end text-xs text-gray-600">
              <span className="inline-flex items-center gap-1">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                ลืมรหัสผ่าน?
              </span>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
