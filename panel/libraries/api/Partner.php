<?php
require_once(APPPATH . '/libraries/api/API.php');

class Partner extends API
{


	private $url = array();

	function __construct(){

		$this->url = array(
            'get_partners' => 'partners',
            'login_partners' => 'partners&m=login',
			'get_partner_profiles' => 'partners&m=profiles?id=',
			'forgot_password' => 'partners&m=forgot',
			'logout_partner' => 'partners&m=logout',
			'get_users' => 'partners&m=users',
			'get_withdrawals' => 'partners&m=withdrawals'
        );

	}


	public function getPartners()
	{

		$partners = $this->callEndpoint('GET', $this->url['partners'], false);
		return $partners;
	}

	public function login($data)
	{

   // print_r($data);
		// $data =  array(
		// 	"user_name"      => $data['user_name'],
		// 	"password"   => $data['password']
		// );

		$get_data = $this->callEndpoint('POST', $this->url['login_partners'], $data);
    //print_r($get_data);
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

	public function getUsers()
	{

		$partners = $this->callEndpoint('GET', $this->url['get_users'], false);
		return $partners;
	}

	public function createUser($data){

		$get_data = $this->callEndpoint('POST', $this->url['get_users'], $data);
		return $get_data;
	}

	public function getUser($data)
	{

		$partners = $this->callEndpoint('GET', $this->url['get_users'], $data);
		return $partners;
	}


	public function getWithdrawals(){

		$partners = $this->callEndpoint('GET', $this->url['get_withdrawals'], false);
		return $partners;
		
	}
}
