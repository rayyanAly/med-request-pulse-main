<?php
require_once APPPATH.'/libraries/api/APIManager.php';

class UserMd extends APIManager {

    function getUsers($data){
        return $this->users->getUsers($data);

    }

}
