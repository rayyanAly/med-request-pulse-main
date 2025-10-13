import { Dispatch } from 'redux';
import { login } from '../../api/authApi';
import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT,
} from '../constants/loginConstants';

export interface LoginData {
  username: string;
  password: string;
}

export const loginRequest = () => ({
  type: LOGIN_REQUEST,
});

export const loginSuccess = (user: any, sessionToken: string) => ({
  type: LOGIN_SUCCESS,
  payload: { user, sessionToken },
});

export const loginFailure = (error: string) => ({
  type: LOGIN_FAILURE,
  payload: error,
});

export const logout = () => ({
  type: LOGOUT,
});

export const loginUser = (data: LoginData) => {
  return async (dispatch: Dispatch) => {
    dispatch(loginRequest());
    try {
      const result = await login(data);

      if (result.success) {
        const sessionToken = result.data?.partner_session || '';
        localStorage.setItem('session_token', sessionToken);
        localStorage.setItem('partner_id', result.data.partner_id);
        localStorage.setItem('partner_ref_id', result.data.id);
        localStorage.setItem('user', JSON.stringify(result.data));
        dispatch(loginSuccess(result.data, sessionToken));
      } else {
        dispatch(loginFailure(result.message || 'Login failed'));
      }
    } catch (error: any) {
      dispatch(loginFailure(error.message || 'Network error'));
    }
  };
};

export const loadUserFromStorage = () => {
  return (dispatch: Dispatch) => {
    const sessionToken = localStorage.getItem('session_token');
    const user = localStorage.getItem('user');
    if (sessionToken && user) {
      try {
        const parsedUser = JSON.parse(user);
        dispatch(loginSuccess(parsedUser, sessionToken));
      } catch (error) {
        // Invalid user data, clear storage
        localStorage.removeItem('session_token');
        localStorage.removeItem('user');
      }
    }
  };
};
