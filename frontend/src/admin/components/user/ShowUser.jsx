import React, { memo, useCallback, useState } from "react";
import DataTable from "../common/DataTable";
import PageWapper from "../../../components/layout/PageWapper";
import Search from "../../../components/common/Search";
import { IoIosArrowDown } from "react-icons/io";
import UserList from "./UserList";
import Modal from "../../../components/common/Modal";
import AddProduct from "./AddUser";

const ShowUser = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [userRole, setUserRole] = useState("");

  const [addUser, setAddUser] = useState(false);

  const closeAddUser = useCallback(() => setAddUser(false), []);
  const openAddUser = useCallback(() => setAddUser(true), []);

  const handleOnChangeRole = (e) => {
    setUserRole(e.target.value);
  };

  console.log(userRole);
  return (
    <div className="p-3">
      <PageWapper>
        <div className="space-y-3">
          <div className="border rounded-xl border-gray-300 p-4 space-y-3">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-semibold">User Create</h1>
              <button
                className="bg-green-600 px-8 py-2 rounded-full cursor-pointer text-white"
                onClick={openAddUser}
              >
                Create
              </button>
            </div>
            <div className="grid grid-cols-3 place-content-center gap-3 max-[600px]:flex max-[600px]:flex-col">
              <div className="flex items-center border border-gray-200 rounded-xl h-12 px-3">
                <select
                  name="Status"
                  onChange={handleOnChangeRole}
                  value={userRole}
                  className="appearance-none outline-none w-full h-full cursor-pointer bg-transparent text-[16px] p-1"
                >
                  <option value="">select option</option>
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                </select>
                <IoIosArrowDown className="shrink-0 text-gray-400" />
              </div>
              <div className="col-span-2">
                <Search onSearch={setSearchQuery} />
              </div>
            </div>
          </div>
          <div>
            <div className="p-2 rounded-2xl border border-gray-200">
              <UserList
                searchQuery={searchQuery}
                openAddUser={openAddUser}
                userRole={userRole}
              />
            </div>
          </div>
        </div>
      </PageWapper>
      <div>
        <Modal
          open={addUser}
          onClose={closeAddUser}
          title="Create User"
          widthClassName="max-w-2xl"
        >
          <AddProduct closeAddUser={closeAddUser} />
        </Modal>
      </div>
    </div>
  );
};

export default memo(ShowUser);
