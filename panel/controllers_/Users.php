<?php
class Users extends CI_Controller
{

    public function __construct()
    {
        parent::__construct();
        $this->load->model('PartnerMd', 'partners_m');

    }

    public function index()
    {

        $this->data['title'] = "Users - 800 Pharmacy";
        $this->data['subview'] = 'pages/users';
        $this->data['selected'] = 'users';
        $this->data['listing_user_url'] = site_url('c=users&m=listing');
                $this->data['add_user_url'] = site_url('c=users&m=form');


        $this->load->view('layouts/_master_layout', array('data' => $this->data));

    }



    public function listing()
    {
        

        $partners = $this->partners_m->getUsers(array('partner_id' => get_partner_id()));

        $totalUsers = 0;
        $totalUsersValue = 0;
        $counter = 0;


        if(count($partners['data']) > 0){
        foreach ($partners['data'] as $partner) {

            $partnersArray[] = array(
                $counter,
                $partner['full_name'],
                $partner['email'],
                $partner['phone'],
                $partner['user_type'],
//                $partner['user_name'],
                $partner['status'],
                '<a href="' . site_url('c=users&m=form&id=' . $partner['id']) . '"><img src="' . base_url() . 'theme/images/view-icon.png" /></a>'
            );
            $counter++;
            $totalUsers++;
            $totalUsersValue = count($partnersArray);
        }
    }else {
        $partnersArray = [];
    }

        echo json_encode(['data' => $partnersArray]);

    }



    public function form()
    {



        if($this->input->get('id')  != ""){
            $user = $this->partners_m->getUser(array(
                'id' => $this->input->get('id')
            ));
            $this->data['user_details'] = $user['data'];
            $this->data['edit_mode'] = true;

        }else {
            $this->data['edit_mode'] = false;

        }

        $this->data['title'] = "Add User - 800 Pharmacy";
        $this->data['subview'] = 'pages/add_user';
        $this->data['selected'] = 'users';
        
        $this->data['submission_url'] = site_url('c=users&m=submit');
        $this->data['success_url'] = site_url('c=users');

        $this->load->view('layouts/_master_layout', array('data' => $this->data));

    }


    public function submit(){

            
            if ($_SERVER['REQUEST_METHOD'] === 'POST') {
                
                $formData = array(
                    'full_name' => $this->input->post('full_name'),
                    'email' => $this->input->post('email'),
                    'phone' => $this->input->post('phone'),
                    'username' => $this->input->post('username'),
                    'password' => $this->input->post('password'),
                    'position' => $this->input->post('position')
                    );


                if($this->input->post('id') !== null){
                    $formData['id'] = $this->input->post('id');
                }


                if($this->input->post('action') !== null){
                    $formData['action'] = $this->input->post('action');
                }


                $response = $this->partners_m->createUser($formData);
                echo json_encode($response);

            }

    }





}
