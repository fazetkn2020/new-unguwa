export default function DashboardButtons({ navigate }) {
  return (
    <div className="flex gap-4 justify-center mt-6 px-4">
      <button
        onClick={() => navigate("/dashboard/exambank")}
        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg shadow"
      >
        Exam Bank
      </button>
      <button
        onClick={() => navigate("/dashboard/elibrary")}
        className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg shadow"
      >
        E-Library
      </button>
    </div>
  );
}
