import { FaUniversity, FaEdit, FaTrash } from "react-icons/fa";

interface StoredMethodProps {
  storedMethod: any;
  paymentMethods: { id: number; name: string; icon: string }[];
  setEditMode: (value: boolean) => void;
  setSelectedMethod: (value: string | null) => void;
  setReceiverName: (value: string) => void;
  setAccountNumber: (value: string) => void;
  setBankName: (value: string) => void;
  handleDelete: () => void;
}

const StoredMethod: React.FC<StoredMethodProps> = ({
  storedMethod,
  paymentMethods,
  setEditMode,
  setSelectedMethod,
  setReceiverName,
  setAccountNumber,
  setBankName,
  handleDelete,
}) => {
  if (!storedMethod || !storedMethod.payment_method) return null;
  const method = storedMethod.payment_method || "";
  const matchedMethod = paymentMethods.find((m) => m.name.toLowerCase() === method.toLowerCase());

  return (
    <div className="bg-gray-800 p-6 rounded shadow mb-6">
      <h2 className="text-2xl font-bold text-white mb-4">Metode Pembayaran Tersimpan</h2>
      <div className="flex items-center space-x-4">
        {method.toLowerCase() === "bank" ? (
          <FaUniversity className="text-blue-500 text-3xl" />
        ) : matchedMethod ? (
          <img src={matchedMethod.icon} alt={method} className="w-12 h-12 rounded border border-blue-500" />
        ) : (
          <span className="text-gray-400">Ikon tidak tersedia</span>
        )}
        <div>
          <p className="text-white font-medium">{method}</p>
          <p className="text-gray-400 text-sm">
            {storedMethod.receiver_name || "Nama tidak tersedia"} -{" "}
            {storedMethod.account_number || "Nomor tidak tersedia"}
          </p>
          {method.toLowerCase() === "bank" && (
            <p className="text-gray-400 text-sm">Bank: {storedMethod.bank_name || "Nama bank tidak tersedia"}</p>
          )}
        </div>
      </div>
      <div className="mt-4 flex space-x-4">
        <button
          onClick={() => {
            setEditMode(true);
            setSelectedMethod(storedMethod.payment_method);
            setReceiverName(storedMethod.receiver_name);
            setAccountNumber(storedMethod.account_number);
            setBankName(storedMethod.bank_name || "");
          }}
          className="flex items-center bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded transition duration-300"
        >
          <FaEdit className="mr-2" /> Edit
        </button>
        <button
          onClick={handleDelete}
          className="flex items-center bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition duration-300"
        >
          <FaTrash className="mr-2" /> Hapus
        </button>
      </div>
    </div>
  );
};

export default StoredMethod;