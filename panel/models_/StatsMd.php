<?php
require_once APPPATH.'/libraries/api/APIManager.php';

class StatsMd extends APIManager {

    function getDashboardStats($data){
        return $this->stats->getDashboardStats($data);

    }

}
