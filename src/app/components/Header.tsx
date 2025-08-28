"use client";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useSPA } from "../context/SPAContext";
import {
  Stethoscope,
  CalendarClock,
  UsersRound,
  Home,
  LogIn,
  LogOut,
  UserRound,
  Menu,
  X,
} from "lucide-react";

function Brand() {
  return (
    <Link
      href="/"
      className="group flex items-center gap-2"
      aria-label="กลับหน้าแรก MediCare"
    >
      <span className="h-9 w-9 grid place-items-center rounded-2xl bg-emerald-50 border border-emerald-200 ring-1 ring-emerald-100 group-hover:ring-emerald-200 transition">
        <Stethoscope className="h-5 w-5 text-emerald-600" />
      </span>
      <div className="leading-tight">
        <p className="text-lg font-semibold text-gray-900">Telemedicine</p>
        <p className="text-[11px] text-gray-500 -mt-0.5">By MediCare</p>
      </div>
    </Link>
  );
}

function AuthButton() {
  const { authed, logout, patientName } = useSPA();
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  const qs = sp.toString();
  const redirect = (pathname || "/") + (qs ? `?${qs}` : "");

  return (
    <div className="flex items-center gap-3">
      {authed ? (
        <>
          <div className="hidden sm:flex items-center gap-2 text-gray-700">
            <UserRound className="h-4 w-4" />
            <span className="text-sm">
              สวัสดี {patientName ?? "คุณผู้ป่วย"}
            </span>
          </div>
          <button
            onClick={() => logout()}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-200 active:scale-[0.99] transition"
            aria-label="ออกจากระบบ"
          >
            <LogOut className="h-4 w-4" /> ออกจากระบบ
          </button>
        </>
      ) : (
        <button
          onClick={() =>
            router.push(`/login?redirect=${encodeURIComponent(redirect)}`)
          }
          className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700 hover:bg-emerald-100 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-200 active:scale-[0.99] transition"
          aria-label="เข้าสู่ระบบ"
        >
          <LogIn className="h-4 w-4" /> เข้าสู่ระบบ
        </button>
      )}
    </div>
  );
}

function NavTabsDesktop() {
  const pathname = usePathname();
  const tabs = [
    { href: "/", label: "หน้าแรก", icon: Home },
    { href: "/doctors", label: "ค้นหาแพทย์", icon: UsersRound },
    { href: "/appointments", label: "นัดหมายของฉัน", icon: CalendarClock },
  ];
  return (
    <nav
      className="flex w-full gap-1 rounded-xl border border-gray-200 bg-gray-50 p-1"
      aria-label="เมนูหลัก"
    >
      {tabs.map(({ href, label, icon: Icon }) => {
        const active =
          pathname === href || (href !== "/" && pathname.startsWith(href));
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={`flex-1 inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm transition
              ${
                active
                  ? "bg-white border border-gray-200 text-gray-900 shadow-sm"
                  : "text-gray-600 hover:bg-white/80"
              }`}
          >
            <Icon className="h-4 w-4" />
            <span className="hidden sm:inline">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

function NavListMobile({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const tabs = [
    { href: "/", label: "หน้าแรก" },
    { href: "/doctors", label: "ค้นหาแพทย์" },
    { href: "/appointments", label: "นัดหมายของฉัน" },
  ];
  return (
    <nav aria-label="เมนูหลัก (มือถือ)">
      <ul className="flex flex-col divide-y divide-gray-100">
        {tabs.map(({ href, label }) => {
          const active =
            pathname === href || (href !== "/" && pathname.startsWith(href));
          return (
            <li key={href}>
              <Link
                href={href}
                onClick={onNavigate}
                className={`block w-full px-1 py-3 text-base
                  ${
                    active
                      ? "text-emerald-700 font-semibold underline underline-offset-4"
                      : "text-gray-800 hover:text-gray-900"
                  }`}
              >
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { authed, logout } = useSPA();
  const sp = useSearchParams();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [open]);

  const qs = sp.toString();
  const redirect = (pathname || "/") + (qs ? `?${qs}` : "");

  return (
    <header className="sticky top-0 z-50 backdrop-blur bg-white/80 border-b border-gray-200">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between gap-3 relative">
        <Brand />
        <div className="hidden md:block w-[560px]">
          <NavTabsDesktop />
        </div>
        <div className="flex items-center gap-2">
          <AuthButton />
          <button
            onClick={() => setOpen((v) => !v)}
            className="md:hidden p-2 rounded-md hover:bg-gray-100 text-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
            aria-label={open ? "ปิดเมนู" : "เปิดเมนู"}
            aria-expanded={open}
            aria-controls="mobile-drawer"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {open && (
          <>
            <button
              className="fixed inset-0 bg-black/30 backdrop-blur-[1px] md:hidden"
              onClick={() => setOpen(false)}
              aria-label="ปิดเมนู"
            />
            <div
              id="mobile-drawer"
              className="fixed inset-x-0 top-0 md:hidden bg-white shadow-xl rounded-b-2xl border-b border-gray-200 px-4 pt-[env(safe-area-inset-top)]"
              role="dialog"
              aria-modal="true"
            >
              <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-2">
                  <span className="h-8 w-8 grid place-items-center rounded-xl bg-emerald-50 border border-emerald-200">
                    <Stethoscope className="h-4 w-4 text-emerald-600" />
                  </span>
                  <div className="leading-tight">
                    <p className="text-lg font-semibold text-gray-900">
                      Telemedicine
                    </p>
                    <p className="text-[11px] text-gray-500 -mt-0.5">
                      By MediCare
                    </p>
                  </div>{" "}
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="p-2 rounded-xl border border-gray-300 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
                  aria-label="ปิดเมนู"
                >
                  <X className="h-5 w-5 text-gray-700" />
                </button>
              </div>
              <hr className="border-gray-200" />
              <div className="py-3">
                <NavListMobile onNavigate={() => setOpen(false)} />
              </div>
              <div className="pb-4">
                {authed ? (
                  <button
                    onClick={() => {
                      logout();
                      setOpen(false);
                    }}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-3 text-base font-medium text-gray-800 hover:bg-gray-50"
                  >
                    <LogOut className="h-5 w-5" /> ออกจากระบบ
                  </button>
                ) : (
                  <button
                    onClick={() =>
                      router.push(
                        `/login?redirect=${encodeURIComponent(redirect)}`
                      )
                    }
                    className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 py-3 text-base font-semibold text-white hover:bg-emerald-700 active:scale-[0.99] transition"
                  >
                    <LogIn className="h-5 w-5" /> เข้าสู่ระบบ
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
