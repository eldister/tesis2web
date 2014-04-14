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

    //$request = \Slim\Slim::getInstance()->request();
   /// $val = $request->params();
   // $idReq= $val["ididioma"];
    $con=getConnection();
 
	$pstmt = $con->prepare("SELECT I.IDIDIOMA,I.NOMBRE,I.OBSERVACION FROM IDIOMA I WHERE I.IDIDIOMA=?");
	$pstmt->execute(array($id));
	$idioma = $pstmt->fetch(PDO::FETCH_ASSOC);
	echo json_encode($idioma);
}

?>