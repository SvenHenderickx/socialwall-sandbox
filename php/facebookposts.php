<?php

require 'secrets.php';

require_once __DIR__ . '/Facebook/autoload.php'; // change path as needed

$fb = new \Facebook\Facebook([
  'app_id' => $facebookappid,
  'app_secret' => $facebookappsecret,
  'default_graph_version' => 'v2.10'
]);

try {
  // Returns a `FacebookFacebookResponse` object
  $response = $fb->get(
    '/me?fields=posts{full_picture,source,message,description,created_time}',
    $facebooksecret
  );
} catch(FacebookExceptionsFacebookResponseException $e) {
  echo 'Graph returned an error: ' . $e->getMessage();
  exit;
} catch(FacebookExceptionsFacebookSDKException $e) {
  echo 'Facebook SDK returned an error: ' . $e->getMessage();
  exit;
}
$graphNode = $response->getGraphNode()->asArray();

echo (json_encode($graphNode));

?>
