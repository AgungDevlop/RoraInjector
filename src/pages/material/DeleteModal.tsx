
interface DeleteModalProps {
  deleteModalOpen: boolean;
  setDeleteModalOpen: (value: boolean) => void;
  confirmDelete: () => void;
}

const DeleteModal: React.FC<DeleteModalProps> = ({ deleteModalOpen, setDeleteModalOpen, confirmDelete }) => {
  if (!deleteModalOpen) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-gray-800 p-6 rounded w-11/12 sm:w-1/2 relative">
        <button
          onClick={() => setDeleteModalOpen(false)}
          className="absolute top-2 right-2 text-white text-xl font-bold"
        >
          ×
        </button>
        <h2 className="text-xl font-bold text-white mb-4">Hapus Metode Pembayaran?</h2>
        <p className="text-white mb-4">Apakah Anda yakin ingin menghapus metode pembayaran ini?</p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={() => setDeleteModalOpen(false)}
            className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded transition duration-300"
          >
            Batal
          </button>
          <button
            onClick={confirmDelete}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition duration-300"
          >
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;