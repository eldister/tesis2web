<?php
   // header("Content-type: text/html; charset=utf8");
	include('routesAutor.php');
	include ('modelAutor.php');
	include_once '../back/conexion.php';


function getListaAutor(){
		$request = \Slim\Slim::getInstance()->request();
		$con=getConnection();
		
		$pstmt = $con->prepare("SELECT A.IDAUTOR,A.NOM_APE,A.PAGINA_WEB,A.INSTITUCION,A.TRABAJO FROM AUTOR A WHERE A.ESTADO =1");
		$pstmt->execute();

		$listaAutor = array();
		while($req = $pstmt->fetch(PDO::FETCH_ASSOC)){
			$listaAutor[] = $req;
		}
		echo json_encode($listaAutor);
}

function getAutor($id){

    $con=getConnection();
 
	$pstmt = $con->prepare("SELECT A.IDAUTOR,A.NOM_APE,A.PAGINA_WEB,A.INSTITUCION,A.TRABAJO FROM AUTOR A WHERE A.IDAUTOR=?");
	$pstmt->execute(array($id));
	$AUTOR = $pstmt->fetch(PDO::FETCH_ASSOC);
	echo json_encode($AUTOR);
}

function modificaAutor(){

	$request = \Slim\Slim::getInstance()->request(); //json parameters
    $data = json_decode($request->getBody());

	$con= getConnection();
	$pstmt = $con->prepare("UPDATE AUTOR A SET A.NOM_APE=?,A.PAGINA_WEB=?,A.INSTITUCION=?,A.TRABAJO=? WHERE A.IDAUTOR=?");
	$pstmt->execute(array($data->{"NOM_APE"},$data->{"PAGINA_WEB"},$data->{"INSTITUCION"},$data->{"TRABAJO"},$data->{"IDAUTOR"));

	echo $request->getBody();
}


function registraAutor(){

	$request = \Slim\Slim::getInstance()->request(); //json parameters
    $data = json_decode($request->getBody());

	$con= getConnection();
	$pstmt = $con->prepare("INSERT INTO AUTOR (nom_ape,pagina_web,institucion,trabajo,estado) VALUES (?,?,?,?,1)");
	$pstmt->execute(array($data->{"NOM_APE"},$data->{"PAGINA_WEB"},$data->{"INSTITUCION"},$data->{"TRABAJO"}));

	$lastInsertId = $con->lastInsertId();

	$array=array(
			array('IDAUTOR'=>$lastInsertId),
			array('NOM_APE'=>$data->{"NOM_APE"}),
			array('PAGINA_WEB'=> $data->{"PAGINA_WEB"})
			array('INSTITUCION'=> $data->{"INSTITUCION"})
			array('TRABAJO'=> $data->{"TRABAJO"})
		);

	echo json_encode($array);
}

function eliminaAutor(){
	$request = \Slim\Slim::getInstance()->request(); //json parameters
	$data = json_decode($request->getBody());
	$con= getConnection();
	$pstmt = $con->prepare("UPDATE AUTOR A SET A.ESTADO = 0 WHERE A.IDAUTOR=?");
	$pstmt->execute(array($data->{"IDAUTOR"}));

	$array=array(
		array('IDAUTOR'=>$data->{"IDIDIOMA"}),
		array('NOM_APE'=>$data->{"NOMBRE"}),
		array('PAGINA_WEB'=> $data->{"PAGINA_WEB"})
		array('INSTITUCION'=> $data->{"INSTITUCION"})
		array('TRABAJO'=> $data->{"TRABAJO"})
		);
	echo json_encode($array);
}

?>