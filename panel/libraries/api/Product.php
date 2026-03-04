<?php
require_once APPPATH . '/libraries/api/API.php';

class Product extends API
{

    private $url = array();

    public function __construct()
    {
        $this->url = array(
            'get_products'   => 'products'
        );
    }


    public function getProducts()
    {

        $orders = $this->callEndpoint('GET', $this->url['get_products'], false);
        return $orders;

    }



    public function getProduct($id)
    {

        $orders = $this->callEndpoint('GET', $this->url['get_products'] . "&id=" . $id, false);
        return $orders;

    }


}
