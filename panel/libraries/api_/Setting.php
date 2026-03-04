<?php
require_once APPPATH . '/libraries/api/API.php';

class Setting extends API
{

    private $url = array();

    public function __construct()
    {
        $this->url = array(
            'get_notifications'   => 'setting',
        );
    }



    public function getNotificationSetting($data)
    {

        $notification = $this->callEndpoint('GET', $this->url['get_notifications'], $data,false);
        return $notification;

    }


    public function updateNotificationSetting($data){
        $response = $this->callEndpoint('POST', $this->url['get_notifications'], $data);
        return $response;
    }


}
