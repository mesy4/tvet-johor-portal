import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(
      new URL("/auth/login?error=Verification", request.url)
    );
  }

  try {
    // Look up the verification token
    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token },
    });

    if (!verificationToken) {
      return NextResponse.redirect(
        new URL("/auth/login?error=Verification", request.url)
      );
    }

    // Check expiry
    if (verificationToken.expires < new Date()) {
      // Clean up expired token
      await prisma.verificationToken.delete({
        where: { token },
      });
      return NextResponse.redirect(
        new URL("/auth/login?error=Verification", request.url)
      );
    }

    // Verify the user
    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { email: verificationToken.identifier },
        data: {
          status: "ACTIVE",
          emailVerified: new Date(),
        },
      });

      // Delete the verification token (consumed)
      await tx.verificationToken.delete({
        where: { token },
      });
    });

    return NextResponse.redirect(
      new URL("/auth/login?verified=true", request.url)
    );
  } catch {
    return NextResponse.redirect(
      new URL("/auth/login?error=Verification", request.url)
    );
  }
}