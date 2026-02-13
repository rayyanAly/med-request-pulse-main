import {
  FETCH_ABANDONED_CARTS_REQUEST,
  FETCH_ABANDONED_CARTS_SUCCESS,
  FETCH_ABANDONED_CARTS_FAILURE,
} from '../constants/abandonedCartsConstants';
import { AbandonedCartsState, AbandonedCart } from '../types';

const initialState: AbandonedCartsState = {
  carts: [],
  loading: false,
  error: null,
};

export const abandonedCartsReducer = (state = initialState, action: any): AbandonedCartsState => {
  switch (action.type) {
    case FETCH_ABANDONED_CARTS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_ABANDONED_CARTS_SUCCESS:
      return {
        ...state,
        loading: false,
        carts: action.payload,
      };
    case FETCH_ABANDONED_CARTS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};