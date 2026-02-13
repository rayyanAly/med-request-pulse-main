// Redux Types - Centralized type definitions for Redux state and actions

import type {
  LoginResponse,
  Order,
  Product,
  Category,
  Customer,
  DashboardStats,
} from "../api/types";

// ==================== Login/Auth State ====================

export interface LoginState {
  user: LoginResponse["data"] | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

export interface LoginAction {
  type: string;
  payload?: any;
}

// ==================== Order State ====================

export interface OrderState {
  loading: boolean;
  orders: Order[];
  singleOrder: Order | null;
  error: string;
  createOrderLoading: boolean;
  createOrderSuccess: boolean;
  createOrderError: string | null;
  createdOrder: any | null;
}

export interface OrderAction {
  type: string;
  payload?: any;
}

// ==================== Product State ====================

export interface ProductState {
  loading: boolean;
  products: Product[];
  error: string | null;
}

export interface ProductAction {
  type: string;
  payload?: any;
}

// ==================== Category State ====================

export interface CategoryState {
  loading: boolean;
  categories: Category[];
  error: string | null;
}

export interface CategoryAction {
  type: string;
  payload?: any;
}

// ==================== Customer State ====================

export interface CustomerState {
  loading: boolean;
  customers: Customer[];
  singleCustomer: Customer | null;
  error: string | null;
}

export interface CustomerAction {
  type: string;
  payload?: any;
}

// ==================== Root State ====================

export interface RootState {
  login: LoginState;
  orders: OrderState;
  products: ProductState;
  // Add more states as needed
}

// ==================== Dashboard State ====================

export interface DashboardState {
  stats: DashboardStats | null;
  loading: boolean;
  error: string | null;
}

export interface DashboardAction {
  type: string;
  payload?: any;
}

// ==================== Action Types ====================

// Login Actions
export const LOGIN_REQUEST = "LOGIN_REQUEST";
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGIN_FAILURE = "LOGIN_FAILURE";
export const LOGOUT = "LOGOUT";

// Order Actions
export const FETCH_ORDERS_REQUEST = "FETCH_ORDERS_REQUEST";
export const FETCH_ORDERS_SUCCESS = "FETCH_ORDERS_SUCCESS";
export const FETCH_ORDERS_FAILURE = "FETCH_ORDERS_FAILURE";
export const FETCH_SINGLE_ORDER_REQUEST = "FETCH_SINGLE_ORDER_REQUEST";
export const FETCH_SINGLE_ORDER_SUCCESS = "FETCH_SINGLE_ORDER_SUCCESS";
export const FETCH_SINGLE_ORDER_FAILURE = "FETCH_SINGLE_ORDER_FAILURE";
export const CREATE_ORDER_REQUEST = "CREATE_ORDER_REQUEST";
export const CREATE_ORDER_SUCCESS = "CREATE_ORDER_SUCCESS";
export const CREATE_ORDER_FAILURE = "CREATE_ORDER_FAILURE";
export const CREATE_ORDER_RESET = "CREATE_ORDER_RESET";

// Product Actions
export const FETCH_PRODUCTS_REQUEST = "FETCH_PRODUCTS_REQUEST";
export const FETCH_PRODUCTS_SUCCESS = "FETCH_PRODUCTS_SUCCESS";
export const FETCH_PRODUCTS_FAILURE = "FETCH_PRODUCTS_FAILURE";

// Category Actions
export const FETCH_CATEGORIES_REQUEST = "FETCH_CATEGORIES_REQUEST";
export const FETCH_CATEGORIES_SUCCESS = "FETCH_CATEGORIES_SUCCESS";
export const FETCH_CATEGORIES_FAILURE = "FETCH_CATEGORIES_FAILURE";

// Dashboard Actions
export const FETCH_DASHBOARD_STATS_REQUEST = "FETCH_DASHBOARD_STATS_REQUEST";
export const FETCH_DASHBOARD_STATS_SUCCESS = "FETCH_DASHBOARD_STATS_SUCCESS";
export const FETCH_DASHBOARD_STATS_FAILURE = "FETCH_DASHBOARD_STATS_FAILURE";
