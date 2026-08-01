/**
 * Run this script ONCE after creating your Supabase project
 * to set up the storage bucket with correct policies.
 *
 * Usage:
 *   npx tsx scripts/setup-supabase-storage.ts
 */

import { createClient } from "@supabase/supabase-js";

const supabaseUrl        = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌  Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false },
});

const BUCKET_NAME = "tvet-documents";

async function main() {
  console.log("🪣  Setting up Supabase Storage bucket...");

  // 1. Create bucket (private — no public access)
  const { data: existing } = await supabase.storage.getBucket(BUCKET_NAME);

  if (existing) {
    console.log(`✅  Bucket "${BUCKET_NAME}" already exists — skipping creation.`);
  } else {
    const { error } = await supabase.storage.createBucket(BUCKET_NAME, {
      public:               false,       // private bucket — access via signed URLs only
      fileSizeLimit:        5242880,     // 5 MB hard limit enforced by Supabase
      allowedMimeTypes:     ["application/pdf", "image/jpeg", "image/png"],
    });

    if (error) {
      console.error("❌  Failed to create bucket:", error.message);
      process.exit(1);
    }
    console.log(`✅  Bucket "${BUCKET_NAME}" created (private, 5MB limit).`);
  }

  console.log("\n🎉  Supabase Storage setup complete!");
  console.log("    Bucket name:", BUCKET_NAME);
  console.log("    Access:      Private (signed URLs only)");
  console.log("    Max size:    5 MB per file");
  console.log("    Allowed:     PDF, JPEG, PNG");
}

main().catch((e) => {
  console.error("❌  Setup failed:", e);
  process.exit(1);
});
