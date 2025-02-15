import { useState, useEffect } from "react";
import axios from "axios";
import { FaCalendarAlt, FaSearch } from "react-icons/fa";

const EarningsHistory: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [displayedData, setDisplayedData] = useState<any[]>([]); // Data yang ditampilkan (default 10 baris)
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  // Ambil user dari sessionStorage
  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      fetchEarningsHistory(parsedUser.user_id, startDate, endDate);
    } else {
      setError("User tidak ditemukan. Silakan login kembali.");
      setLoading(false);
    }
  }, []);

  // Fungsi untuk mengambil data analitik harian dari backend
  const fetchEarningsHistory = async (userId: number, start: string, end: string) => {
    try {
      setLoading(true);
      let url = `https://videyhost.my.id/api/daily-analytics?user_id=${userId}&sort_by=date&sort_order=DESC`;
      if (start && end) {
        url += `&start_date=${start}&end_date=${end}`;
      }
      const response = await axios.get(url);
      setDisplayedData(response.data.slice(0, 10)); // Ambil 10 baris pertama secara default
    } catch (err) {
      setError("Gagal mengambil data riwayat penghasilan. Silakan coba lagi nanti.");
      console.error("Error fetching earnings history:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handler untuk filter tanggal
  const handleFilter = () => {
    if (user) {
      fetchEarningsHistory(user.user_id, startDate, endDate);
    }
  };

  // Fungsi untuk memformat mata uang ke IDR
  const formatCurrency = (value: number | string) => {
    if (value === null || value === undefined) {
      return "Rp 0";
    }
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(Number(value));
  };

  // Fungsi untuk memformat tanggal ke format Indonesia
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "long",
      year: "numeric",
    };
    return new Date(dateString).toLocaleDateString("id-ID", options);
  };

  // Tampilan loading
  if (loading) {
    return (
      <div className="container mx-auto p-4 text-white pb-20">
        <h1 className="text-3xl font-bold mb-4">Riwayat Penghasilan</h1>
        <p className="text-center">Memuat data...</p>
      </div>
    );
  }

  // Tampilan error
  if (error) {
    return (
      <div className="container mx-auto p-4 text-white pb-20">
        <h1 className="text-3xl font-bold mb-4">Riwayat Penghasilan</h1>
        <p className="text-red-500 text-center">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 text-white pb-20">
      <h1 className="text-3xl font-bold mb-6">
        Riwayat Penghasilan - {user?.name || user?.username || "User"}
      </h1>

      {/* Filter Tanggal */}
      <div className="mb-8 flex flex-col md:flex-row gap-4 items-center bg-gray-800 p-4 rounded-lg shadow-lg">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <FaCalendarAlt className="text-purple-400" />
          <label className="text-sm font-medium">Dari:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 w-full"
          />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <FaCalendarAlt className="text-purple-400" />
          <label className="text-sm font-medium">Sampai:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 w-full"
          />
        </div>
        <button
          onClick={handleFilter}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white shadow-md transition duration-200 w-full md:w-auto"
        >
          <FaSearch />
          Filter
        </button>
      </div>

      {/* Tabel Riwayat Penghasilan */}
      {displayedData.length === 0 ? (
        <p className="text-center text-gray-400 text-lg">
          Belum ada data penghasilan harian.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow-lg">
          <table className="min-w-full bg-gray-800">
            <thead>
              <tr className="bg-purple-700 text-white">
                <th className="py-4 px-6 text-left text-sm font-semibold">Tanggal</th>
                <th className="py-4 px-6 text-left text-sm font-semibold">Impressions</th>
                <th className="py-4 px-6 text-left text-sm font-semibold">CPM</th>
                <th className="py-4 px-6 text-left text-sm font-semibold">Penghasilan</th>
              </tr>
            </thead>
            <tbody>
              {displayedData.map((data, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-700 hover:bg-gray-700 transition duration-150"
                >
                  <td className="py-4 px-6 text-sm">{formatDate(data.date)}</td>
                  <td className="py-4 px-6 text-sm">{data.impressions.toLocaleString("id-ID")}</td>
                  <td className="py-4 px-6 text-sm">{formatCurrency(data.cpm)}</td>
                  <td className="py-4 px-6 text-sm font-medium text-green-400">
                    {formatCurrency(data.earnings)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default EarningsHistory;