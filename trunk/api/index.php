<?php
require 'Slim/Slim.php';
\Slim\Slim::registerAutoloader();
$app = new \Slim\Slim();
$app->contentType('text/html; charset=utf-8');

 //INCLUIR ARCHIVO DE BACKEND
include ("../back/pruebaArqui/serviciosPrueba.php");
include ("../back/Publicacion_Documental/serviciosIdioma.php");
$app->run();
//echo 'slim cargado';
?>
