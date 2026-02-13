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
import { Template, TemplateUsage } from '../types';
import { fetchTemplatesAPI, fetchTemplateUsageAPI, sendTemplateAPI, sendTemplateToNumberAPI } from '../api';

export const fetchTemplates = () => {
  return async (dispatch: any) => {
    dispatch({ type: FETCH_TEMPLATES_REQUEST });
    try {
      const templates: Template[] = await fetchTemplatesAPI();
      dispatch({ type: FETCH_TEMPLATES_SUCCESS, payload: templates });
    } catch (error: any) {
      dispatch({ type: FETCH_TEMPLATES_FAILURE, payload: error.message });
    }
  };
};

export const fetchTemplateUsage = () => {
  return async (dispatch: any) => {
    dispatch({ type: FETCH_TEMPLATE_USAGE_REQUEST });
    try {
      const usage: TemplateUsage[] = await fetchTemplateUsageAPI();
      dispatch({ type: FETCH_TEMPLATE_USAGE_SUCCESS, payload: usage });
    } catch (error: any) {
      dispatch({ type: FETCH_TEMPLATE_USAGE_FAILURE, payload: error.message });
    }
  };
};

export const sendTemplate = (templateId: string, customerId: string) => {
  return async (dispatch: any) => {
    dispatch({ type: SEND_TEMPLATE_REQUEST });
    try {
      await sendTemplateAPI(templateId, customerId);
      dispatch({ type: SEND_TEMPLATE_SUCCESS });
    } catch (error: any) {
      dispatch({ type: SEND_TEMPLATE_FAILURE, payload: error.message });
    }
  };
};

export const sendTemplateToNumber = (templateName: string, language: string, phoneNumber: string, params: string[], buttonParams?: any) => {
  return async (dispatch: any) => {
    dispatch({ type: SEND_TEMPLATE_TO_NUMBER_REQUEST });
    try {
      await sendTemplateToNumberAPI(templateName, language, phoneNumber, params, buttonParams);
      dispatch({ type: SEND_TEMPLATE_TO_NUMBER_SUCCESS });
    } catch (error: any) {
      dispatch({ type: SEND_TEMPLATE_TO_NUMBER_FAILURE, payload: error.message });
    }
  };
};