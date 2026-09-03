import React, { useEffect, useState } from "react";
import { IoIosArrowForward } from "react-icons/io";
import { TbEdit } from "react-icons/tb";
import { MdOutlineDelete } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { deleteBrand, fetchBrand } from "../../features/Brand/brandThunk";
import { setIsUpdateBrand } from "../../features/Brand/brandSlice";
import toast from "react-hot-toast";
import DeletePopup from "../common/DeletePopup";

const BrandList = () => {
  const dispatch = useDispatch();
  const { brand, loading, error } = useSelector((state) => state.brand);
  const [isOpen, setIsOpen] = useState(false);
  const isUpdated = useSelector((state) => state.brand.isUpdate);

  const handleDelete = (id) => {
    if (id) {
      dispatch(deleteBrand(id)).unwrap();
      toast.success("Brand deleted successfully");
    }
  };

  useEffect(() => {
    dispatch(fetchBrand()).unwrap();
  }, [dispatch]);

  return (
    <>
      <div className="space-y-2">
        {brand.map((item) => (
          <List key={item.id} item={item} popup={setIsOpen} />
        ))}

        {!loading && brand?.length === 0 && (
          <p className="text-center text-gray-400">Data Not Found</p>
        )}
        
      </div>
      {isOpen && (
        <DeletePopup
          onClose={() => setIsOpen(false)}
          handleDelete={() => {
            handleDelete(isUpdated);
            setIsOpen(false);
          }}
        />
      )}
    </>
  );
};

const List = ({ item, popup }) => {
  const dispatch = useDispatch();

  return (
    <div className="border border-gray-200 rounded-xl flex items-center justify-between p-4 group cursor-all-scroll">
      <div className="flex gap-5">
        <div className="w-15 h-15 border border-gray-200 rounded">
          <img
            src={`../../../../public/image/Brand/${item?.image}`}
            alt={item?.name}
            className="w-full h-full object-contain rounded"
          />
        </div>
        <div className="flex justify-center items-center">
          <p className="text-[16px]">{item?.name}</p>
        </div>
      </div>
      <div className="flex items-center gap-5 text-xl">
        <button
          className="cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-100 hover:scale-105 p-1 rounded-full"
          onClick={() => dispatch(setIsUpdateBrand(item))}
        >
          <TbEdit />
        </button>
        <button
          className="cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-100 p-1 hover:scale-105 rounded-full"
          onClick={() => {
            dispatch(setIsUpdateBrand(item?.id));
            popup(true);
          }}
        >
          <MdOutlineDelete />
        </button>
        <div className="group-hover:translate-x-2 transition-all">
          <IoIosArrowForward />
        </div>
      </div>
    </div>
  );
};

export default BrandList;
