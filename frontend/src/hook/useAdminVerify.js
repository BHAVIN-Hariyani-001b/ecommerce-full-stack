// hooks/useAdminVerify.js
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAdminStatus } from "../features/auth/authThunk.js";

const useAdminVerify = () => {
  const dispatch = useDispatch();
  const isAdmin = useSelector((state) => state.auth?.isAdmin);
  const isLoading = useSelector((state) => state.auth?.isLoading);
  const token = useSelector((state) => state.auth?.token);

  useEffect(() => {
    if (!token) return;
    dispatch(fetchAdminStatus());
  }, [dispatch, token]); 

  return { isAdmin, isLoading, token };
};

export default useAdminVerify;