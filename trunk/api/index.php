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
include ("../back/Administracion_Usuario_Grupo/serviciosUsuario.php");
include ("../back/Administracion_Usuario_Grupo/serviciosInstitucion.php");
include ("../back/Administracion_Usuario_Grupo/serviciosGrupo.php");



//ALBERT
include ("../back/Publicacion_Documental/serviciosTipoPublicacion.php");
include ("../back/Publicacion_Documental/serviciosTipoFicha.php");
include ("../back/Publicacion_Documental/serviciosEtiqueta.php");
include ("../back/Publicacion_Documental/serviciosPublicacion.php");
include ("../back/Publicacion_Documental/serviciosFicha.php"); 
include ("../back/Seguridad/serviciosLogin.php");
include ("../back/Seguridad/serviciosPermiso.php");
include ("../back/Publicacion_Documental/serviciosListaPublicacion.php");

$app->run();
//echo 'slim cargado';
?>
