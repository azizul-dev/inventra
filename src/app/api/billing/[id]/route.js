import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getDb } from "@/lib/db";
import { ObjectId } from "mongodb";

// Helper to normalize Bangla and English digits to standard English float
function parseNum(val) {
  if (val === null || val === undefined) return 0;
  const s = String(val).trim();
  if (s === "") return 0;
  const banglaDigits = {
    "০": "0", "১": "1", "২": "2", "৩": "3", "৪": "4",
    "৫": "5", "৬": "6", "৭": "7", "৮": "8", "৯": "9"
  };
  const normalized = s.replace(/[০-৯]/g, (match) => banglaDigits[match]);
  return parseFloat(normalized) || 0;
}


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

    // Find the bill first to get the items
    const billing = await billingCollection.findOne({ _id: new ObjectId(id) });
    if (!billing) {
      return NextResponse.json({ error: "Billing not found" }, { status: 404 });
    }

    const result = await billingCollection.deleteOne({
      _id: new ObjectId(id),
    });

    return NextResponse.json({
      success: true,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("DELETE /api/billing/[id] error:", error);
    return NextResponse.json({ error: "Failed to delete billing: " + error.message }, { status: 500 });
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

    // Find the old bill to compare items
    const oldBilling = await billingCollection.findOne({ _id: new ObjectId(id) });
    if (!oldBilling) {
      return NextResponse.json({ error: "Billing not found" }, { status: 404 });
    }

    const { _id, ...updatedData } = body;

    const normalizedData = {
      customerName: updatedData.customerName ? updatedData.customerName.trim() : "",
      customerAddress: updatedData.customerAddress ? updatedData.customerAddress.trim() : "",
      customerPhone: updatedData.customerPhone ? updatedData.customerPhone.trim() : "",
      status: updatedData.status || (parseNum(updatedData.dueAmount) === 0 ? "Paid" : "Due"),
      total: parseNum(updatedData.total),
      paidAmount: updatedData.paidAmount !== undefined ? parseNum(updatedData.paidAmount) : parseNum(updatedData.total),
      dueAmount: updatedData.dueAmount !== undefined ? parseNum(updatedData.dueAmount) : 0,
      updatedAt: new Date(),
    };

    if (updatedData.items && Array.isArray(updatedData.items)) {
      normalizedData.items = updatedData.items.map((item) => ({
        productName: item.productName ? item.productName.trim() : "",
        quantity: parseNum(item.quantity),
        unit: item.unit ? item.unit.trim() : "pcs",
        sellPrice: parseNum(item.sellPrice),
      }));
    }

    const result = await billingCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: normalizedData }
    );

    return NextResponse.json({
      success: true,
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error("PATCH /api/billing/[id] error:", error);
    return NextResponse.json({ error: "Failed to update billing: " + error.message }, { status: 500 });
  }
}
