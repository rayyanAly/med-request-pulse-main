<?php
require_once APPPATH.'/libraries/api/APIManager.php';

class CustomerMd extends APIManager {

    function login($data){
        $this->login($data['username'], $data['password']);

    }


    function getCustomers(){
		return $this->getCustomers();    	
    }

}
