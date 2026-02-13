import {
  FETCH_CONVERSATIONS_REQUEST,
  FETCH_CONVERSATIONS_SUCCESS,
  FETCH_CONVERSATIONS_FAILURE,
  FETCH_MESSAGE_TOTALS_REQUEST,
  FETCH_MESSAGE_TOTALS_SUCCESS,
  FETCH_MESSAGE_TOTALS_FAILURE,
  FETCH_DEPARTMENTS_REQUEST,
  FETCH_DEPARTMENTS_SUCCESS,
  FETCH_DEPARTMENTS_FAILURE,
  FETCH_AGENTS_REQUEST,
  FETCH_AGENTS_SUCCESS,
  FETCH_AGENTS_FAILURE,
  FETCH_CUSTOMERS_REQUEST,
  FETCH_CUSTOMERS_SUCCESS,
  FETCH_CUSTOMERS_FAILURE,
} from '../constants/whatsappConstants';
import { WhatsAppConversation } from '../types';
import { fetchConversationsAPI, fetchMessageTotalsAPI, fetchDepartmentsAPI, fetchAgentsAPI, fetchCustomersAPI } from '../api';

export const fetchConversations = () => {
  return async (dispatch: any) => {
    dispatch({ type: FETCH_CONVERSATIONS_REQUEST });
    try {
      const conversations: WhatsAppConversation[] = await fetchConversationsAPI();
      dispatch({ type: FETCH_CONVERSATIONS_SUCCESS, payload: conversations });
    } catch (error: any) {
      dispatch({ type: FETCH_CONVERSATIONS_FAILURE, payload: error.message });
    }
  };
};

export const fetchMessageTotals = () => {
  return async (dispatch: any) => {
    dispatch({ type: FETCH_MESSAGE_TOTALS_REQUEST });
    try {
      const totals = await fetchMessageTotalsAPI();
      dispatch({ type: FETCH_MESSAGE_TOTALS_SUCCESS, payload: totals });
    } catch (error: any) {
      dispatch({ type: FETCH_MESSAGE_TOTALS_FAILURE, payload: error.message });
    }
  };
};

export const fetchDepartments = () => {
  return async (dispatch: any) => {
    dispatch({ type: FETCH_DEPARTMENTS_REQUEST });
    try {
      const departments = await fetchDepartmentsAPI();
      dispatch({ type: FETCH_DEPARTMENTS_SUCCESS, payload: departments.data });
    } catch (error: any) {
      dispatch({ type: FETCH_DEPARTMENTS_FAILURE, payload: error.message });
    }
  };
};

export const fetchAgents = () => {
  return async (dispatch: any) => {
    dispatch({ type: FETCH_AGENTS_REQUEST });
    try {
      const agents = await fetchAgentsAPI();
      dispatch({ type: FETCH_AGENTS_SUCCESS, payload: agents.data });
    } catch (error: any) {
      dispatch({ type: FETCH_AGENTS_FAILURE, payload: error.message });
    }
  };
};

export const fetchCustomers = (page: number = 1, search: string = '', filter: 'all' | 'crm' = 'all') => {
  return async (dispatch: any) => {
    dispatch({ type: FETCH_CUSTOMERS_REQUEST });
    try {
      const customers = await fetchCustomersAPI(page, search, filter);
      dispatch({ type: FETCH_CUSTOMERS_SUCCESS, payload: customers });
    } catch (error: any) {
      dispatch({ type: FETCH_CUSTOMERS_FAILURE, payload: error.message });
    }
  };
};