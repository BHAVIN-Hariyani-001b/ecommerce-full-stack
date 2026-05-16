import { useEffect } from "react";
import { useSelector,useDispatch } from "react-redux";
import { getUserProfile } from "../features/auth/authThunk";

const useAuth = () => {
  const { user, token, isLoggedIn } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  useEffect(() => {
    const loadUser = async () => {
      if (token && !user) {
        try {
            const response = await dispatch(getUserProfile()).unwrap();
            // console.log(response);
            return response?.data;
        } catch (error) {
          console.log(error);
        }
      }
    };
    loadUser();
  }, [token, user, dispatch]);
  return { user, token, isLoggedIn };
};

export default useAuth;
