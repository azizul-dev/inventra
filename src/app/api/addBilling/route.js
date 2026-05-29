import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getDb } from "@/lib/db";

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

// Helper to query product names robustly ignoring leading/trailing spaces and case
function getProductQuery(productName) {
  const trimmed = String(productName).trim();
  const escaped = trimmed.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  return {
    $or: [
      { productName: productName },
      { productName: trimmed },
      { productName: new RegExp("^\\s*" + escaped + "\\s*$", "i") }
    ]
  };
}

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

    // Items validation using parseNum
    const validItems = items.every(
      (item) =>
        item.productName &&
        parseNum(item.quantity) > 0 &&
        item.unit &&
        parseNum(item.sellPrice) >= 0
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
        quantity: parseNum(item.quantity),
        unit: item.unit,
        sellPrice: parseNum(item.sellPrice),
      })),
      total: parseNum(total),
      paidAmount: paidAmount !== undefined ? parseNum(paidAmount) : parseNum(total),
      dueAmount: dueAmount !== undefined ? parseNum(dueAmount) : 0,
      createdAt: new Date(),
    };

    const result = await billingCollection.insertOne(billingData);

    // Update inventory stock safely for each item in the bill
    const inventoryCollection = db.collection("inventor");
    for (const item of billingData.items) {
      if (item.productName) {
        const qty = parseNum(item.quantity);
        if (qty !== 0) {
          const product = await inventoryCollection.findOne(getProductQuery(item.productName));
          if (product) {
            const currentStock = parseNum(product.stock);
            const newStock = currentStock - qty;
            await inventoryCollection.updateOne(
              { _id: product._id },
              {
                $set: {
                  stock: newStock,
                  updatedAt: new Date(),
                },
              }
            );
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      insertedId: result.insertedId,
    });
  } catch (error) {
    console.error("POST /api/addBilling error:", error);
    return NextResponse.json({ error: "Failed to add billing: " + error.message }, { status: 500 });
  }
}
