"use client";

export default function DoctorCardSkeleton() {
  return (
    <div className="relative flex flex-col rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent" />

      <div className="p-5 flex-grow">
        <div className="flex items-start gap-4">
          <div className="h-16 w-16 shrink-0 rounded-xl bg-gray-200" />
          <div className="min-w-0 flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-2/3" />
            <div className="h-3 bg-gray-200 rounded w-1/3" />
            <div className="h-3 bg-gray-200 rounded w-1/2" />
          </div>
        </div>
      </div>

      <div className="border-t border-gray-100 bg-gray-50/70 p-4 rounded-b-2xl space-y-2">
        <div className="h-3 bg-gray-200 rounded w-1/2" />
        <div className="flex gap-2">
          <div className="h-7 w-20 bg-gray-200 rounded-full" />
          <div className="h-7 w-20 bg-gray-200 rounded-full" />
          <div className="h-7 w-20 bg-gray-200 rounded-full" />
        </div>
        <div className="h-9 bg-gray-200 rounded-lg mt-2" />
      </div>
    </div>
  );
}
