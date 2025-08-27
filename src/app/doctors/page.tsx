"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "../components/Header";
import { SPECIALTIES, type Doctor } from "../data/doctors";
import { Stethoscope, Star, MapPin, CalendarClock, Video, Hospital, Search, Clock, CalendarDays, AlertCircle, X } from "lucide-react";
import { useSPA } from "../context/SPAContext";

function parseSlot(slot: string | undefined): { date: string, time: string } | null {
  if (!slot) return null;

  const now = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(now.getDate() + 1);

  const toISO = (d: Date) => d.toISOString().split('T')[0];
  const timeRegex = /(\d{2}:\d{2})/;
  const timeMatch = slot.match(timeRegex);
  const time = timeMatch ? timeMatch[1] : '09:00';

  if (slot.startsWith("วันนี้")) {
    return { date: toISO(now), time };
  }
  if (slot.startsWith("พรุ่งนี้")) {
    return { date: toISO(tomorrow), time };
  }
  return { date: toISO(now), time };
}




function DoctorCard({ d, onOpen }: { d: Doctor; onOpen: (doctor: Doctor, slot?: string) => void }) {
  
  const now = new Date();
  const upcomingSlots = d.slots.filter(slot => {
    if (slot.startsWith("วันนี้")) {
      const timeMatch = slot.match(/(\d{2}):(\d{2})/);
      if (!timeMatch) return true; 

      const hours = parseInt(timeMatch[1], 10);
      const minutes = parseInt(timeMatch[2], 10);
      const slotTime = new Date();
      slotTime.setHours(hours, minutes, 0, 0);
      
      return slotTime > now; 
    }
    return true;
  }).slice(0, 3); 

  return (
    <div className="flex flex-col rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-shadow duration-300">
      <div className="p-5 flex-grow">
        <div className="flex items-start gap-4"> 
          <div className="h-16 w-16 shrink-0 rounded-xl bg-emerald-50 grid place-items-center border border-emerald-200">
            <Stethoscope className="h-8 w-8 text-emerald-600" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <p className="font-semibold text-gray-900 truncate">{d.name}</p>
              <span className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-amber-600">
                <Star className="h-4 w-4 fill-current" /> {d.rating}
              </span>
            </div>
            <p className="mt-0.5 text-sm text-emerald-700">{d.specialty}</p>
            <p className="mt-1 text-sm text-gray-600 inline-flex items-center gap-1.5">
              <MapPin className="h-4 w-4 shrink-0" /> {d.hospital} • {d.location}
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-100 bg-gray-50/70 p-4 rounded-b-2xl">
        {upcomingSlots.length > 0 && (
          <>
            <p className="text-xs font-medium text-gray-500 mb-2">เวลาว่างที่เร็วที่สุด:</p>
            <div className="flex flex-wrap gap-2">
              {upcomingSlots.map((s) => (
                <button 
                  key={s} 
                  onClick={() => onOpen(d, s)} 
                  className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-800 hover:bg-emerald-100 hover:border-emerald-300 transition-colors"
                >
                  <Clock className="h-3.5 w-3.5" />
                  {s}
                </button>
              ))}
            </div>
          </>
        )}
        
        <button 
          onClick={() => onOpen(d)} 
          className={`inline-flex items-center justify-center gap-2 w-full rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors ${upcomingSlots.length > 0 ? 'mt-3' : 'mt-0'}`}
        >
          <CalendarDays className="h-4 w-4" />
          ดูตารางเวลาและจองนัด
        </button>
      </div>
    </div>
  );
}

