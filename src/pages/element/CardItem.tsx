// CardItem component updated to accept bgColor
interface CardItemProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  description?: React.ReactNode;
  onClick?: () => void;
  bgColor?: string; // New prop for background color
}

const CardItem: React.FC<CardItemProps> = ({ icon, title, value, description, onClick, bgColor }) => {
  return (
    <div 
      className={`p-4 rounded shadow-md flex flex-col items-start ${bgColor || 'bg-gray-800'}`}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <div className="flex items-center mb-2">
        <div className="text-4xl mr-4">{icon}</div>
        <div>
          <h3 className="text-xl font-semibold">{title}</h3>
          <p className="text-lg">{value}</p>
        </div>
      </div>
      {description && <p className="text-sm text-gray-400">{description}</p>}
    </div>
  );
};

export default CardItem;