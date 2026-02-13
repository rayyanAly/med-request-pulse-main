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
import { PromotionsState } from '../types';

const initialState: PromotionsState = {
  promotions: [],
  allPromotions: [],
  manufacturers: [],
  loading: false,
  error: null,
  summary: null,
  loadingSummary: false,
  errorSummary: null,
  pagination: null,
  uploading: false,
  uploadError: null,
  uploadResult: null,
  syncing: false,
  syncError: null,
  syncResult: null,
};

const promotionReducer = (state = initialState, action: any): PromotionsState => {
  switch (action.type) {
    case FETCH_PROMOTIONS_REQUEST:
      return { ...state, loading: true, error: null };
    case FETCH_PROMOTIONS_SUCCESS:
      const allPromotions = action.payload.allData || action.payload.data;
      const manufacturers = Array.from(new Set(allPromotions.map((p: any) => p.manufacturer_name).filter(Boolean))) as string[];
      return {
        ...state,
        loading: false,
        promotions: action.payload.data,
        allPromotions,
        manufacturers,
        pagination: {
          page: action.payload.pagination.page,
          limit: action.payload.pagination.limit,
          total: allPromotions.length,
          totalPages: Math.ceil(allPromotions.length / action.payload.pagination.limit),
          hasNext: action.payload.data.length === action.payload.pagination.limit,
          hasPrev: action.payload.pagination.page > 1,
        },
      };
    case FETCH_PROMOTIONS_FAILURE:
      return { ...state, loading: false, error: action.payload };
    case FETCH_PROMOTION_SUMMARY_REQUEST:
      return { ...state, loadingSummary: true, errorSummary: null };
    case FETCH_PROMOTION_SUMMARY_SUCCESS:
      return { ...state, loadingSummary: false, summary: action.payload };
    case FETCH_PROMOTION_SUMMARY_FAILURE:
      return { ...state, loadingSummary: false, errorSummary: action.payload };
    case UPLOAD_PROMOTIONS_REQUEST:
      return { ...state, uploading: true, uploadError: null, uploadResult: null };
    case UPLOAD_PROMOTIONS_SUCCESS:
      return { ...state, uploading: false, uploadResult: action.payload };
    case UPLOAD_PROMOTIONS_FAILURE:
      return { ...state, uploading: false, uploadError: action.payload };
    case SYNC_PROMOTIONS_REQUEST:
      return { ...state, syncing: true, syncError: null, syncResult: null };
    case SYNC_PROMOTIONS_SUCCESS:
      return { ...state, syncing: false, syncResult: action.payload };
    case SYNC_PROMOTIONS_FAILURE:
      return { ...state, syncing: false, syncError: action.payload };
    default:
      return state;
  }
};

export default promotionReducer;