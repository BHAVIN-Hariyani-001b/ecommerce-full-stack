import { memo } from "react";

const BottomMenuItem = memo(function BottomMenuItem({
  icon,
  itemName,
  setActivePage,
}) {
  return (
    <button
      onClick={() => setActivePage(itemName.toLowerCase())}
      className="hover:bg-[#dae2fd] transition-all duration-300 hover:text-gray-500 cursor-pointer ease-in-out delay-75 h-15 w-25 rounded-4xl flex flex-col justify-center items-center"
    >
      {icon}
      <p className="text-[13px] font-medium text-[#5c647a]">{itemName}</p>
    </button>
  );
});

const BottomMenu = memo(function BottomMenu({
  BOTTOM_MENU_ITEMS,
  setActivePage,
}) {
  return (
    <div className="flex gap-3 justify-evenly items-center h-full">
      {BOTTOM_MENU_ITEMS.map((item) => (
        <BottomMenuItem
          key={item.itemName}
          icon={item.icon}
          itemName={item.itemName}
          setActivePage={setActivePage}
        />
      ))}
    </div>
  );
});

export default BottomMenu;
