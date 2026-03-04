<?php
class Customers extends CI_Controller
{

    public function __construct()
    {
        parent::__construct();
        $this->load->model('CustomerMd', 'customers_m');

    }

    public function index()
    {

        $this->data['title']            = "Customrs - Mediclinic Middle East";
        $this->data['subview']          = 'pages/customers';
        $this->data['selected']         = 'customers';
        $this->data['create_customer_url'] = site_url('c=customers&m=create');
        $this->data['listing_customer_url'] = site_url('c=customers&m=listing');

        $totalOrders      = 0;
        $totalOrdersValue = 0;
        $data             = array(
        );
        $customers = $this->customers_m->getCustomers($data);

        $this->data['total_orders']       = $totalOrders;
        $this->data['total_orders_value'] = number_format($totalOrdersValue, 2, '.', ' ');

        $this->load->view('layouts/_master_layout', array('data' => $this->data));

    }

    public function listing()
    {

        
        $customers = $this->customers_m->getCustomers(array());

        $totalCustomers      = 0;
        $totalCustomersValue = 0;


        if(count($customers['data']) > 0){

            foreach ($customers['data'] as $customer) {
                
                $customerList[] = array(
                    $customer['id'],
                    $customer['first_name']. ' ' . $customer['last_name'],
                    $customer['phone'],
                    $customer['mrn_number'],
                    date("Y-m-d", strtotime($customer['date_added'])),
                    $customer['total_orders'],
                    '<a href="javascript: void(0)" onclick="openModal('.$customer['id'].')"><img src="' . base_url() . 'theme/images/view-icon.png" /></a>&nbsp;&nbsp;<select class="select-box"><option value="0">Actions</option><option value="1">Disable</option><option value="0">Edit</option><option value="0">Delete</option></select>'

                );
                $totalCustomers++;
                $totalCustomersValue = count($customerList);
            }

    }else {
        $customerList = [];
    }

        echo json_encode(['data' => $customerList]);

    }

    public function create()
    {

        $this->data['title']    = "Create Customer - Mediclinic Middle East";
        $this->data['selected'] = 'orders-create';
        $this->data['current_session'] = time();
        $this->data['temp_image_url'] = site_url('c=orders&m=createtemp');
        $this->data['delete_temp_image_url'] = site_url('c=orders&m=deletetemp');

        $products = $this->products_m->getProducts();
        if ($products) {

            foreach ($products['data'] as $product) {

                $productsData[] = array(
                    'id'        => $product['sku'],
                    'name'      => $product['name'],
                    'full_name' => $product['name'] . ' - ' . $product['sku'],
                    'price'     => $product['price'],
                    'image'     => $product['image'],

                );

            }

        }


        $this->data['products'] = json_encode($productsData);
        $this->data['create_detail_order_url'] = site_url("c=orders&m=createorder");
        $this->data['submission_url']          = site_url("c=orders&m=submit");
        $this->data['delivery_charges']        = get_delivery_charges();
        $this->data['success_url']             = site_url('c=orders');
        $this->data['subview']                 = 'pages/new_order';
        $this->load->view('layouts/_master_layout', array('data' => $this->data));



    }




}