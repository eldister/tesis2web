<?php
   // header("Content-type: text/html; charset=utf8");
	include('routesGrupo.php');
	include_once '../back/conexion.php';


function eliminarGrupoB($IDGRUPO){
	//print_r($IDGRUPO);
	$con=getConnection();

	//$pstmt = $con->prepare("SELECT COUNT(G.IDGRUPO) as cantidad FROM GRUPO G WHERE G.IDGRUPO_PADRE=? AND G.ESTADO=1");
	//$pstmt->execute(array($IDGRUPO));

	//$cantidad = $pstmt->fetch(PDO::FETCH_ASSOC)["cantidad"]; //MIS HIJOS
	//echo "cantidad fuera de if"+$cantidad + "/n";

	//if($cantidad>0){
		//echo "cantidad dentro de if"+$cantidad + "/n";
		$pstmt = $con->prepare("SELECT G.IDGRUPO AS ID FROM GRUPO G WHERE G.IDGRUPO_PADRE=? AND G.ESTADO=1");
		$pstmt->execute(array($IDGRUPO));
		//print_r($pstmt->fetch(PDO::FETCH_ASSOC));

		while($req = $pstmt->fetch(PDO::FETCH_ASSOC)){
			$IDHIJO=$req["ID"];
			//print_r($IDHIJO);
			eliminarGrupoB($IDHIJO);

			/*$pstmt = $con->prepare("DELETE FROM USUARIOXGRUPO WHERE IDGRUPO=?");
			$pstmt->execute(array($IDHIJO));

			$pstmt = $con->prepare("DELETE FROM LISTAPUBXGRUPO WHERE IDGRUPO=?");
			$pstmt->execute(array($IDHIJO));

			$pstmt = $con->prepare("DELETE FROM GRUXPUBXUSU WHERE IDGRUPO=?");
			$pstmt->execute(array($IDHIJO));
			
			$pstmt = $con->prepare("DELETE FROM GRUXFIXUSU WHERE IDGRUPO=?");
			$pstmt->execute(array($IDHIJO));

			$pstmt = $con->prepare("DELETE FROM USUXARXGRU WHERE IDGRUPO=?");
			$pstmt->execute(array($IDHIJO));

			$pstmt = $con->prepare("DELETE FROM USUARIOXGRUPO WHERE IDGRUPO=?");
			$pstmt->execute(array($IDHIJO));

			$pstmt = $con->prepare("DELETE FROM GRUPO WHERE IDGRUPO=?");
			$pstmt->execute(array($IDHIJO));*/

		}
	//}

	//else if($cantidad == null){
		//echo "Cantidad en hoja" + $cantidad + "/n";
	$pstmt = $con->prepare("DELETE FROM USUARIOXGRUPO WHERE IDGRUPO=?");
	$pstmt->execute(array($IDGRUPO));

	$pstmt = $con->prepare("DELETE FROM LISTAPUBXGRUPO WHERE IDGRUPO=?");
	$pstmt->execute(array($IDGRUPO));

	$pstmt = $con->prepare("DELETE FROM GRUXPUBXUSU WHERE IDGRUPO=?");
	$pstmt->execute(array($IDGRUPO));
	
	$pstmt = $con->prepare("DELETE FROM GRUXFIXUSU WHERE IDGRUPO=?");
	$pstmt->execute(array($IDGRUPO));

	$pstmt = $con->prepare("DELETE FROM USUXARXGRU WHERE IDGRUPO=?");
	$pstmt->execute(array($IDGRUPO));

	$pstmt = $con->prepare("DELETE FROM USUARIOXGRUPO WHERE IDGRUPO=?");
	$pstmt->execute(array($IDGRUPO));

	$pstmt = $con->prepare("DELETE FROM GRUPO WHERE IDGRUPO=?");
	$pstmt->execute(array($IDGRUPO));

	//}

	//echo json_encode(array("status"=>1));
}


function eliminarGrupoN(){

	$request = \Slim\Slim::getInstance()->request(); //json parameters
    $data = json_decode($request->getBody());
    $IDGRUPO=$data->{"IDGRUPO"};

    eliminarGrupoB($IDGRUPO);

	echo json_encode(array("status"=>1));
}


