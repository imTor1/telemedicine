"use client";
import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
  useCallback,
} from "react";

export type Appointment = {
  id: string;
  doctorId: string | number;
  doctorName: string;
  specialty: string;
  datetime: string; 
  status: "ยืนยันแล้ว" | "กำลังจะถึง" | "รอดำเนินการ";
  visitType: "onsite" | "video";
  phoneNumber: string;
  symptoms: string;
  insurance: "self" | "universal" | "social" | "private";
  policyId?: string;
  notes?: string;
  hospital?: string;
  location?: string;
};

export type SPAState = {
  authed: boolean;
  patientName: string | null;
  appointments: Appointment[];
  login: (name?: string) => void;
  logout: () => void;
  bookAppointment: (args: Omit<Appointment, "id" | "status">) => Promise<Appointment>;
  cancelAppointment: (id: string) => void;
  fetchAppointments: (opts?: { q?: string; limit?: number }) => Promise<void>;
};

const SPAContext = createContext<SPAState | null>(null);

const K = {
  AUT: "mc.authed",
  NAME: "mc.name",
  APPTS: "mc.appts",
} as const;

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

export function SPAProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [patientName, setPatientName] = useState<string | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    try {
      const a = localStorage.getItem(K.AUT);
      const n = localStorage.getItem(K.NAME);
      setAuthed(a === "1");
      setPatientName(n || null);
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(K.AUT, authed ? "1" : "0");
      if (patientName) localStorage.setItem(K.NAME, patientName);
      else localStorage.removeItem(K.NAME);
      localStorage.setItem(K.APPTS, JSON.stringify(appointments));
    } catch {}
  }, [authed, patientName, appointments, ready]);

  const login = useCallback((name = "คุณผู้ป่วย") => {
    setAuthed(true);
    setPatientName(name);
  }, []);

  const logout = useCallback(() => {
    setAuthed(false);
    setPatientName(null);
    setAppointments([]);
    try {
      localStorage.removeItem(K.AUT);
      localStorage.removeItem(K.NAME);
      localStorage.removeItem(K.APPTS);
    } catch {}
  }, []);

  const bookAppointment: SPAState["bookAppointment"] = useCallback(async (payload) => {
    const localAppt: Appointment = {
      id: uid(),
      status: "รอดำเนินการ", 
      ...payload,
    };

    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        cache: "no-store",
      });

      if (res.ok) {
        const serverAppt = (await res.json()) as Appointment;
        setAppointments((prev) => [serverAppt, ...prev]);
        return serverAppt;
      }

      const err = await res.json().catch(() => ({}));
      throw new Error(err?.error || "ไม่สามารถจองได้");
    } catch {
      setAppointments((prev) => [localAppt, ...prev]);
      return localAppt;
    }
  }, []);

  const cancelAppointment = useCallback(async (id: string) => {
  try {
    const res = await fetch(`/api/appointments?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
      cache: "no-store",
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.error || "ลบนัดหมายไม่สำเร็จ");
    }
  } finally {
    setAppointments((prev) => prev.filter((a) => a.id !== id));
  }
}, []);


  const fetchAppointments: SPAState["fetchAppointments"] = useCallback(async (opts) => {
    try {
      const params = new URLSearchParams();
      if (opts?.q) params.set("q", opts.q);
      if (opts?.limit) params.set("limit", String(opts.limit));
      const url = `/api/appointments${params.toString() ? `?${params}` : ""}`;
      const res = await fetch(url, { method: "GET", cache: "no-store" });
      const data = await res.json();
              
      if (res.ok && Array.isArray(data.items)) {
        setAppointments(data.items as Appointment[]);
      }
    } catch {}
  }, []);

  

  useEffect(() => {
    if (ready && authed) {
      fetchAppointments();
    }
  }, [ready, authed, fetchAppointments]);

  const value = useMemo(
    () => ({
      authed,
      patientName,
      appointments,
      login,
      logout,
      bookAppointment,
      cancelAppointment,
      fetchAppointments,
    }),
    [authed, patientName, appointments, login, logout, bookAppointment, cancelAppointment, fetchAppointments]
  );

  return <SPAContext.Provider value={value}>{children}</SPAContext.Provider>;
}


export function useSPA() {
  const ctx = useContext(SPAContext);
  if (!ctx) throw new Error("useSPA must be used inside <SPAProvider>");
  return ctx;
}