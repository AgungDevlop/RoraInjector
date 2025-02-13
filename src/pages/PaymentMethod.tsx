import React, { useState, useEffect } from 'react';
import { FaUniversity, FaCheckCircle, FaQuestionCircle } from 'react-icons/fa';
import PaymentCard from "./material/PaymentCard";
import PaymentForm from "./material/PaymentForm";
import { useNavigate } from 'react-router-dom';

const paymentMethods = [
  { id: 1, name: "Dana", icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwtRpAICKjKIeUmkSVYsuBa0Is2ILtR-gIqDAwtpITkEpoYe77eL_MkFeU&s=10" },
  { id: 2, name: "Ovo", icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR75y2qi_f20zR9LoLkHn4TpEYI6daeYieldA&usqp=CAU" },
  { id: 3, name: "LinkAja", icon: "https://vectorez.biz.id/wp-content/uploads/2023/12/Logo-Link-Aja-1.png" },
  { id: 4, name: "Gopay", icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwaEwRWvJaQL56TMk3sphvlcHID_zQ0TVKllqTJJMBdh1gZm_C71fSeGk&s=10" },
];

const PaymentMethod = () => {
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [receiverName, setReceiverName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [bankName, setBankName] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showValidationModal, setShowValidationModal] = useState(false);
  const navigate = useNavigate();

  const fetchPaymentMethods = async () => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      if (!user.user_id) {
        console.error("ID pengguna tidak ditemukan di localStorage");
        return;
      }
      const userId = user.user_id;
      console.log("Mengambil metode pembayaran untuk ID pengguna:", userId);
      try {
        const res = await fetch(`https://server.agungbot.my.id/user-payment-methods/${userId}`);
        const data = await res.json();
        console.log("Data dari server:", data);
      } catch (error) {
        console.error("Gagal mengambil metode pembayaran:", error);
      }
    } else {
      console.error("Data pengguna tidak ditemukan di localStorage");
    }
  };

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setShowValidationModal(true);
  };

  const confirmValidation = async () => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return;
    const user = JSON.parse(storedUser);
    const payload = {
      user_id: user.user_id,
      payment_method: selectedMethod,
      receiver_name: receiverName,
      account_number: accountNumber,
      bank_name: selectedMethod?.toLowerCase() === "bank" ? bankName : null,
    };

    const url = "https://server.agungbot.my.id/api/user-payment-methods";
    const method = "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        sessionStorage.setItem('paymentMethodSuccess', 'true');
        setShowSuccessModal(true);
      } else {
        alert("Gagal menambahkan metode pembayaran");
      }
    } catch (error) {
      console.error("Kesalahan saat menyimpan metode pembayaran:", error);
      alert("Terjadi kesalahan saat menyimpan metode pembayaran");
    }

    // Reset form fields after save attempt, whether successful or not
    setReceiverName("");
    setAccountNumber("");
    setBankName("");
    setSelectedMethod(null);
    setShowValidationModal(false);
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
    navigate("/payment");
  };

  const closeValidationModal = () => {
    setShowValidationModal(false);
  };

  return (
    <div className="container mb-4 mx-auto p-6 text-white">
      <h1 className="text-3xl font-bold mb-6">Metode Pembayaran</h1>
      <div className="bg-transparent border-2 border-purple-600 p-6 rounded shadow mb-6">
        <div className="grid grid-cols-2 gap-4">
          {paymentMethods.map((method) => (
            <PaymentCard
              key={method.id}
              method={method}
              isSelected={selectedMethod === method.name}
              onSelect={setSelectedMethod}
            />
          ))}
          <div
            onClick={() => setSelectedMethod("Bank")}
            className={`cursor-pointer flex items-center justify-center space-x-4 p-4 bg-purple-800 rounded hover:bg-purple-700 transition ${
              selectedMethod?.toLowerCase() === "bank" ? "border-2 border-purple-500" : "border border-purple-600"
            }`}
          >
            <FaUniversity className="text-purple-500 text-3xl" />
            <span>Bank</span>
          </div>
        </div>

        {selectedMethod && (
          <PaymentForm
            selectedMethod={selectedMethod}
            receiverName={receiverName}
            accountNumber={accountNumber}
            bankName={bankName}
            setReceiverName={setReceiverName}
            setAccountNumber={setAccountNumber}
            setBankName={setBankName}
            handleSave={handleSave}
          />
        )}
      </div>

      {/* Validation Modal */}
      {showValidationModal && (
        <div className="fixed inset-0 bg-purple-900 bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-purple-800 border border-purple-600 p-6 rounded-lg shadow-lg">
            <div className="flex items-center justify-center mb-4">
              <FaQuestionCircle className="text-yellow-500 text-4xl mr-2" />
              <h2 className="text-lg font-bold">Validasi</h2>
            </div>
            <p className="text-center">Apakah Anda yakin ingin menyimpan metode pembayaran ini?</p>
            <div className="flex justify-center mt-4">
              <button 
                onClick={confirmValidation} 
                className="mr-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Ya
              </button>
              <button 
                onClick={closeValidationModal} 
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Tidak
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-purple-900 bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-purple-800 border border-purple-600 p-6 rounded-lg shadow-lg">
            <div className="flex items-center justify-center mb-4">
              <FaCheckCircle className="text-green-500 text-4xl mr-2" />
              <h2 className="text-lg font-bold">Berhasil</h2>
            </div>
            <p className="text-center">Metode pembayaran berhasil ditambahkan!</p>
            <button 
              onClick={handleCloseModal} 
              className="mt-4 w-full px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-500"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentMethod;