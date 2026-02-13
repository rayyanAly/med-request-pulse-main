import {
  FETCH_TEMPLATES_REQUEST,
  FETCH_TEMPLATES_SUCCESS,
  FETCH_TEMPLATES_FAILURE,
  FETCH_TEMPLATE_USAGE_REQUEST,
  FETCH_TEMPLATE_USAGE_SUCCESS,
  FETCH_TEMPLATE_USAGE_FAILURE,
  SEND_TEMPLATE_REQUEST,
  SEND_TEMPLATE_SUCCESS,
  SEND_TEMPLATE_FAILURE,
  SEND_TEMPLATE_TO_NUMBER_REQUEST,
  SEND_TEMPLATE_TO_NUMBER_SUCCESS,
  SEND_TEMPLATE_TO_NUMBER_FAILURE,
} from '../constants/templateConstants';
import { TemplateState } from '../types';

const initialState: TemplateState = {
  templates: [],
  templateUsage: [],
  loading: false,
  error: null,
};

const templateReducer = (state = initialState, action: any): TemplateState => {
  switch (action.type) {
    case FETCH_TEMPLATES_REQUEST:
    case FETCH_TEMPLATE_USAGE_REQUEST:
    case SEND_TEMPLATE_REQUEST:
    case SEND_TEMPLATE_TO_NUMBER_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_TEMPLATES_SUCCESS:
      return {
        ...state,
        loading: false,
        templates: action.payload,
      };
    case FETCH_TEMPLATE_USAGE_SUCCESS:
      return {
        ...state,
        loading: false,
        templateUsage: action.payload,
      };
    case SEND_TEMPLATE_SUCCESS:
    case SEND_TEMPLATE_TO_NUMBER_SUCCESS:
      return {
        ...state,
        loading: false,
      };
    case FETCH_TEMPLATES_FAILURE:
    case FETCH_TEMPLATE_USAGE_FAILURE:
    case SEND_TEMPLATE_FAILURE:
    case SEND_TEMPLATE_TO_NUMBER_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default templateReducer;