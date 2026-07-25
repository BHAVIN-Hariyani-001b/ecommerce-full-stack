import {
  memo,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { IoIosArrowDown } from "react-icons/io";
import { RxCrossCircled } from "react-icons/rx";
import Modal from "../../../components/common/Modal";
import Description from "./Description";
import { useDispatch, useSelector } from "react-redux";
import { fetchAttributesAPI } from "../../features/attributes/attributesThunk";

const DEFAULT_COLOR = "#fff";

const AttributeChip = memo(function AttributeChip({ item, onRemove }) {
  // console.log(item);
  return (
    <div className="flex items-center gap-2 bg-blue-50 border border-gray-200 rounded-lg px-3 py-2">
      <span className="text-xs font-semibold text-gray-500">{item.type}</span>

      {item.type === "Color" ? (
        <span className="flex items-center gap-2">
          <span
            className="w-5 h-5 rounded border border-gray-300"
            style={{ backgroundColor: item.value }}
          />
          <span className="text-sm font-medium">{item.value}</span>
        </span>
      ) : (
        <span className="text-sm font-medium">{item.value}</span>
      )}

      <button
        type="button"
        onClick={() => onRemove(item.id)}
        className="cursor-pointer"
        aria-label={`Remove ${item.type} attribute ${item.value}`}
      >
        <RxCrossCircled className="text-lg text-gray-600 hover:text-black" />
      </button>
    </div>
  );
});

const AddAtribute = memo(function AddAtribute({
  productData,
  setProductData,
  ref,
}) {
  const [attributes, setAttributes] = useState([]);
  const [attributeType, setAttributeType] = useState("");
  const [attributeValue, setAttributeValue] = useState("");
  console.log(attributeType)
  console.log(attributeValue)
  console.log(attributes)

  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);

  const openDescription = () => setIsDescriptionOpen(true);
  const closeDescription = () => setIsDescriptionOpen(false);

  const dispatch = useDispatch();

  console.log(productData);
  // console.log(attributeValue);

  useEffect(() => {
    dispatch(fetchAttributesAPI());
  }, [dispatch]);

  // NOTE: confirm this matches the key your attributesSlice.reducer is
  // registered under in configureStore({ reducer: { attributes: ... } })
  const attributeTypes = useSelector(
    (state) => state.attribute.attributes ?? [],
  );

  // console.log(attributeType);

  // Once the DB list loads, default attributeType to the first entry
  // (or reset it if the current selection no longer exists in the list)
  useEffect(() => {
    if (
      attributeTypes.length &&
      !attributeTypes.some((t) => t.attribute_name  === attributeType)
    ) {
      setAttributeType(attributeTypes[0].attribute_name);
    }
  }, [attributeTypes]); // eslint-disable-line react-hooks/exhaustive-deps

  const selectedType = attributeTypes.find((t) => t.attribute_name  === attributeType);
  console.log("this is selec type " + attributeTypes)
  console.log("this is selec type " + selectedType)
  useImperativeHandle(
    ref,
    () => ({
      reset: () => {
        setAttributes([]);
        setProductData((prev) => ({ ...prev, attributes: [] }));
      },
    }),
    [setProductData],
  );

  const addAttribute = useCallback(() => {
    const value = attributeValue.trim();
    // console.log(value);
    // console.log(attributeType);
    if (!value || !attributeType) return;

    setAttributes((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        Aid: selectedType?.id,
        type: attributeType,
        value,
      },
    ]);
    setProductData((prev) => ({
      ...prev,
      attributes: [
        ...prev.attributes,
        { id: selectedType?.id, type: attributeType, value },
      ],
    }));

    setAttributeValue(attributeType === "Color" ? DEFAULT_COLOR : "");
  }, [attributeType, attributeValue, setProductData, selectedType]);

  const removeAttribute = useCallback(
    (id) => {
      console.log("call to the remove attribute")
      setAttributes((prev) => {
        const target = prev.find((item) => item.id === id);
        if (!target) return prev;

        setProductData((pd) => {
          const isExisting = pd.attributes.some((a) => a.id === id);

          return {
            ...pd,
            attributes: pd.attributes.filter(
              (a) => !(a.type === target.type && a.value === target.value),
            ),
            removeAttributes: isExisting
              ? [...new Set([...(pd.removeAttributes ?? []), id])]
              : pd.removeAttributes,
          };
        });

        return prev.filter((item) => item.id !== id);
      });
    },
    [setProductData],
  );

  const handleTypeChange = useCallback((e) => {
    const nextType = e.target.value;

    setAttributeType(nextType);

    setAttributeValue(nextType === "Color" ? DEFAULT_COLOR : "");
  }, []);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        addAttribute();
      }
    },
    [addAttribute],
  );

  const inputType = attributeType === "Number" ? "number" : "text";

  useEffect(() => {
    setAttributes(
      productData?.attributes?.map((attr) => ({
        id: attr?.id  ?? crypto.randomUUID(),
        type: attr?.type ?? attr?.name,
        value: attr?.value,
      })) ?? [],
    );
  }, [productData?.id]);

  const handleOnchange = (e) => {
    setProductData((prev) => ({ ...prev, aboutItem: e.target.value }));
  };

  return (
    <div>
      <h1 className="text-lg p-2 font-medium">Add Attributes</h1>

      <div className="flex flex-col p-1">
        <label htmlFor="NameAtb" className="p-1">
          Attributes Name
        </label>

        {attributeTypes.length === 0 ? (
          <div className="text-sm text-gray-400 px-3 py-3 bg-blue-50 border border-gray-200 rounded-lg">
            Loading attribute types...
          </div>
        ) : (
          <div className="w-full flex gap-4 px-1 relative">
            <select
              name="AttributesName"
              id="NameAtb"
              value={attributeType}
              onChange={handleTypeChange}
              required
              className="outline-none w-full bg-blue-50 border px-3 py-3 rounded-lg border-gray-200 appearance-none"
            >
              {attributeTypes.map((type) => (
                <option key={type.id} value={type.attribute_name}>
                  {type.attribute_name}
                </option>
              ))}
            </select>
            <IoIosArrowDown className="absolute right-3 bottom-4 transition-transform duration-200 text-[15px] pointer-events-none" />
          </div>
        )}

        {selectedType?.desc ? (
          <p className="text-xs text-gray-400 px-1 pt-1">{selectedType.desc}</p>
        ) : null}
      </div>

      <div className="flex flex-col p-1">
        <label htmlFor="ATB" className="p-1">
          Attributes
        </label>

        <div className="w-full flex gap-4 px-1">
          {attributeType === "Color" ? (
            <div className="outline-none w-full bg-blue-50 border border-gray-200 rounded-lg px-3 py-2">
              <input
                type="color"
                name="Attributes"
                required
                id="ATB"
                value={attributeValue || DEFAULT_COLOR}
                onChange={(e) => setAttributeValue(e.target.value)}
                className="h-10 w-full cursor-pointer rounded-lg border border-gray-200 bg-transparent p-0.5 [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:rounded-md [&::-webkit-color-swatch]:border [&::-webkit-color-swatch]:border-gray-200"
              />
            </div>
          ) : (
            <input
              type={inputType}
              name="Attributes"
              id="ATB"
              required
              autoComplete="off"
              value={attributeValue}
              onChange={(e) => setAttributeValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={selectedType?.placeholder || "Enter value"}
              className="outline-none w-full bg-blue-50 border px-3 py-3 rounded-lg border-gray-200"
            />
          )}

          <button
            type="button"
            onClick={addAttribute}
            className="text-white px-4 rounded-lg cursor-pointer bg-green-700 shrink-0"
          >
            ADD
          </button>
        </div>
      </div>
      {/* {console.log(attributes)} */}
      {attributes.length > 0 ? (
        <div className="flex flex-wrap gap-2 p-2 mt-2">
          {attributes.map((item) => (
            <AttributeChip
              key={item.id}
              item={item}
              onRemove={removeAttribute}
            />
          ))}
        </div>
      ) : null}

      <div className="flex flex-col relative py-3">
        <label
          htmlFor="ProductDescription"
          className="font-semibold p-1 text-xl"
        >
          About This Item
        </label>
        <div className="p-2">
          <div
            className="outline-none bg-blue-50 border px-3 py-3 rounded-lg h-40 border-gray-200 resize-none overflow-scroll scrollbar-none cursor-pointer"
            onClick={openDescription}
          >
            {productData?.aboutItem ? (
              <div
                dangerouslySetInnerHTML={{ __html: productData.aboutItem }}
              />
            ) : (
              <span className="text-gray-400">
                Click to add a about this item
              </span>
            )}
          </div>
        </div>
        <Modal
          open={isDescriptionOpen}
          onClose={closeDescription}
          title="About This Item"
          width={"w-100"}
          widthClassName={"max-w-200"}
        >
          <Description
            handleOnchange={handleOnchange}
            values={productData?.aboutItem}
          />
        </Modal>
      </div>
    </div>
  );
});

export default AddAtribute;
