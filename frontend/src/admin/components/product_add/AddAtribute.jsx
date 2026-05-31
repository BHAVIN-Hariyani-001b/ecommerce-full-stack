import { memo, useCallback, useImperativeHandle, useState } from "react";

import { IoIosArrowDown } from "react-icons/io";

import { RxCrossCircled } from "react-icons/rx";

const ATTRIBUTE_TYPES = ["Text", "Color", "Size", "Number"];

const DEFAULT_COLOR = "#fff";

const PLACEHOLDERS = {
  Text: "e.g. Cotton",
  Size: "e.g. XL",
  Number: "e.g. 42",
};

const AttributeChip = memo(function AttributeChip({ item, onRemove }) {
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

const AddAtribute = memo(function AddAtribute({ setProductData, ref }) {
  const [attributes, setAttributes] = useState([]);
  const [attributeType, setAttributeType] = useState("Text");
  const [attributeValue, setAttributeValue] = useState("");

  useImperativeHandle(
    ref,
    () => ({
      reset: () => {
       setAttributes([])
      },
    }),
    [],
  );

  const addAttribute = useCallback(() => {
    const value = attributeValue.trim();

    if (!value) return;

    setAttributes((prev) => [
      ...prev,

      { id: crypto.randomUUID(), type: attributeType, value },
    ]);

    setProductData((prev) => ({
      ...prev,

      attributes: [...prev.attributes, { type: attributeType, value }],
    }));

    setAttributeValue(attributeType === "Color" ? DEFAULT_COLOR : "");
  }, [attributeType, attributeValue, setProductData]);

  const removeAttribute = useCallback((id) => {
    setAttributes((prev) => prev.filter((item) => item.id !== id));
  }, []);

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

  return (
    <div>
      <h1 className="text-lg p-2 font-medium">Add Attributes</h1>

      <div className="flex flex-col p-1">
        <label htmlFor="NameAtb" className="p-1">
          Attributes Name
        </label>

        <div className="w-full flex gap-4 px-1 relative">
          <select
            name="AttributesName"
            id="NameAtb"
            value={attributeType}
            onChange={handleTypeChange}
            required={true}
            className="outline-none w-full bg-blue-50 border px-3 py-3 rounded-lg border-gray-200 appearance-none"
          >
            {ATTRIBUTE_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>

          <IoIosArrowDown className="absolute right-3 bottom-4 transition-transform duration-200 text-[15px] pointer-events-none" />
        </div>
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
                required={true}
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
              required={true}
              autoComplete="off"
              value={attributeValue}
              onChange={(e) => setAttributeValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={PLACEHOLDERS[attributeType]}
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
    </div>
  );
});

export default AddAtribute;
