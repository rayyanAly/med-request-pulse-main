import {
  FETCH_PROMOTIONS_REQUEST,
  FETCH_PROMOTIONS_SUCCESS,
  FETCH_PROMOTIONS_FAILURE,
  FETCH_PROMOTION_SUMMARY_REQUEST,
  FETCH_PROMOTION_SUMMARY_SUCCESS,
  FETCH_PROMOTION_SUMMARY_FAILURE,
  UPLOAD_PROMOTIONS_REQUEST,
  UPLOAD_PROMOTIONS_SUCCESS,
  UPLOAD_PROMOTIONS_FAILURE,
  SYNC_PROMOTIONS_REQUEST,
  SYNC_PROMOTIONS_SUCCESS,
  SYNC_PROMOTIONS_FAILURE,
} from '../constants/promotionConstants';
import { fetchPromotionsAPI, fetchPromotionSummaryAPI, uploadPromotionsAPI, syncPromotionsAPI } from '../api';

export const fetchPromotions = (page: number = 1, limit: number = 50, manufacturer?: string) => {
  return async (dispatch: any) => {
    dispatch({ type: FETCH_PROMOTIONS_REQUEST });
    try {
      const data = await fetchPromotionsAPI(page, limit, manufacturer);

      dispatch({
        type: FETCH_PROMOTIONS_SUCCESS,
        payload: data,
      });
    } catch (error: any) {
      dispatch({ type: FETCH_PROMOTIONS_FAILURE, payload: error.message });
    }
  };
};

export const fetchPromotionSummary = () => {
  return async (dispatch: any) => {
    dispatch({ type: FETCH_PROMOTION_SUMMARY_REQUEST });
    try {
      const summary = await fetchPromotionSummaryAPI();
      dispatch({
        type: FETCH_PROMOTION_SUMMARY_SUCCESS,
        payload: summary.data,
      });
    } catch (error: any) {
      dispatch({ type: FETCH_PROMOTION_SUMMARY_FAILURE, payload: error.message });
    }
  };
};

export const uploadPromotions = (file: File) => {
  return async (dispatch: any) => {
    dispatch({ type: UPLOAD_PROMOTIONS_REQUEST });
    try {
      const result = await uploadPromotionsAPI(file);
      dispatch({
        type: UPLOAD_PROMOTIONS_SUCCESS,
        payload: result,
      });
      return result;
    } catch (error: any) {
      dispatch({ type: UPLOAD_PROMOTIONS_FAILURE, payload: error.message });
      throw error;
    }
  };
};

export const syncPromotions = () => {
  return async (dispatch: any) => {
    dispatch({ type: SYNC_PROMOTIONS_REQUEST });
    try {
      const result = await syncPromotionsAPI();
      dispatch({
        type: SYNC_PROMOTIONS_SUCCESS,
        payload: result,
      });
      return result;
    } catch (error: any) {
      dispatch({ type: SYNC_PROMOTIONS_FAILURE, payload: error.message });
      throw error;
    }
  };
};