<?php

class Rest extends CI_Controller {


    public $statusCode = 200;
    public $post = array();
    public $allowedHeaders = array("GET", "POST", "PUT", "DELETE");
    public $json = array("success" => 1, "error" => "", "data" => array());

    public $multilang = 0;
    public $opencartVersion = "";
    public $urlPrefix = "";
    public $includeMeta = true;
    private $httpVersion = "HTTP/1.1";


    public function __construct(){
        // $header = getallheaders();

        // $data = array(

        // );




        //     print_r($header);
        //     echo "<br />*******<br />";
        //     print_r($_REQUEST);
        //     echo "<br />*******<br />";
        //     print_r($_SERVER);
        //     echo "<br />*******<br />";
        //     exit();
}

        public function validteHeaders($initial = false)
        {
            

            if (($initial && (!isset($header['X-Security-Code']) || $header['X-Security-Code'] == "" || !isset($header['X-Partner-Id'])))
            || ((!$initial && (!isset($header['X-Session']) || $header['X-Session'] == "" || !isset($header['X-Partner-Id']))))
            ){
                $this->statusCode = 401;
                $this->json["success"] = 0;
                $this->json["error"] = UNAUTHORIZED;
                $this->sendResponse();
                exit();
            }





            //Validate Partner-ID and Session
            if (!$initial){
                $result = $this->db->query("SELECT * FROM " . DB_PREFIX . "cust_ext_api_sessions 
                WHERE partner_id = '". $header['X-Partner-Id'] ."' AND session_key = '". $header['X-Session'] ."'");

                if ($result->num_rows() == 0){

                    $this->statusCode = 401;
                    $this->json["success"] = 0;
                    $this->json["error"] = UNAUTHORIZED;
                    $this->sendResponse();
                    exit();

                }else {
                    return true;
                }
            }

            



        }


    public function getHttpStatusMessage($statusCode)
    {
        $httpStatus = array(
            200 => 'OK',
            202 => 'Request Accepted',
            204 => 'No Content',
            400 => 'Bad Request',
            401 => 'Unauthorized',
            403 => 'Forbidden',
            404 => 'Not Found',
            405 => 'Method Not Allowed',
            406 => 'Not Acceptable',
            500 => 'Unknown Error'
        );

        return ($httpStatus[$statusCode]) ? $httpStatus[$statusCode] : $httpStatus[500];
    }



    public function getPost()
    {
        $input = file_get_contents('php://input');
        $post = json_decode($input, true);
        
        if (!is_array($post) || empty($post)) {
            $this->statusCode = 400;
            $this->json['error'] = 'Invalid request body, please validate the json object';
            $this->sendResponse();
        }

        return $post;
    }


  public function sendResponse()
    {

        $statusMessage = $this->getHttpStatusMessage($this->statusCode);

        //fix missing allowed OPTIONS header
        $this->allowedHeaders[] = "OPTIONS";

        if ($this->statusCode != 200) {
            if (!isset($this->json["error"])) {
                $this->json["error"][] = $statusMessage;
            }

            if ($this->statusCode == 405 && $_SERVER['REQUEST_METHOD'] !== 'OPTIONS') {
                $this->response->addHeader('Allow: ' . implode(",", $this->allowedHeaders));
            }

            $this->json["success"] = 0;

            //enable OPTIONS header
            if($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
                $this->statusCode = 200;
                $this->json["success"] = 1;
                $this->json["error"] = "";
            }

        } else {

            if (!empty($this->json["error"])) {
                $this->statusCode = 400;
                $this->json["success"] = 0;
            }
            //add cart errors to the response
            if (isset($this->json["cart_error"]) && !empty($this->json["cart_error"])) {
                $this->json["error"] = $this->json["cart_error"];
                unset($this->json["cart_error"]);
            }
        }

        $this->json["error"] = $this->json['error']; //array_values($this->json["error"]);

        if (isset($this->request->server['HTTP_ORIGIN'])) {
            $this->response->addHeader('Access-Control-Allow-Origin: ' . $this->request->server['HTTP_ORIGIN']);
            $this->response->addHeader('Access-Control-Allow-Methods: '. implode(", ", $this->allowedHeaders));
            $this->response->addHeader('Access-Control-Allow-Headers: '. implode(", ", $this->accessControlAllowHeaders));
            $this->response->addHeader('Access-Control-Allow-Credentials: true');
        }

        $this->response->addHeader($this->httpVersion . " " . $this->statusCode . " " . $statusMessage);
        $this->response->addHeader('Content-Type: application/json; charset=utf-8');

        if (defined('JSON_UNESCAPED_UNICODE')) {
            $this->response->setOutput(json_encode($this->json, JSON_UNESCAPED_UNICODE));
        } else {
            $this->response->setOutput($this->rawJsonEncode($this->json));
        }
        $this->json['statusCode'] = $this->statusCode;
        $this->response->output();

        die;
    }














}