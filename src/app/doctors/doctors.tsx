"use client";
import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "../components/Header";
import { SPECIALTIES, type Doctor } from "../data/doctors";
import { Search } from "lucide-react";
import { useSPA } from "../context/SPAContext";
import DoctorCardSkeleton from "../components/Skeleton/DoctorCardSkeleton";
export type BookingPayload = {
  doctorId: string | number;
  doctorName: string;
  specialty: string;
  datetime: string;
  visitType: "onsite" | "video";
  phoneNumber: string;
  symptoms: string;
  insurance: "self" | "universal" | "social" | "private";
  policyId?: string;
  notes?: string;
  hospital?: string;
  location?: string;
};
const DoctorCard = React.lazy(() => import("../components/DoctorCard"));
const BookingDialog = React.lazy(() => import("../components/BookingDialog"));

export const dynamic = "force-dynamic";

export default function DoctorsPage() {
  const router = useRouter();
  const sp = useSearchParams();
  const { authed, bookAppointment } = useSPA();

  const [keyword, setKeyword] = useState("");
  const [specialty, setSpecialty] = useState<string>("ทั้งหมด");
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [initialSlot, setInitialSlot] = useState<string | undefined>();

  useEffect(() => {
    const k = sp.get("keyword") ?? "";
    const s = sp.get("specialty") ?? "";
    setKeyword(k);
    setSpecialty(s || "ทั้งหมด");

    const fetchData = async () => {
      setLoading(true);
      const res = await fetch(
        `/api/doctors?specialty=${encodeURIComponent(
          s
        )}&name=${encodeURIComponent(k)}`
      );
      if (res.ok) {
        const data: Doctor[] = await res.json();
        setDoctors(data);
      }
      setLoading(false);
    };

    fetchData();
  }, [sp]);

  const openBooking = (d: Doctor, slot?: string) => {
    setSelectedDoctor(d);
    setInitialSlot(slot);
    setDialogOpen(true);
  };

  const onConfirm = async (payload: BookingPayload) => {
    if (!authed) {
      alert("กรุณาเข้าสู่ระบบก่อนจองนัด");
      router.push("/login?redirect=/doctors");
      return;
    }
    try {
      await bookAppointment(payload);
      setDialogOpen(false);
      router.push("/appointments");
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : typeof err === "string"
          ? err
          : "เกิดข้อผิดพลาดในการจอง";
      alert(msg);
    }
  };

  const handleSearch = () => {
    router.push(
      `/doctors?specialty=${encodeURIComponent(
        specialty
      )}&keyword=${encodeURIComponent(keyword)}`
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800">ค้นหาแพทย์</h1>
        <p className="mt-1 text-gray-600">
          ค้นหาและนัดหมายแพทย์ผู้เชี่ยวชาญใกล้บ้านคุณ
        </p>

        <div className="mt-6 p-4 sm:p-5 rounded-2xl border border-gray-200 bg-white shadow-sm">
          <form
            className="grid gap-3 md:grid-cols-12"
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
          >
            <input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="ค้นหาชื่อแพทย์, โรงพยาบาล..."
              className="md:col-span-7 w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-400"
            />
            <select
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              className="md:col-span-3 w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-400"
            >
              {SPECIALTIES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
            <button
              type="submit"
              className="md:col-span-2 inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 text-white px-4 py-2.5 text-sm font-semibold hover:bg-emerald-700 transition-colors"
            >
              <Search className="h-4 w-4" />
              ค้นหา
            </button>
          </form>
        </div>

        <div className="mt-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {loading ? (
              [...Array(6)].map((_, i) => <DoctorCardSkeleton key={i} />)
            ) : doctors.length === 0 ? (
              <p className="col-span-full py-10 text-center text-gray-500">
                ไม่พบข้อมูลแพทย์ที่ตรงกับเงื่อนไขการค้นหา
              </p>
            ) : (
              doctors.map((d) => (
                <Suspense key={d.id} fallback={<DoctorCardSkeleton />}>
                  <DoctorCard d={d} onOpen={openBooking} />
                </Suspense>
              ))
            )}
          </div>
        </div>
      </main>

      <Suspense fallback={<></>}>
        <BookingDialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          doctor={selectedDoctor}
          initialSlot={initialSlot}
          onConfirm={onConfirm}
        />
      </Suspense>
    </div>
  );
}
