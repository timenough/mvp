<?php

/* Filename: script-1.php */

require_once (__DIR__ . '/vendor/autoload.php');

// method for doing each time the same learning operation 

function teachSomethingToTheModel (
    &$MLModelInstance,
    $someTextToLearn,
    $meaning
) {

    $MLModelInstance->learn($someTextToLearn, $meaning);

}

// method for saving a JSON screenshot of the Model into a file 

function backupTheModel (
    &$MLModelInstance,
    $backupFilePath
) {

    file_put_contents($backupFilePath, $MLModelInstance->toJson(), LOCK_EX);

}

// Model instantiation 

$classifier = new \Niiknow\Bayes();

// Fill & train the Model and save it to a JSON backup file

if (
    !file_exists(__DIR__ . '/model-brain.json')
) {

    // OPEN the dataset file and TRAIN the Model with it

    $CSVFileReadingInstance = 
        fopen(__DIR__ . '/tweets.csv','r');

    // READ the dataset file and TRAIN the Model with it

    while (
        (
            $CSVFileReadData = fgetcsv($CSVFileReadingInstance)
        ) !== FALSE
    ) {

        $CSVFileLineTextSplit = 
            explode(';', $CSVFileReadData[0]);

        if(
            isset($CSVFileLineTextSplit[1]) &&
            isset($CSVFileLineTextSplit[0])
        ) {

            teachSomethingToTheModel(
                $classifier,
                $CSVFileLineTextSplit[1],
                $CSVFileLineTextSplit[0]
            );

        }

    }

    // Save the trained Model into a JSON backup file

    backupTheModel(
         $classifier,
         __DIR__ . '/model-brain.json'
    );

    exit ('Model trained.');

}
else {

    exit ('Nothing to do.');

}