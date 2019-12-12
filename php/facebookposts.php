<?php

require 'secrets.php';

try {
  // Returns a `FacebookFacebookResponse` object
  $response = $fb->get(
    '/me',
    $facebooksecret
  );
} catch(FacebookExceptionsFacebookResponseException $e) {
  echo 'Graph returned an error: ' . $e->getMessage();
  exit;
} catch(FacebookExceptionsFacebookSDKException $e) {
  echo 'Facebook SDK returned an error: ' . $e->getMessage();
  exit;
}
$graphNode = $response->getGraphNode();

echo (json_encode($graphNode));

?>
