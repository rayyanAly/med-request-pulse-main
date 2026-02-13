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
import { fetchCatalogProductsAPI, createProductAPI, updateProductAPI, updateProductStatusAPI, updateProductVisibilityAPI, bulkUpdateProductVisibilityAPI } from '../api';

export const fetchProducts = (page: number = 1, limit: number = 100, manufacturerIds: string[] = [], searchQuery: string = '') => {
  return async (dispatch: any) => {
    dispatch({ type: FETCH_PRODUCTS_REQUEST });
    try {
      let url: string;
      let params = new URLSearchParams();

      if (searchQuery.trim()) {
        // Use search API when searching
        params.append('q', searchQuery.trim());
        params.append('limit', limit.toString());
        url = `/api/products/search?${params.toString()}`;
      } else {
        // Use all products API when not searching
        params.append('page', page.toString());
        params.append('limit', limit.toString());

        if (manufacturerIds.length > 0) {
          params.append('manufacturer_id', manufacturerIds.join(','));
        }

        url = `/api/products/all?${params.toString()}`;
      }

      const response = await fetch(url);
      const result = await response.json();

      let products = [];
      let paginationData = null;

      if (searchQuery.trim()) {
        // Search API response
        if (Array.isArray(result)) {
          products = result;
        } else if (result.data && Array.isArray(result.data)) {
          products = result.data;
        } else {
          products = [];
        }
        // For search, don't paginate, show all results
        paginationData = {
          page: 1,
          limit: products.length,
          total: products.length,
          totalPages: 1,
          hasNext: false,
          hasPrev: false
        };
      } else {
        // All products API response
        if (Array.isArray(result)) {
          // Simple array response - all products at once
          products = result;
          paginationData = {
            page: 1,
            limit: result.length,
            total: result.length,
            totalPages: 1,
            hasNext: false,
            hasPrev: false
          };
        } else if (result.data && Array.isArray(result.data)) {
          // Paginated response with data array
          products = result.data;

          // Extract total count - try result.total first, then result.pagination.total
          const totalCount = result.total || result.pagination?.total || products.length;
          const totalPages = Math.ceil(totalCount / limit);

          paginationData = {
            page: page,
            limit: limit,
            total: totalCount,
            totalPages: totalPages,
            hasNext: page < totalPages,
            hasPrev: page > 1
          };
        } else {
          throw new Error('Invalid API response format');
        }
      }

      dispatch({
        type: FETCH_PRODUCTS_SUCCESS,
        payload: {
          products: products,
          allProducts: products,
          pagination: paginationData,
        },
      });
    } catch (error: any) {
      dispatch({ type: FETCH_PRODUCTS_FAILURE, payload: error.message });
    }
  };
};

export const createProduct = (productData: any, mainImageFile: File | null, subImageFiles: File[]) => {
  return async (dispatch: any) => {
    dispatch({ type: CREATE_PRODUCT_REQUEST });
    try {
      const response = await createProductAPI(productData, mainImageFile, subImageFiles);
      dispatch({ type: CREATE_PRODUCT_SUCCESS, payload: response.data });
    } catch (error: any) {
      dispatch({ type: CREATE_PRODUCT_FAILURE, payload: error.message });
      throw error;
    }
  };
};

export const updateProduct = (productId: number, productData: any, mainImageFile: File | null, subImageFiles: File[], dynamicCode?: string) => {
  return async (dispatch: any) => {
    dispatch({ type: UPDATE_PRODUCT_REQUEST });
    try {
      const response = await updateProductAPI(productId, productData, mainImageFile, subImageFiles, dynamicCode);
      dispatch({ type: UPDATE_PRODUCT_SUCCESS, payload: response.data });
    } catch (error: any) {
      dispatch({ type: UPDATE_PRODUCT_FAILURE, payload: error.message });
      throw error;
    }
  };
};

export const updateProductStatus = (productId: number, status: number) => {
  return async (dispatch: any) => {
    dispatch({ type: UPDATE_PRODUCT_STATUS_REQUEST });
    try {
      const response = await updateProductStatusAPI(productId, status);
      if (response.success) {
        // Update local state with the updated product data
        dispatch({ type: UPDATE_PRODUCT_STATUS_SUCCESS, payload: response.data });
      } else {
        throw new Error(response.error || 'Failed to update product status');
      }
    } catch (error: any) {
      dispatch({ type: UPDATE_PRODUCT_STATUS_FAILURE, payload: error.message });
      throw error;
    }
  };
};

export const updateProductVisibility = (productId: number, web: boolean, mobile: boolean) => {
  return async (dispatch: any) => {
    dispatch({ type: UPDATE_PRODUCT_STATUS_REQUEST });
    try {
      const response = await updateProductVisibilityAPI(productId, web, mobile);
      if (response.success) {
        // Update the product with new visibility data
        dispatch({ type: UPDATE_PRODUCT_STATUS_SUCCESS, payload: {
          product_id: productId,
          visibility: response.data.visibility
        } });
      } else {
        throw new Error(response.error || 'Failed to update product visibility');
      }
    } catch (error: any) {
      dispatch({ type: UPDATE_PRODUCT_STATUS_FAILURE, payload: error.message });
      throw error;
    }
  };
};

export const bulkUpdateProductVisibility = (codesString: string, web: number, mobile: number) => {
  return async (dispatch: any) => {
    dispatch({ type: UPDATE_PRODUCT_STATUS_REQUEST });
    try {
      const response = await bulkUpdateProductVisibilityAPI(codesString, web, mobile);
      if (response.success) {
        // Dispatch the actual response data for UI updates
        dispatch({ type: UPDATE_PRODUCT_STATUS_SUCCESS, payload: response.data });
      } else {
        throw new Error(response.error || 'Failed to update product visibility');
      }
    } catch (error: any) {
      dispatch({ type: UPDATE_PRODUCT_STATUS_FAILURE, payload: error.message });
      throw error;
    }
  };
};