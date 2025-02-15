import { useState, useEffect } from "react";
import { FaPiggyBank, FaEye, FaMoneyBill, FaChartLine, FaHistory } from "react-icons/fa";
import UploadVideo from './UploadVideo';
import CardItem from './element/CardItem';
import axios from 'axios';

const Dashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [impressionsToday, setImpressionsToday] = useState<number | null>(null);
  const [cpm, setCpm] = useState<number | null>(null);
  const [revenueToday, setRevenueToday] = useState<number | null>(null);
  const [totalBalance, setTotalBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      fetchDashboardData(parsedUser.user_id);
    }
  }, []);

  const fetchDashboardData = async (userId: number) => {
    try {
      setLoading(true);

      // Gunakan endpoint baru untuk ambil total revenue, total impressions, dan average CPM
      const revenueResponse = await axios.get(`https://videyhost.my.id/api/total-revenue?user_id=${userId}`);
      setRevenueToday(parseFloat(revenueResponse.data.totalRevenue));
      setImpressionsToday(revenueResponse.data.totalImpressions);
      setCpm(parseFloat(revenueResponse.data.avgCpm));

      // Ambil total saldo dari endpoint /total-balance
      const balanceResponse = await axios.get(`https://videyhost.my.id/api/total-balance?user_id=${userId}`);
      setTotalBalance(parseFloat(balanceResponse.data.total_balance));

    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number | null) => {
    if (value === null || value === undefined) {
      return "Rp 0";
    }
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(value);
  };

  const cardData = [
    {
      icon: <FaPiggyBank className="text-blue-400" />,
      title: "Saldo Total",
      value: loading ? "Sedang Dihitung..." : formatCurrency(totalBalance),
      description: "Tarik saldo mulai Rp100.000, langsung ke rekeningmu dalam 1 minggu!",
      onClick: () => window.location.href = "/payment",
      bgColor: "bg-blue-500 bg-opacity-10"
    },
    {
      icon: <FaMoneyBill className="text-green-500" />,
      title: "Pendapatan Hari Ini",
      value: loading ? "Sedang Dihitung..." : formatCurrency(revenueToday),
      description: "Lihat berapa banyak uang yang kamu hasilkan hari ini dari video-videomu!",
      bgColor: "bg-green-500 bg-opacity-10"
    },
    {
      icon: <FaEye className="text-yellow-400" />,
      title: "Impression Hari Ini",
      value: loading ? "Sedang Dihitung..." : (impressionsToday?.toLocaleString('id-ID') || "0"),
      description: "Berapa banyak orang yang sudah menyaksikan video kamu hari ini?",
      bgColor: "bg-yellow-400 bg-opacity-10"
    },
    {
      icon: <FaMoneyBill className="text-green-400" />,
      title: "CPM",
      value: loading ? "Sedang Dihitung..." : formatCurrency(cpm),
      description: "Berapa yang kamu dapatkan per 1000 tayangan? Temukan nilai CPM-mu di sini!",
      bgColor: "bg-green-400 bg-opacity-10"
    },
    {
      icon: <FaChartLine className="text-red-400" />,
      title: "Penghasilan Harian",
      value: "Lihat Sejarah Penghasilan",
      description: "Telusuri tren penghasilan harianmu untuk memaksimalkan strategimu!",
      onClick: () => window.location.href = "/earnings-history",
      bgColor: "bg-red-400 bg-opacity-10"
    },
    {
      icon: <FaHistory className="text-purple-400" />,
      title: "Riwayat Pencairan",
      value: "Lihat Riwayat",
      description: "Periksa semua transaksi pencairanmu, transparansi terjamin!",
      onClick: () => window.location.href = "/withdrawal-history",
      bgColor: "bg-purple-400 bg-opacity-10"
    },
  ];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4" data-aos="fade-down">
        Dashboard - {user?.name || user?.username || "User"} {/* Using user data here */}
      </h1>
      
      {/* Upload Video Section */}
      <div className="mb-6" data-aos="fade-up" data-aos-delay="100">
        <UploadVideo />
      </div>

      {/* Card Dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-20">
        {cardData.map((card, index) => (
          <div key={index} data-aos="fade-up" data-aos-delay={index * 100}>
            <CardItem 
              icon={card.icon} 
              title={card.title} 
              value={card.value} 
              description={card.description} 
              onClick={card.onClick} 
              bgColor={card.bgColor} 
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;