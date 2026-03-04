<?php
class Settings extends CI_Controller
{

    public function __construct()
    {
        parent::__construct();
        $this->load->model('SettingMd', 'setting_m');

    }

    public function index()
    {


        $this->data['title'] = "Settings - 800 Pharmacy";
        $this->data['subview'] = 'pages/settings';
        $this->data['selected'] = 'settings';

        $this->data['settings'] = $this->setting_m->getNotificationSetting(array())['data'];
        $this->load->view('layouts/_master_layout', array('data' => $this->data));

    }

    public function update_setting(){   

        if ($_SERVER['REQUEST_METHOD'] === 'POST') {

            

            for($i = 0; $i < count($this->input->post('ids')); $i++){

                $data = array(
                    'id' => $this->input->post('ids')[$i],
                    'sms' => $this->input->post('smsData')[$i],
                    'email' => $this->input->post('emailData')[$i]
                );
             
                $this->setting_m->updateNotificationSetting($data);

            }

            echo json_encode(array(
                        'success' => 1
                    ));

        }

    }


}
