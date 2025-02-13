interface PaymentFormProps {
  selectedMethod: string | null;
  receiverName: string;
  accountNumber: string;
  bankName: string;
  setReceiverName: (value: string) => void;
  setAccountNumber: (value: string) => void;
  setBankName: (value: string) => void;
  handleSave: (e: React.FormEvent<HTMLFormElement>) => void;
  editMode: boolean;
}

import { FaUser, FaCreditCard, FaBuilding } from 'react-icons/fa';

const PaymentForm: React.FC<PaymentFormProps> = ({
  selectedMethod,
  receiverName,
  accountNumber,
  bankName,
  setReceiverName,
  setAccountNumber,
  setBankName,
  handleSave,
  editMode,
}) => (
  <form onSubmit={handleSave} className="space-y-4 mt-4">
    {selectedMethod?.toLowerCase() === "bank" && (
      <div className="relative">
        <label className="block text-gray-400 mb-1">Nama Bank</label>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <FaBuilding className="text-purple-500" />
          </span>
          <input
            type="text"
            value={bankName}
            onChange={(e) => setBankName(e.target.value)}
            required
            className="w-full pl-10 p-2 bg-purple-800 rounded text-white border border-purple-600 focus:border-purple-500"
            placeholder="Masukkan Nama Bank"
          />
        </div>
      </div>
    )}
    <div className="relative">
      <label className="block text-gray-400 mb-1">Nama Penerima</label>
      <div className="relative">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
          <FaUser className="text-purple-500" />
        </span>
        <input
          type="text"
          value={receiverName}
          onChange={(e) => setReceiverName(e.target.value)}
          required
          className="w-full pl-10 p-2 bg-purple-800 rounded text-white border border-purple-600 focus:border-purple-500"
          placeholder="Masukkan Nama Penerima"
        />
      </div>
    </div>
    <div className="relative">
      <label className="block text-gray-400 mb-1">
        {selectedMethod?.toLowerCase() === "bank" ? "No Rekening" : `No ${selectedMethod}`}
      </label>
      <div className="relative">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
          <FaCreditCard className="text-purple-500" />
        </span>
        <input
          type={selectedMethod?.toLowerCase() === "bank" ? "text" : "number"}
          value={accountNumber}
          onChange={(e) => setAccountNumber(e.target.value)}
          required
          className="w-full pl-10 p-2 bg-purple-800 rounded text-white border border-purple-600 focus:border-purple-500"
          placeholder="Masukkan Nomor"
        />
      </div>
    </div>
    <button
      type="submit"
      className="w-full bg-purple-700 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded transition duration-300"
    >
      {editMode ? "Update" : "Simpan"}
    </button>
  </form>
);

export default PaymentForm;