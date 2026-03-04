<?php
require_once APPPATH . '/libraries/api/API.php';

class Login extends CI_Controller
{

    public function __construct()
    {
        parent::__construct();
        $this->load->model('PartnerMd', 'partner_m');

    }

    public function index()
    {

        $this->data['title']          = "Login - 800 Pharmacy";
        $this->data['validation_url'] = site_url('c=login&m=validate');
        $this->data['success_url'] = site_url('c=orders&m=create');
        $this->load->view('pages/login', $this->data);

    }

    public function validate()
    {

        if ($_SERVER['REQUEST_METHOD'] === 'POST') {

            $response = $this->partner_m->login(
                array('user_name' => trim($this->input->post('user_name')),
                    'password'        => trim($this->input->post('password')),
                ));


            if ($response) {

                //Create sessions if login is successful

                $this->session->set_userdata('partner_data', $response['data']);
                $this->session->set_userdata('login', 1);

                $data = $response;

            } else {

                $data = array(
                    'success' => 0,
                    'error'   => array(
                        'message' => $response,
                    ),
                    'data'    => array(),
                );
            }

        } else {

            $data = array(
                'success' => 0,
                'error'   => array(
                    'message' => "Username / Password required",
                ),
                'data'    => array(),
            );

        }
        echo json_encode($data);

    }

    public function logout(){
        unset($_SESSION['partner_data']);
        redirect(site_url('login'));

    }

}
