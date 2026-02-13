import {
  FETCH_REFERENCE_DATA_REQUEST,
  FETCH_REFERENCE_DATA_SUCCESS,
  FETCH_REFERENCE_DATA_FAILURE,
} from '../constants/referenceDataConstants';
import { ReferenceDataState } from '../types';

const initialState: ReferenceDataState = {
  manufacturers: [],
  categories: [],
  products: [],
  loading: false,
  error: null,
  lastFetched: null,
};

export const referenceDataReducer = (state = initialState, action: any): ReferenceDataState => {
  switch (action.type) {
    case FETCH_REFERENCE_DATA_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_REFERENCE_DATA_SUCCESS:
      return {
        ...state,
        loading: false,
        manufacturers: action.payload.manufacturers,
        categories: action.payload.categories,
        products: action.payload.products,
        lastFetched: action.payload.lastFetched,
      };
    case FETCH_REFERENCE_DATA_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};