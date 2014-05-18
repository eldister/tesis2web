<?php
	//IMPORTS NECESARIOS
    header("Content-type: text/html; charset=utf8");
	include('routesTipoFicha.php');
	include ('modelTipoFicha.php');
	include_once '../back/conexion.php';

	function getListaTipoFicha(){
		$con=getConnection();
		$pstmt = $con->prepare("SELECT T.IDTIPOFICHA, T.NOMBRE, T.DESCRIPCION FROM TIPOFICHA T WHERE T.ESTADO=1");
		$pstmt->execute(array());

		$listaTipoFicha = array();
		while($element = $pstmt->fetch(PDO::FETCH_ASSOC)){
			$listaTipoFicha[] = $element;
		}
		echo json_encode($listaTipoFicha);
	}	

	function getTipoFicha($id){

	    $con=getConnection();
	 
		$pstmt = $con->prepare("SELECT T.IDTIPOFICHA, T.NOMBRE, T.DESCRIPCION FROM TIPOFICHA T WHERE T.IDTIPOFICHA=?");
		$pstmt->execute(array($id));
		$tipoFicha = $pstmt->fetch(PDO::FETCH_ASSOC);
		echo json_encode($tipoFicha);
	}

	function modificaTipoFicha(){

		$request = \Slim\Slim::getInstance()->request(); //json parameters
		$data = json_decode($request->getBody());

		$con= getConnection();
		$pstmt = $con->prepare("UPDATE TIPOFICHA T SET T.NOMBRE=?,T.DESCRIPCION=? WHERE T.IDTIPOFICHA=?");
		$pstmt->execute(array($data->{"NOMBRE"},$data->{"DESCRIPCION"},$data->{"IDTIPOFICHA"}));

		echo $request->getBody(); 
	}

	function registraTipoFicha(){

		$request = \Slim\Slim::getInstance()->request(); //json parameters
	    $data = json_decode($request->getBody());
		$con= getConnection();
		$pstmt = $con->prepare("INSERT INTO TIPOFICHA (NOMBRE,DESCRIPCION,ESTADO) VALUES (?,?,1)");
		$pstmt->execute(array($data->{"NOMBRE"},$data->{"DESCRIPCION"}));

		$lastInsertId = $con->lastInsertId();

		$array=array(
			array('IDTIPOFICHA'=>$lastInsertId),
			array('NOMBRE'=>$data->{"NOMBRE"}),
			array('DESCRIPCION'=> $data->{"DESCRIPCION"})
		);

		echo json_encode($array);

	}

	function eliminaTipoFicha(){
		$request = \Slim\Slim::getInstance()->request(); //json parameters
		$data = json_decode($request->getBody());
		$con= getConnection();
		$pstmt = $con->prepare("UPDATE TIPOFICHA T SET T.ESTADO = 0 WHERE T.IDTIPOFICHA=?");
		$pstmt->execute(array($data->{"IDTIPOFICHA"}));

		$array=array(
			array('IDTIPOFICHA'=>$data->{"IDTIPOFICHA"}),
			array('NOMBRE'=>$data->{"NOMBRE"}),
			array('DESCRIPCION'=> $data->{"DESCRIPCION"})
		);
		echo json_encode($array);
	}

?>