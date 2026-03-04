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

        $this->data['title']            = "Orders";
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

         $data = array(
             'start_date' => $this->input->get('start_date'),
             'end_date'   => $this->input->get('end_date'),
         );
        
        $order = $this->orders_m->getOrders($data);
           

        $totalOrders      = 0;
        $totalOrdersValue = 0;


        if(count($order['data']) > 0){

            foreach ($order['data'] as $order) {
                $orders[] = array(
                    '#' . $order['order_id_internal'],
                    $order['firstname'] . ' ' . $order['lastname'] . '<div class="small-hint">' . $order['telephone'] . '</div>',
                    number_format($order['total'], 2, '.', ' '),
                    $order['order_status'],
                    $order['date_added'],
                	$order['agent_name'],
                	$order['prepared_at'],
                	$order['dispatched'],
                	$order['delivered_at'],
                    ((strtolower($order['order_status']) != "new order1") ? '<a href="' . site_url('c=orders&m=detail&id=' . $order['order_id'].'&i='.$order['order_id_internal']) . '"><img src="' . base_url() . 'theme/images/view-icon.png" /></a>' : ''),
                );
                $totalOrders++;
                $totalOrdersValue = count($orders);
            }

    }else {
        $orders = [];
    }

        echo json_encode(['data' => $orders]);

    }



	public function listorders()
    {

        $this->data['title']            = "Orders";
        $this->data['subview']          = 'pages/listorders';
        $this->data['selected']         = 'orders-list';
        $this->data['listing_order_url'] = site_url('c=orders&m=listingorders');

        $totalOrders      = 0;
        $totalOrdersValue = 0;
        $data             = array(
                                  'start_date' => $this->input->get('startdate'),
                                  'end_date'   => $this->input->get('enddate'),
                                  "user_id" => get_user_id());
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
                    'image'             => ((strtolower($order['order_status']) != "new order") ? '<a href="' . site_url('c=orders&m=detail&id=' . $order['order_id'].'&i='.$order['order_id_internal']) . '"><img src="' . base_url() . 'theme/images/view-icon.png" /></a>' : '')
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




	public function listingorders()
    {

      $data             = array(
                                'start_date' => $this->input->get('startdate'),
                                'end_date'   => $this->input->get('enddate'),
                                "user_id" => get_user_id(),
                            );

        $order = $this->orders_m->getOrders($data);

        $totalOrders      = 0;
        $totalOrdersValue = 0;


        if(count($order['data']) > 0){
        


            foreach ($order['data'] as $order) {

                $orders[] = array(
                    $order['order_id_internal'],
                    $order['firstname'] . ' ' . $order['lastname'] . '<div class="small-hint">' . $order['telephone'] . '</div>',
                    number_format($order['total'], 2, '.', ' '),
                	$order['date_added'],
                   	$order['agent_name'],
                	$order['prepared_at'],
                	$order['dispatched'],
                	$order['delivered_at'],
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

        $this->data['title']    = "Create Order";
        $this->data['selected'] = 'orders-create';
        $this->data['current_session'] = time();
        $this->data['temp_image_url'] = site_url('c=orders&m=createtemp');
        $this->data['delete_temp_image_url'] = site_url('c=orders&m=deletetemp');
        $this->data['login_url'] = site_url('c=login');

        $products = $this->products_m->getProducts();
        if ($products) {

            foreach ($products['data'] as $product) {

                $productsData[] = array(
                    'id'        => $product['sku'],
                    'name'      => $product['name'],
                    'full_name' => $product['name'] . ' (' . $product['pharmacy_generic_name'] .') - ' . $product['sku'],
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
            'session'        => $this->input->post('session'),
        	'user_id'		 => get_user_id()
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

        $this->data['title']                = "Order#";
        $this->data['subview']              = 'pages/order_detail';
        $this->data['selected']             = 'orders';
        $this->data['create_order_url']     = site_url('c=orders&m=create');
        $this->data['change_status_url']    = site_url('c=orders&m=updatestatus');
        $this->data['confirmation_url']     = site_url('c=orders');
        $this->data['add_product_url']      = site_url('c=orders&m=addproduct');
        $this->data['delete_product_url']   = site_url('c=orders&m=deleteproduct');
        $this->data['cancel_order_url']     = site_url('c=orders&m=cancelorder');


        $orderId = $this->input->get('i');
        $order   = $this->orders_m->getOrder($orderId)['data'];
    
    
        /*
        Array ( [order_id] => 7234ff3c-8020-11eb-83ff-a4bf0127a71a [order_id_internal] => 224613 
        [firstname] => Ritesh [lastname] => Kumar [email] => riteshfd@gmail.com [telephone] => +971585723001 
        [payment_method] => Cash On Delivery [payment_status] => pending [payment_reference] => 
        [shipping_method] => Flat Shipping Rate [shipping_lat] => [shipping_lng] => 
        [comment] => [currency_code] => AED [currency_value] => 1 [ip] => 5.32.63.38 [date_added] => 2021-03-08 19:10:40 
        [date_modified] => 2021-03-08 19:55:49 [delivery_date] => 2021-03-08 00:00:00 
        [delivery_time] => As Soon As Possible [rating] => pending [insurance] => 1 [prescription] => 0 
        [order_status] => Complete [internal_name] => 
        [total] => Array ( [0] => Array ( [code] => sub_total [title] => Sub Total [value] => 5.37 [sort_order] => 1 ) 
        [1] => Array ( [code] => shipping [title] => Flat Shipping Rate [value] => 0 [sort_order] => 3 ) 
        [2] => Array ( [code] => total [title] => Total [value] => 5.37 [sort_order] => 9 ) ) 
        [address] => Array ( [firstname] => [lastname] => [title] => [address] => [country] => [street] => [house_building_no] => 
        [apartment] => 0 [extra_direction] => [lat] => [lng] => [area] => ) 
        [activities] => Array ( ) [attachments] => Array ( ) 
        [products] => 
        Array ( [0] => Array ( [product_id] => 3624 [sku] => 44401645 [name] => Silvadiazin 1% Cream [quantity] => 1 [price] => 4.5 [discount_applied] => 1 [total] => 0.43 [image] => https://dashboard.800pharmacy.ae/image/catalog/Products/44401645.jpg ) 
        [1] => Array ( [product_id] => 2164 [sku] => 44412792 [name] => Fastum Gel Dispenser [quantity] => 1 [price] => 52 [discount_applied] => 1 [total] => 4.94 [image] => https://dashboard.800pharmacy.ae/image/catalog/Products/44412792.jpg ) ) 
        [erx] => [order_status_id] => 5 [cancel_key] => 7234ff51-8020-11eb-83ff-a4bf0127a71a )
        */

        // $products = $this->products_m->getProducts();
        
        // if ($products) {

        //     foreach ($products['data'] as $product) {
        //         $productsData[] = array(
        //             'id'        => $product['sku'],
        //             'name'      => $product['name'],
        //             'full_name' => $product['name'] . ' - ' . $product['sku'],
        //             'price'     => $product['price'],
        //             'image'     => $product['image'],

        //         );
        //     }
        // }

       // $this->data['products'] = json_encode($productsData);

        $this->data['order_detail'] = array(
            'order_id'              => $order['order_id_internal'],
            'external_order_id'     => $order['order_id'],
            'full_name'             => $order['firstname'] . ' ' . $order['lastname'],
            'contact_number'        => $order['telephone'],
            'erx'                   => $order['erx'],
            'comments'              => $order['comment'],
            'total'                 => $order['total'],
            'delivery_date'         => date("d-m-Y", strtotime($order['delivery_date'])),
            'delivery_time'         => $order['delivery_time'],
            'payment_method'        => $order['payment_method'],
            'products'              => $order['products'],
            'discount'              => number_format(0, 2, '.', ' '),
            'attachments'           => $order['attachments'],
            'order_status_id'       => $order['order_status_id'],
            'order_status'          => $order['order_status'],
            'cancel_key'            => $order['cancel_key'],
        	'cancel_reason'			=> $order['cancel_reason'],
        'agent_name'			=> $order['agent_name'],
        'a_notes' => $order['a_notes'],
            'item_total'            => number_format($order['item_total'], 2, '.', ' ')
        );
    


        $itemTotal = 0;
        if(count($order['products']) > 0){
            foreach($order['products'] as $pro){
                $itemTotal += ($pro['price'] * $pro['quantity']);
            }
        }
    
    
            	//print_r($order);exit();

        //$this->data['order_detail']['item_total'] = $totalValue = array_values(array_column(array_filter($order['total'], fn($item) => $item['code'] === 'total'), 'value'))[0] ?? null;

  $this->data['order_detail']['item_total'] = $totalValue =
    ($values = array_column(
        array_filter(
            is_array($order['total'] ?? null) ? $order['total'] : [],
            fn($item) => is_array($item) && ($item['code'] ?? null) === 'total'
        ),
        'value'
    ))[0] ?? null;

        
        /*if(count($order['activities']) > 0) {
        
            foreach($order['activities'] as $attachment){

                $this->data['activities'][] = array(
                    "date_added" => date("Y-m-d H:i:s", strtotime($attachment['date_added'])),
                    "status" => $attachment['status'],
                    "comments" => $attachment['comments']
                );
            }

        }else {
            $this->data['activities'] = array();
            
        }*/
    	$this->data['activities'] = $order['activities'];



        $this->data['address'] = $order['address'];


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


                if ($total['code'] == "discount" || $total['value'] < 0) {
                    $this->data['order_detail']['discount'] = number_format($total['value'], 2, '.', ' ');
                }
            }
        }
     //   print_r($this->data['order_detail']);exit();

        $label = "";
        switch($order['internal_name']){
            
            case "new_order":
            $label = "Accept Order";
            $nextActionId = 2;
            $nextAction = "under_process";
            break;

            case "under_process":
            $label = "Ready for dispatch";
            $nextActionId = 3;
            $nextAction = "ready_for_dispatch";
            break;

            case "ready_for_dispatch":
            $label = "Dispatch";
            $nextActionId = 4;
            $nextAction = "dispatch";
            break;

            default:
            $label = "Accept Order";
            $nextAction = "";
            $nextActionId = 0;

            break;
        }

        $this->data['label'] = $label;
        $this->data['next_action_id'] = $nextActionId;
        $this->data['next_action'] = $nextAction;

        $this->load->view('layouts/_master_layout', array('data' => $this->data));

    }


    public function createorder()
    {

        $this->data['title']    = "Create Order";
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


        public function updatestatus(){



            $response = $this->orders_m->updateStatus(array(
                'id' => $this->input->post('id'),
                'internal_name' => $this->input->post('internal_name')
                
            ));

            echo json_encode($response);

        }


        public function addproduct(){

            $response = $this->orders_m->addProduct(array(
                'id' => $this->input->post('id'),
                'quantity' => $this->input->post('quantity'),
                'order_id' => $this->input->post('order_id')
            ));

            echo json_encode($response);

        }


        public function deleteproduct(){

            $response = $this->orders_m->deleteProduct(array(
                'id' => $this->input->post('id'),
                'order_id' => $this->input->post('order_id')
            ));

            echo json_encode($response);

        }


        public function cancelorder(){

            $response = $this->orders_m->cancelOrder(array(
                'id' => $this->input->post('id'),
                'cancel_key' => $this->input->post('cancel_key')
            ));

            echo json_encode($response);

        }

	function order_exists(){
    	echo json_encode($this->orders_m->orderExists($this->input->post('order_id')));
    }





    }