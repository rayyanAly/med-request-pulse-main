import {
  FETCH_BANNERS_REQUEST,
  FETCH_BANNERS_SUCCESS,
  FETCH_BANNERS_FAILURE,
  CREATE_BANNER_REQUEST,
  CREATE_BANNER_SUCCESS,
  CREATE_BANNER_FAILURE,
  UPDATE_BANNER_REQUEST,
  UPDATE_BANNER_SUCCESS,
  UPDATE_BANNER_FAILURE,
} from '../constants/bannerConstants';
import { BannersState, Banner } from '../types';

const initialState: BannersState = {
  banners: [],
  loading: false,
  error: null,
};

export const bannerReducer = (state = initialState, action: any): BannersState => {
  switch (action.type) {
    case FETCH_BANNERS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_BANNERS_SUCCESS:
      return {
        ...state,
        loading: false,
        banners: action.payload,
      };
    case FETCH_BANNERS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case CREATE_BANNER_REQUEST:
      return {
        ...state,
        error: null,
      };
    case CREATE_BANNER_SUCCESS:
      return {
        ...state,
        banners: [...state.banners, action.payload],
      };
    case CREATE_BANNER_FAILURE:
      return {
        ...state,
        error: action.payload,
      };
    case UPDATE_BANNER_REQUEST:
      return {
        ...state,
        error: null,
      };
    case UPDATE_BANNER_SUCCESS:
      return {
        ...state,
        banners: state.banners.map(banner => 
          banner.banner_id === action.payload.banner_id ? action.payload : banner
        ),
      };
    case UPDATE_BANNER_FAILURE:
      return {
        ...state,
        error: action.payload,
      };
    default:
      return state;
  }
};