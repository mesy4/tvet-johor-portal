"use server";

import { prisma } from "@/lib/prisma";
import { z } from "zod";

const inquirySchema = z.object({
  name:    z.string().min(2, "Nama diperlukan").max(100),
  email:   z.string().email("Format emel tidak sah").max(254),
  phone:   z.string().max(20).optional(),
  subject: z.string().min(3, "Tajuk diperlukan").max(200),
  message: z.string().min(10, "Mesej diperlukan (min. 10 aksara)").max(2000),
});

export type InquiryResult = { success: boolean; error?: string };

export async function submitInquiryAction(formData: FormData): Promise<InquiryResult> {
  const raw = {
    name:    formData.get("name"),
    email:   formData.get("email"),
    phone:   formData.get("phone") || undefined,
    subject: formData.get("subject"),
    message: formData.get("message"),
  };

  const parsed = inquirySchema.safeParse(raw);
  if (!parsed.success) {
    const firstError = parsed.error.errors[0]?.message;
    return { success: false, error: firstError ?? "Data tidak sah." };
  }

  try {
    await prisma.inquiry.create({ data: parsed.data });
    return { success: true };
  } catch {
    return { success: false, error: "Gagal menghantar pertanyaan. Sila cuba lagi." };
  }
}
