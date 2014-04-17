<?php
   // header("Content-type: text/html; charset=utf8");
	include('routesIdioma.php');
	include ('modelIdioma.php');
	include_once '../back/conexion.php';


function getListaIdioma(){
		$request = \Slim\Slim::getInstance()->request();
		$con=getConnection();
		
		$pstmt = $con->prepare("SELECT I.IDIDIOMA,I.NOMBRE,I.OBSERVACION FROM IDIOMA I WHERE I.ESTADO =1");
		$pstmt->execute();

		$listaIdioma = array();
		while($req = $pstmt->fetch(PDO::FETCH_ASSOC)){
			$listaIdioma[] = $req;
		}
		echo json_encode($listaIdioma);
}

function getIdioma($id){

    $con=getConnection();
 
	$pstmt = $con->prepare("SELECT I.IDIDIOMA,I.NOMBRE,I.OBSERVACION FROM IDIOMA I WHERE I.IDIDIOMA=?");
	$pstmt->execute(array($id));
	$idioma = $pstmt->fetch(PDO::FETCH_ASSOC);
	echo json_encode($idioma);
}

function modificaIdioma(){

	$request = \Slim\Slim::getInstance()->request(); //json parameters
    $data = json_decode($request->getBody());

	$con= getConnection();
	$pstmt = $con->prepare("UPDATE IDIOMA I SET I.NOMBRE=?,I.OBSERVACION=? WHERE I.IDIDIOMA=?");
	$pstmt->execute(array($data->{"NOMBRE"},$data->{"OBSERVACION"},$data->{"IDIDIOMA"}));

	echo $request->getBody();
	//echo json_encode($val); 
}

?>