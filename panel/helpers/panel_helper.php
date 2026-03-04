<?php

function get_partner_id(){

	$CI = get_instance();
	$data = $CI->session->userdata('partner_data');
	return  $data['partner_id'];
}


function get_partner_id_int(){

	$CI = get_instance();
	$data = $CI->session->userdata('partner_data');
	return  $data['id'];
}


function get_partner_session(){

	$CI = get_instance();
	$data = $CI->session->userdata('partner_data');
	return $data['partner_session'];

}



function get_user_id(){


	$CI = get_instance();
	$data  = $CI->session->userdata('partner_data');

	if(isset($data['user_id']) && $data['user_id'] > 0 ){
    	return $data['user_id'];
    }else {
    	return 0;
    }

}


function get_partner_logo(){

	$CI = get_instance();
	$data = $CI->session->userdata('partner_data');
	return $data['store_logo'];

}

function get_partner_name(){

	$CI = get_instance();
	$data = $CI->session->userdata('partner_data');
	return $data['partner_name'];

}


function get_delivery_charges(){

	$CI = get_instance();
	$data = $CI->session->userdata('partner_data');
	return $data['delivery_charges'];

}


function format_date($date){
	$time = strtotime($date);

	return '<span class="date-color">' . date("H:i", $time) . '</span><br ><span class="day-color"> ' . date("d M", $time) . '</span>';
}








// Array
// (
// [partner_id] => a6ce23b3-ccd1-11ea-8d63-a4bf0127a71a
// [partner_session] => 1f5f2f64-0314-11eb-806b-a4bf0127a71a
// [partner_name] => HeathAtHand
// [store_name] => Health at Hand
// [store_status] => enabled
// [user_name] => healthathand
// [whatsapp_number] =>
// [store_logo] => https://www.healthmagazine.ae/wp-content/uploads/2018/06/healthathand2.jpg
// [store_phone] =>
// )