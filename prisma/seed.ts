import { PrismaClient, UserRole, AccountStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱  Seeding TVET Johor Portal database...");

  // ── Superadmin ──────────────────────────────────────────────
  const superadminPassword = await bcrypt.hash("Admin@TVET2025!", 12);
  const superadmin = await prisma.user.upsert({
    where: { email: "superadmin@tvetjohor.gov.my" },
    update: {},
    create: {
      email: "superadmin@tvetjohor.gov.my",
      name: "Super Administrator",
      passwordHash: superadminPassword,
      role: UserRole.SUPERADMIN,
      status: AccountStatus.ACTIVE,
      emailVerified: new Date(),
      adminProfile: {
        create: {
          fullName: "Super Administrator",
          entity: "SYSTEM",
          department: "Sistem",
        },
      },
    },
  });
  console.log(`✅  Superadmin created: ${superadmin.email}`);

  // ── ADTEC Admin ─────────────────────────────────────────────
  const adtecPassword = await bcrypt.hash("Admin@ADTEC2025!", 12);
  const adtecAdmin = await prisma.user.upsert({
    where: { email: "admin@adtecpg.edu.my" },
    update: {},
    create: {
      email: "admin@adtecpg.edu.my",
      name: "Admin ADTEC Pasir Gudang",
      passwordHash: adtecPassword,
      role: UserRole.ADMIN_ADTEC,
      status: AccountStatus.ACTIVE,
      emailVerified: new Date(),
      adminProfile: {
        create: {
          fullName: "Admin ADTEC JTM Kampus Pasir Gudang",
          entity: "ADTEC_PG",
          department: "Bahagian Teknologi Maklumat",
        },
      },
    },
  });
  console.log(`✅  ADTEC Admin created: ${adtecAdmin.email}`);

  // ── JTDC Admin ──────────────────────────────────────────────
  const jtdcPassword = await bcrypt.hash("Admin@JTDC2025!", 12);
  const jtdcAdmin = await prisma.user.upsert({
    where: { email: "admin@jtdc.johor.gov.my" },
    update: {},
    create: {
      email: "admin@jtdc.johor.gov.my",
      name: "Admin JTDC Johor",
      passwordHash: jtdcPassword,
      role: UserRole.ADMIN_JTDC,
      status: AccountStatus.ACTIVE,
      emailVerified: new Date(),
      adminProfile: {
        create: {
          fullName: "Admin Johor Talent Development Council",
          entity: "JTDC",
          department: "Bahagian Pembangunan Bakat",
        },
      },
    },
  });
  console.log(`✅  JTDC Admin created: ${jtdcAdmin.email}`);

  // ── Categories ───────────────────────────────────────────────
  const categories = [
    { name: "Kejuruteraan Elektrik", slug: "kejuruteraan-elektrik" },
    { name: "Kejuruteraan Mekanikal", slug: "kejuruteraan-mekanikal" },
    { name: "Teknologi Maklumat", slug: "teknologi-maklumat" },
    { name: "Pembinaan & Senibina", slug: "pembinaan-senibina" },
    { name: "Hospitaliti & Pelancongan", slug: "hospitaliti-pelancongan" },
    { name: "Automotif", slug: "automotif" },
    { name: "Logistik & Penghantaran", slug: "logistik-penghantaran" },
    { name: "Pembuatan & Pengeluaran", slug: "pembuatan-pengeluaran" },
    { name: "Penjagaan Kesihatan", slug: "penjagaan-kesihatan" },
    { name: "Pertanian & Bioteknologi", slug: "pertanian-bioteknologi" },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }
  console.log(`✅  ${categories.length} categories seeded`);

  // ── System Settings ──────────────────────────────────────────
  const settings = [
    { key: "site_name", value: "Sekretariat TVET Negeri Johor", description: "Portal name displayed in header" },
    { key: "site_tagline", value: "Membangunkan Kemahiran. Memperkasa Johor.", description: "Hero section tagline" },
    { key: "contact_email", value: "info@tvetjohor.gov.my", description: "Public contact email" },
    { key: "contact_phone", value: "+607-000 0000", description: "Public contact phone" },
    { key: "footer_address", value: "ADTEC JTM Kampus Pasir Gudang, Johor, Malaysia", description: "Footer address" },
    { key: "max_upload_bytes", value: "5242880", description: "Maximum file upload size in bytes (5MB)" },
    { key: "allowed_mime_types", value: "application/pdf,image/jpeg,image/png", description: "Allowed MIME types for document uploads" },
  ];

  for (const setting of settings) {
    await prisma.systemSetting.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting,
    });
  }
  console.log(`✅  ${settings.length} system settings seeded`);

  console.log("\n🎉  Seeding complete!");
}

main()
  .catch((e) => {
    console.error("❌  Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
