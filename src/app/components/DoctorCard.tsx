"use client";
import { type Doctor } from "../data/doctors";
import { Stethoscope, Star, MapPin, Clock, CalendarDays } from "lucide-react";

export default function DoctorCard({
  d,
  onOpen,
}: {
  d: Doctor;
  onOpen: (doctor: Doctor, slot?: string) => void;
}) {
  const now = new Date();
  const upcomingSlots = d.slots
    .filter((slot) => {
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
    })
    .slice(0, 3);

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
              <MapPin className="h-4 w-4 shrink-0" /> {d.hospital} •{" "}
              {d.location}
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-100 bg-gray-50/70 p-4 rounded-b-2xl">
        {upcomingSlots.length > 0 && (
          <>
            <p className="text-xs font-medium text-gray-500 mb-2">
              เวลาว่างที่เร็วที่สุด:
            </p>
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
          className={`inline-flex items-center justify-center gap-2 w-full rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors ${
            upcomingSlots.length > 0 ? "mt-3" : "mt-0"
          }`}
        >
          <CalendarDays className="h-4 w-4" />
          ดูตารางเวลาและจองนัด
        </button>
      </div>
    </div>
  );
}
