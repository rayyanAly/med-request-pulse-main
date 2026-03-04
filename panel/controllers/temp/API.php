<?php
require_once APPPATH . '/libraries/api/config.php';

abstract class API
{

    public $error    = array();
    public $json     = array("success" => 1, "error" => array(), "data" => array());
    private $headers = array();
    private $baseUrl = "https://staging.800pharmacy.ae/api/1.0/?c=";

    protected function callEndpoint($method, $url, $data)
    {

        $this->headers = array('X-Partner-Id:' . get_partner_id(), 'X-Session:' . get_partner_session());

        $curl = curl_init();

        $url = $this->baseUrl . $url;
        switch ($method) {
            case "POST":
                curl_setopt($curl, CURLOPT_POST, 1);

                if ($data) {
                    curl_setopt($curl, CURLOPT_POSTFIELDS, $data);
                }

                break;

            case "PUT":
                curl_setopt($curl, CURLOPT_CUSTOMREQUEST, "PUT");

                if ($data) {
                    curl_setopt($curl, CURLOPT_POSTFIELDS, $data);
                }

                break;

            default:

                // curl_setopt($curl, CURLOPT_CUSTOMREQUEST, 'GET' );
                // if($data){
                //     curl_setopt($curl, CURLOPT_POSTFIELDS, $data );
                // }

                if ($data) {
                    $url = sprintf("%s&%s", $url, http_build_query($data));
                }
            

        }

        // OPTIONS:
        curl_setopt($curl, CURLOPT_URL, $url);

        if ($this->headers) {

            curl_setopt($curl, CURLOPT_HTTPHEADER, $this->headers);
        }

        curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($curl, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);

        // EXECUTE:
        $result   = curl_exec($curl);
        $httpcode = curl_getinfo($curl, CURLINFO_HTTP_CODE);

        if (!$result) {

            die("Connection Failure");

        }

        curl_close($curl);

        try {
            return $this->_response($result, $httpcode);

        } catch (Exception $e) {

            $this->json['error']   = $e->getMessage();
            $this->json['success'] = 0;
            return $this->json;

        }

        return;
    }

    private function _response($data, $status = 200)
    {
        //header("HTTP/1.1 " . $status . " " . $this->_requestStatus($status));
        // $data->message = $this->_requestStatus($status);
        if ($status != 200) {
            array_push($this->error, $this->_requestStatus($status));
        }

        $response = json_decode($data, true);

        if ($response['success'] == 0 && !empty($response['error'])) {

            array_push($this->error, $response['error']);
        }

        $this->json['error'] = $this->error;

        $this->json['success'] = $response['success'];
        $this->json['data']    = $response['data'];

        return $this->json;

    }

    private function _requestStatus($code)
    {
        $status = array(
            200 => 'OK',
            401 => 'Unauthorized request',
            404 => 'Not Found',
            405 => 'Method Not Allowed',
            403 => 'Forbidden',
            400 => 'No allowed',
            406 => 'Internal Server Error',
            500 => 'Internal Server Error',
        );
        return ($status[$code]) ? $status[$code] : $status[500];
    }

}
