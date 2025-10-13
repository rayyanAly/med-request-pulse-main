import { Order } from '../../api/types';
import {
  FETCH_ORDERS_REQUEST,
  FETCH_ORDERS_SUCCESS,
  FETCH_ORDERS_FAILURE,
  FETCH_SINGLE_ORDER_REQUEST,
  FETCH_SINGLE_ORDER_SUCCESS,
  FETCH_SINGLE_ORDER_FAILURE,
} from '../constants/orderConstants';

interface OrderState {
  loading: boolean;
  orders: Order[];
  singleOrder: Order | null;
  error: string;
}

const initialState: OrderState = {
  loading: false,
  orders: [],
  singleOrder: null,
  error: '',
};

const orderReducer = (state = initialState, action: any): OrderState => {
  switch (action.type) {
    case FETCH_ORDERS_REQUEST:
      return {
        ...state,
        loading: true,
        error: '',
      };
    case FETCH_ORDERS_SUCCESS:
      return {
        ...state,
        loading: false,
        orders: action.payload,
        error: '',
      };
    case FETCH_ORDERS_FAILURE:
      return {
        ...state,
        loading: false,
        orders: [],
        error: action.payload,
      };
    case FETCH_SINGLE_ORDER_REQUEST:
      return {
        ...state,
        loading: true,
        error: '',
      };
    case FETCH_SINGLE_ORDER_SUCCESS:
      return {
        ...state,
        loading: false,
        singleOrder: action.payload,
        error: '',
      };
    case FETCH_SINGLE_ORDER_FAILURE:
      return {
        ...state,
        loading: false,
        singleOrder: null,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default orderReducer;