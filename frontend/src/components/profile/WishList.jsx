import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  wishListFetchAPI,
  wishListRemoveAPI,
} from "../../features/wishlist/wishlistThunk";
import { MdDeleteOutline } from "react-icons/md";
import { NavLink } from "react-router-dom";
import { setLogOut } from "../../features/auth/authSlice";
import toast from "react-hot-toast";
import { setProductList } from "../../features/wishlist/wishlistSlice";

const WishList = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const wishListProduct = useSelector(
    (state) => state.wishlist.wishListProduct,
  );
  console.log(wishListProduct);

  const closeModal = useCallback(() => dispatch(setLogOut(false)), [dispatch]);

  useEffect(() => {
    (async () => await dispatch(wishListFetchAPI(user?.id)).unwrap())();
    dispatch(setProductList());
  }, [dispatch, user]);

  return (
    <div className="px-3">
      <h1 className="font-serif text-[26px] font-semibold text-gray-900 p-2">
        My WishList ({wishListProduct.length})
      </h1>
      <div>
        {wishListProduct.map((item) => (
          <NavLink
            key={item?.id}
            to={`/product/${item?.product?.id}`}
            onClick={closeModal}
          >
            <WishListProduct key={item.id} item={item} />
          </NavLink>
        ))}
      </div>
    </div>
  );
};

const WishListProduct = ({ item }) => {
  const dispatch = useDispatch();
  console.log(item);

  const handleOnClickDelete = (e, id) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      dispatch(wishListRemoveAPI(id));
      dispatch(setProductList());
      toast.success("Remove successfully");
    } catch {
      toast.error("Pleace Try Again");
    }
  };

  return (
    <div className="flex gap-4 space-x-4 border border-gray-300 rounded-xl p-2 w-full group m-2">
      <div className="flex justify-center items-center w-30 h-30 p-2 border border-gray-300 rounded-xl">
        <img
          src={`/public/image/product_img/${item?.product?.image?.image_name}`}
          alt=""
          className="object-contain w-30 h-full rounded-lg overflow-hidden"
        />
      </div>
      <div className="py-3 w-full">
        <div className="flex justify-between space-x-3 w-full">
          <div className="flex-wrap group-hover:text-blue-700 transition-colors duration-300 ">
            {item?.product?.name}
          </div>
          <div
            onClick={(e) => handleOnClickDelete(e, item?.id)}
            className="w-7 h-7 flex items-center justify-center cursor-pointer rounded-full hover:bg-gray-200"
          >
            <MdDeleteOutline size={20} />
          </div>
        </div>
        <div className="flex gap-2">
          <span className="text-gray-300 line-through">
            ₹{item?.product?.BPrice}
          </span>
          <span>₹{item?.product?.PPrice}</span>
        </div>
      </div>
    </div>
  );
};

export default WishList;
