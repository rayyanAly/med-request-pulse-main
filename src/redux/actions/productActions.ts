import { Dispatch } from "redux";
import { fetchProducts, fetchCategories } from "@/api/productApi";
import { Product, Category } from "@/api/types";
import {
  FETCH_PRODUCTS_REQUEST,
  FETCH_PRODUCTS_SUCCESS,
  FETCH_PRODUCTS_FAILURE,
  FETCH_CATEGORIES_REQUEST,
  FETCH_CATEGORIES_SUCCESS,
  FETCH_CATEGORIES_FAILURE,
} from "../constants/productConstants";

export const fetchProductsRequest = () => ({
  type: FETCH_PRODUCTS_REQUEST,
});

export const fetchProductsSuccess = (products: Product[]) => ({
  type: FETCH_PRODUCTS_SUCCESS,
  payload: products,
});

export const fetchProductsFailure = (error: string) => ({
  type: FETCH_PRODUCTS_FAILURE,
  payload: error,
});

export const fetchCategoriesRequest = () => ({
  type: FETCH_CATEGORIES_REQUEST,
});

export const fetchCategoriesSuccess = (categories: Category[]) => ({
  type: FETCH_CATEGORIES_SUCCESS,
  payload: categories,
});

export const fetchCategoriesFailure = (error: string) => ({
  type: FETCH_CATEGORIES_FAILURE,
  payload: error,
});

export const fetchAllProducts = (
  filters?: { category?: number; limit?: number; page?: number }
) => {
  return async (dispatch: Dispatch) => {
    dispatch(fetchProductsRequest());
    try {
      const result = await fetchProducts(filters);
      if (result.success && result.data) {
        dispatch(fetchProductsSuccess(result.data));
      } else {
        dispatch(
          fetchProductsFailure(result.error || "Failed to fetch products")
        );
      }
    } catch (error: any) {
      dispatch(fetchProductsFailure(error.message || "Network error"));
    }
  };
};

export const fetchAllCategories = () => {
  return async (dispatch: Dispatch) => {
    dispatch(fetchCategoriesRequest());
    try {
      const result = await fetchCategories();
      if (result.success && result.data) {
        dispatch(fetchCategoriesSuccess(result.data));
      } else {
        dispatch(
          fetchCategoriesFailure(result.error || "Failed to fetch categories")
        );
      }
    } catch (error: any) {
      dispatch(fetchCategoriesFailure(error.message || "Network error"));
    }
  };
};
