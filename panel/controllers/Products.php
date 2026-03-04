<?php
class Products extends CI_Controller
{

    public function __construct()
    {
        parent::__construct();
        $this->load->model('ProductMd', 'products_m');
        $this->load->model('CustomerMd', 'customers_m');

    }

    public function index()
    {

        $this->data['title']            = "Products";
        $this->data['subview']          = 'pages/products';
        $this->data['selected']         = 'products';
        $this->data['create_product'] = site_url('c=products&m=create');
        $this->data['listing_product_url'] = site_url('c=products&m=listing');

        $totalOrders      = 0;
        $totalOrdersValue = 0;
        $data             = array(

        );
        $this->data['products'] = $this->products_m->getProducts()['data'];
        $this->load->view('layouts/_master_layout', array('data' => $this->data));

    }

    public function listing()
    {
        
        $products = $this->products_m->getProducts();

        $totalProducts      = 0;
        $totalProductsValue = 0;


        if(count($products['data']) > 0){

            foreach ($products['data'] as $product) {
                //print_r($product);exit();

                $productList[] = array(
                    //'',//'<img src="' . $product['image'] . '" class="product-thumb" />',                    
                    $product['sku'],
                    $product['name'],
                    $product['price'],
                    "Yes",//rand(10,500),
                    $product['unit'],

  //                  $product['category_id'],
                  // $product['category_name'],
                ''
                	//'<a href="javascript: void(0)" onclick="openModal('.$product['product_id'].')"><img src="' . base_url() . 'theme/images/view-icon.png" /></a>&nbsp;&nbsp;<select class="select-box"><option value="0">Actions</option><option value="1">Disable</option><option value="0">Edit</option><option value="0">Delete</option></select>'
                   //'<a href="javascript: void(0)" onclick="openModal('.$product['product_id'].')"><img src="' . base_url() . 'theme/images/view-icon.png" /></a>&nbsp;&nbsp;<select class="select-box"><option value="0">Actions</option><option value="1">Disable</option><option value="0">Edit</option><option value="0">Delete</option></select>'
                );

                $totalProducts++;
                $totalProductsValue = count($products);

            }

    }else {
        $productList = [];
    }

        echo json_encode(['data' => $productList]);

    }

    public function create()
    {

        $this->data['title']    = "Create Product - Mediclinic Middle East";
        $this->data['selected'] = 'product-create';
        $this->data['current_session'] = time();
        $this->data['temp_image_url'] = site_url('c=products&m=create');

        $this->data['categories'] = array(
            array(
                'id' => 1, 
                'name' => 'Common Symptoms'
            ),
            array(
                'id' => 2, 
                'name' => 'Medicine'
            ),
            array(
                'id' => 3, 
                'name' => 'Personal Care'
            ),
            array(
                'id' => 4, 
                'name' => 'Baby & Mom'
            ),
            array(
                'id' => 4, 
                'name' => 'Vitamins & Supplements'
            ),
            array(
                'id' => 4, 
                'name' => 'First Aid'
            ),
        );

        

        $this->data['submission_url']          = site_url("c=products&m=submit");
        $this->data['success_url']             = site_url('c=products');
        $this->data['subview']                 = 'pages/new_product';
        $this->load->view('layouts/_master_layout', array('data' => $this->data));


    }









    public function detail()
    {
        $product = $this->products_m->getProduct($this->input->get('id'));
        $this->data['product'] = $product['data'];
        $this->load->view('pages/product-popup', $this->data);

    }


}