function BookingDialog({
  open,
  onClose,
  doctor,
  initialSlot, 
  onConfirm,
}: {
  open: boolean;
  onClose: () => void;
  doctor: Doctor | null;
  initialSlot?: string;
  onConfirm: (payload: BookingPayload) => void;
}) {

  
  const todayISO = useMemo(() => new Date().toISOString().split("T")[0], []);



  const [visitType, setVisitType] = useState<"onsite" | "video">("video");
  const [date, setDate] = useState<string>(todayISO);
  const [time, setTime] = useState<string>("09:00");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [insurance, setInsurance] = useState<"self" | "universal" | "social" | "private">("self");
  const [policyId, setPolicyId] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    
    const parsed = parseSlot(initialSlot);
    setDate(parsed?.date || todayISO);
    setTime(parsed?.time || "09:00");

    setVisitType("video");
    setPhoneNumber("");
    setSymptoms("");
    setInsurance("self");
    setPolicyId("");
    setNotes("");
    setAgree(false);
    setError(null);
  }, [open, todayISO, initialSlot]);

  if (!open || !doctor) return null;

  const times = ["09:00","10:30","11:30","12:30","13:30","14:30","15:30","16:30","17:30"];

  const handleConfirm = () => {
    if (!/^[0-9+\-\s]{8,}$/.test(phoneNumber)) { return setError("กรุณากรอกเบอร์โทรให้ถูกต้อง"); }
    if (!symptoms || symptoms.length < 5) { return setError("กรุณาระบุอาการอย่างน้อย 5 อักษร"); }
    if (insurance !== "self" && policyId.trim().length < 3) { return setError("กรุณากรอกเลขกรมธรรม์/สิทธิ์ประกัน"); }
    if (!agree) { return setError("กรุณายอมรับเงื่อนไขการรักษา"); }
    
    setError(null);
    const payload: BookingPayload = {
      doctorId: doctor.id,
      doctorName: doctor.name,
      specialty: String(doctor.specialty),
      datetime: `${date}T${time}:00`,
      visitType,
      phoneNumber,
      symptoms,
      insurance,
      policyId: insurance === "self" ? undefined : policyId,
      notes: notes || undefined,
      hospital: doctor.hospital,
      location: doctor.location,
    };
    onConfirm(payload);
  };

  return (
  <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-0 sm:p-6 backdrop-blur-sm">
    <div className="w-full sm:max-w-2xl rounded-t-2xl sm:rounded-2xl bg-white shadow-2xl max-h-[90vh] flex flex-col">
      
      <div className="flex items-center justify-between px-5 py-4 bg-gray-50">
        <div className="min-w-0">
          <p className="text-xs text-gray-500">จองคิวพบแพทย์</p>
          <h3 className="font-semibold text-gray-900">{doctor.name} • {doctor.specialty}</h3>
          <p className="text-sm text-gray-600 flex items-center gap-1">
            <MapPin className="h-4 w-4 text-emerald-600" /> {doctor.hospital}
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-xl hover:bg-gray-100 transition"
          aria-label="ปิด"
        >
          <X className="h-5 w-5 text-gray-500" />
        </button>
      </div>

      <div className="px-5 py-6 space-y-6 overflow-y-auto">
                <div className="space-y-2">
          <label className="text-sm font-medium text-gray-800">รูปแบบการพบแพทย์</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setVisitType("video")}
              className={`flex items-center justify-center gap-2 rounded-xl border px-3 py-3 text-sm font-medium transition ${
                visitType === "video"
                  ? "border-emerald-400 bg-emerald-50 text-emerald-700"
                  : "border-gray-300 hover:bg-gray-50"
              }`}
            >
              <Video className="h-4 w-4" /> วิดีโอคอล
            </button>
            <button
              onClick={() => setVisitType("onsite")}
              className={`flex items-center justify-center gap-2 rounded-xl border px-3 py-3 text-sm font-medium transition ${
                visitType === "onsite"
                  ? "border-emerald-400 bg-emerald-50 text-emerald-700"
                  : "border-gray-300 hover:bg-gray-50"
              }`}
            >
              <Hospital className="h-4 w-4" /> ไปที่โรงพยาบาล
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-800 flex items-center gap-2">
            <CalendarClock className="h-4 w-4 text-emerald-600" /> เลือกวันและเวลา
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={todayISO}
              className="rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400"
            />
            <select
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400"
            >
              {times.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-800">ข้อมูลการติดต่อและอาการ</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              inputMode="tel"
              placeholder="เบอร์โทรติดต่อกลับ"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="rounded-xl border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400"
            />
            <input
              placeholder="อาการเบื้องต้น"
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              className="rounded-xl border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-800">สิทธิ์การรักษาและข้อมูลเพิ่มเติม</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <select
              value={insurance}
              onChange={(e) => setInsurance(e.target.value as any)}
              className="rounded-xl border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400"
            >
              <option value="self">ชำระเงินเอง</option>
              <option value="universal">บัตรทอง/สิทธิ์หลักประกันสุขภาพ</option>
              <option value="social">ประกันสังคม</option>
              <option value="private">ประกันเอกชน</option>
            </select>
            {insurance !== "self" && (
              <input
                placeholder="เลขที่สิทธิ์/กรมธรรม์"
                value={policyId}
                onChange={(e) => setPolicyId(e.target.value)}
                className="rounded-xl border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400"
              />
            )}
          </div>
          <textarea
            placeholder="ข้อมูลเพิ่มเติม เช่น แพ้ยา ประวัติการรักษา"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400 min-h-[80px]"
          />
        </div>

        <label className="flex items-start gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            className="mt-1 rounded border-gray-300"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
          />
          <span>
            ฉันยอมรับให้มีการใช้ข้อมูลส่วนบุคคลเพื่อการรักษาพยาบาล และยินยอมตาม{" "}
            <a className="text-emerald-700 underline" href="#" onClick={(e) => e.preventDefault()}>
              ข้อกำหนดการบริการ
            </a>
          </span>
        </label>

        {error && (
          <div className="rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-700 flex gap-2">
            <AlertCircle className="h-4 w-4" /> {error}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between gap-2 px-5 py-4  bg-gray-50 rounded-b-2xl">
        <button
          onClick={onClose}
          className="rounded-xl border border-gray-300 bg-white px-5 py-2 text-sm font-medium hover:bg-gray-100"
        >
          ยกเลิก
        </button>
        <button
          onClick={handleConfirm}
          className="rounded-xl bg-emerald-600 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-700 shadow-sm transition"
        >
          ยืนยันการจอง
        </button>
      </div>
    </div>
  </div>
);

}

export type BookingPayload = {
  doctorId: string | number; doctorName: string; specialty: string; datetime: string; visitType: "onsite" | "video"; phoneNumber: string; symptoms: string; insurance: "self" | "universal" | "social" | "private"; policyId?: string; notes?: string; hospital?: string; location?: string;
};

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
      const res = await fetch(`/api/doctors?specialty=${encodeURIComponent(s)}&name=${encodeURIComponent(k)}`);
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
  } catch (err: any) {
    alert(err?.message || "เกิดข้อผิดพลาดในการจอง");
  }
};

  const handleSearch = () => {
     router.push(`/doctors?specialty=${encodeURIComponent(specialty)}&keyword=${encodeURIComponent(keyword)}`);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800">ค้นหาแพทย์</h1>
        <p className="mt-1 text-gray-600">ค้นหาและนัดหมายแพทย์ผู้เชี่ยวชาญใกล้บ้านคุณ</p>

        <div className="mt-6 p-4 sm:p-5 rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="grid gap-3 md:grid-cols-12">
            <input value={keyword} onChange={(e) => setKeyword(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSearch()} placeholder="ค้นหาชื่อแพทย์, โรงพยาบาล..." className="md:col-span-7 w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-400"/>
            <select value={specialty} onChange={(e) => setSpecialty(e.target.value)} className="md:col-span-3 rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-400">{SPECIALTIES.map((s) => (<option key={s}>{s}</option>))}</select>
            <button onClick={handleSearch} className="md:col-span-2 inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 text-white px-4 py-2.5 text-sm font-semibold hover:bg-emerald-700 transition-colors"><Search className="h-4 w-4"/>ค้นหา</button>
          </div>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
          {loading && <p className="col-span-full text-center text-gray-500 py-10">กำลังโหลดข้อมูลแพทย์...</p>}
          {!loading && doctors.length === 0 && <p className="col-span-full text-center text-gray-500 py-10">ไม่พบข้อมูลแพทย์ที่ตรงกับเงื่อนไขการค้นหา</p>}
          {!loading && doctors.map((d) => (<DoctorCard key={d.id} d={d} onOpen={openBooking} />))}
        </div>
      </main>

      <BookingDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        doctor={selectedDoctor}
        initialSlot={initialSlot}
        onConfirm={onConfirm}
      />
    </div>
  );
}