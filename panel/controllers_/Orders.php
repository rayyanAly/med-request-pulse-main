<?php
class Orders extends CI_Controller
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

        $this->data['title']            = "Orders - 800 Pharmacy";
        $this->data['subview']          = 'pages/orders';
        $this->data['selected']         = 'orders';
        $this->data['create_order_url'] = site_url('c=orders&m=create');
        $this->data['listing_order_url'] = site_url('c=orders&m=listing');

        $totalOrders      = 0;
        $totalOrdersValue = 0;
        $data             = array(

        );
        $order = $this->orders_m->getOrders($data);

        if ($order['success'] == 1) {

            foreach ($order['data'] as $order) {

                $this->data['orders'][] = array(
                    'order_id'          => $order['order_id_internal'],
                    'order_id_external' => $order['order_id'],
                    'full_name'         => $order['firstname'] . ' ' . $order['lastname'] . '<div class="small-hint">' . $order['telephone'] . '</div>',
                    'date_added'        => $order['date_added'],
                    'total'             => $order['total'],
                    'order_status'      => $order['order_status'],
                    'comission'         => ((strtolower($order['order_status']) == "complete") ? 'AED ' . number_format($order['comission'], 2, '.', ' ') : '--'),
                    'image'             => ((strtolower($order['order_status']) != "new order") ? '<a href="' . site_url('c=orders&m=detail&id=' . $order['order_id']) . '"><img src="' . base_url() . 'theme/images/view-icon.png" /></a>' : ''),
                );


                $totalOrders++;
                $totalOrdersValue += $order['total'];

            }

        } else {
            $this->data['orders'] = false;

        }

        $this->data['total_orders']       = $totalOrders;
        $this->data['total_orders_value'] = number_format($totalOrdersValue, 2, '.', ' ');

        $this->load->view('layouts/_master_layout', array('data' => $this->data));

    }

    public function listing()
    {

        // $data = array(
        //     'start_date' => $this->input->get('start_date'),
        //     'end_date'   => $this->input->get('end_date'),
        // );
        
        $order = $this->orders_m->getOrders(array());

        $totalOrders      = 0;
        $totalOrdersValue = 0;


        if(count($order['data']) > 0){

            foreach ($order['data'] as $order) {
                $orders[] = array(
                    '#' . $order['order_id_internal'],
                    $order['firstname'] . ' ' . $order['lastname'] . '<div class="small-hint">' . $order['telephone'] . '</div>',
                    $order['date_added'],
                    $order['total'],
                    ((strtolower($order['order_status']) == "complete") ? 'AED ' . number_format($order['comission'], 2, '.', ' ') : '--'),
                    $order['order_status'],
                    ((strtolower($order['order_status']) != "new order1") ? '<a href="' . site_url('c=orders&m=detail&id=' . $order['order_id']) . '"><img src="' . base_url() . 'theme/images/view-icon.png" /></a>' : ''),
                );
                $totalOrders++;
                $totalOrdersValue = count($orders);
            }

    }else {
        $orders = [];
    }

        echo json_encode(['data' => $orders]);

    }

    public function create()
    {

        $this->data['title']    = "Create Order - 800 Pharmacy";
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

    public function submit()
    {

        if (null != $this->input->post('products')) {

            foreach (json_decode($this->input->post('products'), true) as $product) {
                $productArray[] = array(
                    'sku'  => $product['id'],
                    'qty'  => $product['quantity'],
                    'name' => $product['name'],
                );
            }

        } else {
            $productArray = false;

        }

        $data = array(
            'first_name'     => '---',
            'last_name'      => '---',
            'contact_number' => $this->input->post('mobile_number'),
            'erx'            => $this->input->post('erx_number'),
            'payment_method' => $this->input->post('payment_method'),
            'with_insurance' => $this->input->post('with_insurance'),
            'comments'       => $this->input->post('notes'),
            'session'        => $this->input->post('session')
        );


        // if(is_uploaded_file($_FILES["prescription"]["tmp_name"])){
        //     $data['prescription'] = $this->orders_m->makecurlfile($_FILES["prescription"]["tmp_name"]);
        // }

        if ($productArray) {
            $data['products'] = json_encode($productArray);
        }

        $response = $this->orders_m->createOrder($data);
        echo json_encode($response);

    }

    public function detail()
    {

        $this->data['title']            = "Order#  - 800 Pharmacy";
        $this->data['subview']          = 'pages/order_detail';
        $this->data['selected']         = 'orders';
        $this->data['create_order_url'] = site_url('c=orders&m=create');

        $orderId = $this->input->get('id');
        $order   = $this->orders_m->getOrder($orderId)['data'];


        $this->data['order_detail'] = array(
            'order_id'       => $order['order_id_internal'],
            'full_name'      => $order['firstname'] . ' ' . $order['lastname'],
            'contact_number' => $order['telephone'],
            'erx'            => $order['erx'],
            'comments'       => $order['comment'],
            'total'          => $order['total'],
            'delivery_date'  => date("d-m-Y", strtotime($order['delivery_date'])),
            'delivery_time'  => $order['delivery_time'],
            'payment_method' => $order['payment_method'],
            'products'       => $order['products'],
            'discount'       => number_format(0, 2, '.', ' '),
            'attachments'    => $order['attachments'],
        );


        if($order['total'] > 0 ){

            foreach ($order['total'] as $total) {

                if ($total['code'] == "total") {
                    $this->data['order_detail']['total'] = number_format($total['value'], 2, '.', ' ');
                }

                if ($total['code'] == "shipping") {
                    $this->data['order_detail']['delivery_charges'] = number_format($total['value'], 2, '.', ' ');
                }

                if ($total['code'] == "sub_total") {
                    $this->data['order_detail']['sub_total'] = number_format($total['value'], 2, '.', ' ');
                }

                if ($total['code'] == "discount") {
                    $this->data['order_detail']['discount'] = number_format($total['value'], 2, '.', ' ');
                }
            }
        }



        $this->load->view('layouts/_master_layout', array('data' => $this->data));

    }

    public function createorder()
    {

        $this->data['title']    = "Create Order - 800 Pharmacy";
        $this->data['selected'] = 'orders-create';

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

        $this->data['products']         = json_encode($productsData);
        $this->data['submission_url']   = site_url("c=orders&m=submit");
        $this->data['delivery_charges'] = get_delivery_charges();
        $this->data['success_url']      = site_url('c=orders');
        $this->data['subview']          = 'pages/create_order_with_products';
        $this->load->view('layouts/_master_layout', array('data' => $this->data));

    }


    public function createtemp(){

        $data = array(
            'session' => $this->input->post('session')
        );

        if(is_uploaded_file($_FILES["prescription"]["tmp_name"])){

            $path_parts = pathinfo($_FILES["prescription"]["name"]);
            $extension = $path_parts['extension'];
            $data['extension'] = $extension;

            $data['prescription'] = $this->orders_m->makecurlfile($_FILES["prescription"]["tmp_name"]);
        }

         echo json_encode($this->orders_m->createTemp($data));
    }

    public function deletetemp(){

      $data = array(
            'session' => $this->input->get('session'),
            'id'    => $this->input->get('id')
        );
     echo json_encode($this->orders_m->deleteTemp($data));   
    }

}
