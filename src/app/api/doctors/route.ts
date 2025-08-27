import { NextResponse } from "next/server";
import { DOCTORS } from "../../data/doctors";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const spec = searchParams.get("specialty") ?? "";
  const keyword = (searchParams.get("name") ?? "").toLowerCase().trim();

  const list = DOCTORS.filter((d) => {
    const isSpecialtyMatch =
      !spec || spec === "ทั้งหมด" || d.specialty === spec;

    const text = [d.name, d.hospital, d.location].filter(Boolean).join(" ").toLowerCase();
    const isKeywordMatch = !keyword || text.includes(keyword);

    return isSpecialtyMatch && isKeywordMatch;
  });

  return NextResponse.json(list);
}
