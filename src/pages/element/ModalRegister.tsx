interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="p-4 bg-gray-800 bg-opacity-70 border-2 border-purple-600 rounded-lg text-white w-96">
        <h2 className="text-lg font-bold mb-4">{title}</h2>
        <p className="mb-4">{message}</p>
        <button 
          onClick={onClose} 
          className="w-full bg-purple-700 hover:bg-purple-600 text-white font-bold py-2 rounded-lg transition duration-300"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Modal;