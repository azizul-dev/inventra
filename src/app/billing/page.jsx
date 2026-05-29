import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import BillingClient from "./BillingClient";
import { getDb } from "@/lib/db";
import { ObjectId } from "mongodb";

export default async function BillingPage({ searchParams }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const { token } = await auth.api.getToken({
    headers: await headers(),
  });

  const resolvedParams = await searchParams;
  const prefillName = resolvedParams?.customerName || "";
  const prefillPhone = resolvedParams?.customerPhone || "";
  const prefillAddress = resolvedParams?.customerAddress || "";
  const editBillId = resolvedParams?.editBillId || "";

  let inventory = [];
  let billingList = [];
  let editBill = null;

  try {
    const db = await getDb();
    const inventoryCollection = db.collection("inventor");
    const billingCollection = db.collection("billing");

    const invData = await inventoryCollection.find().toArray();
    console.log("🔍 RAW inventory count:", invData.length); 

    inventory = invData.map(item => ({
      ...item,
      _id: item._id.toString(),
      createdAt: item.createdAt instanceof Date ? item.createdAt.toISOString() : item.createdAt,
      updatedAt: item.updatedAt instanceof Date ? item.updatedAt.toISOString() : item.updatedAt,
    }));

    const billData = await billingCollection.find().sort({ createdAt: -1 }).toArray();
    billingList = billData.map(bill => ({
      ...bill,
      _id: bill._id.toString(),
      createdAt: bill.createdAt instanceof Date ? bill.createdAt.toISOString() : bill.createdAt,
      updatedAt: bill.updatedAt instanceof Date ? bill.updatedAt.toISOString() : bill.updatedAt,
    }));

    if (editBillId && ObjectId.isValid(editBillId)) {
      const editBillData = await billingCollection.findOne({ _id: new ObjectId(editBillId) });
      if (editBillData) {
        editBill = {
          ...editBillData,
          _id: editBillData._id.toString(),
          createdAt: editBillData.createdAt instanceof Date ? editBillData.createdAt.toISOString() : editBillData.createdAt,
          updatedAt: editBillData.updatedAt instanceof Date ? editBillData.updatedAt.toISOString() : editBillData.updatedAt,
        };
      }
    }
  } catch (error) {
    console.error("Failed to fetch billing data directly from DB:", error);
  }

  return (
    <BillingClient
      session={session}
      token={token}
      initialInventory={inventory}
      initialBillingList={billingList}
      prefillName={prefillName}
      prefillPhone={prefillPhone}
      prefillAddress={prefillAddress}
      editBill={editBill}
    />
  );
}