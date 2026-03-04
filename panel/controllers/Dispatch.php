<?php
class Dispatch extends CI_Controller
{

    public function __construct()
    {
        parent::__construct();
        $this->load->model('OrderMd', 'orders_m');
        $this->load->model('ProductMd', 'products_m');
        $this->load->model('CustomerMd', 'customers_m');

    }


    public function index()
    {

        $this->data['title']            = "Dispatch";
        $this->data['subview']          = 'pages/dispatch';
        $this->data['selected']         = 'dispatch';
        
        $this->load->view('layouts/_master_layout', array('data' => $this->data));

    }


}