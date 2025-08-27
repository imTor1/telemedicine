"use client";
import React, { useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "../app/components/Header";
import Image from "next/image";

import {
  Stethoscope, CalendarClock, Heart, ShieldCheck, Star, MapPin, ChevronRight
} from "lucide-react";
import { DOCTORS } from "../app/data/doctors";

export default function Page() {
  const router = useRouter();

  const featured = useMemo(() => DOCTORS.slice(0, 6), []);

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,rgba(16,185,129,0.08),transparent_45%)]">
      <Header />

      <section className="relative">
  <div className="absolute inset-0 -z-10">
    <Image
      src="/back.jpg"
      alt="Telemedicine hero"
      fill
      priority
      className="object-cover"
      sizes="100vw"
    />
  </div>

  <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/40 via-black/30 to-white/0 md:to-black/40" />

  <div className="mx-auto max-w-6xl px-4 pt-24 pb-28 text-center text-white">
    <div className="mx-auto mb-5 h-12 w-12 rounded-2xl border border-white/30 bg-white/10 grid place-items-center backdrop-blur-sm shadow-sm">
      <Stethoscope className="h-6 w-6 text-white" />
    </div>

    <h1 className="text-3xl md:text-5xl font-semibold tracking-tight leading-tight">
      พบแพทย์ออนไลน์ได้จากทุกที่ — เริ่มต้นในไม่กี่คลิก
    </h1>
    <p className="mt-3 max-w-2xl mx-auto text-white/90">
      ค้นหาแพทย์เฉพาะทาง จองนัดออนไลน์ และติดตามนัดหมายในระบบเดียว
    </p>

    <div className="mt-6 flex items-center justify-center gap-3">
      <button
        onClick={() => router.push("/doctors")}
        className="rounded-xl bg-emerald-600 text-white px-5 py-2.5 text-sm md:text-base font-medium hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-200"
      >
        ค้นหาแพทย์
      </button>
    </div>
  </div>
</section>

      <section className="py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-bold">แพทย์แนะนำ</h2>
            <p className="mt-2 text-gray-600">เลือกเวลาที่สะดวกเพื่อจองนัดทันที</p>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((d) => (
              <div key={d.id} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition">
                <div className="flex items-start gap-4">
                  <div className="h-14 w-14 shrink-0 rounded-xl bg-emerald-50 grid place-items-center border border-emerald-200">
                    <Stethoscope className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-semibold text-gray-900 truncate">{d.name}</p>
                      <span className="inline-flex items-center gap-1 text-sm text-amber-600">
                        <Star className="h-4 w-4" /> {d.rating}
                      </span>
                    </div>
                    <p className="mt-0.5 text-sm text-emerald-700">{d.specialty}</p>
                    <p className="mt-1 text-sm text-gray-600 inline-flex items-center gap-1">
                      <MapPin className="h-4 w-4" /> {d.hospital} • {d.location}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 text-right">
            <Link href="/doctors" className="inline-flex items-center gap-1 text-sm text-emerald-700 hover:underline">
              ดูแพทย์ทั้งหมด <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section id="how" className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-bold">ใช้งานง่ายใน 3 ขั้นตอน</h2>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900">1) ค้นหาแพทย์</h3>
              <p className="mt-2 text-gray-600">กดปุ่ม “ค้นหาแพทย์” เพื่อเข้าสู่หน้าเลือกสาขา</p>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900">2) จองนัดออนไลน์</h3>
              <p className="mt-2 text-gray-600">เลือกเวลาว่างและยืนยันการจอง</p>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900">3) พบแพทย์ตามเวลาที่นัด</h3>
              <p className="mt-2 text-gray-600">รับการแจ้งเตือนและติดตามผล</p>
            </div>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
              <ShieldCheck className="h-5 w-5 text-emerald-700" />
              <span className="text-sm">พบแพทย์ที่น่าเชื่อถือ</span>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
              <CalendarClock className="h-5 w-5 text-emerald-700" />
              <span className="text-sm">ค่าเฉลี่ยเวลาตอบกลับ 2 นาที</span>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
              <Heart className="h-5 w-5 text-emerald-700" />
              <span className="text-sm">คะแนนพึงพอใจเฉลี่ย 4.8/5</span>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-12 border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 grid md:grid-cols-3 gap-6 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <span className="inline-grid place-items-center h-8 w-8 rounded-lg bg-emerald-600 text-white">
              <Stethoscope className="h-4 w-4" />
            </span>
            <span className="font-semibold text-gray-900">MediCare</span>
          </div>
          <div>
            <p className="font-medium text-gray-900">มาตรฐานความปลอดภัย</p>
            <ul className="mt-2 space-y-1">
              <li>นโยบาย PDPA</li>
              <li>การควบคุมสิทธิ์เข้าถึง</li>
            </ul>
          </div>
          <div>
            <p className="font-medium text-gray-900">ลิงก์</p>
            <ul className="mt-2 space-y-1">
              <li>
                <Link href="/doctors" className="hover:underline">ค้นหาแพทย์</Link>
              </li>
              <li>
                <Link href="#how" className="hover:underline">วิธีใช้งาน</Link>
              </li>
              <li>
                <Link href="/appointments" className="hover:underline">นัดหมายของฉัน</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} MediCare. สงวนลิขสิทธิ์.
        </div>
      </footer>
    </div>
  );
}