function eliminaPublicacionXGrupo(){

	$request = \Slim\Slim::getInstance()->request(); //json parameters
    $data = json_decode($request->getBody());
    $IDGRUPO=$data->{"IDGRUPO"};
    echo $IDGRUPO;
    $IDPUBLICACION=$data->{"IDPUBLICACION"};
	
	$con=getConnection();

	$pstmt = $con->prepare("DELETE FROM GRUXPUBXUSU WHERE IDGRUPO=? AND IDPUBLICACION=?");
	$pstmt->execute(array($IDGRUPO,$IDPUBLICACION));
	
	$pstmt = $con->prepare("DELETE FROM GRUXFIXUSU WHERE IDGRUPO=? AND IDPUBLICACION=?");
	$pstmt->execute(array($IDGRUPO,$IDPUBLICACION));

	$pstmt = $con->prepare("DELETE FROM USUXARXGRU WHERE IDGRUPO=? AND IDPUBLICACION=?");
	$pstmt->execute(array($IDGRUPO,$IDPUBLICACION));
}	

function dameResponsableN(){

	$request = \Slim\Slim::getInstance()->request(); //json parameters
    $data = json_decode($request->getBody());
    $IDGRUPO=$data->{"IDGRUPO"};
    //$IDGRUPO=$data->{"IDGRUPO"};
	
	$con=getConnection();
	$pstmt = $con->prepare("SELECT G.IDRESPONSABLE FROM GRUPO G WHERE G.IDGRUPO=$IDGRUPO");
	$pstmt->execute();
	$ID = $pstmt->fetch(PDO::FETCH_ASSOC);
	ECHO json_encode($ID);
}

