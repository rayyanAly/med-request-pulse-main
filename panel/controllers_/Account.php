<?php
class Account extends CI_Controller
{

    public function __construct()
    {
        parent::__construct();
        $this->load->model('PartnerMd', 'partners_m');

    }

    public function index()
    {

        $this->data['title'] = "Withdrawals - 800 Pharmacy";
        $this->data['subview'] = 'pages/withdrawals';
        $this->data['selected'] = 'withdrawals';
        $this->data['listing_user_url'] = site_url('c=account&m=listing');

        $this->load->view('layouts/_master_layout', array('data' => $this->data));

    }



    public function listing()
    {
        
        $partners = $this->partners_m->getWithdrawals(array('partner_id' => get_partner_id()));

        $totalUsers = 0;
        $totalUsersValue = 0;
        $counter = 1;

        if(count($partners['data']) > 0) {
        foreach ($partners['data'] as $partner) {

            $partnersArray[] = array(
                $counter,
                format_date($partner['date']),
                $partner['amount'],
                ucwords(str_replace("_", " ",$partner['payment_method']))
            );
            $counter++;
            $totalUsers++;
            $totalUsersValue = count($partnersArray);
        }
    }else {
        $partnersArray = array();        
    }

        echo json_encode(['data' => $partnersArray]);

    }


    


}
