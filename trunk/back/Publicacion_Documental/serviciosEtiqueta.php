<?php
	//IMPORTS NECESARIOS
    header("Content-type: text/html; charset=utf8");
	include('routesEtiqueta.php');
	include ('modelEtiqueta.php');
	include_once '../back/conexion.php';

	function getListaEtiqueta(){
		$con=getConnection();
		$pstmt = $con->prepare("SELECT E.IDETIQUETA, E.NOMBRE, E.OBSERVACION, I.NOMBRE as IDIOMA,E.IDIDIOMA 
								FROM ETIQUETA E, IDIOMA I WHERE E.ESTADO=1 AND I.IDIDIOMA=E.IDIDIOMA");
		$pstmt->execute();

		$listaEtiqueta = array();
		while($element = $pstmt->fetch(PDO::FETCH_ASSOC)){
			$listaEtiqueta[] = $element;
		}
		echo json_encode($listaEtiqueta);
	}	

	function getEtiqueta($id){

	    $con=getConnection();	 
		$pstmt = $con->prepare("SELECT E.IDETIQUETA, E.NOMBRE, E.OBSERVACION, I.NOMBRE as IDIOMA,E.IDIDIOMA 
								FROM ETIQUETA E, IDIOMA I WHERE E.IDETIQUETA=? AND I.IDIDIOMA=E.IDIDIOMA");		
		$pstmt->execute(array($id));

		$etiqueta = $pstmt->fetch(PDO::FETCH_ASSOC);
		echo json_encode($etiqueta);
	}

	function modificaEtiqueta(){

		$request = \Slim\Slim::getInstance()->request(); //json parameters
		$data = json_decode($request->getBody());

		$con= getConnection();
		$pstmt = $con->prepare("UPDATE ETIQUETA E SET E.NOMBRE=?,E.OBSERVACION=?,E.IDIDIOMA=? WHERE E.IDETIQUETA=?");
		$pstmt->execute(array($data->{"NOMBRE"},$data->{"OBSERVACION"},$data->{"IDIDIOMA"},$data->{"IDETIQUETA"}));

		echo $request->getBody(); 
	}

	function registraEtiqueta(){

		$request = \Slim\Slim::getInstance()->request(); //json parameters
	    $data = json_decode($request->getBody());

		$con= getConnection();
		$pstmt = $con->prepare("INSERT INTO ETIQUETA (NOMBRE,OBSERVACION,ESTADO,IDIDIOMA) VALUES (?,?,1,?)");
		$pstmt->execute(array($data->{"NOMBRE"},$data->{"OBSERVACION"},$data->{"IDIDIOMA"}));

		$lastInsertId = $con->lastInsertId();

		$array=array(
			array('IDETIQUETA'=>$lastInsertId),
			array('NOMBRE'=>$data->{"NOMBRE"}),
			array('IDIOMA'=> $data->{"IDIOMA"}),
			array('OBSERVACION'=> $data->{"OBSERVACION"})

		);

		echo json_encode($array);

	}

	function eliminaEtiqueta(){
		$request = \Slim\Slim::getInstance()->request(); //json parameters
		$data = json_decode($request->getBody());

		$con= getConnection();
		$pstmt = $con->prepare("UPDATE ETIQUETA E SET E.ESTADO = 0 WHERE E.IDETIQUETA=?");
		$pstmt->execute(array($data->{"IDETIQUETA"}));

		$array=array(
			array('IDETIQUETA'=>$data->{"IDETIQUETA"}),
			array('NOMBRE'=>$data->{"NOMBRE"}),
			array('OBSERVACION'=> $data->{"OBSERVACION"})
		);

		echo json_encode($array);
	}

?>