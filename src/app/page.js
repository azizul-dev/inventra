
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardTables from "@/components/dashboard/DashboardTables";
import Footer from "@/components/dashboard/Footer";
import Navbar from "@/components/dashboard/Navbar";
import StatsCard from "@/components/dashboard/StatsCard";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <DashboardHeader/>
      <StatsCard/>
      <DashboardTables/>
      <Footer/>
    </main>
  );
}