<?php
   // header("Content-type: text/html; charset=utf8");
	include('routesGrupo.php');
	include_once '../back/conexion.php';


function dameListaIntegrantes(){

	$request = \Slim\Slim::getInstance()->request(); //json parameters
    $data = json_decode($request->getBody());
    $IDGRUPO=$data->{"IDGRUPO"};
    $IDUSUARIO=$data->{"IDUSUARIO"};

    $con=getConnection();
    $pstmt = $con->prepare("SELECT U.NOMBRES,U.APELLIDOS, U.CORREO_INSTITUCIONAL, U.NUMERO_CELULAR
    						FROM USUARIOXGRUPO UG, USUARIO U  WHERE UG.IDGRUPO=? AND UG.ESTADO=1 AND UG.IDUSUARIO=U.IDUSUARIO");
	$pstmt->execute(array($IDGRUPO));

	$listaGrupo = array();
	while($req = $pstmt->fetch(PDO::FETCH_ASSOC)){
		$listaGrupo[] = $req;
	}

	echo json_encode($listaGrupo);
}

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

function damePermiso2($id){
	$con=getConnection();
	$pstmt = $con->prepare("SELECT U.IDPERMISO FROM USUARIO U WHERE U.ESTADO = 1 AND U.IDUSUARIO=?");
	$pstmt->execute(array($id));
	$idPermiso = $pstmt->fetch(PDO::FETCH_ASSOC);
	echo json_encode($idPermiso);
}

function damePermiso($id){
	$con=getConnection();
	$pstmt = $con->prepare("SELECT U.IDPERMISO FROM USUARIO U WHERE U.ESTADO = 1 AND U.IDUSUARIO=?");
	$pstmt->execute(array($id));
	$idPermiso = $pstmt->fetch(PDO::FETCH_ASSOC)["IDPERMISO"];
	return $idPermiso;
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

function dameCantPersonas($IDGRUPO){
	$con=getConnection();
 
	$pstmt = $con->prepare("SELECT count(U.IDUSUARIO) cantidad FROM USUARIOXGRUPO U WHERE U.ESTADO = 1 
							AND  U.IDGRUPO=?");
	$pstmt->execute(array($IDGRUPO));
	return $req = $pstmt->fetch(PDO::FETCH_ASSOC)["cantidad"];
}

function damePadreQueVeo(){
	
	$request = \Slim\Slim::getInstance()->request(); //json parameters
    $data = json_decode($request->getBody());
    $IDGRUPO=$data->{"IDGRUPO"};
    $IDUSUARIO=$data->{"IDUSUARIO"};

    if ($IDGRUPO==1){
		$ID=1;
		echo json_encode(array("IDGRUPO"=>$ID));	
		return;
	}

    $con=getConnection();
 
	$pstmt = $con->prepare("SELECT U.IDGRUPO,G.NOMBRE,G.IDGRUPO_PADRE,G.IDRESPONSABLE,G.DESCRIPCION FROM USUARIOXGRUPO U, GRUPO G  WHERE U.ESTADO = 1 
							AND U.IDUSUARIO=? AND G.IDGRUPO=U.IDGRUPO");
	$pstmt->execute(array($IDUSUARIO));


	$listaGrupo = array();
	while($req = $pstmt->fetch(PDO::FETCH_ASSOC)){
		$listaGrupo[] = $req;
	}

	$variable=damePadre($IDGRUPO);

	$ID=1;

	while (true) {
		if ($variable==1) {
			$ID=1;
			break;
		}
		if (estaEnLista($variable,$listaGrupo)==true){
			$ID=$variable;
			break;
		}
		$variable=damePadre($variable);
	}

	echo json_encode(array("IDGRUPO"=>$ID));	
}

function estaEnLista($id,$lista){
	$esta=false;
	$cantidad=count($lista);
	for($i=0;$i<$cantidad;$i++){
		if($lista[$i]["IDGRUPO"]==$id) return true;
	}
	return $esta;
}

function dameCantidadHijos($id,$lista){

	$con=getConnection();
	$pstmt = $con->prepare("SELECT G.IDGRUPO FROM  GRUPO G  WHERE G.ESTADO = 1 AND G.IDGRUPO_PADRE=?");
	$pstmt->execute(array($id));
	
	$i=0;
	while($req = $pstmt->fetch(PDO::FETCH_ASSOC)){
		if(estaLista($lista,$req["IDGRUPO"])==true){
			$i=1+dameCantidadHijos($req["IDGRUPO"],$lista);
		}
	}
	
	return $i;
}

function getListaGrupo(){

	$request = \Slim\Slim::getInstance()->request(); //json parameters
    $data = json_decode($request->getBody());
    $IDPADRE=$data->{"IDPADRE"};
    $IDUSUARIO=$data->{"IDUSUARIO"};
    

	$con=getConnection();
	//ECHO damePermiso($IDUSUARIO);
 	//------------------------------------------------------------------------------------------------------------------------
 	if(damePermiso($IDUSUARIO)==1){
 		//ECHO "SOY ADMINISTRADOR";
 		$pstmt = $con->prepare("SELECT G.IDGRUPO,G.NOMBRE,G.IDGRUPO_PADRE,G.IDRESPONSABLE,G.DESCRIPCION FROM  GRUPO G  WHERE G.ESTADO = 1 
								AND G.IDGRUPO>?");
		$pstmt->execute(array($IDPADRE));

		$listaGrupo = array();
			while($req = $pstmt->fetch(PDO::FETCH_ASSOC)){

				$grupo= [
					'IDGRUPO'=> $req["IDGRUPO"],
					'NOMBRE'=> $req["NOMBRE"],
					'DESCRIPCION'=> $req["DESCRIPCION"],
					'IDGRUPO_PADRE'=> $req["IDGRUPO_PADRE"],
					'IDRESPONSABLE'=> $req["IDRESPONSABLE"],
					'CANTIDAD'=> dameCantPersonas( $req["IDGRUPO"])
				];
				$listaGrupo[] = $grupo;
			}
		//ECHO json_encode($listaGrupo);	
 	}
 	else{
 		//ECHO "NO DEBO ENTRAR";
		$pstmt = $con->prepare("SELECT U.IDGRUPO,G.NOMBRE,G.IDGRUPO_PADRE,G.IDRESPONSABLE,G.DESCRIPCION FROM USUARIOXGRUPO U, GRUPO G  WHERE U.ESTADO = 1 
								AND U.IDUSUARIO=? AND G.IDGRUPO=U.IDGRUPO AND G.IDGRUPO>?");
		$pstmt->execute(array($IDUSUARIO,$IDPADRE));

		$listaGrupo = array();
		while($req = $pstmt->fetch(PDO::FETCH_ASSOC)){

			$grupo= [
				'IDGRUPO'=> $req["IDGRUPO"],
				'NOMBRE'=> $req["NOMBRE"],
				'DESCRIPCION'=> $req["DESCRIPCION"],
				'IDGRUPO_PADRE'=> $req["IDGRUPO_PADRE"],
				'IDRESPONSABLE'=> $req["IDRESPONSABLE"],
				'CANTIDAD'=> dameCantPersonas($req["IDGRUPO"])
			];
			$listaGrupo[] = $grupo;
		}
	}


	$listaGrupo1=array();
	for($i=0;$i<count($listaGrupo);$i++){
		$grupo2=[
				'IDGRUPO'=> $listaGrupo[$i]["IDGRUPO"],
				'NOMBRE'=> $listaGrupo[$i]["NOMBRE"],
				'DESCRIPCION'=> $listaGrupo[$i]["DESCRIPCION"],
				'IDGRUPO_PADRE'=> $listaGrupo[$i]["IDGRUPO_PADRE"],
				'IDRESPONSABLE'=> $listaGrupo[$i]["IDRESPONSABLE"],
				'CANTIDAD'=> $listaGrupo[$i]["CANTIDAD"],
				'HIJOS'=> dameCantidadHijos($listaGrupo[$i]["IDGRUPO"],$listaGrupo)
		];
		array_push($listaGrupo1, $grupo2);
	}


	 $cantUsuarios=count($listaGrupo1);
	 $listaGruposAver=array();

	 for ($i = 0; $i < $cantUsuarios; $i++) {
	 	if(veo_a_su_ancestro_dentro_de_la_lista($listaGrupo1,$listaGrupo1[$i]["IDGRUPO"])==false){
	 		array_push($listaGruposAver, $listaGrupo1[$i]);
	 	}
	 }

	 $listaGruposFinal=array();
	 $cantidadG=count($listaGruposAver);
	 for ($i=0;$i<$cantidadG;$i++){
	 	if(estaEnMiRama($listaGruposAver[$i]["IDGRUPO"],$IDPADRE)==true){
	 		array_push($listaGruposFinal,$listaGruposAver[$i]);
	 	}
	 }

	 echo json_encode($listaGruposFinal);
}

function estaEnMiRama($idHijo,$idpadre){
	$esta=false;

	if($idpadre==1)return true;

	$idp2=damePadre($idHijo);
	if($idp2==1)  return $esta;
	while(1){
		if($idp2==$idpadre)return true;
		$idp2=damePadre($idp2);
		if($idp2==1)  return false;
	}
	return false;
}

function damePadre($ID){
	$con1=getConnection();
 
	if($ID==1)return $ID;

	$pstmt = $con1->prepare("SELECT G.IDGRUPO_PADRE FROM GRUPO G  WHERE G.ESTADO = 1 AND G.IDGRUPO=?");
	$pstmt->execute(array($ID));
	$req = $pstmt->fetch(PDO::FETCH_ASSOC);
	return $req["IDGRUPO_PADRE"]; 
}

function estaLista($lista,$id){
	//busco si el id esta en la lista
	$cantidad=count($lista);
	for ($i=0;$i<$cantidad;$i++){
		if($lista[$i]["IDGRUPO"]==$id){
			return true;
		}
			
	}
	return false;
}


function veo_a_su_ancestro_dentro_de_la_lista($lista,$IDGRUPO){
	//$con=getConnection();
	$cantidadGrupos=count($lista);
	//echo $cantidadGrupos;

	$veo_a_su_ancestro=false;
	$idpadre=damePadre($IDGRUPO);
	//echo $idpadre;
	if($idpadre==1)  return $veo_a_su_ancestro;
	while(true){

		if(estaLista($lista,$idpadre)==true){
			return $veo_a_su_ancestro=true;
		}
		//echo $idpadre; // aca tabien cuidado
		$IDGRUPO=$idpadre;
		$idpadre=damePadre($IDGRUPO);
		if($idpadre==1)  return $veo_a_su_ancestro;
	}


	return $veo_a_su_ancestro;
}



?>