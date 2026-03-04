<?php

function l($value){
    $CI = &get_instance();
    return $CI->lang->line($value);
}


function ld($value){
    $CI = &get_instance();
    echo $CI->lang->line($value);
}


function d($value){
    echo $value;
}


