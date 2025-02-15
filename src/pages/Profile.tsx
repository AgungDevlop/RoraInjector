import { useState, useEffect } from 'react';
import { FaUser, FaEnvelope, FaMoneyBillWave, FaUserCircle } from 'react-icons/fa';
import axios from 'axios';

const Profile = () => {
  const [user, setUser] = useState<any>(null);
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUser = sessionStorage.getItem("user");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);

          // Fetch balance from the API
          const response = await axios.get(`https://server.agungbot.my.id/api/total-balance?user_id=${parsedUser.user_id}`);
          setBalance(response.data.total_balance);
        }
      } catch (err) {
        setError("Gagal mengambil data saldo. Silakan coba lagi nanti.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const formatCurrency = (value: number | null) => {
    if (value === null) {
      return "Rp 0";
    }
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(value);
  };

  if (loading) return <div className="container mx-auto p-6 text-white">Loading...</div>;
  if (error) return <div className="container mx-auto p-6 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-6">
      <div className="bg-transparent border-2 border-purple-600 p-6 rounded-xl shadow-lg">
        {/* Header Profil */}
        <div className="flex flex-col items-center border-b border-purple-700 pb-6">
          <div className="w-24 h-24 rounded-full bg-purple-700 flex items-center justify-center">
            <FaUserCircle className="text-white text-4xl" />
          </div>
          <h1 className="text-3xl font-bold mt-4 text-white">Profil Saya</h1>
        </div>

        {/* Informasi Akun */}
        <div className="mt-6 space-y-6">
          <div className="flex items-center">
            <FaUser className="text-purple-500 text-xl mr-3" />
            <div>
              <p className="text-gray-400 text-sm">Username</p>
              <p className="text-white text-lg font-semibold">
                {user ? user.username : "Tidak tersedia"}
              </p>
            </div>
          </div>

          <div className="flex items-center">
            <FaEnvelope className="text-purple-500 text-xl mr-3" />
            <div>
              <p className="text-gray-400 text-sm">Email</p>
              <p className="text-white text-lg font-semibold">
                {user ? user.email : "Tidak tersedia"}
              </p>
            </div>
          </div>

          <div className="flex items-center">
            <FaMoneyBillWave className="text-purple-500 text-xl mr-3" />
            <div>
              <p className="text-gray-400 text-sm">Saldo</p>
              <p className="text-white text-lg font-semibold">
                {balance !== null ? formatCurrency(balance) : "Rp 0"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;