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

interface ManufacturerState {
  manufacturers: any[];
  loading: boolean;
  error: string | null;
  creating: boolean;
  creatingError: string | null;
  updating: boolean;
  updatingError: string | null;
}

const initialState: ManufacturerState = {
  manufacturers: [],
  loading: false,
  error: null,
  creating: false,
  creatingError: null,
  updating: false,
  updatingError: null,
};

const getManufacturersFromPayload = (payload: any): any[] => {
  if (Array.isArray(payload)) {
    return payload;
  } else if (payload.data && Array.isArray(payload.data)) {
    return payload.data;
  } else if (payload.manufacturers && Array.isArray(payload.manufacturers)) {
    return payload.manufacturers;
  }
  return [];
};

const manufacturerReducer = (state = initialState, action: any): ManufacturerState => {
  switch (action.type) {
    case FETCH_MANUFACTURERS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_MANUFACTURERS_SUCCESS:
      return {
        ...state,
        loading: false,
        manufacturers: getManufacturersFromPayload(action.payload),
        error: null,
      };
    case FETCH_MANUFACTURERS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case CREATE_MANUFACTURER_REQUEST:
      return {
        ...state,
        creating: true,
        creatingError: null,
      };
    case CREATE_MANUFACTURER_SUCCESS:
      return {
        ...state,
        creating: false,
        creatingError: null,
        manufacturers: [...state.manufacturers, action.payload.data],
      };
    case CREATE_MANUFACTURER_FAILURE:
      return {
        ...state,
        creating: false,
        creatingError: action.payload,
      };
    case UPDATE_MANUFACTURER_REQUEST:
      return {
        ...state,
        updating: true,
        updatingError: null,
      };
    case UPDATE_MANUFACTURER_SUCCESS:
      return {
        ...state,
        updating: false,
        updatingError: null,
        manufacturers: state.manufacturers.map((m) =>
          m.manufacturer_id === action.payload.data.manufacturer_id
            ? action.payload.data
            : m
        ),
      };
    case UPDATE_MANUFACTURER_FAILURE:
      return {
        ...state,
        updating: false,
        updatingError: action.payload,
      };
    case TOGGLE_MANUFACTURER_STATUS_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case TOGGLE_MANUFACTURER_STATUS_SUCCESS:
      return {
        ...state,
        loading: false,
        manufacturers: state.manufacturers.map((m) =>
          m.manufacturer_id === action.payload.data.manufacturer_id
            ? action.payload.data
            : m
        ),
      };
    case TOGGLE_MANUFACTURER_STATUS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default manufacturerReducer;
