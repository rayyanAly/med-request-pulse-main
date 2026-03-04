<?php
require_once APPPATH . '/libraries/api/API.php';

class Order extends API
{

    private $url = array();

    public function __construct()
    {
        $this->url = array(
            'get_orders'   => 'orders&m=index',
            'create_order' => 'orders&m=create',
        );
    }

    public function createUser($data)
    {

        $response = $this->callEndpoint('POST', $this->url['create_order'], $data);
        return $response;
    }

    public function getOrders($data)
    {

        $orders = $this->callEndpoint('GET', $this->url['get_orders'], $data,false);
    
        return $orders;

    }


    public function getOrder($order_id){

        $order = $this->callEndpoint('GET', $this->url['get_orders'] . '&id=' . $order_id, false);
        return $order;

    }



}
