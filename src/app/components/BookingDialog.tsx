"use client";
import { useEffect, useMemo, useState } from "react";
import { Doctor } from "../data/doctors";
import {
  MapPin,
  CalendarClock,
  Video,
  Hospital,
  AlertCircle,
  X,
} from "lucide-react";
type Insurance = BookingPayload["insurance"];

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

function parseSlot(
  slot: string | undefined
): { date: string; time: string } | null {
  if (!slot) return null;

  const now = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(now.getDate() + 1);

  const toISO = (d: Date) => d.toISOString().split("T")[0];
  const timeRegex = /(\d{2}:\d{2})/;
  const timeMatch = slot.match(timeRegex);
  const time = timeMatch ? timeMatch[1] : "09:00";

  if (slot.startsWith("วันนี้")) {
    return { date: toISO(now), time };
  }
  if (slot.startsWith("พรุ่งนี้")) {
    return { date: toISO(tomorrow), time };
  }
  return { date: toISO(now), time };
}

export default function BookingDialog({
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
  const [insurance, setInsurance] = useState<
    "self" | "universal" | "social" | "private"
  >("self");
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

  const times = [
    "09:00",
    "10:30",
    "11:30",
    "12:30",
    "13:30",
    "14:30",
    "15:30",
    "16:30",
    "17:30",
  ];

  const handleConfirm = () => {
    if (!/^[0-9+\-\s]{8,}$/.test(phoneNumber)) {
      return setError("กรุณากรอกเบอร์โทรให้ถูกต้อง");
    }
    if (!symptoms || symptoms.length < 5) {
      return setError("กรุณาระบุอาการอย่างน้อย 5 อักษร");
    }
    if (insurance !== "self" && policyId.trim().length < 3) {
      return setError("กรุณากรอกเลขกรมธรรม์/สิทธิ์ประกัน");
    }
    if (!agree) {
      return setError("กรุณายอมรับเงื่อนไขการรักษา");
    }

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
            <h3 className="font-semibold text-gray-900">
              {doctor.name} • {doctor.specialty}
            </h3>
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
            <label className="text-sm font-medium text-gray-800">
              รูปแบบการพบแพทย์
            </label>
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
              <CalendarClock className="h-4 w-4 text-emerald-600" />{" "}
              เลือกวันและเวลา
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
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-800">
              ข้อมูลการติดต่อและอาการ
            </label>
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
            <label className="text-sm font-medium text-gray-800">
              สิทธิ์การรักษาและข้อมูลเพิ่มเติม
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <select
                value={insurance}
                onChange={(e) => setInsurance(e.target.value as Insurance)}
                className="rounded-xl border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400"
              >
                <option value="self">ชำระเงินเอง</option>
                <option value="universal">
                  บัตรทอง/สิทธิ์หลักประกันสุขภาพ
                </option>
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
              ฉันยอมรับให้มีการใช้ข้อมูลส่วนบุคคลเพื่อการรักษาพยาบาล
              และยินยอมตาม{" "}
              <a
                className="text-emerald-700 underline"
                href="#"
                onClick={(e) => e.preventDefault()}
              >
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
