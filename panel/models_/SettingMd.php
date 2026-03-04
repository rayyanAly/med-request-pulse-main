<?php
require_once APPPATH.'/libraries/api/APIManager.php';

class SettingMd extends APIManager {

    function getNotificationSetting($data){
        return $this->setting->getNotificationSetting($data);

    }

    function updateNotificationSetting($data){
    	return $this->setting->updateNotificationSetting($data);

    }

}
