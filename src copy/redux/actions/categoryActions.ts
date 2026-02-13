import {
  FETCH_CATEGORIES_REQUEST,
  FETCH_CATEGORIES_SUCCESS,
  FETCH_CATEGORIES_FAILURE,
  CREATE_CATEGORY_REQUEST,
  CREATE_CATEGORY_SUCCESS,
  CREATE_CATEGORY_FAILURE,
  UPDATE_CATEGORY_REQUEST,
  UPDATE_CATEGORY_SUCCESS,
  UPDATE_CATEGORY_FAILURE,
  TOGGLE_CATEGORY_STATUS_REQUEST,
  TOGGLE_CATEGORY_STATUS_SUCCESS,
  TOGGLE_CATEGORY_STATUS_FAILURE,
} from '../constants/categoryConstants';
import {
  fetchCategoriesAPI,
  createCategoryAPI,
  updateCategoryAPI,
} from '../api';

export const fetchCategories = (languageId: number = 1) => {
  return async (dispatch: any) => {
    dispatch({ type: FETCH_CATEGORIES_REQUEST });
    try {
      const data = await fetchCategoriesAPI();
      
      dispatch({
        type: FETCH_CATEGORIES_SUCCESS,
        payload: data,
      });
    } catch (error: any) {
      dispatch({
        type: FETCH_CATEGORIES_FAILURE,
        payload: error.message,
      });
    }
  };
};

export const createCategory = (formData: FormData) => {
  return async (dispatch: any) => {
    dispatch({ type: CREATE_CATEGORY_REQUEST });
    try {
      const data = await createCategoryAPI(formData);
      
      dispatch({
        type: CREATE_CATEGORY_SUCCESS,
        payload: data,
      });
      return { success: true, data };
    } catch (error: any) {
      dispatch({
        type: CREATE_CATEGORY_FAILURE,
        payload: error.message,
      });
      return { success: false, error: error.message };
    }
  };
};

export const updateCategory = (id: number, formData: FormData) => {
  return async (dispatch: any) => {
    dispatch({ type: UPDATE_CATEGORY_REQUEST });
    try {
      const data = await updateCategoryAPI(id, formData);
      
      dispatch({
        type: UPDATE_CATEGORY_SUCCESS,
        payload: data,
      });
      return { success: true, data };
    } catch (error: any) {
      dispatch({
        type: UPDATE_CATEGORY_FAILURE,
        payload: error.message,
      });
      return { success: false, error: error.message };
    }
  };
};

export const toggleCategoryStatus = (id: number, status: number) => {
  return async (dispatch: any) => {
    dispatch({ type: TOGGLE_CATEGORY_STATUS_REQUEST });
    try {
      const formData = new FormData();
      formData.append('status', String(status));
      
      const data = await updateCategoryAPI(id, formData);
      
      dispatch({
        type: TOGGLE_CATEGORY_STATUS_SUCCESS,
        payload: data,
      });
      dispatch(fetchCategories());
      return { success: true, data };
    } catch (error: any) {
      dispatch({
        type: TOGGLE_CATEGORY_STATUS_FAILURE,
        payload: error.message,
      });
      return { success: false, error: error.message };
    }
  };
};
