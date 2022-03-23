<?php
/**
 * Created by PhpStorm.
 * User: timeNough Europe Inc.
 * Date: 12/01/2022
 * Time: 21:26
 */

$ds = 
DIRECTORY_SEPARATOR;
 
$storeFolder =
'uploads';
 
if (
    !empty(
        $_FILES
    )
) {
     
    $tempFile =
    $_FILES['file']['tmp_name'];   
      
    $targetPath =
    dirname( __FILE__ ) . $ds. $storeFolder . $ds;
     
    $targetFile =
    $targetPath. $_FILES['file']['name'];
 
    move_uploaded_file(
        $tempFile,
        $targetFile
    );
     
}

exit;