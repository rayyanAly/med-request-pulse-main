<?php
require_once(APPPATH . '/libraries/api/API.php');

class Customer extends API
{


	private $url = array();

	function __construct(){

		$this->url = array(
            'get_customers' => 'customers',
            'register_customer' => 'customers&m=register',
            'login_customer' => 'customers&m=login',
			'get_customer_profiles' => 'customers&m=profiles?id=',
			'forgot_password' => 'customers&m=forgot',
			'logout_customer' => 'customers&m=logout'
        );

	}


	public function getCustomers($data)
	{

		$customers = $this->callEndpoint('GET', $this->url['get_customers'], $data);
		return $customers;
	}

	public function login($email, $password)
	{

		$data =  array(
			"email"      => $email,
			"password"   => $password
		);

		$get_data = $this->callEndpoint('POST', $this->url['login_customer'], $data, $this->headers);
		// 	$response = json_decode($get_data, true);

		// $status = $response['success'];
		// 	$errors = $response['error'];
		// 	$data = $response['data'];

		//if( $status == 1){return new \Customer();}

		return $get_data;
	}

	public function register($first_name, $last_name, $email, $password, $confirm_password, $contact_number)
	{

		$data =  array(
			"first_name"        => $first_name,
			"last_name"         => $last_name,
			"email"             => $email,
			"password"          => $password,
			"confirm_password"  => $confirm_password,
			"contact_number"    => $contact_number
		);


		$get_data = $this->callEndpoint('POST', $this->url['register_customer'], $data);
		$response = json_decode($get_data, true);

		$status = $response['success'];
		$errors = $response['error'];
		$data = $response['data'];

		return $response;
	}


	public function getProfile($customerId)
	{

		$url = GET_PROFILE . $customerId;

		$get_data = $this->callEndpoint('GET', $url, false);
		$response = json_decode($get_data, true);

		$status = $response['success'];
		$errors = $response['error'];
		$data = $response['data'];

		return $response;
	}



	public function forgotPassword($email)
	{

		$data =  array(
			"email"    => $email
		);

		$get_data = $this->callEndpoint('POST', $this->url['forgot_password'], $data);
		$response = json_decode($get_data, true);

		$status = $response['success'];
		$errors = $response['error'];
		$data = $response['data'];

		return $response;
	}


	public function logOut($email)
	{

		$data =  array(
			"email"   => $email
		);

		$get_data = $this->callEndpoint('POST', $this->url['logout_customer'], $data);
		$response = json_decode($get_data, true);

		$status = $response['success'];
		$errors = $response['error'];
		$data = $response['data'];

		return $response;
	}
}
