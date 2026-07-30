import React, { useEffect, useState } from "react";
import PageWapper from "../../../components/layout/PageWapper";
import AttributesList from "./AttributesList";
import { toast } from "react-toastify";
import {
  createAttributeAPI,
  fetchAttributesAPI,
  updateAttributeAPI,
} from "../../features/attributes/attributesThunk";
import { useDispatch, useSelector } from "react-redux";
import { setIsUpdateAttribute } from "../../features/attributes/attributesSlice";

const initialState = {
  AName: "",
  AExm: "",
  ADesc: "",
};

const AddAttributes = () => {
  const [attributes, setAttributes] = useState(initialState);
  const dispatch = useDispatch();
  const isUpdated = useSelector((state) => state.attribute.isUpdate);

  console.log(attributes);

  useEffect(() => {
    if (isUpdated?.id) {
      setAttributes({
        AName: isUpdated?.attribute_name,
        ADesc: isUpdated?.desc,
        AExm: isUpdated?.placeholder,
      });
    } else if (isUpdated == false) {
      setAttributes(initialState);
    }
  }, [isUpdated]);

  const isCheck = () =>
    Boolean(
      attributes.AName.trim() &&
      attributes.ADesc.trim() &&
      attributes.AExm.trim(),
    );

  const handleOnChnage = (e) => {
    const { name, value } = e.target;
    setAttributes((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleOnSubmit = async () => {
    // console.log("hi");
    if (!isCheck()) {
      toast.error("Please fill All required fields");
      return;
    }

    // console.log("hi");

    try {
      // console.log("hi");

      if (isUpdated?.id) {
        await dispatch(
          updateAttributeAPI({ id: isUpdated?.id, attribute: attributes }),
        ).unwrap();
        toast.success("Attribute update successfully");
      } else {
        await dispatch(createAttributeAPI(attributes)).unwrap();
        toast.success("Attribute create successfully");
      }
      await dispatch(fetchAttributesAPI()).unwrap();
      setAttributes(initialState);
    } catch (error) {
      toast.error(error || "Faild to process Attributes");
    }
  };

  return (
    <div>
      <PageWapper>
        <div className="grid grid-cols-2 gap-4 max-[900px]:flex max-[900px]:flex-wrap p-5">
          <div className="w-full border border-gray-200 rounded-2xl space-y-3 p-4">
            <form
              autoComplete="flase"
              className="space-y-3"
              onSubmit={(e) => e.preventDefault()}
            >
              <h1 className="text-2xl font-semibold">Create New Attributes</h1>
              <div className="flex flex-col gap-2">
                <label htmlFor="attributeName" className="font-semibold">
                  Attribute Name
                </label>
                <input
                  type="text"
                  name="AName"
                  id="attributeName"
                  placeholder="Color"
                  className="px-2 py-2 rounded-lg border border-gray-200 outline-none"
                  value={attributes.AName}
                  onChange={handleOnChnage}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="attributeExm" className="font-semibold">
                  Attribute Example
                </label>
                <input
                  type="text"
                  name="AExm"
                  id="attributeExm"
                  placeholder="red"
                  className="px-2 py-2 rounded-lg border border-gray-200 outline-none"
                  value={attributes.AExm}
                  onChange={handleOnChnage}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="description" className="font-semibold">
                  Description
                </label>
                <textarea
                  type="text"
                  name="ADesc"
                  id="description"
                  placeholder="write description"
                  className="px-2 py-2 rounded-lg border border-gray-200 outline-none resize-none h-30"
                  value={attributes.ADesc}
                  onChange={handleOnChnage}
                />
              </div>
              {!isUpdated?.id ? (
                <button
                  type="submit"
                  className="w-full bg-green-600 text-white py-3 rounded-lg cursor-pointer"
                  onClick={handleOnSubmit}
                >
                  Create Attrubute
                </button>
              ) : (
                <div className="flex gap-4">
                  <div className="text-center w-full h-14 text-white font-semibold bg-green-600 rounded-xl flex items-center justify-center  hover:bg-green-500 focus:scale-99">
                    <button
                      type="button"
                      className="w-full h-full cursor-pointer"
                      onClick={() => {
                        handleOnSubmit();
                        dispatch(setIsUpdateAttribute(false));
                      }}
                    >
                      Update Attribute
                    </button>
                  </div>
                  <div className="text-center w-full h-14 border border-gray-200 font-semibold rounded-xl flex items-center justify-center hover:text-white hover:bg-green-600 focus:scale-99">
                    <button
                      type="button"
                      className="w-full h-full cursor-pointer"
                      onClick={() => {
                        dispatch(setIsUpdateAttribute(false));
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
          <div className="w-full border border-gray-200 rounded-2xl p-4">
            <h1 className="text-2xl font-semibold">Attributes</h1>
            <div className="pt-3">
              <AttributesList />
            </div>
          </div>
        </div>
      </PageWapper>
    </div>
  );
};

export default AddAttributes;