function getListaPublicacionesN($IDGRUPO){

	$request = \Slim\Slim::getInstance()->request(); //json parameters
    $data = json_decode($request->getBody());
    $IDUSUARIO=$data->{"IDUSUARIO"};
    //$IDGRUPO=$data->{"IDGRUPO"};
	
    $IDPERMISO=damePermiso($IDUSUARIO);
	$con=getConnection();

	if($IDPERMISO==1){
		$pstmt = $con->prepare("SELECT P.IDPUBLICACION, P.TITULO, P.FUENTE, P.OBTENIDO, P.ANIO,
										P.MES,P.PAGINAS,P.VOLUMEN,P.DOI, P.ISSN,P.FECHAREGISTRO,
										I.NOMBRE as IDIOMA,T.NOMBRE as TIPO
								FROM PUBLICACION P,IDIOMA I, TIPOPUBLICACION T 
								WHERE P.ESTADO=1 AND I.IDIDIOMA=P.IDIDIOMA 
								AND P.IDTIPOPUBLICACION=T.IDTIPOPUBLICACION AND P.IDPUBLICACION IN (select 
									g.IDPUBLICACION from gruxpubxusu g where g.idgrupo=$IDGRUPO)");
		$pstmt->execute();
	}
	else{
		$pstmt = $con->prepare("SELECT P.IDPUBLICACION, P.TITULO, P.FUENTE, P.OBTENIDO, P.ANIO,
										P.MES,P.PAGINAS,P.VOLUMEN,P.DOI, P.ISSN,P.FECHAREGISTRO,
										I.NOMBRE as IDIOMA,T.NOMBRE as TIPO
								FROM PUBLICACION P,IDIOMA I, TIPOPUBLICACION T 
								WHERE P.ESTADO=1 AND I.IDIDIOMA=P.IDIDIOMA 
								AND P.IDTIPOPUBLICACION=T.IDTIPOPUBLICACION AND P.IDPUBLICACION IN (select 
									g.IDPUBLICACION from gruxpubxusu g where g.idusuario=$IDUSUARIO and g.idgrupo=$IDGRUPO)");
		$pstmt->execute();
	}
		$listaPublicacion = array();
		while($element = $pstmt->fetch(PDO::FETCH_ASSOC)){
			$listaPublicacion[] = $element;
		}
		echo json_encode($listaPublicacion);
}	

function estaEnLaLista4($id,$lista){
	for($i=0;$i<count($lista);$i++){
		if($lista[$i]["IDUSUARIO"]==$id)return true;
	}
	return false;
}

function modificaGrupo(){

	$request = \Slim\Slim::getInstance()->request(); //json parameters
    $data = json_decode($request->getBody(),true);
    $estaResponsable=false;
	$con=getConnection();
		
	$IDGRUPO=$data["IDGRUPO"];	
	$IDUSUARIO=$data["IDUSUARIO"];
    $NOMBRE=$data["NOMBRE"];
    $FECHA=$data["FECHA"];
	$DESCRIPCION=$data["DESCRIPCION"];
    $ESTADO=1;

    $IDRESPONSABLE=$data[0][0];

    //MODIFICO EL IDRESPONSABLE
    $pstmt = $con->prepare("UPDATE GRUPO G SET  G.NOMBRE=?,G.DESCRIPCION=?,G.IDRESPONSABLE=? WHERE G.IDGRUPO=?");
	$pstmt->execute(array($NOMBRE,$DESCRIPCION,$IDRESPONSABLE,$IDGRUPO));

	//CREO LA LISTA DE PERSONAS QUE SE QUIEREN MODIFICAR
	$listaGrupoActual=array();
	$cantUsuarios=count($data[1]);

	for ($i = 1; $i <= $cantUsuarios; $i++) {
		$j=$i-1;

    	$var= $data[1][$j];
    	if(($var)==$IDRESPONSABLE) $estaResponsable=true;
    	$gr=[
			'IDUSUARIO'=>$var,
		];
    	array_push($listaGrupoActual, $gr);
	}

	if ($estaResponsable==false){
		$gr=[
			'IDUSUARIO'=>$IDRESPONSABLE,
		];
		array_push($listaGrupoActual, $gr);
	}
	//echo json_encode($listaGrupoActual);/////////////////////////////////////////////////////

	//SELECCIONO LAS PERSONAS DEL GRUPO
	$listaGrupoAnterior=array();
	$pstmt = $con->prepare("SELECT UG.IDUSUARIO FROM USUARIOXGRUPO UG WHERE UG.ESTADO=1 AND UG.IDGRUPO=?");
	$pstmt->execute(array($IDGRUPO));

	while($req = $pstmt->fetch(PDO::FETCH_ASSOC)){
		$gr=[
			'IDUSUARIO'=>$req["IDUSUARIO"],
		];

		array_push($listaGrupoAnterior, $gr);
	}

	$listaNuevo=array();
	$listaSeVa=array();
	//echo json_encode($listaGrupoAnterior);
	for($i=0;$i<count($listaGrupoActual);$i++){
		if(estaEnLaLista4($listaGrupoActual[$i]["IDUSUARIO"],$listaGrupoAnterior)==false){
			array_push($listaNuevo,$listaGrupoActual[$i]["IDUSUARIO"]);
		}

	}
	//echo json_encode($listaNuevo);

	for($i=0;$i<count($listaGrupoAnterior);$i++){
		if(estaEnLaLista4($listaGrupoAnterior[$i]["IDUSUARIO"],$listaGrupoActual)==false){
			array_push($listaSeVa,$listaGrupoAnterior[$i]["IDUSUARIO"]);
		}
	}

	//BORRO TODOS USUARIOS QUE YA SE MODIFICARON EN EL PROCESO	

	for($i=0;$i<count($listaSeVa);$i++){
		echo $listaSeVa[$i];
		$pstmt = $con->prepare("DELETE FROM USUARIOXGRUPO WHERE IDGRUPO=? AND idusuario=?");
		$pstmt->execute(array($IDGRUPO,$listaSeVa[$i]));

		$pstmt = $con->prepare("DELETE FROM GRUXPUBXUSU  WHERE IDGRUPO=? AND IDUSUARIO=?");
		$pstmt->execute(array($IDGRUPO,$listaSeVa[$i]));	
		
		$pstmt = $con->prepare("DELETE FROM GRUXFIXUSU  WHERE IDGRUPO=? AND IDUSUARIO=?");
		$pstmt->execute(array($IDGRUPO,$listaSeVa[$i]));

		$pstmt = $con->prepare("DELETE FROM USUXARXGRU  WHERE IDGRUPO=? AND IDUSUARIO=?");
		$pstmt->execute(array($IDGRUPO,$listaSeVa[$i]));
	}

	//ANADO TODOS USUARIOS QUE YA SE MODIFICARON EN EL PROCESO

	for($i=0;$i<count($listaNuevo);$i++){
		$pstmt = $con->prepare("INSERT INTO USUARIOXGRUPO(IDUSUARIO,IDGRUPO,ESTADO) VALUES(?,?,?)");
		$pstmt->execute(array($listaNuevo[$i],$IDGRUPO,1));

		//SELECCIONO LAS PUBLICACIONES, FICHAS Y ARCHIVOS A LAS QUE TENGO ACCESO
		$pstmt = $con->prepare("SELECT DISTINCT(GPU.IDPUBLICACION) FROM GRUXPUBXUSU GPU WHERE GPU.IDGRUPO=? AND GPU.ESTADO=1");
		$pstmt->execute(array($IDGRUPO));		

		$listaPublicacion=array();

		//SELECCIONO LAS PUBLICACIONES
		while($req = $pstmt->fetch(PDO::FETCH_ASSOC)){
			array_push($listaPublicacion, $req["IDPUBLICACION"]);
		}

		for($j=0;$j<count($listaPublicacion);$j++){
			$pstmt = $con->prepare("INSERT INTO GRUXPUBXUSU(IDUSUARIO,IDGRUPO,IDPUBLICACION,VISIBILIDAD,ESTADO) VALUES(?,?,?,?,?)");
			$pstmt->execute(array($listaNuevo[$i],$IDGRUPO,$listaPublicacion[$j],1,1));		

			//SELECCIONO LAS FICHAS
			$listaFichas=array();

			$pstmt = $con->prepare("SELECT DISTINCT(GFU.IDFICHABIB) FROM GRUXFIXUSU GFU WHERE GFU.IDGRUPO=? AND GFU.ESTADO=1 AND GFU.IDPUBLICACION=?");
			$pstmt->execute(array($IDGRUPO,$listaPublicacion[$j]));		

			while($req = $pstmt->fetch(PDO::FETCH_ASSOC)){
				array_push($listaFichas, $req["IDFICHABIB"]);
			}

			for($k=0;$k<count($listaFichas);$k++){
				$pstmt = $con->prepare("INSERT INTO GRUXFIXUSU(IDGRUPO,IDUSUARIO,IDFICHABIB,IDPUBLICACION,VISIBILIDAD,ESTADO) VALUES(?,?,?,?,?,?)");
				$pstmt->execute(array($IDGRUPO,$listaNuevo[$i],$listaFichas[$k],$listaPublicacion[$j],1,1));
			}

			//SELECCION LOS ARCHIVOS
			$listaArchivos=array();

			$pstmt = $con->prepare("SELECT DISTINCT(GPU.IDARCHIVO) FROM USUXARXGRU AU WHERE AU.IDGRUPO=? AND AU.ESTADO=1 AND AU.IDPUBLICACION=?");
			$pstmt->execute(array($IDGRUPO,$listaPublicacion[$j]));		

			while($req = $pstmt->fetch(PDO::FETCH_ASSOC)){
				array_push($listaArchivos, $req["IDARCHIVO"]);
			}

			for($k=0;$k<count($listaArchivos);$k++){
				$pstmt = $con->prepare("INSERT INTO USUXARXGRU(IDGRUPO,IDUSUARIO,IDARCHIVO,IDPUBLICACION,VISIBILIDAD,ESTADO) VALUES(?,?,?,?,?,?)");
				$pstmt->execute(array($IDGRUPO,$listaNuevo[$i],$listaArchivos[$k],$listaPublicacion[$j],1,1));
			}
		}	
	}
	echo json_encode(array("status"=>1));
}

function damePersonas4(){
	$request = \Slim\Slim::getInstance()->request(); //json parameters
    $data = json_decode($request->getBody());
    //$IDGRUPO=$data->{"IDGRUPO"};
    $IDUSUARIO=$data->{"IDUSUARIO"};

    $con=getConnection();

	//$pstmt = $con->prepare("SELECT U.IDUSUARIO,U.NOMBRES,U.APELLIDOS
    //						FROM USUARIOXGRUPO UG, USUARIO U  WHERE UG.IDGRUPO=? AND UG.ESTADO=1 AND U.IDUSUARIO NOT IN (?)
    //						AND UG.IDUSUARIO=U.IDUSUARIO");
	//$pstmt->execute(array($IDGRUPO,$IDUSUARIO));

	$pstmt = $con->prepare("SELECT U.IDUSUARIO,U.NOMBRES,U.APELLIDOS
    						FROM USUARIO U  WHERE U.ESTADO=1 AND U.IDPERMISO NOT IN (1) ");
	$pstmt->execute(array());

	$listaGrupo = array();
	while($req = $pstmt->fetch(PDO::FETCH_ASSOC)){
		$gr=[
			'IDUSUARIO'=>$req["IDUSUARIO"],
			'NOMBRES'=>$req["NOMBRES"]. ' '.$req["APELLIDOS"]
		];

		array_push($listaGrupo, $gr);
	}
	echo json_encode($listaGrupo);

}




function damePersonas2(){

	$request = \Slim\Slim::getInstance()->request(); //json parameters 
    $data = json_decode($request->getBody());
    $IDGRUPO=$data->{"IDGRUPO"};
    $IDUSUARIO=$data->{"IDUSUARIO"};

    $con=getConnection();

	//$pstmt = $con->prepare("SELECT U.IDUSUARIO,U.NOMBRES,U.APELLIDOS
    //						FROM USUARIOXGRUPO UG, USUARIO U  WHERE UG.IDGRUPO=? AND UG.ESTADO=1 AND U.IDUSUARIO NOT IN (?)
    //						AND UG.IDUSUARIO=U.IDUSUARIO");
	//$pstmt->execute(array($IDGRUPO,$IDUSUARIO));

	$pstmt = $con->prepare("SELECT U.IDUSUARIO,U.NOMBRES,U.APELLIDOS
    						FROM USUARIO U  WHERE U.ESTADO=1 AND U.IDPERMISO NOT IN (1)");
	$pstmt->execute(array());

	$listaGrupo = array();
	while($req = $pstmt->fetch(PDO::FETCH_ASSOC)){
		$gr=[
			'IDUSUARIO'=>$req["IDUSUARIO"],
			'NOMBRES'=>$req["NOMBRES"]. ' '.$req["APELLIDOS"]
		];

		array_push($listaGrupo, $gr);
	}
	echo json_encode($listaGrupo);

}


function damePersonas3(){

	$request = \Slim\Slim::getInstance()->request(); //json parameters
    $data = json_decode($request->getBody());
    $IDGRUPO=$data->{"IDGRUPO"};
    $IDUSUARIO=$data->{"IDUSUARIO"};

    $con=getConnection();

	$pstmt = $con->prepare("SELECT U.IDUSUARIO,U.NOMBRES,U.APELLIDOS
    						FROM USUARIOXGRUPO UG, USUARIO U  WHERE UG.IDGRUPO=? AND UG.ESTADO=1
    						AND UG.IDUSUARIO=U.IDUSUARIO");
	$pstmt->execute(array($IDGRUPO));

	$listaGrupo = array();
	while($req = $pstmt->fetch(PDO::FETCH_ASSOC)){
		$gr=[
			'IDUSUARIO'=>$req["IDUSUARIO"],
			'NOMBRES'=>$req["NOMBRES"]. ' '.$req["APELLIDOS"]
		];

		array_push($listaGrupo, $gr);
	}
	echo json_encode($listaGrupo);

}

/*function damePersonas3(){

	$request = \Slim\Slim::getInstance()->request(); //json parameters
    $data = json_decode($request->getBody());
    $IDGRUPO=$data->{"IDGRUPO"};
    $IDUSUARIO=$data->{"IDUSUARIO"};

    $con=getConnection();

	$pstmt = $con->prepare("SELECT U.IDUSUARIO,U.NOMBRES,U.APELLIDOS
    						FROM USUARIOXGRUPO UG, USUARIO U  WHERE UG.IDGRUPO=? AND UG.ESTADO=1
    						AND UG.IDUSUARIO=U.IDUSUARIO");
	$pstmt->execute(array($IDGRUPO));

	$listaGrupo = array();
	while($req = $pstmt->fetch(PDO::FETCH_ASSOC)){
		$gr=[
			'IDUSUARIO'=>$req["IDUSUARIO"],
			'NOMBRES'=>$req["NOMBRES"]. ' '.$req["APELLIDOS"]
		];

		array_push($listaGrupo, $gr);
	}
	echo json_encode($listaGrupo);

}
*/	
function dameGrupo(){

	$request = \Slim\Slim::getInstance()->request(); //json parameters
    $data = json_decode($request->getBody());
    $IDGRUPO=$data->{"IDGRUPO"};
    $IDUSUARIO=$data->{"IDUSUARIO"};

    $con=getConnection();

    //SACO INFORMACION DEL GRUPO
    $pstmt = $con->prepare("SELECT G.NOMBRE,G.FECHA_CREACION,G.DESCRIPCION FROM GRUPO G WHERE G.ESTADO=1 AND G.IDGRUPO=?");
	$pstmt->execute(array($IDGRUPO));

	while($row = $pstmt->fetch(PDO::FETCH_ASSOC)){
			$NOMBRE=$row["NOMBRE"];
			$FECHA_CREACION=$row["FECHA_CREACION"];
			$DESCRIPCION=$row["DESCRIPCION"];
	}

	//SACO AL RESPONSABLE
	$pstmt = $con->prepare("SELECT U.IDUSUARIO,U.NOMBRES,U.APELLIDOS
    						FROM  USUARIO U, GRUPO G  WHERE G.IDGRUPO=? AND G.ESTADO=1 AND G.IDRESPONSABLE=U.IDUSUARIO");
	$pstmt->execute(array($IDGRUPO));
	$resp = array();
	while($req = $pstmt->fetch(PDO::FETCH_ASSOC)){
		$gr=[
			'IDUSUARIO'=>$req["IDUSUARIO"],
			'NOMBRES'=>$req["NOMBRES"]. ' '.$req["APELLIDOS"]
		];
		$IDRESPONSABLE2=$gr["IDUSUARIO"];
		array_push($resp, $gr);
	}


	//SACO INFORMACION DE LOS INTEGRANTES
    $pstmt = $con->prepare("SELECT U.IDUSUARIO,U.NOMBRES,U.APELLIDOS
    						FROM USUARIOXGRUPO UG, USUARIO U  WHERE UG.IDGRUPO=? AND UG.ESTADO=1 AND UG.IDUSUARIO=U.IDUSUARIO AND 
    						U.IDUSUARIO NOT IN (?,?)");
	$pstmt->execute(array($IDGRUPO,$IDUSUARIO,$IDRESPONSABLE2));

	$listaGrupo = array();
	while($req = $pstmt->fetch(PDO::FETCH_ASSOC)){
		$gr=[
			'IDUSUARIO'=>$req["IDUSUARIO"],
			'NOMBRES'=>$req["NOMBRES"]. ' '.$req["APELLIDOS"]
		];

		array_push($listaGrupo, $gr);
	}

	//SACO AL RESPONSABLE
	$pstmt = $con->prepare("SELECT U.IDUSUARIO,U.NOMBRES,U.APELLIDOS
    						FROM  USUARIO U, GRUPO G  WHERE G.IDGRUPO=? AND G.ESTADO=1 AND G.IDRESPONSABLE=U.IDUSUARIO");
	$pstmt->execute(array($IDGRUPO));
	$resp = array();
	while($req = $pstmt->fetch(PDO::FETCH_ASSOC)){
		$gr=[
			'IDUSUARIO'=>$req["IDUSUARIO"],
			'NOMBRES'=>$req["NOMBRES"]. ' '.$req["APELLIDOS"]
		];

		array_push($resp, $gr);
	}

	$grupo=[
		'NOMBRE'=> $NOMBRE,
		'FECHA'=> $FECHA_CREACION,
		'DESCRIPCION'=> $DESCRIPCION,
		'USUARIOS'=> $listaGrupo,
		'RESPONSABLE'=>$resp
	];

	echo json_encode($grupo);

}


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
	//echo $lastInsertId;

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
 
	$pstmt = $con->prepare("SELECT count(*) cantidad FROM USUARIOXGRUPO U WHERE U.ESTADO = 1 
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
 	$permiso=damePermiso($IDUSUARIO);

 	if($permiso==1){
 		$pstmt = $con->prepare("SELECT G.IDGRUPO,G.NOMBRE,G.IDGRUPO_PADRE,G.IDRESPONSABLE,G.DESCRIPCION FROM  GRUPO G  WHERE G.ESTADO = 1");
		$pstmt->execute(array());


		$listaGrupo = array();
		while($req = $pstmt->fetch(PDO::FETCH_ASSOC)){
			$listaGrupo[] = $req;
		}
 	}
 	else{
 		$pstmt = $con->prepare("SELECT U.IDGRUPO,G.NOMBRE,G.IDGRUPO_PADRE,G.IDRESPONSABLE,G.DESCRIPCION FROM USUARIOXGRUPO U, GRUPO G  WHERE U.ESTADO = 1 
								AND U.IDUSUARIO=? AND G.IDGRUPO=U.IDGRUPO");
		$pstmt->execute(array($IDUSUARIO));


		$listaGrupo = array();
		while($req = $pstmt->fetch(PDO::FETCH_ASSOC)){
			$listaGrupo[] = $req;
		}
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
					'CANTIDAD'=> dameCantPersonas($req["IDGRUPO"])
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


function dameGrupo2(){

	$request = \Slim\Slim::getInstance()->request(); //json parameters
    $data = json_decode($request->getBody());
    $IDGRUPO=$data->{"IDGRUPO"};
    $IDUSUARIO=$data->{"IDUSUARIO"};

    $con=getConnection();

    //SACO INFORMACION DEL GRUPO
    $pstmt = $con->prepare("SELECT G.NOMBRE,G.FECHA_CREACION,G.DESCRIPCION FROM GRUPO G WHERE G.ESTADO=1 AND G.IDGRUPO=?");
	$pstmt->execute(array($IDGRUPO));

	while($row = $pstmt->fetch(PDO::FETCH_ASSOC)){
			$NOMBRE=$row["NOMBRE"];
			$FECHA_CREACION=$row["FECHA_CREACION"];
			$DESCRIPCION=$row["DESCRIPCION"];
	}

	//SACO AL RESPONSABLE
	$pstmt = $con->prepare("SELECT U.IDUSUARIO,U.NOMBRES,U.APELLIDOS
    						FROM  USUARIO U, GRUPO G  WHERE G.IDGRUPO=? AND G.ESTADO=1 AND G.IDRESPONSABLE=U.IDUSUARIO");
	$pstmt->execute(array($IDGRUPO));
	//$resp = array();
	$resp="";
	while($req = $pstmt->fetch(PDO::FETCH_ASSOC)){
		$gr=[
			'IDUSUARIO'=>$req["IDUSUARIO"],
			'NOMBRES'=>$req["NOMBRES"]. ' '.$req["APELLIDOS"]
		];

		//array_push($resp, $gr);
		$aux=$req["NOMBRES"]. ' '.$req["APELLIDOS"]. ' ';
		//echo $aux;
		$resp=$resp. ' '.$aux;
	}

	$IDRESPONSABLE2=$gr["IDUSUARIO"];
	//echo $IDRESPONSABLE2;

	//SACO INFORMACION DE LOS INTEGRANTES
    $pstmt = $con->prepare("SELECT U.IDUSUARIO,U.NOMBRES,U.APELLIDOS
    						FROM USUARIOXGRUPO UG, USUARIO U  WHERE UG.IDGRUPO=? AND UG.ESTADO=1 AND UG.IDUSUARIO=U.IDUSUARIO AND 
    						U.IDUSUARIO NOT IN (?)");
	$pstmt->execute(array($IDGRUPO,$IDRESPONSABLE2));

	$listaGrupo = array();
	$personas="";
	while($req = $pstmt->fetch(PDO::FETCH_ASSOC)){
		$gr=[
			'IDUSUARIO'=>$req["IDUSUARIO"],
			'NOMBRES'=>$req["NOMBRES"]. ' '.$req["APELLIDOS"]
		];
		$aux=$req["NOMBRES"]. ' '.$req["APELLIDOS"]. '  ; ';
		$personas=$personas. ' '.$aux;
		//array_push($listaGrupo, $gr);
	}

	

	$grupo=[
		'NOMBRE'=> $NOMBRE,
		'FECHA'=> $FECHA_CREACION,
		'DESCRIPCION'=> $DESCRIPCION,
		'INTEGRANTES'=> $personas,
		'RESPONSABLE'=>$resp
	];

	echo json_encode($grupo);

}




?>