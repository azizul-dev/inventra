import Navbar from "@/components/dashboard/Navbar";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="p-6">
        <h1 className="text-4xl font-bold text-gray-900">
          Dashboard
        </h1>
      </div>
    </main>
  );
}