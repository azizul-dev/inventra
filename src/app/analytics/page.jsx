import DashboardCharts from "@/components/dashboard/DashboardCharts";

export default function AnalyticsPage() {
  return (
    <div className="p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        <p className="mt-1 text-gray-500">লাভ, লস এবং বিক্রির বিস্তারিত বিশ্লেষণ</p>
      </div>
      <DashboardCharts />
    </div>
  );
}