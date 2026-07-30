import React, { memo, useEffect, useMemo, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";
import { useDispatch, useSelector } from "react-redux";
import { deleteUserAPI, fetchUserAPI } from "../../features/user/userThunk";
import DataTable from "../common/DataTable";

import IconButton from "@mui/material/IconButton";
import { TbEdit } from "react-icons/tb";
import { MdOutlineDelete } from "react-icons/md";
import { setIsUpdatedUser } from "../../features/user/userSlice";
import { toast } from "react-toastify";
import DeletePopup from "../common/DeletePopup";

const UserList = ({ searchQuery, openAddUser, userRole }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user?.users) ?? [];
  const [deleteId, setDeleteId] = useState(null);

  const handleUpdateUser = (item) => {
    dispatch(setIsUpdatedUser(item));
  };

  const handleDeleteUser = async (id) => {
    if (!id) return;
    try {
      await dispatch(deleteUserAPI(id)).unwrap();
      toast.success("Product deleted successfully");
    } catch (error) {
      toast.error(error?.message || "Failed to delete product");
    } finally {
      setDeleteId(false);
    }
  };

  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: 150,
      renderCell: (params) => (params.value ? params.value : "—"),
    },
    {
      field: "username",
      headerName: "User name",
      width: 200,
      renderCell: (params) => (params.value ? params.value : "—"),
    },
    {
      field: "email",
      headerName: "User Email",
      width: 350,
      renderCell: (params) => (params.value ? params.value : "—"),
    },
    {
      field: "role",
      headerName: "Roal",
      type: "number",
      width: 150,
      renderCell: (params) => (params.value ? params.value.toUpperCase() : "—"),
    },
    {
      field: "phone",
      headerName: "Phone Number",
      type: "number",
      width: 200,
      renderCell: (params) => (params.value ? `₹${params.value}` : "—"),
    },

    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <div className="flex gap-1 items-center justify-center h-full">
          <IconButton
            size="small"
            onClick={() => {
              openAddUser();
              handleUpdateUser(params.row);
            }}
            title="Edit"
          >
            <TbEdit className="text-blue-500 text-xl hover:scale-105 duration-100" />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => setDeleteId(params.row?._id || params.row?.id)}
            title="Delete"
          >
            <MdOutlineDelete className="text-red-400 text-xl hover:scale-105 duration-100" />
          </IconButton>
        </div>
      ),
    },
  ];

  useEffect(() => {
    dispatch(fetchUserAPI());
  }, [dispatch]);

  const handleSearchUser = useMemo(() => {
    return user.filter((item) => {
      const searchResult =
        searchQuery.trim() === ""
          ? true
          : item?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item?.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item?.role?.toLowerCase().includes(searchQuery.toLowerCase());

      const roleMatch =
        userRole === "" || item?.role?.toLowerCase() === userRole.toLowerCase();

      return searchResult && roleMatch;
    });
  }, [searchQuery, user, userRole]);

  console.log(handleSearchUser);

  return (
    <div>
      <DataTable
        columns={columns}
        rows={handleSearchUser}
        getRowId={(row) => row._id || row.id}
      />

      {deleteId && (
        <DeletePopup
          onClose={() => setDeleteId(null)}
          handleDelete={() => handleDeleteUser(deleteId)}
        />
      )}
    </div>
  );
};

export default memo(UserList);
