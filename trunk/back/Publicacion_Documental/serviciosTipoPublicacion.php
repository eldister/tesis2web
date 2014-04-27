<?php
	//IMPORTS NECESARIOS
    header("Content-type: text/html; charset=utf8");
	include('rutasTipoPublicacion.php');
	include ('modelTipoPublicacion.php');
	include_once '../back/conexion.php';

	function getListaTipoPublicacion(){
		$con=getConnection();
		$pstmt = $con->prepare("SELECT T.IDTIPOPUBLICACION, T.NOMBRE, T.DESCRIPCION FROM TIPOPUBLICACION T WHERE T.ESTADO=1");
		$pstmt->execute();

		$listaTipoPublicacion = array();
		while($element = $pstmt->fetch(PDO::FETCH_ASSOC)){
			$listaTipoPublicacion[] = $element;
		}
		echo json_encode($listaTipoPublicacion);
	}	

	function getTipoPublicacion($id){

	    $con=getConnection();
	 
		$pstmt = $con->prepare("SELECT T.IDTIPOPUBLICACION, T.NOMBRE, T.DESCRIPCION FROM TIPOPUBLICACION T WHERE T.IDTIPOPUBLICACION=?");
		$pstmt->execute(array($id));
		$tipoPub = $pstmt->fetch(PDO::FETCH_ASSOC);
		echo json_encode($tipoPub);
	}

	function modificaTipoPublicacion(){

		$request = \Slim\Slim::getInstance()->request(); //json parameters
		$data = json_decode($request->getBody());

		$con= getConnection();
		$pstmt = $con->prepare("UPDATE TIPOPUBLICACION T SET T.NOMBRE=?,T.DESCRIPCION=? WHERE T.IDTIPOPUBLICACION=?");
		$pstmt->execute(array($data->{"NOMBRE"},$data->{"DESCRIPCION"},$data->{"IDTIPOPUBLICACION"}));

		echo $request->getBody();
		//echo json_encode($val); 
	}

	function registraTipoPublicacion(){

		$request = \Slim\Slim::getInstance()->request(); //json parameters
	    $data = json_decode($request->getBody());

		$con= getConnection();
		$pstmt = $con->prepare("INSERT INTO TIPOPUBLICACION (NOMBRE,DESCRIPCION,ESTADO) VALUES (?,?,1)");
		$pstmt->execute(array($data->{"NOMBRE"},$data->{"DESCRIPCION"}));

		$lastInsertId = $con->lastInsertId();

		$array=array(
			array('IDTIPOPUBLICACION'=>$lastInsertId),
			array('NOMBRE'=>$data->{"NOMBRE"}),
			array('DESCRIPCION'=> $data->{"DESCRIPCION"})
		);

		echo json_encode($array);

	}

	function eliminaTipoPublicacion(){
		$request = \Slim\Slim::getInstance()->request(); //json parameters
		$data = json_decode($request->getBody());

		$con= getConnection();
		$pstmt = $con->prepare("UPDATE TIPOPUBLICACION T SET T.ESTADO = 0 WHERE T.IDTIPOPUBLICACION=?");
		$pstmt->execute(array($data->{"IDTIPOPUBLICACION"}));

		$array=array(
			array('IDTIPOPUBLICACION'=>$data->{"IDTIPOPUBLICACION"}),
			array('NOMBRE'=>$data->{"NOMBRE"}),
			array('DESCRIPCION'=> $data->{"DESCRIPCION"})
		);

		echo json_encode($array);
	}

?>