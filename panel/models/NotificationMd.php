<?php
require_once APPPATH.'/libraries/api/APIManager.php';

class NotificationMd extends APIManager {

    function getNotificationSettings($data){
        return $this->notification->getNotificationSettings($data);

    }

}
