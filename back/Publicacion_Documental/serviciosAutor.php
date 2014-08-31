<?php
   // header("Content-type: text/html; charset=utf8");
	include('routesAutor.php');
	//include ('modelAutor.php');
	include_once '../back/conexion.php';


function getListaAutor(){
		$request = \Slim\Slim::getInstance()->request();
		$con=getConnection();
		
		$pstmt = $con->prepare("SELECT A.IDAUTOR,A.NOM_APE,A.PAGINA_WEB,I.NOMBRE_INSTITUCION,A.TRABAJO FROM AUTOR A, INSTITUCION I WHERE A.ESTADO =1 AND 
								A.IDINSTITUCION=I.IDINSTITUCION");
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
	$pstmt->execute(array($data->{"NOM_APE"},$data->{"PAGINA_WEB"},$data->{"INSTITUCION"},$data->{"TRABAJO"},$data->{"IDAUTOR"}));

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
			//array('PAGINA_WEB'=> $data->{"PAGINA_WEB"}),
			array('INSTITUCION'=> $data->{"INSTITUCION"}),
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
		array('IDAUTOR'=>$data->{"IDAUTOR"}),
		array('NOM_APE'=>$data->{"NOM_APE"}),
		array('PAGINA_WEB'=> $data->{"PAGINA_WEB"}),
		array('INSTITUCION'=> $data->{"INSTITUCION"}),
		array('TRABAJO'=> $data->{"TRABAJO"})
		);
	echo json_encode($array);
}

function listaPublicacionAU(){

	$con= getConnection();
	$pstmt = $con->prepare("SELECT A.IDINSTITUCION,A.NOMBRE_INSTITUCION FROM INSTITUCION A  WHERE A.ESTADO=1");
	$pstmt->execute(array());

	$listaInstitucion = array();
		while($req = $pstmt->fetch(PDO::FETCH_ASSOC)){
			$listaInstitucion[] = $req;
		}
	echo json_encode($listaInstitucion);

}

/*function registraAutorIns(){

	$request = \Slim\Slim::getInstance()->request(); //json parameters
    $data = json_decode($request->getBody());

	$con= getConnection();
	$pstmt = $con->prepare("INSERT INTO AUTOR (nom_ape,pagina_web,institucion,trabajo,estado) VALUES (?,?,?,?,1)");
	$pstmt->execute(array($data->{"NOM_APE"},$data->{"PAGINA_WEB"},$data->{"INSTITUCION"},$data->{"TRABAJO"}));

	$lastInsertId = $con->lastInsertId();

	$array=array(
			array('IDAUTOR'=>$lastInsertId),
			array('NOM_APE'=>$data->{"NOM_APE"}),
			//array('PAGINA_WEB'=> $data->{"PAGINA_WEB"}),
			array('INSTITUCION'=> $data->{"INSTITUCION"}),
			array('TRABAJO'=> $data->{"TRABAJO"})
		);

	echo json_encode($array);
}*/

function registraAutorIns(){

	$request = \Slim\Slim::getInstance()->request(); //json parameters
    $data = json_decode($request->getBody(),TRUE);
	$con=getConnection();
		
    $IDINSTITUCION=$data[0][0];
    //printf($IDINSTITUCION);
    $pstmt = $con->prepare("INSERT INTO AUTOR(nom_ape,pagina_web,idinstitucion,trabajo,estado) VALUES (?,?,?,?,1)");
	$pstmt->execute(array($data["NOM_APE"],$data["PAGINA_WEB"],$IDINSTITUCION,$data["TRABAJO"]));

	$lastInsertId = $con->lastInsertId();
	echo json_encode($lastInsertId);
}

function registraInstitucion2(){

	$request = \Slim\Slim::getInstance()->request(); //json parameters
    $data = json_decode($request->getBody());
	$con=getConnection();
		
    $NOMBRE_INSTITUCION=$data->{"INSTITUCION"};
    $DESCRIPCION=$data->{"NOM_INSTITUCION"};
    $pstmt = $con->prepare("INSERT INTO INSTITUCION(nombre_institucion,descripcion,estado) VALUES (?,?,1)");
	$pstmt->execute(array($NOMBRE_INSTITUCION,$DESCRIPCION));

	$lastInsertId = $con->lastInsertId();
	$array=array(
			array('IDINSTITUCION'=>$lastInsertId),
			array('NOMBRE_INSTITUCION'=>$data->{"INSTITUCION"})
		);

	echo json_encode($array);

}

?>