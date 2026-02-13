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
  SET_ALL_CUSTOMERS_CACHE,
} from '../constants/whatsappConstants';
import { WhatsAppConversation, CustomersResponse } from '../types';

interface WhatsAppState {
  conversations: WhatsAppConversation[];
  loading: boolean;
  error: string | null;
  messageTotals: {
    total_sent: number;
    total_delivered: number;
    total_read: number;
    today_total_sent: number;
    today_total_delivered: number;
    today_total_read: number;
  } | null;
  totalsLoading: boolean;
  totalsError: string | null;
  departments: any[];
  departmentsLoading: boolean;
  departmentsError: string | null;
  agents: any[];
  agentsLoading: boolean;
  agentsError: string | null;
  customers: CustomersResponse | null;
  customersLoading: boolean;
  customersError: string | null;
  allCustomersCache: any[];
}

const initialState: WhatsAppState = {
  conversations: [],
  loading: false,
  error: null,
  messageTotals: null,
  totalsLoading: false,
  totalsError: null,
  departments: [],
  departmentsLoading: false,
  departmentsError: null,
  agents: [],
  agentsLoading: false,
  agentsError: null,
  customers: null,
  customersLoading: false,
  customersError: null,
  allCustomersCache: [],
};

const whatsappReducer = (state = initialState, action: any): WhatsAppState => {
  switch (action.type) {
    case FETCH_CONVERSATIONS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_CONVERSATIONS_SUCCESS:
      return {
        ...state,
        loading: false,
        conversations: action.payload,
      };
    case FETCH_CONVERSATIONS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case FETCH_MESSAGE_TOTALS_REQUEST:
      return {
        ...state,
        totalsLoading: true,
        totalsError: null,
      };
    case FETCH_MESSAGE_TOTALS_SUCCESS:
      return {
        ...state,
        totalsLoading: false,
        messageTotals: action.payload,
      };
    case FETCH_MESSAGE_TOTALS_FAILURE:
      return {
        ...state,
        totalsLoading: false,
        totalsError: action.payload,
      };
    case FETCH_DEPARTMENTS_REQUEST:
      return {
        ...state,
        departmentsLoading: true,
        departmentsError: null,
      };
    case FETCH_DEPARTMENTS_SUCCESS:
      return {
        ...state,
        departmentsLoading: false,
        departments: action.payload,
      };
    case FETCH_DEPARTMENTS_FAILURE:
      return {
        ...state,
        departmentsLoading: false,
        departmentsError: action.payload,
      };
    case FETCH_AGENTS_REQUEST:
      return {
        ...state,
        agentsLoading: true,
        agentsError: null,
      };
    case FETCH_AGENTS_SUCCESS:
      return {
        ...state,
        agentsLoading: false,
        agents: action.payload,
      };
    case FETCH_AGENTS_FAILURE:
      return {
        ...state,
        agentsLoading: false,
        agentsError: action.payload,
      };
    case FETCH_CUSTOMERS_REQUEST:
      return {
        ...state,
        customersLoading: true,
        customersError: null,
      };
    case FETCH_CUSTOMERS_SUCCESS:
      return {
        ...state,
        customersLoading: false,
        customers: action.payload,
      };
    case FETCH_CUSTOMERS_FAILURE:
      return {
        ...state,
        customersLoading: false,
        customersError: action.payload,
      };
    case SET_ALL_CUSTOMERS_CACHE:
      return {
        ...state,
        allCustomersCache: action.payload,
      };
    default:
      return state;
  }
};

export default whatsappReducer;