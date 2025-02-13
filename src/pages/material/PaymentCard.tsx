interface PaymentCardProps {
  method: { id: number; name: string; icon: string };
  isSelected: boolean;
  onSelect: (name: string) => void;
}

const PaymentCard: React.FC<PaymentCardProps> = ({ method, isSelected, onSelect }) => (
  <div
    onClick={() => onSelect(method.name)}
    className={`cursor-pointer flex items-center justify-center space-x-4 p-4 bg-purple-800 rounded hover:bg-purple-700 transition ${
      isSelected ? "border-2 border-purple-500" : "border border-purple-600"
    }`}
  >
    <img src={method.icon} alt={method.name} className="w-12 h-12 rounded" />
  </div>
);

export default PaymentCard;