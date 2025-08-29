// AppointmentsPage.tsx
"use client";
import React, { Suspense } from "react";
import Header from "../components/Header";
import { useSPA } from "../context/SPAContext";
import Link from "next/link";

// lazy โหลดการ์ด
const AppointmentCard = React.lazy(
  () => import("../components/AppointmentCard")
);

function CardsList() {
  const { appointments, cancelAppointment } = useSPA();

  // ✅ empty state
  if (!appointments || appointments.length === 0) {
    return (
      <div className="mt-6 rounded-2xl border-2 border-dashed border-gray-200 bg-white p-8 text-center">
        <p className="text-gray-600">ยังไม่มีนัดหมาย</p>
        <Link
          href="/doctors"
          className="inline-flex items-center gap-1 text-sm text-emerald-700 hover:underline"
        >
          ค้นหาแพทย์เพื่อเริ่มจองนัดหมาย
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-6 grid gap-4">
      {appointments
        .sort(
          (a, b) =>
            new Date(b.datetime).getTime() - new Date(a.datetime).getTime()
        )
        .map((a) => (
          <AppointmentCard
            key={a.id}
            appointment={a}
            onCancel={cancelAppointment}
          />
        ))}
    </div>
  );
}

export default function AppointmentsPage() {
  const { authed, fetchAppointments } = useSPA();
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (authed) {
      setLoading(true);
      fetchAppointments().finally(() => setLoading(false));
    }
  }, [authed, fetchAppointments]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="mx-auto max-w-4xl px-4 py-8">
        <h1 className="text-2xl md:text-3xl font-bold">นัดหมายของฉัน</h1>

        {!authed ? (
          <div className="mt-6 rounded-2xl border-2 border-dashed border-gray-200 bg-white p-8 text-center">
            <p>กรุณาเข้าสู่ระบบเพื่อดูและจัดการนัดหมายของคุณ</p>
          </div>
        ) : loading ? (
          <p className="mt-6 text-center text-gray-500">กำลังโหลดนัดหมาย...</p>
        ) : (
          <Suspense
            fallback={
              <div className="mt-6 grid gap-4">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="mt-6 rounded-2xl border-2 border-dashed border-gray-200 bg-white p-8 text-center"
                  />
                ))}
              </div>
            }
          >
            <CardsList />
          </Suspense>
        )}
      </main>
    </div>
  );
}
