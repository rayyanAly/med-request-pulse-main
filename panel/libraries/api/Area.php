<?php
require_once(APPPATH.'/libraries/api/API.php');

class Area extends API{

	private $url = array();

	function __construct(){
		$this->url = array(
			'get_areas' => 'address&m=areas'
		);

	}
	
	
	public $headers = array('X-Partner-Id:'.PARTNER_ID, 'X-Session: 9abc76f2-fcb4-11ea-806b-a4bf0127a71a');

	public function getAreas(){
		$get_data = $this->callEndpoint('GET', $this->url['get_areas'], false);
    	$response = json_decode($get_data, true);

    	$errors = $response['error'];
    	$data = $response['data'];

    	return $response;
	}


}

?>