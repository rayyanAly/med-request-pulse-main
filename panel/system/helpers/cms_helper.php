<?php

function is_admin(){
    $CI = &get_instance();
    if (!$CI->session->userdata('is_admin')){
    	redirect(site_url('common/login'));
    }

}
