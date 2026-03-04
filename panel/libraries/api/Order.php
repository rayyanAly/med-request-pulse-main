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
            'temp_image'   => 'orders&m=upload_temp',
            'delete_temp'   => 'orders&m=delete_temp',
            'update_change' => 'orders&m=update_status',
            'add_product' => 'orders&m=addproduct',
            'delete_product' => 'orders&m=deleteproduct',
            'cancel_order' => 'orders&m=cancel',
        'order_exists' => 'orders&m=order_exists'

        );
    }

    public function createOrder($data)
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

    public function createTemp($data){

        $response = $this->callEndpoint('POST', $this->url['temp_image'], $data);
        return $response;
    }


    public function deleteTemp($data){

        $response = $this->callEndpoint('GET', $this->url['delete_temp'], $data, false);
        return $response;
    }


    public function updateStatus($data){

        $response = $this->callEndpoint('POST', $this->url['update_change'], $data);
        return $response;
    }


    public function addProduct($data){

        $response = $this->callEndpoint('POST', $this->url['add_product'], $data);
        return $response;
    }

    public function deleteProduct($data){

        $response = $this->callEndpoint('POST', $this->url['delete_product'], $data);
        return $response;
    }

    public function cancelOrder($data){

        $response = $this->callEndpoint('POST', $this->url['cancel_order'], $data);
        return $response;
    }



	public function orderExists($order_id){

        $order = $this->callEndpoint('GET', $this->url['order_exists'] . '&id=' . $order_id, false);
        return $order;

    }
    

}
