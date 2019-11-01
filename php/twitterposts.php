<?php

session_start();
require_once("../twitteroauth/twitteroauth/twitteroauth.php"); //Path to twitteroauth library

$twitteruser = "HenderickxSven";
$notweets = 30;
$consumerkey = "Rs6xKnG5R3U6o3dTyKamHkJnc";
$consumersecret = "wxXzpmTCeNLYmt0cYHeSzdhBUm9WszxNiWmcOp0sfk0iWGy2ox";
$accesstoken = "1189849599520968704-r5bluZ7TqpMDcxl0FjLvals11oeQEB";
$accesstokensecret = "hTrdi4yyes8tsxRAHDYU8k5Duf9gh1ppI8JaPg2htw7Et";

function getConnectionWithAccessToken($cons_key, $cons_secret, $oauth_token, $oauth_token_secret) {
  $connection = new TwitterOAuth($cons_key, $cons_secret, $oauth_token, $oauth_token_secret);
  return $connection;
}

$connection = getConnectionWithAccessToken($consumerkey, $consumersecret, $accesstoken, $accesstokensecret);

$tweets = $connection->get("https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=".$twitteruser."&count=".$notweets);

echo json_encode($tweets);

 ?>
