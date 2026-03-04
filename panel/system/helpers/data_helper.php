<?php

function post_data($variable){
  $CI = &get_instance();
  return $CI->input->post($variable);
}

function get_data($variable){
  $this->_CI = &get_instance();
  return $CI->input->get($variable);
}

function set_value_for_empty($value, $default){
  return (($value == "" ? $default : $value));
}



function get_language(){

	$CI =  &get_instance();
	return (($CI->session->userdata('UserLanguage') == "arabic") ? 2 : 1);
}




function get_color_for_notifications($warning){


	if($warning == "general")
		return "#64b056";
	else if($warning == "information")
		return "#64b056";
	else if($warning == "warning")
		return "#e05553";
	else if($warning == "reminder")
		return "#dea254";
	else return "#64b056";

}