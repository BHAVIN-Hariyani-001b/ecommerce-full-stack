import { memo, useEffect, useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../../../features/category/categoryThunk";
import Description from "./Description";
import Modal from "../../../components/common/Modal";

const BasicInfo = memo(function BasicInfo({ productData, handleOnChange }) {
  const category = useSelector((state) => state.userCategory.category);
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);

  const openDescription = () => setIsDescriptionOpen(true);
  const closeDescription = () => setIsDescriptionOpen(false);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  return (
    <div className="border border-gray-200 p-3 rounded-xl">
      <h1 className="text-xl font-semibold py-4">Basic Details</h1>

      <div className="flex flex-col">
        <label htmlFor="name" className="font-semibold py-2">
          Product Name
        </label>

        <input
          type="text"
          name="name"
          id="ProductName"
          required={true}
          autoComplete="off"
          value={productData?.name}
          onChange={handleOnChange}
          placeholder="e.g. I phone"
          className="outline-none bg-blue-50 border px-3 py-3 rounded-lg border-gray-200"
        />
      </div>

      <div className="flex flex-col relative">
        <label htmlFor="Category" className="font-semibold py-2">
          Category
        </label>

        <select
          name="Category"
          id="ProductCategory"
          required={true}
          autoComplete="off"
          className="outline-none bg-blue-50 border px-3 py-3 rounded-lg border-gray-200 appearance-none"
          onChange={handleOnChange}
          value={productData?.Category ?? "option"}
        >
          <option value="option">Select Any One</option>

          {category.map(
            (cat) =>
              cat?.id !== 1 && (
                <option value={cat?.name} key={cat?.id}>
                  {cat?.name}
                </option>
              ),
          )}
        </select>

        <IoIosArrowDown className="absolute right-3 bottom-4 transition-transform duration-200 text-[15px]" />
      </div>

      <div className="flex flex-col relative">
        <label htmlFor="Gender" className="font-semibold py-2">
          Gender
        </label>

        <select
          name="gender"
          id="CategoryGender"
          autoComplete="off"
          required={true}
          className="outline-none bg-blue-50 border px-3 py-3 rounded-lg border-gray-200 appearance-none"
          onChange={handleOnChange}
          value={productData?.gender}
        >
          <option value="option">Select Any One</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="unisex">Unisex</option>
        </select>
        <IoIosArrowDown className="absolute right-3 bottom-4 transition-transform duration-200 text-[15px]" />
      </div>
      <div className="flex flex-col relative">
        <label htmlFor="ProductDescription" className="font-semibold py-2">
          Short Description
        </label>
        <div
          className="outline-none bg-blue-50 border px-3  py-3 rounded-lg h-30 border-gray-200 resize-none overflow-scroll scrollbar-none cursor-pointer"
          onClick={openDescription}
        >
          {productData?.description ? (
            <div
              dangerouslySetInnerHTML={{ __html: productData.description }}
            />
          ) : (
            <span className="text-gray-400">Click to add a description</span>
          )}
        </div>
        <Modal
          open={isDescriptionOpen}
          onClose={closeDescription}
          title="Short Description"
          width={"w-100"}
          widthClassName={"max-w-200"}
        >
          <Description
            handleOnchange={handleOnChange}
            values={productData?.description}
          />
        </Modal>
      </div>
    </div>
  );
});

export default BasicInfo;
