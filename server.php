<?php
//Archivo muy básico para ejemplo

$fileName = $_FILES["file"]["name"]; // The file name
$fileTmp = $_FILES["file"]["tmp_name"]; // File in the PHP tmp folder


if(move_uploaded_file( $fileTmp , "./uploads/$fileName"))
    echo json_encode(['file_name'=>$fileName,'status'=>'201']);
else 
    echo json_encode(['file_name'=>$fileName,'status'=>'500']);
