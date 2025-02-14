import { useState, useEffect } from "react";
import { FaPiggyBank, FaMoneyBill, FaCreditCard } from "react-icons/fa";
import CardItem from './element/CardItem';
import axios from 'axios';

const Payment = () => {
  const [balance, setBalance] = useState<number | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [requestError, setRequestError] = useState<string | null>(null);
  const [paymentRequests, setPaymentRequests] = useState<any[]>([]);
  const [showSuccessMessage, setShowSuccessMessage] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [withdrawalId, setWithdrawalId] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
          throw new Error("User not logged in");
        }
        const user = JSON.parse(storedUser);

        // Fetch balance
        const balanceResponse = await axios.get(`https://server.agungbot.my.id/api/total-balance?user_id=${user.user_id}`);
        setBalance(parseFloat(balanceResponse.data.total_balance));

        // Fetch payment method
        const paymentMethodResponse = await axios.get(`https://server.agungbot.my.id/api/user-payment-methods/${user.user_id}`);
        if (paymentMethodResponse.data.length > 0) {
          setPaymentMethod(paymentMethodResponse.data[0]);
        }

        // Fetch payment requests
        const paymentRequestsResponse = await axios.get(`https://server.agungbot.my.id/api/payment-requests/${user.user_id}`);
        setPaymentRequests(paymentRequestsResponse.data);

        setLoading(false);
      } catch (err) {
        setError("Error fetching data");
        setLoading(false);
      }
    };

    fetchData();

    if (sessionStorage.getItem('paymentMethodSuccess') === 'true') {
      setShowSuccessMessage(true);
      // Remove the message from session storage to prevent it from showing again
      sessionStorage.removeItem('paymentMethodSuccess');

      // Set a timeout to hide the message after 5 seconds with smooth fade out
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);
    }
  }, []);

  const handlePaymentRequest = async (withdrawal_id: string) => {
    setWithdrawalId(withdrawal_id);
    setIsModalOpen(true);
  };

  const confirmWithdrawal = async () => {
    try {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) {
        throw new Error("User not logged in");
      }
      const user = JSON.parse(storedUser);

      if (!paymentMethod || balance === null) {
        setRequestError("Metode pembayaran belum diatur atau data saldo tidak tersedia.");
        return;
      }

      if (balance < 100000) {
        showAlert("Belum minimum pembayaran", "Saldo Anda belum mencapai minimum pembayaran yaitu Rp 100.000.", "red");
        return;
      }

      const response = await axios.post('https://server.agungbot.my.id/api/payment-request', {
        user_id: user.user_id,
        payment_method: paymentMethod.payment_method,
        payment_account: paymentMethod.account_number,
        withdrawal_id: withdrawalId // Send withdrawal_id to backend
      });

      // Update balance and show success alert
      setBalance(response.data.new_balance);
      setRequestError(null);
      setPaymentRequests([response.data, ...paymentRequests]);

      showAlert("Permintaan Pembayaran Berhasil", "Permintaan pembayaran Anda telah dibuat dengan sukses.", "green");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setRequestError(err.response?.data.message || 'Gagal mengirim permintaan pembayaran. Silakan coba lagi.');
      } else {
        setRequestError('Terjadi kesalahan tidak terduga. Silakan coba lagi.');
      }
      console.error('Error requesting payment:', err);
    } finally {
      setIsModalOpen(false);
    }
  };

  const cancelWithdrawal = () => {
    setIsModalOpen(false);
  };

  const showAlert = (title: string, message: string, color: string) => {
    const alertContainer = document.createElement('div');
    alertContainer.className = "fixed z-50 inset-0 overflow-y-auto";
    alertContainer.innerHTML = `
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 transition-opacity" aria-hidden="true">
          <div class="absolute inset-0 bg-purple-900 opacity-75"></div>
        </div>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true"></span>
        <div class="inline-block align-middle bg-purple-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full" role="dialog" aria-modal="true" aria-labelledby="modal-headline">
          <div class="bg-purple-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-${color === 'red' ? 'purple' : color}-700 sm:mx-0 sm:h-10 sm:w-10">
                <svg class="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  ${color === 'red' ? '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />' : '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />'}
                </svg>
              </div>
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 class="text-lg leading-6 font-medium text-white" id="modal-headline">
                  ${title}
                </h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-300">
                    ${message}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-purple-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button type="button" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-purple-600 text-base font-medium text-white hover:bg-purple-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:ml-3 sm:w-auto sm:text-sm" onclick="this.parentElement.parentElement.parentElement.remove()">
              OK
            </button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(alertContainer);
  };

  const formatCurrency = (value: number | null) => {
    if (value === null || value === undefined) {
      return "Rp 0";
    }
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const calculateEstimatedProcessing = (requestedAt: string): string => {
    const date = new Date(requestedAt);
    date.setDate(date.getDate() + 7); // Add 7 days to the requested date
    return formatDate(date.toISOString()); // Assuming formatDate can handle ISO string
  };

  const cardData = [
    {
      icon: <FaPiggyBank className="text-blue-400" />,
      title: "Saldo Anda",
      value: loading ? "Sedang Dihitung..." : formatCurrency(balance),
      description: "Total saldo yang tersedia untuk pencairan. Minimum pencairan adalah Rp 100.000.",
      bgColor: "bg-blue-500 bg-opacity-10"
    },
    {
      icon: <FaCreditCard className="text-green-500" />,
      title: "Metode Pembayaran",
      value: paymentMethod ? paymentMethod.payment_method : "Belum Disetel",
      description: paymentMethod ? (
        <>
          <p><strong>Nama Penerima:</strong> {paymentMethod.receiver_name}</p>
          {paymentMethod.payment_method === 'Bank' && <p><strong>Nama Bank:</strong> {paymentMethod.bank_name}</p>}
          <p><strong>Nomor Akun:</strong> {paymentMethod.account_number}</p>
        </>
      ) : "Silakan atur metode pembayaran Anda.",
      bgColor: "bg-green-500 bg-opacity-10"
    },
  ];

  // Generate cards for multiples of 100 up to 500,000 and one for max amount
  let withdrawalOptions = [];
  if (balance !== null) {
    for (let i = 100; i <= 500; i += 100) {
      if (i * 1000 <= balance) {
        withdrawalOptions.push({
          icon: <FaMoneyBill className="text-purple-400" />,
          title: formatCurrency(i * 1000),
          value: '',  
          description: "Klik untuk mencairkan",
          bgColor: "bg-purple-500 bg-opacity-10",
          onClick: () => handlePaymentRequest(`${i}k`) // e.g., '100k', '200k'
        });
      }
    }
    withdrawalOptions.push({
      icon: <FaMoneyBill className="text-red-400" />,
      title: formatCurrency(balance),
      value: '',  
      description: balance < 100000 ? "Saldo belum mencapai minimum pencairan Rp 100.000." : "Cairkan Seluruh Saldo Anda",
      bgColor: "bg-red-500 bg-opacity-10",
      onClick: balance < 100000 ? undefined : () => handlePaymentRequest('max')
    });
  }

  return (
    <div className="container mx-auto p-4 pb-20">
      <h1 className="text-3xl font-bold mb-4" data-aos="fade-down">
        Pembayaran
      </h1>

      {/* Success Message */}
      {showSuccessMessage && (
        <div 
          className="mb-4 p-4 bg-purple-800 border border-purple-600 text-white rounded transition-opacity duration-500"
          style={{ opacity: showSuccessMessage ? 1 : 0 }}
        >
          <p>Payment Method Berhasil Di Tambahkan</p>
        </div>
      )}

{/* Card Payment */}
<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-20">
  {cardData.map((card, index) => (
    <div 
      key={index} 
      data-aos="fade-up" 
      data-aos-delay={index * 100}
      className={`p-4 rounded shadow-md flex flex-col items-start ${card.bgColor || 'bg-gray-800'}`}
      style={{ cursor: 'default' }} // If no interactivity is needed, set to default
    >
      <div className="flex items-center mb-2">
        <div className="text-4xl mr-4">{card.icon}</div>
        <div>
          <h3 className="text-xl font-semibold">{card.title}</h3>
          <p className="text-lg">{card.value}</p>
        </div>
      </div>
      {card.description && <p className="text-sm text-gray-400">{card.description}</p>}
    </div>
  ))}
</div>

      {/* Withdrawal Options - 2 grid 2 columns */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {withdrawalOptions.map((option, index) => (
          <div key={index} onClick={option.onClick} data-aos="fade-up" data-aos-delay={index * 100}>
            <CardItem 
              icon={option.icon} 
              title={<span className="text-sm">{option.title}</span>}  
              value={option.value} 
              description={option.description} 
              bgColor={option.bgColor}
            />
          </div>
        ))}
      </div>

      {requestError && <p className="text-red-500 text-center">{requestError}</p>}
      {error && <p className="text-red-500 text-center">{error}</p>}

      {/* Modal for Withdrawal Confirmation */}
      {isModalOpen && (
        <div className="fixed z-50 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity">
              <div className="absolute inset-0 bg-purple-900 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true"></span>
            <div className="inline-block align-middle bg-purple-900 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-purple-900 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-purple-700 sm:mx-0 sm:h-10 sm:w-10">
                    <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-white">
                      Apakah Kamu yakin Akan Melakukan Withdraw?
                    </h3>
                  </div>
                </div>
              </div>
              <div className="bg-purple-800 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button onClick={confirmWithdrawal} type="button" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-purple-600 text-base font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:ml-3 sm:w-auto sm:text-sm">
                  Ya, Withdraw
                </button>
                <button onClick={cancelWithdrawal} type="button" className="mt-3 w-full inline-flex justify-center rounded-md border border-purple-600 shadow-sm px-4 py-2 bg-purple-700 text-base font-medium text-white hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                  Batal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Display Payment Requests */}
      <div className="mt-4 bg-purple-900 rounded-lg shadow-lg overflow-x-auto">
        <h2 className="text-xl font-bold mb-2 p-4 text-white">Payment Requests:</h2>
        {loading ? (
          <p className="text-white text-center p-4">Loading requests...</p>
        ) : (
          <table className="w-full divide-y divide-purple-800">
            <thead className="bg-purple-800">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Date</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Payment Method</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Amount</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Estimasi</th>
              </tr>
            </thead>
            <tbody className="bg-purple-900 divide-y divide-purple-800">
              {/* Sort the payment requests so 'pending' requests appear first */}
              {[...paymentRequests].sort((a, b) => {
                if (a.status === 'pending' && b.status !== 'pending') return -1;
                if (b.status === 'pending' && a.status !== 'pending') return 1;
                return 0;
              }).map(request => (
                <tr key={request.request_id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{formatDate(request.requested_at)}</td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${request.status === 'pending' ? 'bg-yellow-600' : request.status === 'approved' ? 'bg-green-600' : request.status === 'rejected' ? 'bg-red-600' : 'bg-purple-700'}`}>
                    {request.status}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{request.payment_method || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{formatCurrency(request.request_amount)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {request.status === 'pending' ? calculateEstimatedProcessing(request.requested_at) : 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Spacer to prevent footer overlap */}
      <div className="h-20"></div>
    </div>
  );
};

export default Payment;