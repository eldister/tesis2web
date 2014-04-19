<?php
require 'Slim/Slim.php';
\Slim\Slim::registerAutoloader();
$app = new \Slim\Slim();
$app->contentType('text/html; charset=utf-8');

 //INCLUIR ARCHIVO DE BACKEND
include ("../back/pruebaArqui/serviciosPrueba.php");

//NADYA
include ("../back/Publicacion_Documental/serviciosIdioma.php");
include ("../back/Publicacion_Documental/serviciosAutor.php");


//ALBERT
include ("../back/Publicacion_Documental/serviciosTipoPublicacion.php");
include ("../back/Publicacion_Documental/serviciosTipoFicha.php");
include ("../back/Publicacion_Documental/serviciosEtiqueta.php");

$app->run();
//echo 'slim cargado';
?>
