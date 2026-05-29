import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getDb } from "@/lib/db";
import { ObjectId } from "mongodb";

export async function PATCH(req, { params }) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const body = await req.json();

    // Trim string inputs to prevent trailing whitespaces
    if (body.productName) body.productName = body.productName.trim();
    if (body.category) body.category = body.category.trim();
    if (body.unit) body.unit = body.unit.trim();
    if (body.brand) body.brand = body.brand.trim();

    const db = await getDb();
    const inventoryCollection = db.collection("inventor");

    // Clean body fields if ObjectId is passed in body
    const { _id, ...updatedData } = body;

    const updatedWithTime = {
      ...updatedData,
      updatedAt: new Date(),
    };

    const result = await inventoryCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedWithTime }
    );

    return NextResponse.json({
      success: true,
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error("PATCH /api/inventoryUpdate error:", error);
    return NextResponse.json({ error: "Failed to update inventory" }, { status: 500 });
  }
}
