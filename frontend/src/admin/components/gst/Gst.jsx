import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IoIosArrowDown } from "react-icons/io";
import { MdDeleteOutline, MdAdd } from "react-icons/md";
import toast from "react-hot-toast";
import PageWapper from "../../../components/layout/PageWapper";
import Search from "../../../components/common/Search";
import Modal from "../../../components/common/Modal";
import DeletePopup from "../common/DeletePopup";
import GstForm from "./GstForm";
import { deleteGstAPI, getGstAPI } from "../../features/gst/gstThunk";
import { TbEdit } from "react-icons/tb";

const getGstId = (item) => item?.gst_id ?? item?.id ?? item?._id;

const getGstRate = (item) => item?.gst_rate ?? item?.rate ?? item?.percentage;

const Gst = () => {
  const dispatch = useDispatch();
  const { gst = [], loading, error } = useSelector((state) => state.gst ?? {});
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [addOpen, setAddOpen] = useState(false);
  const [editingGst, setEditingGst] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    dispatch(getGstAPI())
      .unwrap()
      .catch((loadError) => toast.error(loadError || "Failed to load GST"));
  }, [dispatch]);

  const filteredGst = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return gst.filter((item) => {
      const searchableText = `${getGstId(item) ?? ""} ${getGstRate(item) ?? ""}`.toLowerCase();
      const searchMatch = !query || searchableText.includes(query);
      const isActive = item?.is_active ?? item?.active;
      const statusMatch =
        statusFilter === "All" ||
        (statusFilter === "Active" && (isActive === true || isActive === 1)) ||
        (statusFilter === "Inactive" && (isActive === false || isActive === 0));

      return searchMatch && statusMatch;
    });
  }, [gst, searchQuery, statusFilter]);

  const handleDelete = async () => {
    try {
      await dispatch(deleteGstAPI(deleteId)).unwrap();
      toast.success("GST deleted successfully");
    } catch (deleteError) {
      toast.error(deleteError || "Failed to delete GST");
    } finally {
      setDeleteId(null);
    }
  };

  const closeGstModal = () => {
    setAddOpen(false);
    setEditingGst(null);
  };

  return (
    <div className="p-3">
      <PageWapper>
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-200 p-4">
            <div>
              <h1 className="text-2xl font-semibold text-gray-800">GST rates</h1>
              <p className="text-sm text-gray-500">Manage the tax rates used by your store.</p>
            </div>
            <button
              type="button"
              onClick={() => setAddOpen(true)}
              className="flex items-center gap-1 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
            >
              <MdAdd size={20} /> Add GST
            </button>
          </div>

          <form
            onSubmit={(event) => event.preventDefault()}
            className="grid gap-3 md:grid-cols-2"
          >
            <div className="flex h-12 items-center rounded-xl border border-gray-200 px-3">
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="h-full w-full appearance-none bg-transparent p-2 text-sm outline-none"
              >
                <option value="All">All GST rates</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
              <IoIosArrowDown className="shrink-0 text-gray-400" />
            </div>
            <Search onSearch={setSearchQuery} />
          </form>

          <div className="rounded-xl border border-gray-200 p-4">
            {loading && <p className="py-8 text-center text-gray-500">Loading GST rates...</p>}
            {!loading && error && <p className="py-8 text-center text-red-500">{error}</p>}
            {!loading && !error && filteredGst.length === 0 && (
              <p className="py-8 text-center text-gray-400">GST not found</p>
            )}
            {!loading && !error && filteredGst.length > 0 && (
              <div className="space-y-2">
                {filteredGst.map((item) => {
                  const id = getGstId(item);
                  const isActive = item?.is_active ?? item?.active;
                  return (
                    <div key={id} className="flex items-center justify-between rounded-lg border border-gray-100 p-4">
                      <div>
                        <p className="font-semibold text-gray-800">{getGstRate(item)}%</p>
                        <p className="text-xs text-gray-400">GST ID: {id ?? "—"}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`rounded-full px-2 py-1 text-xs ${isActive === false || isActive === 0 ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"}`}>
                          {isActive === false || isActive === 0 ? "Inactive" : "Active"}
                        </span>
                        <button
                          type="button"
                          title="Edit GST"
                          onClick={() => {
                            setEditingGst(item);
                            setAddOpen(true);
                          }}
                          className="rounded p-1 text-blue-500 hover:bg-blue-50"
                        >
                          <TbEdit    size={20} />
                        </button>
                        <button
                          type="button"
                          title="Delete GST"
                          onClick={() => setDeleteId(id)}
                          className="rounded p-1 text-red-500 hover:bg-red-50"
                        >
                          <MdDeleteOutline size={22} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </PageWapper>

      <Modal
        open={addOpen}
        onClose={closeGstModal}
        title={editingGst ? "Edit GST" : "Add GST"}
      >
        <GstForm gstItem={editingGst} onClose={closeGstModal} />
      </Modal>
      {deleteId != null && (
        <DeletePopup onClose={() => setDeleteId(null)} handleDelete={handleDelete} />
      )}
    </div>
  );
};

export default Gst;