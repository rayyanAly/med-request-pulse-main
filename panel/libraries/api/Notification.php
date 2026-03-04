<?php
require_once APPPATH . '/libraries/api/API.php';

class Notification extends API
{

    private $url = array();

    public function __construct()
    {
        $this->url = array(
            'get_notification_settings'   => 'notification'
        );
    }

    public function getNotificationSettings($data)
    {

        $notificationSettings = $this->callEndpoint('GET', $this->url['get_notification_settings'], $data,false);
    
        return $notificationSettings;

    }


}
