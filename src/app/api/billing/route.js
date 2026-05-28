import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getDb } from "@/lib/db";

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = await getDb();
    const billingCollection = db.collection("billing");
    const result = await billingCollection
      .find()
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(result);
  } catch (error) {
    console.error("GET /api/billing error:", error);
    return NextResponse.json({ error: "Failed to fetch billing" }, { status: 500 });
  }
}
