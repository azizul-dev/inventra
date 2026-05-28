import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getDb } from "@/lib/db";
import { ObjectId } from "mongodb";

// GET single billing
export async function GET(req, { params }) {
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

    const db = await getDb();
    const billingCollection = db.collection("billing");
    const result = await billingCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!result) {
      return NextResponse.json({ error: "Billing not found" }, { status: 404 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("GET /api/billing/[id] error:", error);
    return NextResponse.json({ error: "Failed to fetch billing" }, { status: 500 });
  }
}

// DELETE single billing
export async function DELETE(req, { params }) {
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

    const db = await getDb();
    const billingCollection = db.collection("billing");
    const result = await billingCollection.deleteOne({
      _id: new ObjectId(id),
    });

    return NextResponse.json({
      success: true,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("DELETE /api/billing/[id] error:", error);
    return NextResponse.json({ error: "Failed to delete billing" }, { status: 500 });
  }
}

// PATCH single billing (update)
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
    const db = await getDb();
    const billingCollection = db.collection("billing");

    const { _id, ...updatedData } = body;

    const updatedWithTime = {
      ...updatedData,
      updatedAt: new Date(),
    };

    const result = await billingCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedWithTime }
    );

    return NextResponse.json({
      success: true,
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error("PATCH /api/billing/[id] error:", error);
    return NextResponse.json({ error: "Failed to update billing" }, { status: 500 });
  }
}
