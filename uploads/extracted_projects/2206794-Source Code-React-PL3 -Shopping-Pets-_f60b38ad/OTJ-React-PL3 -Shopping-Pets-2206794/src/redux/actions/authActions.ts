import { Dispatch } from "redux";
import { API_BASE_URL } from "../../config/constants";

export const loginUser = (credentials: { email: string; password: string }) => {
  return async (dispatch: Dispatch) => {
    try {
      const res = await fetch(`${API_BASE_URL}/users?email=${credentials.email}&password=${credentials.password}`);
      const data = await res.json();

      if (data.length > 0) {
        dispatch({ type: 'LOGIN_SUCCESS', payload: data[0] });
        
        return true;
      } else {
        dispatch({ type: 'LOGIN_FAILURE' });
        return false;
      }
    } catch (error) {
      console.error("Login error:", error);
      dispatch({ type: 'LOGIN_FAILURE' });
      return false;
    }
  };
};

export const logoutUser = () => {
  return async (dispatch: Dispatch) => {
    try {
      
        dispatch({ type: 'LOGIN_FAILURE' });
        return false;

    } catch (error) {
      console.error("Logout  error:", error);
      dispatch({ type: 'LOGIN_FAILURE' });
      return false;
    }
  };
};
