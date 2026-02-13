import {
  FETCH_PRODUCTS_REQUEST,
  FETCH_PRODUCTS_SUCCESS,
  FETCH_PRODUCTS_FAILURE,
  CREATE_PRODUCT_REQUEST,
  CREATE_PRODUCT_SUCCESS,
  CREATE_PRODUCT_FAILURE,
  UPDATE_PRODUCT_REQUEST,
  UPDATE_PRODUCT_SUCCESS,
  UPDATE_PRODUCT_FAILURE,
  UPDATE_PRODUCT_STATUS_REQUEST,
  UPDATE_PRODUCT_STATUS_SUCCESS,
  UPDATE_PRODUCT_STATUS_FAILURE,
} from '../constants/productConstants';
import { ProductsState, ProductManufacturer } from '../types';

const initialState: ProductsState = {
  products: [],
  allProducts: [],
  manufacturers: [],
  loading: false,
  error: null,
  pagination: null,
};

const productReducer = (state = initialState, action: any): ProductsState => {
  switch (action.type) {
    case FETCH_PRODUCTS_REQUEST:
      return { ...state, loading: true, error: null };
    case FETCH_PRODUCTS_SUCCESS:
      const allProductsData = action.payload.allProducts || action.payload.products || [];
      return {
        ...state,
        loading: false,
        products: action.payload.products || [],
        allProducts: allProductsData,
        pagination: action.payload.pagination || null,
      };
    case FETCH_PRODUCTS_FAILURE:
      return { ...state, loading: false, error: action.payload };
    case CREATE_PRODUCT_REQUEST:
      return { ...state, loading: true, error: null };
    case CREATE_PRODUCT_SUCCESS:
      // Add the new product to allProducts
      const newProduct = action.payload;
      return {
        ...state,
        loading: false,
        allProducts: [newProduct, ...state.allProducts],
        products: [newProduct, ...state.products],
      };
    case CREATE_PRODUCT_FAILURE:
      return { ...state, loading: false, error: action.payload };
    case UPDATE_PRODUCT_REQUEST:
      return { ...state, loading: true, error: null };
    case UPDATE_PRODUCT_SUCCESS:
      // Update the specific product in allProducts and products
      const updatedProduct = action.payload;
      const updatedAllProducts = state.allProducts.map(p =>
        p.product_id === updatedProduct.product_id ? updatedProduct : p
      );
      const updatedProducts = state.products.map(p =>
        p.product_id === updatedProduct.product_id ? updatedProduct : p
      );
      return {
        ...state,
        loading: false,
        products: updatedProducts,
        allProducts: updatedAllProducts,
      };
    case UPDATE_PRODUCT_FAILURE:
      return { ...state, loading: false, error: action.payload };
    case UPDATE_PRODUCT_STATUS_REQUEST:
      return { ...state, loading: true, error: null };
    case UPDATE_PRODUCT_STATUS_SUCCESS:
      const statusData = action.payload;
      if (statusData.product_id && statusData.visibility) {
        // Single product visibility update - convert string values to booleans
        const convertedVisibility = {
          web: statusData.visibility.web === 'Active',
          mobile: statusData.visibility.mobile === 'Active'
        };

        const visibilityUpdatedAllProducts = state.allProducts.map(p =>
          p.product_id === statusData.product_id ? { ...p, visibility: convertedVisibility } : p
        );
        const visibilityUpdatedProducts = state.products.map(p =>
          p.product_id === statusData.product_id ? { ...p, visibility: convertedVisibility } : p
        );
        return {
          ...state,
          loading: false,
          products: visibilityUpdatedProducts,
          allProducts: visibilityUpdatedAllProducts,
        };
      } else if (statusData.codes && statusData.visibility) {
        // Bulk update response with codes array
        const convertedVisibility = {
          web: statusData.visibility.web === 'Active',
          mobile: statusData.visibility.mobile === 'Active'
        };

        const bulkUpdatedAllProducts = state.allProducts.map(p =>
          statusData.codes.includes(p.dynamic_code) ? { ...p, visibility: convertedVisibility } : p
        );
        const bulkUpdatedProducts = state.products.map(p =>
          statusData.codes.includes(p.dynamic_code) ? { ...p, visibility: convertedVisibility } : p
        );

        return {
          ...state,
          loading: false,
          products: bulkUpdatedProducts,
          allProducts: bulkUpdatedAllProducts,
        };
      } else if (statusData.visibility) {
        // Bulk update response (fallback for old format)
        return {
          ...state,
          loading: false,
        };
      } else {
        // Other success response
        return {
          ...state,
          loading: false,
        };
      }
    case UPDATE_PRODUCT_STATUS_FAILURE:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default productReducer;