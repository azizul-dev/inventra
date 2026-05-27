import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import BillingClient from "./BillingClient";

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

  let inventory = [];
  let billingList = [];

  try {
    const invRes = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/inventory`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
      next: { revalidate: 0 } // Disable caching to get fresh stock
    });

    if (invRes.ok) {
      inventory = await invRes.json();
    }
  } catch (error) {
    console.error("Failed to fetch inventory for billing:", error);
  }

  try {
    const billRes = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/billing`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
      next: { revalidate: 0 } // Disable caching to get fresh bills
    });

    if (billRes.ok) {
      billingList = await billRes.json();
    }
  } catch (error) {
    console.error("Failed to fetch billing list:", error);
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
    />
  );
}