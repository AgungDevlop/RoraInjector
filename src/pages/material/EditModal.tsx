import PaymentForm from "./PaymentForm";

interface EditModalProps {
  editMode: boolean;
  setEditMode: (value: boolean) => void;
  selectedMethod: string | null;
  receiverName: string;
  accountNumber: string;
  bankName: string;
  setReceiverName: (value: string) => void;
  setAccountNumber: (value: string) => void;
  setBankName: (value: string) => void;
  handleSave: (e: React.FormEvent<HTMLFormElement>) => void;
}

const EditModal: React.FC<EditModalProps> = ({
  editMode,
  setEditMode,
  selectedMethod,
  receiverName,
  accountNumber,
  bankName,
  setReceiverName,
  setAccountNumber,
  setBankName,
  handleSave,
}) => {
  if (!editMode) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-gray-800 p-6 rounded w-11/12 sm:w-1/2 relative">
        <button onClick={() => setEditMode(false)} className="absolute top-2 right-2 text-white text-xl font-bold">
          ×
        </button>
        <h2 className="text-2xl font-bold text-white mb-4">Edit Metode Pembayaran</h2>
        <PaymentForm
          selectedMethod={selectedMethod}
          receiverName={receiverName}
          accountNumber={accountNumber}
          bankName={bankName}
          setReceiverName={setReceiverName}
          setAccountNumber={setAccountNumber}
          setBankName={setBankName}
          handleSave={handleSave}
          editMode={editMode}
        />
      </div>
    </div>
  );
};

export default EditModal;