import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT,
} from '../constants/loginConstants';

interface LoginState {
  loading: boolean;
  user: any;
  sessionToken: string;
  error: string;
}

const initialState: LoginState = {
  loading: false,
  user: null,
  sessionToken: '',
  error: '',
};

const loginReducer = (state = initialState, action: any): LoginState => {
  switch (action.type) {
    case LOGIN_REQUEST:
      return {
        ...state,
        loading: true,
        error: '',
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        loading: false,
        user: action.payload.user,
        sessionToken: action.payload.sessionToken,
        error: '',
      };
    case LOGIN_FAILURE:
      return {
        ...state,
        loading: false,
        user: null,
        sessionToken: '',
        error: action.payload,
      };
    case LOGOUT:
      localStorage.removeItem('user');
      localStorage.removeItem('session_token');
      localStorage.removeItem('partner_id');
      localStorage.removeItem('partner_ref_id');
      return initialState;
    default:
      return state;
  }
};

export default loginReducer;