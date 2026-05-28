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
    const {
      customerName,
      customerAddress,
      customerPhone,
      status,
      items,
      total,
      paidAmount,
      dueAmount,
    } = body;

    // Validation
    if (
      !customerName ||
      !status ||
      !items ||
      items.length === 0 ||
      total === undefined
    ) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Items validation
    const validItems = items.every(
      (item) =>
        item.productName &&
        item.quantity > 0 &&
        item.unit &&
        item.sellPrice >= 0
    );

    if (!validItems) {
      return NextResponse.json({ error: "Invalid item structure" }, { status: 400 });
    }

    const db = await getDb();
    const billingCollection = db.collection("billing");

    const billingData = {
      customerName: customerName.trim(),
      customerAddress: customerAddress ? customerAddress.trim() : "",
      customerPhone: customerPhone ? customerPhone.trim() : "",
      status,
      items: items.map((item) => ({
        productName: item.productName,
        quantity: Number(item.quantity),
        unit: item.unit,
        sellPrice: Number(item.sellPrice),
      })),
      total: Number(total),
      paidAmount: paidAmount !== undefined ? Number(paidAmount) : Number(total),
      dueAmount: dueAmount !== undefined ? Number(dueAmount) : 0,
      createdAt: new Date(),
    };

    const result = await billingCollection.insertOne(billingData);

    return NextResponse.json({
      success: true,
      insertedId: result.insertedId,
    });
  } catch (error) {
    console.error("POST /api/addBilling error:", error);
    return NextResponse.json({ error: "Failed to add billing" }, { status: 500 });
  }
}
