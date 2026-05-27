import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import CustomersClient from "./CustomersClient";

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
    const billRes = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/billing`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
      next: { revalidate: 0 } // Get fresh bills
    });

    if (billRes.ok) {
      billingList = await billRes.json();
    }
  } catch (error) {
    console.error("Failed to fetch billing list for customers page:", error);
  }

  return (
    <CustomersClient
      session={session}
      token={token}
      initialBillingList={billingList}
    />
  );
}
