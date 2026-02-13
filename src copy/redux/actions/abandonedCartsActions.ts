import {
  FETCH_ABANDONED_CARTS_REQUEST,
  FETCH_ABANDONED_CARTS_SUCCESS,
  FETCH_ABANDONED_CARTS_FAILURE,
} from '../constants/abandonedCartsConstants';
import { AbandonedCart } from '../types';
import { fetchAbandonedCartsAPI } from '../api';

export const fetchAbandonedCarts = () => {
  return async (dispatch: any) => {
    dispatch({ type: FETCH_ABANDONED_CARTS_REQUEST });
    try {
      const response = await fetchAbandonedCartsAPI();
      dispatch({ type: FETCH_ABANDONED_CARTS_SUCCESS, payload: response.data });
    } catch (error: any) {
      dispatch({ type: FETCH_ABANDONED_CARTS_FAILURE, payload: error.message });
    }
  };
};