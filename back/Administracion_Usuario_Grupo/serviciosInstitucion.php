<?php
   // header("Content-type: text/html; charset=utf8");
	include('routesInstitucion.php');
	//include ('modelIdioma.php');
	include_once '../back/conexion.php';


function getListaInstitucion(){
		$request = \Slim\Slim::getInstance()->request();
		$con=getConnection();
		
		$pstmt = $con->prepare("SELECT I.IDINSTITUCION,I.NOMBRE_INSTITUCION,I.DESCRIPCION FROM INSTITUCION I WHERE I.ESTADO =1");
		$pstmt->execute();

		$listaInstitucion = array();
		while($req = $pstmt->fetch(PDO::FETCH_ASSOC)){
			$listaInstitucion[] = $req;
		}
		echo json_encode($listaInstitucion);
}

function getInstitucion($id){

    $con=getConnection();
 
	$pstmt = $con->prepare("SELECT I.IDINSTITUCION,I.NOMBRE_INSTITUCION,I.DESCRIPCION FROM INSTITUCION I WHERE I.IDINSTITUCION =?");
	$pstmt->execute(array($id));
	$IDINSTITUCION = $pstmt->fetch(PDO::FETCH_ASSOC);
	echo json_encode($IDINSTITUCION);
}

function modificaInstitucion(){

	$request = \Slim\Slim::getInstance()->request(); //json parameters
    $data = json_decode($request->getBody());

	$con= getConnection();
	$pstmt = $con->prepare("UPDATE INSTITUCION I SET I.NOMBRE_INSTITUCION=?,I.DESCRIPCION=? WHERE I.IDINSTITUCION=?");
	$pstmt->execute(array($data->{"NOMBRE_INSTITUCION"},$data->{"DESCRIPCION"},$data->{"IDINSTITUCION"}));

	echo $request->getBody();
}


function registraInstitucion(){

	$request = \Slim\Slim::getInstance()->request(); //json parameters
    $data = json_decode($request->getBody());

	$con= getConnection();
	$pstmt = $con->prepare("INSERT INTO INSTITUCION (NOMBRE_INSTITUCION,DESCRIPCION,ESTADO) VALUES (?,?,1)");
	$pstmt->execute(array($data->{"NOMBRE_INSTITUCION"},$data->{"ESTADO"}));

	$lastInsertId = $con->lastInsertId();

	$array=array(
			array('IDINSTITUCION'=>$lastInsertId),
			array('NOMBRE_INSTITUCION'=>$data->{"NOMBRE_INSTITUCION"}),
			array('DESCRIPCION'=> $data->{"DESCRIPCION"})
		);
	echo json_encode($array);
}

function eliminaInstitucion(){
	$request = \Slim\Slim::getInstance()->request(); //json parameters
	$data = json_decode($request->getBody());
	$con= getConnection();
	$pstmt = $con->prepare("UPDATE INSTITUCION T SET T.ESTADO = 0 WHERE T.IDINSTITUCION=?");
	$pstmt->execute(array($data->{"IDINSTITUCION"}));

	$array=array(
		array('IDINSTITUCION'=>$data->{"IDINSTITUCION"}),
		array('NOMBRE_INSTITUCION'=>$data->{"NOMBRE_INSTITUCION"}),
		array('DESCRIPCION'=> $data->{"DESCRIPCION"})
		);
	echo json_encode($array);
}

?>