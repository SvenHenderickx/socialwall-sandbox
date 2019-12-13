<?php

    include 'secrets.php';

    if(!isset($_POST['name'])){
        echo 'not set';
        exit();
    }

    $target_url = "https://api.twitter.com/1.1/statuses/user_timeline.json";

    $ch = curl_init();

    $data = array(
        'Name' => 'HenderickxSven',
        'acces_token' => '1189849599520968704-qYxBKCBIGZGGapBHrx1kemaqIZzneX'
    );

    $data = json_encode($data);

    curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
    curl_setopt($ch, CURLOPT_URL, $target_url);
    curl_setopt($ch, CURLOPT_HTTPHEADER, array("Accept: application/json"));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

    $result = curl_exec($ch);
    if ($result === false) {
        echo "Curl error: " . curl_error($ch) . "\n";
    }
    curl_close($ch);

    print_r($result) ;


?>
