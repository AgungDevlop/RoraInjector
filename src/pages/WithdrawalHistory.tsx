import { useEffect, useState } from "react";
import axios from "axios";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

interface Transaction {
  transaction_id: number;
  user_id: string;
  type: string;
  amount: number;
  description: string;
  created_at: string;
}

const WithdrawalHistory: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchTransactions = async () => {
      const userData = sessionStorage.getItem("user");
      
      if (!userData) {
        setError("User tidak ditemukan. Silakan login kembali.");
        setLoading(false);
        return;
      }

      const user = JSON.parse(userData);
      const userId = user.user_id;

      if (!userId) {
        setError("User ID tidak ditemukan. Silakan login kembali.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get(
          `https://videyhost.my.id/api/transactions/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
          }
        );
        setTransactions(response.data);
        setError(null);
      } catch (err) {
        setError("Gagal mengambil data transaksi. Silakan coba lagi.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  // Fungsi untuk format angka ke Rp tanpa desimal
  const formatRupiah = (amount: number) => {
    return `Rp ${Math.floor(amount).toLocaleString("id-ID")}`;
  };

  // Fungsi untuk format tanggal ke format yang lebih rapi
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Filter transaksi debit dan paginasi
  const debitTransactions = transactions.filter((transaction) => transaction.type === "debit");
  const totalPages = Math.ceil(debitTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentTransactions = debitTransactions.slice(startIndex, startIndex + itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (loading) {
    return <div className="text-center p-4 text-purple-300">Memuat data...</div>;
  }

  if (error) {
    return <div className="text-center text-red-400 p-4">{error}</div>;
  }

  return (
    <div className="container mx-auto p-6 text-white pb-20">
      <h1 className="text-3xl font-bold mb-6 text-purple-100">Riwayat Penarikan</h1>
      {debitTransactions.length === 0 ? (
        <p className="text-purple-400 text-lg">Belum ada transaksi penarikan.</p>
      ) : (
        <div className="overflow-x-auto bg-purple-900 bg-opacity-50 rounded-lg shadow-lg">
          <table className="min-w-full border border-purple-700">
            <thead>
              <tr className="bg-purple-800 text-purple-200">
                <th className="py-4 px-6 border-b border-purple-700 text-left text-sm font-semibold">Tipe</th>
                <th className="py-4 px-6 border-b border-purple-700 text-left text-sm font-semibold">Jumlah</th>
                <th className="py-4 px-6 border-b border-purple-700 text-left text-sm font-semibold">Deskripsi</th>
                <th className="py-4 px-6 border-b border-purple-700 text-left text-sm font-semibold">Tanggal</th>
              </tr>
            </thead>
            <tbody>
              {currentTransactions.map((transaction) => (
                <tr key={transaction.transaction_id} className="hover:bg-purple-800 text-purple-200 transition-colors">
                  <td className="py-4 px-6 border-b border-purple-700">{transaction.type}</td>
                  <td className="py-4 px-6 border-b border-purple-700">{formatRupiah(transaction.amount)}</td>
                  <td className="py-4 px-6 border-b border-purple-700">{transaction.description}</td>
                  <td className="py-4 px-6 border-b border-purple-700">{formatDate(transaction.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Paginasi */}
          <div className="flex justify-between items-center p-4 text-purple-300">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className={`p-2 rounded-full transition-colors ${
                currentPage === 1 ? "bg-purple-700 text-purple-400 cursor-not-allowed" : "bg-purple-600 hover:bg-purple-500"
              }`}
            >
              <FaArrowLeft className="text-lg" />
            </button>
            <span className="text-sm">
              Halaman {currentPage} dari {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-full transition-colors ${
                currentPage === totalPages ? "bg-purple-700 text-purple-400 cursor-not-allowed" : "bg-purple-600 hover:bg-purple-500"
              }`}
            >
              <FaArrowRight className="text-lg" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WithdrawalHistory;