const MathOverviewCard = ({ title, description, icon }) => {
  return (
    <div className="bg-white p-4 w-50 cursor-pointer h-25 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-all duration-300 ease-in-out delay-100">
      <div className="flex items-center justify-between">
        <div className="flex items-center justify-between gap-2 w-full">
          <h2 className="text-[12px]">{title}</h2>
          <div className="text text-blue-800 font-extrabold">{icon}</div>
        </div>
      </div>
      <div className="text-sm text-[#5c647a] mt-1">
        <span className="text-2xl font-medium">{description}</span>
      </div>
    </div>
  );
};

export default MathOverviewCard;
