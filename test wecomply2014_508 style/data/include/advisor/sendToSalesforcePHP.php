<?php

ignore_user_abort(true);

$fields_string = '';
$url = 'https://www.salesforce.com/servlet/servlet.WebToLead?encoding=UTF-8';

$fields = array(
	'first_name'=>urlencode($_POST['first_name']),
	'last_name'=>urlencode($_POST['last_name']),
	'company'=>urlencode($_POST['company']),
	'description'=>urlencode($_POST['description']),
	'email'=>urlencode($_POST['email']),
	'phone'=>urlencode($_POST['phone']),
	'lead_source'=>urlencode($_POST['lead_source']),
	'oid' => '00D00000000hY2U'
);


//url-ify the data for the POST
foreach($fields as $key=>$value) { $fields_string .= $key.'='.$value.'&'; }
rtrim($fields_string,'&');


//open connection
$ch = curl_init();

//set the url, number of POST vars, POST data
curl_setopt($ch,CURLOPT_URL,$url);
curl_setopt($ch,CURLOPT_POST,count($fields));
curl_setopt($ch,CURLOPT_POSTFIELDS,$fields_string);


curl_setopt($ch,CURLOPT_SSL_VERIFYPEER, FALSE);
curl_setopt($ch,CURLOPT_RETURNTRANSFER, TRUE);
curl_setopt($ch,CURLOPT_FOLLOWLOCATION, TRUE);

//execute post
$result = curl_exec($ch);


//close connection
curl_close($ch);


?>