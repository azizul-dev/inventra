import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getDb } from "@/lib/db";

export async function POST(req) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    
    // Trim string inputs to prevent trailing whitespaces
    if (body.productName) body.productName = body.productName.trim();
    if (body.category) body.category = body.category.trim();
    if (body.unit) body.unit = body.unit.trim();
    if (body.brand) body.brand = body.brand.trim();

    const db = await getDb();
    const inventoryCollection = db.collection("inventor");

    const data = {
      ...body,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await inventoryCollection.insertOne(data);

    return NextResponse.json({
      success: true,
      insertedId: result.insertedId,
    });
  } catch (error) {
    console.error("POST /api/addInventory error:", error);
    return NextResponse.json({ error: "Failed to add inventory" }, { status: 500 });
  }
}
