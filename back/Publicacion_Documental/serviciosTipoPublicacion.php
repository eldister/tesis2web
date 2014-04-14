<?php
	//IMPORTS NECESARIOS
    header("Content-type: text/html; charset=utf8");
	include('rutasTipoPublicacion.php');
	include ('modelTipoPublicacion.php');
	include_once '../back/conexion.php';

	function getListaTipoPublicacion(){
		$con=getConnection();
		$pstmt = $con->prepare("SELECT * FROM tipopublicacion");
		$pstmt->execute();
		$listaTipoPublicacion = array();
		while($estado = $pstmt->fetch(PDO::FETCH_ASSOC)){
			$listaEstados[] = $estado;
		}
		echo json_encode($listaEstados);
	}	

?>