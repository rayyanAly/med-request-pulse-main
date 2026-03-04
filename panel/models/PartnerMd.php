<?php
require_once APPPATH . '/libraries/api/APIManager.php';

class PartnerMd extends APIManager
{

    public function login($data)
    {

        $response = $this->partner->login($data);
    

        if ($response['success'] == 1) {
        	return $response;

        } else {
        	return false;

        }

    }


    function getUsers($data){
        return $this->partner->getUsers($data);

    }

    function createUser($data){
        return $this->partner->createUser($data);
    }


    function getUser($data){
        return $this->partner->getUser($data);        
    }

    function getWithdrawals($data){
        return $this->partner->getWithdrawals($data);

    }

}

