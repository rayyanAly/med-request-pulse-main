<?php
require_once(APPPATH.'/libraries/api/API.php');

class Session extends API{

	public $headers = array('X-Partner-Id:'.PARTNER_ID, 'X-Security-Code:'.PARTNER_SECRET_CODE);
	private $response;

  	protected function getResponse(){
		return $this->response;
  	}

  	private function setResponse($response){
  		$this->repsonse = $response;
  	}


	public function getSession(){

    	$get_data = $this->callEndpoint('GET', 'session', false);
    	$response = json_decode($get_data, true);
   
    	$status = $response['success'];
    	$errors = $response['error'];
    	$data = $response['data'];

      return $response;
    

	}

}




?>