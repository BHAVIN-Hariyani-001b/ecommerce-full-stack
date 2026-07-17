// hooks/useAdminVerify.js
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAdminStatus } from "../features/auth/authThunk.js";

const useAdminVerify = () => {
  const dispatch = useDispatch();
  const isAdmin = useSelector((state) => state.auth?.isAdmin);
  const isLoading = useSelector((state) => state.auth?.isLoading);
  const isLoggedIn = useSelector((state) => state.auth?.isLoggedIn);

  useEffect(() => {
    console.log("hello")
    if (!isLoggedIn) return;
    dispatch(fetchAdminStatus()); // cookie sent automatically by browser
  }, [dispatch, isLoggedIn]);

  return { isAdmin, isLoading };
};

export default useAdminVerify;