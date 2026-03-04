<?php
require_once APPPATH.'/libraries/api/APIManager.php';

class OrderMd extends APIManager {

    function getOrders($data){
        return $this->order->getOrders($data);

    }

    function createOrder($data){
    	return $this->order->createOrder($data);

    }

  	function getOrder($order_id){
          return $this->order->getOrder($order_id);

    }

    function createTemp($data){
          return $this->order->createTemp($data);

    }

    function deleteTemp($data){
          return $this->order->deleteTemp($data);

    }

    function updateStatus($data){
        return $this->order->updateStatus($data);      
    }

    function addProduct($data){
          return $this->order->addProduct($data);

    }

    function deleteProduct($data){
          return $this->order->deleteProduct($data);

    }

    function cancelOrder($data){
                return $this->order->cancelOrder($data);
    }

    function makecurlfile($file){
      $path = realpath($file);
      $actualfile = $path;
      $mime = mime_content_type($file);
      $info = pathinfo($file);
      $name = $info['basename'];
      $output = new CurlFile($actualfile, $mime, $name);
      return $output;
      }

	function orderExists($order_id){
    	return $this->order->orderExists($order_id);
    }

}
