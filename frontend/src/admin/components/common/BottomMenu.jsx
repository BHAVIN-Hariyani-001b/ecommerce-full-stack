import { memo } from "react";
import { useSelector } from "react-redux";
import Logout from "../../../components/Popup/Logout";

const BottomMenuItem = memo(function BottomMenuItem({
  icon,
  itemName,
  action,
}) {
  const count = useSelector((state) => state.cart.count);
  const user = useSelector((state) => state.auth?.user);

  return (
    <>
      {itemName == "Profile" && user ? (
        <div className="hover:bg-[#dae2fd] transition-all duration-300 hover:text-gray-500 cursor-pointer ease-in-out delay-75 h-15 w-25 rounded-4xl flex flex-col justify-center items-center relative">
          <Logout />
        </div>
      ) : (
        <button
          onClick={() => action(itemName.toLowerCase())}
          className="hover:bg-[#dae2fd] transition-all duration-300 hover:text-gray-500 cursor-pointer ease-in-out delay-75 h-15 w-25 rounded-4xl flex flex-col justify-center items-center relative"
        >
          <div className="flex flex-col items-center justify-center">
            {icon}
            <p className="text-[13px] font-medium text-[#5c647a]">{itemName}</p>
          </div>
          {count !== 0 && itemName === "Cart" && (
            <div className="flex items-center justify-center right-6 -top-1 text-[12px] absolute bg-[#8685ef] text-white min-w-5 min-h-5 rounded-full">
              <span className="h-full w-full px-1">
                {count < 10 ? count : "10+"}
              </span>
            </div>
          )}
        </button>
      )}
    </>
  );
});

const BottomMenu = memo(function BottomMenu({ BOTTOM_MENU_ITEMS, action }) {
  return (
    <div className="flex gap-3 justify-evenly items-center h-full">
      {BOTTOM_MENU_ITEMS.map((item) => (
        <BottomMenuItem
          key={item.itemName}
          icon={item.icon}
          itemName={item.itemName}
          action={action}
        />
      ))}
    </div>
  );
});

export default BottomMenu;
