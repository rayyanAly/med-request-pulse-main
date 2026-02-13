import {
  FETCH_REFERENCE_DATA_REQUEST,
  FETCH_REFERENCE_DATA_SUCCESS,
  FETCH_REFERENCE_DATA_FAILURE,
} from '../constants/referenceDataConstants';
import { ReferenceDataItem } from '../types';
import { fetchManufacturersAPI, fetchCategoriesAPI, fetchProductsAPI } from '../api';

export const fetchReferenceData = () => {
  return async (dispatch: any) => {
    dispatch({ type: FETCH_REFERENCE_DATA_REQUEST });
    try {
      const [manufacturersResponse, categoriesResponse, productsResponse] = await Promise.all([
        fetchManufacturersAPI(),
        fetchCategoriesAPI(),
        fetchProductsAPI(),
      ]);

      const manufacturers = Array.isArray(manufacturersResponse)
        ? manufacturersResponse
        : (manufacturersResponse.data || []);
      const categories = Array.isArray(categoriesResponse)
        ? categoriesResponse
        : (categoriesResponse.data || []);
      const products = Array.isArray(productsResponse)
        ? productsResponse
        : (productsResponse.data || []);

      dispatch({
        type: FETCH_REFERENCE_DATA_SUCCESS,
        payload: {
          manufacturers,
          categories,
          products,
          lastFetched: Date.now(),
        }
      });
    } catch (error: any) {
      dispatch({ type: FETCH_REFERENCE_DATA_FAILURE, payload: error.message });
    }
  };
};

export const startReferenceDataPolling = () => {
  return (dispatch: any) => {
    // Initial fetch
    dispatch(fetchReferenceData());

    // Set up polling every 5 minutes (300,000 ms)
    const intervalId = setInterval(() => {
      dispatch(fetchReferenceData());
    }, 300000);

    // Store interval ID in a way that can be accessed for cleanup
    (window as any).__referenceDataInterval = intervalId;
  };
};