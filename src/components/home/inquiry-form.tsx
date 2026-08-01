"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { submitInquiryAction } from "@/app/actions/inquiry";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, Send } from "lucide-react";

const schema = z.object({
  name:    z.string().min(2, "Nama diperlukan").max(100),
  email:   z.string().email("Format emel tidak sah"),
  phone:   z.string().max(20).optional(),
  subject: z.string().min(3, "Tajuk diperlukan").max(200),
  message: z.string().min(10, "Mesej diperlukan (min. 10 aksara)").max(2000),
});

type FormValues = z.infer<typeof schema>;

export function InquiryForm() {
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function onSubmit(data: FormValues) {
    setServerError(null);
    const fd = new FormData();
    Object.entries(data).forEach(([k, v]) => { if (v) fd.set(k, v); });
    const result = await submitInquiryAction(fd);
    if (!result.success) {
      setServerError(result.error ?? "Ralat tidak dijangka.");
      return;
    }
    setSubmitted(true);
    reset();
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
        <CheckCircle2 className="h-14 w-14 text-green-500" />
        <h3 className="font-heading text-xl font-semibold text-gray-800">
          Pertanyaan Berjaya Dihantar!
        </h3>
        <p className="max-w-sm text-sm text-gray-500">
          Terima kasih. Pasukan kami akan menghubungi anda dalam masa 2–3 hari bekerja.
        </p>
        <Button variant="outline" size="sm" onClick={() => setSubmitted(false)}>
          Hantar Pertanyaan Lain
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="inq-name" className="mb-1.5 block text-sm font-medium text-gray-700">
            Nama Penuh <span className="text-johor-red-500">*</span>
          </label>
          <Input id="inq-name" placeholder="Nama anda" {...register("name")} />
          {errors.name && <p className="mt-1 text-xs text-johor-red-500">{errors.name.message}</p>}
        </div>
        <div>
          <label htmlFor="inq-email" className="mb-1.5 block text-sm font-medium text-gray-700">
            Alamat Emel <span className="text-johor-red-500">*</span>
          </label>
          <Input id="inq-email" type="email" placeholder="nama@contoh.com" {...register("email")} />
          {errors.email && <p className="mt-1 text-xs text-johor-red-500">{errors.email.message}</p>}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="inq-phone" className="mb-1.5 block text-sm font-medium text-gray-700">
            No. Telefon <span className="text-gray-400 text-xs">(pilihan)</span>
          </label>
          <Input id="inq-phone" type="tel" placeholder="+601X-XXX XXXX" {...register("phone")} />
        </div>
        <div>
          <label htmlFor="inq-subject" className="mb-1.5 block text-sm font-medium text-gray-700">
            Tajuk <span className="text-johor-red-500">*</span>
          </label>
          <Input id="inq-subject" placeholder="Tajuk pertanyaan anda" {...register("subject")} />
          {errors.subject && <p className="mt-1 text-xs text-johor-red-500">{errors.subject.message}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="inq-message" className="mb-1.5 block text-sm font-medium text-gray-700">
          Mesej <span className="text-johor-red-500">*</span>
        </label>
        <Textarea
          id="inq-message"
          rows={5}
          placeholder="Huraikan pertanyaan atau maklum balas anda…"
          {...register("message")}
          className="resize-none"
        />
        {errors.message && <p className="mt-1 text-xs text-johor-red-500">{errors.message.message}</p>}
      </div>

      {serverError && (
        <div role="alert" className="rounded-lg border border-johor-red-100 bg-johor-red-50 px-4 py-3 text-sm text-johor-red-700">
          {serverError}
        </div>
      )}

      <Button type="submit" variant="navy" size="lg" disabled={isSubmitting} className="w-full sm:w-auto">
        <Send className="h-4 w-4" aria-hidden="true" />
        {isSubmitting ? "Menghantar…" : "Hantar Pertanyaan"}
      </Button>
    </form>
  );
}
