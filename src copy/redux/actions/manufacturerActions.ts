import {
  FETCH_MANUFACTURERS_REQUEST,
  FETCH_MANUFACTURERS_SUCCESS,
  FETCH_MANUFACTURERS_FAILURE,
  CREATE_MANUFACTURER_REQUEST,
  CREATE_MANUFACTURER_SUCCESS,
  CREATE_MANUFACTURER_FAILURE,
  UPDATE_MANUFACTURER_REQUEST,
  UPDATE_MANUFACTURER_SUCCESS,
  UPDATE_MANUFACTURER_FAILURE,
  TOGGLE_MANUFACTURER_STATUS_REQUEST,
  TOGGLE_MANUFACTURER_STATUS_SUCCESS,
  TOGGLE_MANUFACTURER_STATUS_FAILURE,
} from '../constants/manufacturerConstants';
import {
  fetchManufacturersAPI,
  createManufacturerAPI,
  updateManufacturerAPI,
} from '../api';

export const fetchManufacturers = () => {
  return async (dispatch: any) => {
    dispatch({ type: FETCH_MANUFACTURERS_REQUEST });
    try {
      const data = await fetchManufacturersAPI();
      
      dispatch({
        type: FETCH_MANUFACTURERS_SUCCESS,
        payload: data,
      });
    } catch (error: any) {
      dispatch({
        type: FETCH_MANUFACTURERS_FAILURE,
        payload: error.message,
      });
    }
  };
};

export const createManufacturer = (formData: FormData) => {
  return async (dispatch: any) => {
    dispatch({ type: CREATE_MANUFACTURER_REQUEST });
    try {
      const data = await createManufacturerAPI(formData);
      
      dispatch({
        type: CREATE_MANUFACTURER_SUCCESS,
        payload: data,
      });
      return { success: true, data };
    } catch (error: any) {
      dispatch({
        type: CREATE_MANUFACTURER_FAILURE,
        payload: error.message,
      });
      return { success: false, error: error.message };
    }
  };
};

export const updateManufacturer = (id: number, formData: FormData) => {
  return async (dispatch: any) => {
    dispatch({ type: UPDATE_MANUFACTURER_REQUEST });
    try {
      const data = await updateManufacturerAPI(id, formData);
      
      dispatch({
        type: UPDATE_MANUFACTURER_SUCCESS,
        payload: data,
      });
      return { success: true, data };
    } catch (error: any) {
      dispatch({
        type: UPDATE_MANUFACTURER_FAILURE,
        payload: error.message,
      });
      return { success: false, error: error.message };
    }
  };
};

export const toggleManufacturerStatus = (id: number, status: number) => {
  return async (dispatch: any) => {
    dispatch({ type: TOGGLE_MANUFACTURER_STATUS_REQUEST });
    try {
      const formData = new FormData();
      formData.append('status', String(status));
      
      const data = await updateManufacturerAPI(id, formData);
      
      dispatch({
        type: TOGGLE_MANUFACTURER_STATUS_SUCCESS,
        payload: data,
      });
      dispatch(fetchManufacturers());
      return { success: true, data };
    } catch (error: any) {
      dispatch({
        type: TOGGLE_MANUFACTURER_STATUS_FAILURE,
        payload: error.message,
      });
      return { success: false, error: error.message };
    }
  };
};
