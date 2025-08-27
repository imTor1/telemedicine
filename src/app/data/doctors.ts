export const SPECIALTIES = [
  "ทั้งหมด",
  "อายุรแพทย์",
  "กุมารเวช",
  "ผิวหนัง",
  "จิตเวช",
  "กระดูกและข้อ",
  "สูติ-นรีเวช",
  "หู คอ จมูก",
  "ตา",
] as const;

export type Doctor = {
  id: string;
  name: string;
  specialty: (typeof SPECIALTIES)[number] | string;
  rating: number;
  hospital: string;
  location: string;
  slots: string[];
};

export const DOCTORS: Doctor[] = [
  { id: "d1", name: "นพ. ปวรุตม์ ศิริธรรม", specialty: "อายุรแพทย์", rating: 4.9, hospital: "MediCare Center (บางนา)", location: "กรุงเทพฯ", slots: ["วันนี้ 18:30", "พรุ่งนี้ 10:00", "พฤ. 14:30"] },
  { id: "d2", name: "พญ. ชนัญชิดา ลีวัฒน์", specialty: "ผิวหนัง", rating: 4.8, hospital: "MediCare Clinic (สยาม)", location: "กรุงเทพฯ", slots: ["วันนี้ 20:00", "พรุ่งนี้ 11:00"] },
  { id: "d3", name: "นพ. กฤตนัย วงศ์สุข", specialty: "กระดูกและข้อ", rating: 4.7, hospital: "MediCare Ortho (เชียงใหม่)", location: "เชียงใหม่", slots: ["ศ. 09:30", "ส. 15:00"] },
  { id: "d4", name: "พญ. วรัณณา จิตพิพัฒน์", specialty: "กุมารเวช", rating: 4.9, hospital: "MediCare Kids (ขอนแก่น)", location: "ขอนแก่น", slots: ["พรุ่งนี้ 09:00", "ส. 10:00"] },
  { id: "d5", name: "พญ. พิชญ์สินี ธาราวงศ์", specialty: "จิตเวช", rating: 4.8, hospital: "MediCare Mind (หาดใหญ่)", location: "สงขลา", slots: ["วันนี้ 21:00", "อา. 13:00"] },
  { id: "d6", name: "นพ. สิรวิชญ์ กมลพงศ์", specialty: "หู คอ จมูก", rating: 4.6, hospital: "MediCare ENT (พระราม 2)", location: "กรุงเทพฯ", slots: ["พฤ. 17:30"] },
  { id: "d7",  name: "นพ. ณัฐวุฒิ ภูวนนท์", specialty: "อายุรแพทย์", rating: 4.7, hospital: "MediCare General (ลาดพร้าว)", location: "กรุงเทพฯ", slots: ["วันนี้ 19:00", "ศ. 10:30"] },
  { id: "d8",  name: "พญ. ปาริฉัตร กิตติวัฒน์", specialty: "สูติ-นรีเวช", rating: 4.8, hospital: "MediCare Women (พระราม 9)", location: "กรุงเทพฯ", slots: ["พรุ่งนี้ 14:00", "ส. 09:30"] },
  { id: "d9",  name: "นพ. ธนดล วัฒนะกูล", specialty: "ศัลยกรรม", rating: 4.6, hospital: "MediCare Surgery (พญาไท)", location: "กรุงเทพฯ", slots: ["อ. 16:00", "พฤ. 11:30"] },
  { id: "d10", name: "พญ. ศศิธร รัตนวดี", specialty: "ผิวหนัง", rating: 4.9, hospital: "MediCare Skin (ทองหล่อ)", location: "กรุงเทพฯ", slots: ["วันนี้ 18:00", "ศ. 13:30"] },
  { id: "d11", name: "นพ. ภาสกร สิทธิเดช", specialty: "ตา", rating: 4.7, hospital: "MediCare Eye (ลาดพร้าว)", location: "กรุงเทพฯ", slots: ["พ. 10:00", "ส. 16:00"] },
  { id: "d12", name: "พญ. กชพรรณ เกียรติศรี", specialty: "กุมารเวช", rating: 4.8, hospital: "MediCare Children (บางแค)", location: "กรุงเทพฯ", slots: ["พรุ่งนี้ 08:30", "อา. 10:30"] },
  { id: "d13", name: "นพ. วสันต์ เศรษฐกุล", specialty: "กระดูกและข้อ", rating: 4.6, hospital: "MediCare Ortho (โคราช)", location: "นครราชสีมา", slots: ["ศ. 14:00", "ส. 11:00"] },
  { id: "d14", name: "พญ. ชุติมา ทองสกุล", specialty: "หู คอ จมูก", rating: 4.7, hospital: "MediCare ENT (เชียงใหม่)", location: "เชียงใหม่", slots: ["พฤ. 15:30", "อา. 09:00"] },
  { id: "d15", name: "นพ. กิตติพงศ์ สุนทรชัย", specialty: "อายุรแพทย์", rating: 4.8, hospital: "MediCare Center (หาดใหญ่)", location: "สงขลา", slots: ["วันนี้ 20:00", "พ. 09:30"] },
  { id: "d16", name: "พญ. วารีรัตน์ แสงรุ่ง", specialty: "สูติ-นรีเวช", rating: 4.9, hospital: "MediCare Women (ขอนแก่น)", location: "ขอนแก่น", slots: ["พรุ่งนี้ 13:00", "ศ. 09:00"] },
  { id: "d17", name: "นพ. พิชญเดช ชัยวัฒน์", specialty: "ศัลยกรรม", rating: 4.7, hospital: "MediCare Surgery (ชลบุรี)", location: "ชลบุรี", slots: ["อ. 14:30", "พฤ. 09:30"] },
  { id: "d18", name: "พญ. จิราภรณ์ ณภัทร", specialty: "ตา", rating: 4.8, hospital: "MediCare Eye (ภูเก็ต)", location: "ภูเก็ต", slots: ["ส. 10:00", "อา. 14:00"] },
  { id: "d19", name: "นพ. อัครเดช ปัญญากูล", specialty: "ผิวหนัง", rating: 4.6, hospital: "MediCare Skin (เชียงใหม่)", location: "เชียงใหม่", slots: ["วันนี้ 17:30", "พฤ. 12:00"] },
  { id: "d20", name: "พญ. ณิชารีย์ อินทร์สุข", specialty: "จิตเวช", rating: 4.7, hospital: "MediCare Mind (นนทบุรี)", location: "นนทบุรี", slots: ["พ. 19:00", "ศ. 18:00"] },
  { id: "d21", name: "นพ. พงศกร ตันธนบดี", specialty: "อายุรแพทย์", rating: 4.8, hospital: "MediCare General (ระยอง)", location: "ระยอง", slots: ["พรุ่งนี้ 09:30", "ส. 13:30"] },
  { id: "d22", name: "พญ. ธารินี ชโลธร", specialty: "กุมารเวช", rating: 4.9, hospital: "MediCare Children (ปทุมธานี)", location: "ปทุมธานี", slots: ["ศ. 10:00", "อา. 11:00"] },
  { id: "d23", name: "นพ. วิชญ์พล ภูริเดช", specialty: "กระดูกและข้อ", rating: 4.7, hospital: "MediCare Ortho (อุบลฯ)", location: "อุบลราชธานี", slots: ["พฤ. 16:00", "ส. 09:30"] },
  { id: "d24", name: "พญ. ลลิตา ครุฑสกุล", specialty: "สูติ-นรีเวช", rating: 4.8, hospital: "MediCare Women (นนทบุรี)", location: "นนทบุรี", slots: ["วันนี้ 18:15", "จ. 09:00"] },
  { id: "d25", name: "นพ. ธีรภัทร ทองนาค", specialty: "ศัลยกรรม", rating: 4.5, hospital: "MediCare Surgery (พิษณุโลก)", location: "พิษณุโลก", slots: ["อ. 10:30", "ศ. 15:00"] },
  { id: "d26", name: "พญ. มนัสนันท์ สมจิต", specialty: "หู คอ จมูก", rating: 4.7, hospital: "MediCare ENT (ระยอง)", location: "ระยอง", slots: ["พ. 14:00", "ส. 17:00"] },
  { id: "d27", name: "นพ. สหชาติ วิริยะศักดิ์", specialty: "ตา", rating: 4.8, hospital: "MediCare Eye (ขอนแก่น)", location: "ขอนแก่น", slots: ["พฤ. 09:30", "อา. 15:30"] },
  { id: "d28", name: "พญ. ภูษณิศา เจริญสุข", specialty: "ผิวหนัง", rating: 4.7, hospital: "MediCare Skin (หาดใหญ่)", location: "สงขลา", slots: ["ศ. 18:30", "ส. 11:30"] },
  { id: "d29", name: "นพ. กรองเกียรติ สุนทรวงศ์", specialty: "อายุรแพทย์", rating: 4.6, hospital: "MediCare Center (ราชพฤกษ์)", location: "นนทบุรี", slots: ["วันนี้ 19:30", "พ. 08:30"] },
  { id: "d30", name: "พญ. ชลธิชา อภิวัฒน์พงศ์", specialty: "จิตเวช", rating: 4.8, hospital: "MediCare Mind (ภูเก็ต)", location: "ภูเก็ต", slots: ["จ. 20:00", "พฤ. 18:30"] },
];

