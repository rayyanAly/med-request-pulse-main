import { Product, Category } from '../../api/types';
import {
  FETCH_PRODUCTS_REQUEST,
  FETCH_PRODUCTS_SUCCESS,
  FETCH_PRODUCTS_FAILURE,
  FETCH_CATEGORIES_REQUEST,
  FETCH_CATEGORIES_SUCCESS,
  FETCH_CATEGORIES_FAILURE,
} from '../constants/productConstants';

interface ProductState {
  loading: boolean;
  products: Product[];
  categories: Category[];
  error: string;
  categoriesError: string;
}

const initialState: ProductState = {
  loading: false,
  products: [],
  categories: [],
  error: '',
  categoriesError: '',
};

const productReducer = (state = initialState, action: any): ProductState => {
  switch (action.type) {
    case FETCH_PRODUCTS_REQUEST:
      return {
        ...state,
        loading: true,
        error: '',
      };
    case FETCH_PRODUCTS_SUCCESS:
      return {
        ...state,
        loading: false,
        products: action.payload,
        error: '',
      };
    case FETCH_PRODUCTS_FAILURE:
      return {
        ...state,
        loading: false,
        products: [],
        error: action.payload,
      };
    case FETCH_CATEGORIES_REQUEST:
      return {
        ...state,
        loading: true,
        categoriesError: '',
      };
    case FETCH_CATEGORIES_SUCCESS:
      return {
        ...state,
        loading: false,
        categories: action.payload,
        categoriesError: '',
      };
    case FETCH_CATEGORIES_FAILURE:
      return {
        ...state,
        loading: false,
        categories: [],
        categoriesError: action.payload,
      };
    default:
      return state;
  }
};

export default productReducer;
