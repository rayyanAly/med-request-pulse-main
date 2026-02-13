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

interface CategoryState {
  categories: any[];
  loading: boolean;
  error: string | null;
  creating: boolean;
  creatingError: string | null;
  updating: boolean;
  updatingError: string | null;
}

const initialState: CategoryState = {
  categories: [],
  loading: false,
  error: null,
  creating: false,
  creatingError: null,
  updating: false,
  updatingError: null,
};

const getCategoriesFromPayload = (payload: any): any[] => {
  if (Array.isArray(payload)) {
    return payload;
  } else if (payload.data && Array.isArray(payload.data)) {
    return payload.data;
  } else if (payload.categories && Array.isArray(payload.categories)) {
    return payload.categories;
  }
  return [];
};

const categoryReducer = (state = initialState, action: any): CategoryState => {
  switch (action.type) {
    case FETCH_CATEGORIES_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_CATEGORIES_SUCCESS:
      return {
        ...state,
        loading: false,
        categories: getCategoriesFromPayload(action.payload),
        error: null,
      };
    case FETCH_CATEGORIES_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case CREATE_CATEGORY_REQUEST:
      return {
        ...state,
        creating: true,
        creatingError: null,
      };
    case CREATE_CATEGORY_SUCCESS:
      return {
        ...state,
        creating: false,
        creatingError: null,
        categories: [...state.categories, action.payload.data],
      };
    case CREATE_CATEGORY_FAILURE:
      return {
        ...state,
        creating: false,
        creatingError: action.payload,
      };
    case UPDATE_CATEGORY_REQUEST:
      return {
        ...state,
        updating: true,
        updatingError: null,
      };
    case UPDATE_CATEGORY_SUCCESS:
      return {
        ...state,
        updating: false,
        updatingError: null,
        categories: state.categories.map((c) =>
          c.category_id === action.payload.data.category_id
            ? action.payload.data
            : c
        ),
      };
    case UPDATE_CATEGORY_FAILURE:
      return {
        ...state,
        updating: false,
        updatingError: action.payload,
      };
    case TOGGLE_CATEGORY_STATUS_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case TOGGLE_CATEGORY_STATUS_SUCCESS:
      return {
        ...state,
        loading: false,
        categories: state.categories.map((c) =>
          c.category_id === action.payload.data.category_id
            ? action.payload.data
            : c
        ),
      };
    case TOGGLE_CATEGORY_STATUS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default categoryReducer;
