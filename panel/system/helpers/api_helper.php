<?php

use backend\models\ApiLog;


function get_partner_id(){
    $header = getallheaders();

    // print_r($header);
    // echo "<br />*******<br />";
    // print_r($_GET);
    // echo "<br />*******<br />";
    // print_r($_SERVER);
    // echo "<br />*******<br />";
    // exit();


    
    return $header['X-Partner-Id'];
}


function print_json($array, $print=true)
{
  if($print)
  echo json_encode($array);
  else
  return json_encode($array);

}



function get_unique_id(){
  return md5(time() . mt_rand(1,1000000));
}





function getJson()
{

    $CI=&get_instance();

    if (isset($_REQUEST['json'])) {


        $api_type = "";

        $loginID = 0;

        $userID = 0;

        $json = $_REQUEST['json'];


        $arr = json_decode(stripcslashes($json));


        $arr1 = $arr[0];


        foreach ($arr1 as $key => $value) {


            $value = str_replace("'", '', $value);


            $dbvalues[$key] = $value;

        }


        extract($dbvalues);

        if ($loginID > 0 || $userID > 0) {

            $ID = isset($userID) ? $userID : $loginID;

            $users = $CI->account_m->_get_user($ID);
            //$users = Users::find()->where(" userID='$ID' AND (userStatus='Active' OR userStatus='Deactive') ")->one();


            if (empty($users)) {

                $result1[0]['status'] = false;

                $result1[0]['message'] = "User is inactive or no longer available.";

                echo $string = str_replace('\"', '', str_replace("\/", "/", json_encode($result1)));

                die;

            }

        }

//        if ($api_type == "") {
//
//
//            $result1[0]['status'] = false;
//
//
//            $result1[0]['message'] = "api_type is missing";
//
//
//            $json1 = $_REQUEST['json'];
//
//
//            $model = new ApiLog();
//
//
//            $model->api_name = 'Api_Log';
//
//
//            $model->api_request = "$json1";
//
//
//            $model->api_response = "api_type is missing";
//
//
//            $model->api_type = "missing";
//
//
//            if ($model->save(false)) {
//
//
//            }
//
//
//            echo $string = str_replace('\"', '', str_replace("\/", "/", json_encode($result1)));
//
//
//            die;
//
//        } else {
//
//
//            return $dbvalues;
//
//        }
            return $dbvalues;

    } else {

        return false;

    }

}











function apiLog($action, $string, $type)
{

    $CI = &get_instance();


    //if ($getjson != "false") {
   //     extract($getjson);
        $CI->api_m->log($action, $string, $type);
    //}

}



function getExtension($fileName){
    $extension = pathinfo($fileName, PATHINFO_EXTENSION);

    if (is_null($extension) || $extension ==  ""){
        return "png";
    }else return $extension;


}



function generateRandomString($length = 9) {
    $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $charactersLength = strlen($characters);
    $randomString = '';
    for ($i = 0; $i < $length; $i++) {
        $randomString .= $characters[rand(0, $charactersLength - 1)];
    }
    return $randomString;
}