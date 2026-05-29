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
    const inventoryCollection = db.collection("inventor");

    // Find the bill first to get the items
    const billing = await billingCollection.findOne({ _id: new ObjectId(id) });
    if (!billing) {
      return NextResponse.json({ error: "Billing not found" }, { status: 404 });
    }

    // Restore inventory stock safely for each item in the bill
    if (billing.items && Array.isArray(billing.items)) {
      for (const item of billing.items) {
        if (item.productName) {
          const qty = parseNum(item.quantity);
          if (qty !== 0) {
            const product = await inventoryCollection.findOne(getProductQuery(item.productName));
            if (product) {
              const currentStock = parseNum(product.stock);
              const newStock = currentStock + qty;
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
    const inventoryCollection = db.collection("inventor");

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

    // If items are being updated, adjust the inventory stock accordingly
    if (normalizedData.items && Array.isArray(normalizedData.items)) {
      const oldItems = oldBilling.items || [];
      const newItems = normalizedData.items;

      // Map of old item quantities
      const oldItemsMap = {};
      for (const item of oldItems) {
        if (item.productName) {
          oldItemsMap[item.productName] = (oldItemsMap[item.productName] || 0) + parseNum(item.quantity);
        }
      }

      // Map of new item quantities
      const newItemsMap = {};
      for (const item of newItems) {
        if (item.productName) {
          newItemsMap[item.productName] = (newItemsMap[item.productName] || 0) + parseNum(item.quantity);
        }
      }

      // Get all unique product names
      const allProductNames = new Set([
        ...Object.keys(oldItemsMap),
        ...Object.keys(newItemsMap),
      ]);

      // Adjust inventory stock safely for each product
      for (const productName of allProductNames) {
        const qtyOld = oldItemsMap[productName] || 0;
        const qtyNew = newItemsMap[productName] || 0;
        const diff = qtyOld - qtyNew; // If old > new, stock increases. If old < new, stock decreases.

        if (diff !== 0) {
          const product = await inventoryCollection.findOne(getProductQuery(productName));
          if (product) {
            const currentStock = parseNum(product.stock);
            const newStock = currentStock + diff;
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
