import { NextResponse } from "next/server";

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

export type Appointment = BookingPayload & {
  id: string;
  status: "ยืนยันแล้ว" | "กำลังจะถึง" | "รอดำเนินการ";
  createdAt: string;
};

const APPOINTMENTS: Appointment[] = [];

export const dynamic = "force-dynamic";

function ok<T>(data: T, init?: ResponseInit) {
  return NextResponse.json(data, { status: 200, ...init });
}
function bad(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}
function genId() {
  return (
    globalThis.crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2)
  );
}

function validate(body: unknown): { valid: boolean; msg?: string } {
  if (!body) return { valid: false, msg: "ไม่มีข้อมูล" };
  const {
    doctorName,
    datetime,
    visitType,
    phoneNumber,
    symptoms,
    insurance,
    policyId,
  } = body as BookingPayload;

  if (!datetime) return { valid: false, msg: "เวลานัดห้ามว่าง" };
  if (!doctorName) return { valid: false, msg: "กรุณาระบุชื่อแพทย์" };

  if (visitType !== "onsite" && visitType !== "video")
    return { valid: false, msg: "รูปแบบการพบแพทย์ไม่ถูกต้อง" };

  if (!/^[0-9+\-\s]{8,}$/.test(String(phoneNumber || "")))
    return { valid: false, msg: "กรุณากรอกเบอร์โทรให้ถูกต้อง" };

  if (!symptoms || String(symptoms).trim().length < 5)
    return { valid: false, msg: "กรุณาระบุอาการอย่างน้อย 5 อักขระ" };

  if (!["self", "universal", "social", "private"].includes(String(insurance)))
    return { valid: false, msg: "สิทธิ์การรักษาไม่ถูกต้อง" };

  if (insurance !== "self" && String(policyId || "").trim().length < 3)
    return { valid: false, msg: "กรุณากรอกเลขกรมธรรม์/สิทธิ์ประกัน" };

  if (isNaN(Date.parse(datetime)))
    return { valid: false, msg: "รูปแบบเวลานัดไม่ถูกต้อง" };

  return { valid: true };
}

export function randomStatus(): "ยืนยันแล้ว" | "รอดำเนินการ" {
  const statuses = ["ยืนยันแล้ว", "รอดำเนินการ"] as const;
  const idx = Math.floor(Math.random() * statuses.length);
  return statuses[idx];
}

export async function POST(req: Request) {
  let body: BookingPayload;
  try {
    body = (await req.json()) as BookingPayload;
  } catch {
    return bad("รูปแบบข้อมูลไม่ถูกต้อง");
  }

  const v = validate(body);
  if (!v.valid) return bad(v.msg!);

  const appt: Appointment = {
    id: genId(),
    status: randomStatus(),
    createdAt: new Date().toISOString(),
    ...body,
  };

  APPOINTMENTS.unshift(appt);
  return NextResponse.json(appt, { status: 201 });
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") || "").toLowerCase().trim();
  const limit = Math.max(
    1,
    Math.min(Number(searchParams.get("limit")) || 100, 200)
  );

  let data = APPOINTMENTS;

  if (q) {
    data = data.filter((a) => {
      const text = [
        a.doctorName,
        a.specialty,
        a.hospital,
        a.location,
        a.symptoms,
        a.status,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return text.includes(q);
    });
  }

  data = data
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, limit);

  return ok({ items: data, total: data.length });
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) return bad("ต้องระบุ id ของนัดที่ต้องการลบ");

  const idx = APPOINTMENTS.findIndex((a) => a.id === id);
  if (idx === -1)
    return NextResponse.json({ error: "ไม่พบนัดหมายนี้" }, { status: 404 });

  const [removed] = APPOINTMENTS.splice(idx, 1);
  return ok({ success: true, removedId: removed.id });
}
