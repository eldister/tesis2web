<?php
   // header("Content-type: text/html; charset=utf8");
	include('routesGrupo.php');
	include_once '../back/conexion.php';


function registraGrupo(){

	$request = \Slim\Slim::getInstance()->request(); //json parameters
    $data = json_decode($request->getBody(),TRUE);
	
	echo $data;
}

function getListaPersonas($id){
	$con=getConnection();
 
	$pstmt = $con->prepare("SELECT U.IDPERMISO FROM USUARIO U WHERE U.ESTADO = 1 AND U.IDUSUARIO=?");
	$pstmt->execute(array($id));
	$idPermiso = $pstmt->fetch(PDO::FETCH_ASSOC);

	if($idPermiso["IDPERMISO"]==1){ //SI ES EL ADMINISTRADOR PUEDE VER TODAS LAS PERSONAS

		$pstmt = $con->prepare("SELECT U.IDUSUARIO,U.NOMBRES,U.APELLIDOS FROM USUARIO U WHERE U.ESTADO = 1 AND U.IDUSUARIO NOT IN (?)");
		$pstmt->execute(array($id));
		$listaPersonas= array();

		while($row = $pstmt->fetch(PDO::FETCH_ASSOC)){
			$NOMBRE=$row["NOMBRES"].' '.$row["APELLIDOS"];
			$persona["IDUSUARIO"]=$row["IDUSUARIO"];
			$persona["NOMBRE"]=$NOMBRE;
			array_push($listaPersonas,$persona);
		}

		echo json_encode($listaPersonas);
	}
	else {



	}

	
}


?>