import { Dispatch } from "redux";
import { fetchOrders, fetchSingleOrder, createOrder, fetchDashboardStats, cancelOrder } from "@/api/orderApi";
import { Order, CreateOrderRequest, OrderFiles, CancelOrderRequest } from "@/api/types";
import {
  FETCH_ORDERS_REQUEST,
  FETCH_ORDERS_SUCCESS,
  FETCH_ORDERS_FAILURE,
  FETCH_SINGLE_ORDER_REQUEST,
  FETCH_SINGLE_ORDER_SUCCESS,
  FETCH_SINGLE_ORDER_FAILURE,
  CREATE_ORDER_REQUEST,
  CREATE_ORDER_SUCCESS,
  CREATE_ORDER_FAILURE,
  CREATE_ORDER_RESET,
  CANCEL_ORDER_REQUEST,
  CANCEL_ORDER_SUCCESS,
  CANCEL_ORDER_FAILURE,
} from "../constants/orderConstants";

export const fetchOrdersRequest = () => ({
  type: FETCH_ORDERS_REQUEST,
});

export const fetchOrdersSuccess = (orders: Order[]) => ({
  type: FETCH_ORDERS_SUCCESS,
  payload: orders,
});

export const fetchOrdersFailure = (error: string) => ({
  type: FETCH_ORDERS_FAILURE,
  payload: error,
});

export const fetchSingleOrderRequest = () => ({
  type: FETCH_SINGLE_ORDER_REQUEST,
});

export const fetchSingleOrderSuccess = (order: Order) => ({
  type: FETCH_SINGLE_ORDER_SUCCESS,
  payload: order,
});

export const fetchSingleOrderFailure = (error: string) => ({
  type: FETCH_SINGLE_ORDER_FAILURE,
  payload: error,
});

export const createOrderRequest = () => ({
  type: CREATE_ORDER_REQUEST,
});

export const createOrderSuccess = (order: any) => ({
  type: CREATE_ORDER_SUCCESS,
  payload: order,
});

export const createOrderFailure = (error: string) => ({
  type: CREATE_ORDER_FAILURE,
  payload: error,
});

export const createOrderReset = () => ({
  type: CREATE_ORDER_RESET,
});

export const fetchAllOrders = () => {
  return async (dispatch: Dispatch) => {
    dispatch(fetchOrdersRequest());
    try {
      const result = await fetchOrders();
      if (result.success) {
        const orders = Array.isArray(result.data)
          ? result.data
          : result.data
          ? [result.data]
          : [];
        dispatch(fetchOrdersSuccess(orders));
      } else {
        console.error("Failed to fetch orders:", result.message);
        dispatch(
          fetchOrdersFailure(result.message || "Failed to fetch orders")
        );
      }
    } catch (error: any) {
      console.error("Network error fetching orders:", error);
      dispatch(fetchOrdersFailure(error.message || "Network error"));
    }
  };
};

export const fetchOrderById = (orderId: string) => {
  return async (dispatch: Dispatch) => {
    dispatch(fetchSingleOrderRequest());
    try {
      const result = await fetchSingleOrder(orderId);
      if (result.success) {
        dispatch(fetchSingleOrderSuccess(result.data!));
      } else {
        dispatch(
          fetchSingleOrderFailure(result.message || "Failed to fetch order")
        );
      }
    } catch (error: any) {
      dispatch(fetchSingleOrderFailure(error.message || "Network error"));
    }
  };
};

export const createNewOrder = (
  orderData: CreateOrderRequest,
  files: OrderFiles = {}
) => {
  return async (dispatch: Dispatch) => {
    dispatch(createOrderRequest());
    try {
      const result = await createOrder(orderData, files);
      if (result.success) {
        dispatch(createOrderSuccess(result.data));
        return { success: true, data: result.data };
      } else {
        dispatch(createOrderFailure(result.message || "Failed to create order"));
        return { success: false, message: result.message };
      }
    } catch (error: any) {
      dispatch(createOrderFailure(error.message || "Network error"));
      return { success: false, message: error.message };
    }
  };
};

export const loadDashboardStats = () => {
  return async (dispatch: Dispatch) => {
    try {
      const result = await fetchDashboardStats();
      if (result.success && result.data) {
        return { success: true, data: result.data };
      }
      return { success: false, message: result.message };
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  };
};

// Cancel Order Actions
export const cancelOrderRequest = () => ({
  type: CANCEL_ORDER_REQUEST,
});

export const cancelOrderSuccess = (data: { order_id: string; status: string }) => ({
  type: CANCEL_ORDER_SUCCESS,
  payload: data,
});

export const cancelOrderFailure = (error: string) => ({
  type: CANCEL_ORDER_FAILURE,
  payload: error,
});

export const cancelOrderById = (orderId: string, cancelKey: string) => {
  return async (dispatch: Dispatch) => {
    dispatch(cancelOrderRequest());
    try {
      const result = await cancelOrder({ id: orderId, cancel_key: cancelKey });
      if (result.success && result.data) {
        dispatch(cancelOrderSuccess(result.data));
        return { success: true, data: result.data };
      } else {
        dispatch(cancelOrderFailure(result.message || "Failed to cancel order"));
        return { success: false, message: result.message };
      }
    } catch (error: any) {
      dispatch(cancelOrderFailure(error.message || "Network error"));
      return { success: false, message: error.message };
    }
  };
};
