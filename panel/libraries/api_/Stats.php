<?php
require_once(APPPATH . '/libraries/api/API.php');

class Stats extends API
{


	private $url = array();

	function __construct(){

		$this->url = array(
            'get_stats' => 'stats'        
        );

	}


	public function getDashboardStats($data)
	{

		$stats = $this->callEndpoint('GET', $this->url['get_stats'], $data);
		return $stats;
	}

}
