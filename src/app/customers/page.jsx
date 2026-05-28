import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import CustomersClient from "@/components/customers/CustomersClient";
import { getDb } from "@/lib/db";

export default async function CustomersPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const { token } = await auth.api.getToken({
    headers: await headers(),
  });

  let billingList = [];

  try {
    const db = await getDb();
    const billingCollection = db.collection("billing");
    const billData = await billingCollection.find().sort({ createdAt: -1 }).toArray();
    billingList = billData.map(bill => ({
      ...bill,
      _id: bill._id.toString(),
      createdAt: bill.createdAt instanceof Date ? bill.createdAt.toISOString() : bill.createdAt,
      updatedAt: bill.updatedAt instanceof Date ? bill.updatedAt.toISOString() : bill.updatedAt,
    }));
  } catch (error) {
    console.error("Failed to query billing directly on customers page:", error);
  }

  return (
    <CustomersClient
      session={session}
      token={token}
      initialBillingList={billingList}
    />
  );
}
