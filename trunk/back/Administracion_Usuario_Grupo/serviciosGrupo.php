<?php
   // header("Content-type: text/html; charset=utf8");
	include('routesGrupo.php');
	include_once '../back/conexion.php';


function registraGrupo(){

	$request = \Slim\Slim::getInstance()->request(); //json parameters
    $data = json_decode($request->getBody(),true);
    $estaResponsable=false;
	$con=getConnection();
		
    $NOMBRE=$data["NOMBRES"];
    $FECHA=$today = date("Y-m-d");
	$DESCRIPCION=$data["DESCRIPCION"];
    $ESTADO=1;
    $IDRESPONSABLE=$data[0][0];
	$IDGRUPO_PADRE=$data["IDGRUPO_PADRE"];

    $pstmt = $con->prepare("INSERT INTO GRUPO(NOMBRE,FECHA_CREACION,DESCRIPCION,ESTADO,IDGRUPO_PADRE,IDRESPONSABLE) 
			 VALUES(?,?,?,?,?,?)");
	$pstmt->execute(array($NOMBRE,$FECHA,$DESCRIPCION,$ESTADO,$IDGRUPO_PADRE,$IDRESPONSABLE));
	$lastInsertId = $con->lastInsertId();//ESTE ES EL ID DEL GRUPO QUE SE CREO
	echo $lastInsertId;

	$cantUsuarios=count($data[1]);

	for ($i = 1; $i <= $cantUsuarios; $i++) {
		$j=$i-1;

    	$var= $data[1][$j];
    	if(($var)==$IDRESPONSABLE) $estaResponsable=true;
    	$pstmt = $con->prepare("INSERT INTO USUARIOXGRUPO (IDUSUARIO,IDGRUPO,ESTADO) VALUES(?,?,?)");
		$pstmt->execute(array($var,$lastInsertId,1));
	}

	if ($estaResponsable==false){
		$pstmt = $con->prepare("INSERT INTO USUARIOXGRUPO (IDUSUARIO,IDGRUPO,ESTADO) VALUES(?,?,?)");
		$pstmt->execute(array($IDRESPONSABLE,$lastInsertId,1));
	}

	$grupo= [
		'NOMBRE'=> $NOMBRE,
		'FECHA'=> $FECHA,
		'DESCRIPCION'=> $DESCRIPCION,
		'IDRESPONSABLE'=> $IDRESPONSABLE,
		'IDGRUPO_PADRE'=> $IDGRUPO_PADRE,
		'USUARIOS'=> $data[1]
	];

	echo json_encode($grupo);
}

function getListaPersonas($id){
	$con=getConnection();
 
	$pstmt = $con->prepare("SELECT U.IDPERMISO FROM USUARIO U WHERE U.ESTADO = 1 AND U.IDUSUARIO=?");
	$pstmt->execute(array($id));
	$idPermiso = $pstmt->fetch(PDO::FETCH_ASSOC);

	if($idPermiso["IDPERMISO"]==1){ //SI ES EL ADMINISTRADOR PUEDE VER TODAS LAS PERSONAS

		$pstmt = $con->prepare("SELECT U.IDUSUARIO,U.NOMBRES,U.APELLIDOS FROM USUARIO U WHERE U.ESTADO = 1 AND U.IDUSUARIO NOT IN (?)");
		$pstmt->execute(array($id));
		$listaPersonas= array();

		while($row = $pstmt->fetch(PDO::FETCH_ASSOC)){
			$NOMBRE=$row["NOMBRES"].' '.$row["APELLIDOS"];
			$persona["IDUSUARIO"]=$row["IDUSUARIO"];
			$persona["NOMBRE"]=$NOMBRE;
			array_push($listaPersonas,$persona);
		}

		echo json_encode($listaPersonas);
	}
	else {



	}

	
}


?>