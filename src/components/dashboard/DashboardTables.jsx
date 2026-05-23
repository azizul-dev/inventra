const recentSales = [
  {
    name: "Karim Store",
    product: "Rod 30 KG",
    amount: "৳ 8,200",
    status: "Paid",
    color: "bg-green-100 text-green-700",
    dot: "bg-green-600",
  },

  {
    name: "Rahim Traders",
    product: "Cement 10 Bag",
    amount: "৳ 6,500",
    status: "Due",
    color: "bg-red-100 text-red-700",
    dot: "bg-red-600",
  },

  {
    name: "Alam Mix",
    product: "Hardware",
    amount: "৳ 1,750",
    status: "Paid",
    color: "bg-green-100 text-green-700",
    dot: "bg-green-600",
  },

  {
    name: "Salam Brothers",
    product: "Rod 40 KG",
    amount: "৳ 2,800",
    status: "Due",
    color: "bg-red-100 text-red-700",
    dot: "bg-red-600",
  },
];

const stockItems = [
  {
    name: "Rod 12mm",
    stock: "3.5 Ton",
    width: "35%",
    color: "bg-orange-500",
    text: "text-orange-600",
  },

  {
    name: "Sand",
    stock: "0 Cubic",
    width: "10%",
    color: "bg-red-500",
    text: "text-red-600",
  },

  {
    name: "Cement 52",
    stock: "185 Bag",
    width: "85%",
    color: "bg-green-600",
    text: "text-green-700",
  },

  {
    name: "Brick",
    stock: "200 Pieces",
    width: "40%",
    color: "bg-yellow-500",
    text: "text-yellow-700",
  },
];

const DashboardTables = () => {
  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-2 p-4 max-w-7xl mx-auto">
      {/* RECENT SALES */}
      <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
        <div className="h-1 bg-gradient-to-r from-violet-500 via-sky-500 to-amber-500 bg-[length:200%_200%] animate-gradient" />

        <div className="flex items-center justify-between border-b px-6 py-5">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Recent Sales/ আজকের বিক্রি
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Today’s invoices
            </p>
          </div>

          <div className="rounded-full bg-violet-100 px-4 py-1 text-sm font-semibold text-violet-700">
            4 Items
          </div>
        </div>

        <div className="divide-y">
          {recentSales.map((sale, index) => (
            <div
              key={index}
              className="flex items-center justify-between px-6 py-5 transition-all duration-300 hover:bg-gray-50"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`h-3 w-3 rounded-full ${sale.dot}`}
                />

                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {sale.name}
                  </h3>

                  <p className="text-sm text-gray-500">
                    {sale.product}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <h2 className="text-xl font-bold text-gray-900">
                  {sale.amount}
                </h2>

                <span
                  className={`rounded-full px-4 py-1 text-sm font-semibold ${sale.color}`}
                >
                  {sale.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* STOCK STATUS */}
      <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
        <div className="h-1 bg-gradient-to-r from-pink-500 via-orange-500 to-yellow-500 bg-[length:200%_200%] animate-gradient" />

        <div className="flex items-center justify-between border-b px-6 py-5">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Stock Status
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Low stock alert
            </p>
          </div>

          <div className="rounded-full bg-orange-100 px-4 py-1 text-sm font-semibold text-orange-700">
            2 Low
          </div>
        </div>

        <div className="space-y-6 px-6 py-6">
          {stockItems.map((item, index) => (
            <div key={index}>
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  {item.name}
                </h3>

                <span
                  className={`font-bold ${item.text}`}
                >
                  {item.stock}
                </span>
              </div>

              <div className="h-3 overflow-hidden rounded-full bg-gray-200">
                <div
                  className={`h-full rounded-full ${item.color}`}
                  style={{ width: item.width }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardTables;