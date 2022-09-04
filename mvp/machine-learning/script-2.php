<?php

/* Filename: script-2.php */

require_once (__DIR__ . '/vendor/autoload.php');

// method for reading the content of a JSON Model screenshot file 

function loadTheModelBackupFile (
    &$MLModelInstance,
    $backupFilePath
) {

    $_ML_model_instance->fromJson(
        file_get_contents($backupFilePath, false)
    );

}

// method for making Predictions and figuring out the category of a short text message 

function challengeTheModel (
    &$MLModelInstance,
    $shortTextMessage
): string {

    return $_ML_model_instance->categorize($shortTextMessage);

}

// Model instantiation 

$classifier = new \Niiknow\Bayes();

// loading the education brain file of past trainings 

loadTheModelBackupFile($classifier, __DIR__ . '/model-brain.json');

// Retrieve unpredictable data from somewhere or from the user
// TODO: make it more secure, filtered...

$inputShortTextMessage = $_GET['message'] ?? 'Default short text message to be challenged'; 

// Challenge the ML Model with something to trigger it's response (classification, problem solving)

$MLprediction = challengeTheModel($classifier, $inputShortTextMessage);

exit (
    'ML Model prediction: the short text message is ' . $MLprediction . '.'
);