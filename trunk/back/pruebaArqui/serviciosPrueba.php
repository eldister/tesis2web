<?php
	//IMPORTS NECESARIOS
    header("Content-type: text/html; charset=utf8");
	include('rutasPrueba.php');
	include ('modelPrueba.php');
	include_once '../back/conexion.php';

	function guardarDato(){
		$request = \Slim\Slim::getInstance()->request();
		$val = json_decode($request->getBody(),TRUE);
		$con= getConnection();
		$psmt= $con->prepare("INSERT into usuarios values(NULL,?,?,?)");
		$psmt->execute(array(
			$val["nombre"],
			$val["apellido"],
			$val["correo"],
			));
		echo json_encode($request);
	}

?>