import { useEffect, useState } from "react";
import { IoIosArrowForward } from "react-icons/io";
import { TbEdit } from "react-icons/tb";
import { MdOutlineDelete } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { deleteAttributeAPI, fetchAttributesAPI } from "../../features/attributes/attributesThunk";
import DeletePopup from "../common/DeletePopup";
import { toast } from "react-toastify";
import { setIsUpdateAttribute } from "../../features/attributes/attributesSlice";

const AttributesList = () => {
  const dispatch = useDispatch();
  const { attributes, loading, isUpdate } = useSelector(
    (state) => state.attribute,
  );
  console.log(attributes);
  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = (id) => {
    if (id) {
      dispatch(deleteAttributeAPI(id)).unwrap();
      toast.success("Attribute deleted successfully");
    }
  };

  useEffect(() => {
    dispatch(fetchAttributesAPI());
  }, [dispatch]);

  return (
    <>
      <div className="space-y-2 h-100 overflow-scroll scrollbar-none">
        {attributes.map((item) => (
          <List key={item.id} item={item} popup={setIsOpen} />
        ))}

        {!loading && attributes?.length === 0 && (
          <p className="text-center text-gray-400">Data Not Found</p>
        )}
      </div>

      {isOpen && (
        <DeletePopup
          onClose={() => setIsOpen(false)}
          handleDelete={() => {
            handleDelete(isUpdate);
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
      <div className="text-start space-y-1">
        <p className="text-[18px]">{item.name}</p>
        <p className="text-[14px] text-wrap line-clamp-2 max-w-80 max-[1100px]:max-w-60 max-[600px]:max-w-40 max-[600px]:hidden truncate">
          {item.desc}
        </p>
      </div>
      <div className="flex items-center gap-5 text-xl">
        <button
          className="cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-100 hover:scale-105 p-1 rounded-full"
          onClick={() => dispatch(setIsUpdateAttribute(item))}
        >
          <TbEdit />
        </button>
        <button
          className="cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-100 p-1 hover:scale-105 rounded-full"
          onClick={() => {
            dispatch(setIsUpdateAttribute(item?.id));
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

export default AttributesList;
