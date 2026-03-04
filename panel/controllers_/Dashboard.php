<?php
class Dashboard extends CI_Controller
{

    public function __construct()
    {
        parent::__construct();
        $this->load->model('StatsMd', 'stats_m');


    }

    public function index(){

        $this->data['title'] = "Dashboard - 800 Pharmacy";
        $this->data['selected'] = 'dashboard';

        $parameters = array();
        $data = $this->stats_m->getDashboardStats($parameters)['data'];

        if(!isset($data['total_sale'])){

            $this->data['stats'] = array(
            'total_sale' => 'AED ' . number_format(0, 2, '.', ' '),
            'total_orders' => 0,
            'total_customers' => 0,
            'average_value' => 'AED ' . number_format(0, 2, '.', ' '),
            );

        }else {

            $counter = 1;
            foreach($data['sale_by_products'] as $prod){

                if($counter < 5){
                    $products[] = $prod;
                }
                
                $counter++;

            }

            $this->data['stats'] = array(
            'total_sale' => 'AED ' . number_format($data['total_sale'], 2, '.', ' '),
            'total_orders' => $data['total_orders'],
            'total_customers' => $data['total_customers'],
            'average_value' => 'AED ' . number_format($data['average_value'], 2, '.', ' '),
            'products' => array()//$products
            );

        }
        

        $this->data['subview'] = 'pages/dashboard';
    	$this->load->view('layouts/_master_layout', array('data' => $this->data));

    }

}
