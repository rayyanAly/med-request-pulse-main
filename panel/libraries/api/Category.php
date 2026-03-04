<?php 

require_once(APPPATH.'/libraries/api/API.php');


class Category extends API{


    private $url = array();

	function __construct(){

		$this->url = array(
            'get_categories' => 'categories',
            'get_category_by_parent' => 'categories&parent=',
            'get_category_products' => 'products&category=',
            'get_productby_id' => 'products&id='
        );

	}


 	public function getCategories($browseType){
  
        if(empty($browseType)){
            $categories = $this->callEndpoint('GET', $this->url['get_categories'], false);
        }else{
            $url = $this->url['get_category_by_parent'].$browseType;
            $categories = $this->callEndpoint('GET', $url, false);
        }

    	
    	return $categories;

	}


	public function getCategoryProducts($categoryId){

        $url = $this->url['get_category_products'].$categoryId;

    	$products = $this->callEndpoint('GET', $url, false);
    
    	return $products;

	}

    public function getProductDetail($productId){

        $url = $this->url['get_productby_id'].$productId;

        $productDetail = $this->callEndpoint('GET', $url, false);
       
        return $productDetail;

    }




}



?>