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
import { Banner } from '../types';
import { fetchBannersAPI, createBannerAPI, updateBannerAPI } from '../api';

export const fetchBanners = () => {
  return async (dispatch: any) => {
    dispatch({ type: FETCH_BANNERS_REQUEST });
    try {
      const response = await fetchBannersAPI();
      dispatch({ type: FETCH_BANNERS_SUCCESS, payload: response.data });
    } catch (error: any) {
      dispatch({ type: FETCH_BANNERS_FAILURE, payload: error.message });
    }
  };
};

export const createBanner = (bannerData: any, imageFiles: File[], mobileImageFiles: File[]) => {
  return async (dispatch: any) => {
    dispatch({ type: CREATE_BANNER_REQUEST });
    try {
      const response = await createBannerAPI(bannerData, imageFiles, mobileImageFiles);
      dispatch({ type: CREATE_BANNER_SUCCESS, payload: response.data });
    } catch (error: any) {
      dispatch({ type: CREATE_BANNER_FAILURE, payload: error.message });
      throw error; // Re-throw to handle in component
    }
  };
};

export const updateBanner = (bannerId: number, bannerData: any, imageFiles: File[], mobileImageFiles: File[]) => {
  return async (dispatch: any) => {
    dispatch({ type: UPDATE_BANNER_REQUEST });
    try {
      const response = await updateBannerAPI(bannerId, bannerData, imageFiles, mobileImageFiles);
      dispatch({ type: UPDATE_BANNER_SUCCESS, payload: response.data });
    } catch (error: any) {
      dispatch({ type: UPDATE_BANNER_FAILURE, payload: error.message });
      throw error; // Re-throw to handle in component
    }
  };
};