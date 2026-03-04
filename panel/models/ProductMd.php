<?php
require_once APPPATH.'/libraries/api/APIManager.php';

class ProductMd extends APIManager {

    function getProducts(){
        return $this->product->getProducts();

    }

    function getProduct($id){
        return $this->product->getProduct($id);

    }


}
