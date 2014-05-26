<?php
   // header("Content-type: text/html; charset=utf8");
	include('routesBusqueda.php');
	include_once '../back/conexion.php';


function busquedaBasica(){

	/*$request = \Slim\Slim::getInstance()->request(); //json parameters
    $data = json_decode($request->getBody());
    $CRITERIO=$data->{"criterio"};

    $pstmt = $con->prepare("SELECT U.IDPERMISO FROM USUARIO U WHERE U.ESTADO = 1 AND U.IDUSUARIO=?");
	$pstmt->execute(array($id));
	$idPermiso = $pstmt->fetch(PDO::FETCH_ASSOC)["IDPERMISO"];
	return $idPermiso;*/
}


?>