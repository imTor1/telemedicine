"use client";
import { useState } from "react";
import {
  CalendarClock,
  Trash2,
  ChevronDown,
  Hospital,
  Video,
  MapPin,
  ClipboardList,
  Phone,
  ShieldCheck,
  FileText,
  CalendarCheck2,
  AlertCircle,
} from "lucide-react";
import type { Appointment } from "../context/SPAContext";

function formatDateTime(isoString: string) {
  if (!isoString) return "ไม่มีข้อมูลเวลา";
  try {
    return new Date(isoString).toLocaleString("th-TH", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  } catch {
    return isoString;
  }
}

export default function AppointmentCard({
  appointment: a,
  onCancel,
}: {
  appointment: Appointment;
  onCancel: (id: string) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  const INSURANCE_LABELS: Record<Appointment["insurance"], string> = {
    self: "ชำระเงินเอง",
    universal: "บัตรทอง / หลักประกันสุขภาพแห่งชาติ",
    social: "ประกันสังคม",
    private: "ประกันเอกชน",
  };

  const STATUS_MAP: Record<
    Appointment["status"],
    {
      wrapRing: string;
      badge: string;
      dot: string;
      Icon: React.ComponentType<{ className?: string }>;
    }
  > = {
    ยืนยันแล้ว: {
      wrapRing: "ring-emerald-100",
      badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
      dot: "bg-emerald-500",
      Icon: CalendarCheck2,
    },
    กำลังจะถึง: {
      wrapRing: "ring-sky-100",
      badge: "bg-sky-50 text-sky-700 border-sky-200",
      dot: "bg-sky-500",
      Icon: CalendarClock,
    },
    รอดำเนินการ: {
      wrapRing: "ring-amber-100",
      badge: "bg-amber-50 text-amber-700 border-amber-200",
      dot: "bg-amber-500",
      Icon: AlertCircle,
    },
  };

  const S = STATUS_MAP[a.status] ?? STATUS_MAP["ยืนยันแล้ว"];

  const detailItems = [
    {
      icon: a.visitType === "video" ? Video : Hospital,
      label: "รูปแบบ",
      value: a.visitType === "video" ? "วิดีโอคอล" : "ไปที่โรงพยาบาล",
    },
    {
      icon: MapPin,
      label: "สถานที่",
      value: `${a.hospital} • ${a.location}`,
    },
    { icon: Phone, label: "เบอร์ติดต่อ", value: a.phoneNumber },
    { icon: ClipboardList, label: "อาการเบื้องต้น", value: a.symptoms },
    {
      icon: ShieldCheck,
      label: "สิทธิ์การรักษา",
      value: `${INSURANCE_LABELS[a.insurance]}${
        a.policyId ? ` (${a.policyId})` : ""
      }`,
    },
    ...(a.notes
      ? [{ icon: FileText, label: "ข้อมูลเพิ่มเติม", value: a.notes }]
      : []),
  ];

  return (
    <div
      className={`relative rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition-all ring-1 ${S.wrapRing}`}
    >
      <div className="absolute bottom-3 right-3">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${S.badge}`}
        >
          <S.Icon className="h-4 w-5" />
          {a.status}
        </span>
      </div>

      <div className="flex items-start gap-4">
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-gray-900 truncate">{a.doctorName}</p>
          <p className="text-sm text-emerald-700">{a.specialty}</p>
          <p className="mt-1 text-sm text-gray-600 flex items-center gap-1.5">
            <span className={`h-2.5 w-2.5 rounded-full ${S.dot}`} />
            {formatDateTime(a.datetime)}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button
            onClick={() => onCancel(a.id)}
            className="rounded-lg p-2 text-gray-500 hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 className="h-4 w-4" />
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
          >
            <ChevronDown
              className={`h-5 w-5 transition-transform ${
                isExpanded ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
          <h4 className="font-medium text-sm text-gray-800">
            รายละเอียดการนัดหมาย
          </h4>
          {detailItems.map((item) => (
            <div key={item.label} className="flex items-start gap-3 text-sm">
              <item.icon className="h-4 w-4 mt-0.5 shrink-0 text-gray-500" />
              <div className="min-w-0">
                <p className="text-gray-500">{item.label}</p>
                <p className="text-gray-800 break-words">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
