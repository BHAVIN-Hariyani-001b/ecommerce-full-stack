import { memo, useCallback, useState } from "react";
import { IoAddOutline } from "react-icons/io5";
import { IoIosArrowForward } from "react-icons/io";
import { BiHome } from "react-icons/bi";
import { MdOutlineDelete } from "react-icons/md";
import { TbEditCircle } from "react-icons/tb";
import Modal from "../common/Modal";
import AddressDetails from "./AddressDetails";
import { useDispatch, useSelector } from "react-redux";
import { setIsUpdateAddress } from "../../features/userAddress/userAddressSlice";
import { DeleteUserAddress } from "../../features/userAddress/userAddressThunk";
import DeletePopup from "../../admin/components/common/DeletePopup";

const UserLocation = () => {
  const [addressDetail, setAddressDetail] = useState(false);
  const UserAddress = useSelector((state) => state.address?.Address);
  const dispatch = useDispatch();

  const handeleOpenAddressDetails = useCallback(
    () => setAddressDetail(true),
    [],
  );

  const handeleCloseAddressDetails = useCallback(
    () => {
      dispatch(setIsUpdateAddress(false));
      setAddressDetail(false);
    },
    [dispatch],
    [],
  );

  return (
    <div className="p-5 space-y-2 bg-gray-100 rounded-2xl h-full">
      <div className="bg-white rounded-xl" onClick={handeleOpenAddressDetails}>
        <div className="w-full flex items-center justify-between text-[16px] border border-gray-300  px-2 py-3 rounded-xl cursor-pointer">
          <div className="flex items-center gap-5">
            <IoAddOutline size={25} />
            <span>Add Address</span>
          </div>
          <IoIosArrowForward size={20} />
        </div>
      </div>
      <h1 className="text-[16px] font-semibold text-gray-900 p-2">
        Saved Address
      </h1>

      {UserAddress.map((item) => (
        <AddressCart
          key={item.id}
          item={item}
          setAddressDetail={setAddressDetail}
        />
      ))}

      <Modal
        open={addressDetail}
        onClose={handeleCloseAddressDetails}
        title="Address"
      >
        <AddressDetails />
      </Modal>
    </div>
  );
};

const AddressCart = ({ item, setAddressDetail }) => {
  const dispatch = useDispatch();
  const [delteId, setDeleteId] = useState(null);

  const handleOnClick = useCallback(
    (item) => {
      setAddressDetail(true);
      dispatch(setIsUpdateAddress(item));
    },
    [dispatch, setAddressDetail],
  );

  const handleOnDeleteAddress = useCallback(() => {
    if (delteId) {
      dispatch(DeleteUserAddress(delteId)).unwrap();
    }
  }, [dispatch, delteId]);

  return (
    <div className="bg-white p-3 border border-gray-300 rounded-2xl flex items-center justify-between">
      <div className="flex items-center gap-3">
        <BiHome size={30} />
        <div className="flex flex-col">
          <span className="font-semibold">Home</span>
          <span className="text-[14px] max-[600px]:w-30 max-[600px]:truncate">
            {/* 10, ab, 311, Shahpore, Bhagal, Surat, Gujarat 395003, India */}
            {item?.streetArea}, {item?.city}, {item?.pin_code}, {item?.state},
            India
          </span>
        </div>
      </div>
      <div className="flex  items-center gap-4 text-2xl">
        <TbEditCircle
          className="cursor-pointer"
          onClick={() => handleOnClick(item)}
        />
        <MdOutlineDelete
          className="cursor-pointer"
          onClick={() => setDeleteId(item.id)}
        />
      </div>

      {delteId && (
        <DeletePopup
          onClose={() => setDeleteId(null)}
          handleDelete={handleOnDeleteAddress}
        />
      )}
    </div>
  );
};

export default memo(UserLocation);
