import { useState } from "react";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { createGstAPI, updateGstAPI } from "../../features/gst/gstThunk";

const getGstId = (item) => item?.gst_id ?? item?.id ?? item?._id;

const getGstRate = (item) => item?.gst_rate ?? item?.rate ?? item?.percentage;

const getGstStatus = (item) => {
  const status = item?.is_active ?? item?.active;
  return status === false || status === 0 ? "false" : "true";
};

const GstForm = ({ gstItem, onClose }) => {
  const dispatch = useDispatch();
  const isEditing = Boolean(gstItem);
  const [gstRate, setGstRate] = useState(
    gstItem ? String(getGstRate(gstItem) ?? "") : "",
  );
  const [isActive, setIsActive] = useState(
    gstItem ? getGstStatus(gstItem) : "true",
  );
  const [submitting, setSubmitting] = useState(false);
  let submitLabel = "Add GST";
  if (submitting) submitLabel = "Saving...";
  else if (isEditing) submitLabel = "Update GST";

  const handleSubmit = async (event) => {
    event.preventDefault();
    const rate = Number(gstRate);

    if (!gstRate || Number.isNaN(rate) || rate < 0) {
      toast.error("Enter a valid GST rate");
      return;
    }

    setSubmitting(true);
    try {
      if (isEditing) {
        await dispatch(
          updateGstAPI({
            gst_id: getGstId(gstItem),
            gst_rate: rate,
            is_active: isActive === "true",
          }),
        ).unwrap();
        toast.success("GST updated successfully");
      } else {
        await dispatch(createGstAPI({ gst_rate: rate })).unwrap();
        toast.success("GST created successfully");
      }
      onClose();
    } catch (error) {
      toast.error(error || "Failed to create GST");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="gst-rate" className="font-medium text-gray-700">
          GST rate (%)
        </label>
        <input
          id="gst-rate"
          type="number"
          min="0"
          step="0.01"
          value={gstRate}
          onChange={(event) => setGstRate(event.target.value)}
          placeholder="18"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
        />
      </div>
      {isEditing && (
        <div className="space-y-2">
          <label htmlFor="gst-status" className="font-medium text-gray-700">
            Status
          </label>
          <select
            id="gst-status"
            value={isActive}
            onChange={(event) => setIsActive(event.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 outline-none focus:border-blue-500"
          >
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>
      )}
      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitLabel}
      </button>
    </form>
  );
};

export default GstForm;