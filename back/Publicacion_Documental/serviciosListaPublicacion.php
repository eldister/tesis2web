<?php
    header("Content-type: text/html; charset=utf8");
	include('routesListaPublicacion.php');
	include_once '../back/conexion.php';

	function getListaListaPublicacion(){
		$request = \Slim\Slim::getInstance()->request();
		$data = json_decode($request->getBody(),TRUE);

	    $permiso=getPermisoUsuario($data["idUsuario"]);

	    $con=getConnection();

	    if($permiso["IDPERMISO"]!=1){
			$pstmt = $con->prepare("SELECT L.idlistapublicacion, L.nombreabr, DATE_FORMAT(L.fecharegistro,'%e-%m-%y') as 									fecharegistro, L.estado 
    								from listapublicacion L, listapubxgrupo G
    								where L.idlistapublicacion = G.idlistapublicacion and G.idgrupo=? and L.estado=1");
			$pstmt->execute(array($data["idMiGrupo"]));
		}
		else{ //es admin
			$pstmt = $con->prepare("SELECT L.idlistapublicacion, L.nombreabr, DATE_FORMAT(L.fecharegistro,'%e-%m-%y') as 									fecharegistro, L.estado 
    								from listapublicacion L, listapubxgrupo G where L.estado=1");
			$pstmt->execute();			
		}

		$listaListaPublicaciones = array();
		while($element = $pstmt->fetch(PDO::FETCH_ASSOC)){
			$listaListaPublicaciones[] = $element;
		}
		echo json_encode($listaListaPublicaciones);
	}

	function getPublicacionesLista(){
		$request = \Slim\Slim::getInstance()->request();
		$data = json_decode($request->getBody(),TRUE);

		$con=getConnection();
		$pstmt = $con->prepare("SELECT LP.NOMBREABR, L.IDLECTURAASIGNADA, L.TITULO, L.PALABRASCLAVE, L.NOTASLECTURA, 
								L.OBSERVACIONES, L.AUTORES, A.URL, P.IDPUBLICACION
								from LECTURAASIGNADA L, ARCHIVO A, LISTAPUBLICACION LP, PUBLICACION P
								WHERE L.IDLISTAPUBLICACION=? AND A.IDARCHIVO=L.IDARCHIVO AND 
									LP.IDLISTAPUBLICACION=L.IDLISTAPUBLICACION AND P.IDPUBLICACION=A.IDPUBLICACION");
		$pstmt->execute(array($data["idlp"]));

		$listaLecturas = array();
		while($element = $pstmt->fetch(PDO::FETCH_ASSOC)){
			$listaLecturas[] = $element;
		}
		echo json_encode($listaLecturas);
	}

	function getGrupoListaPublicacion($id){

		$con=getConnection();
		$pstmt = $con->prepare("SELECT G.IDGRUPO, G.NOMBRE 
			  					from listapublicacion L,grupo G, LISTAPUBXGRUPO LG
			 					where LG.IDLISTAPUBLICACION=L.IDLISTAPUBLICACION and G.idgrupo=LG.idgrupo
										and LG.IDLISTAPUBLICACION=?");
		$listaGrupo = array();
		$pstmt->execute(array($id));
		while($element = $pstmt->fetch(PDO::FETCH_ASSOC)){
			$listaGrupo[] = $element;
		}
		echo json_encode($listaGrupo);
	}

	function obtieneIdArchivo($idpub){
		$con=getConnection();
		$pstmt = $con->prepare("SELECT  A.IDARCHIVO FROM ARCHIVO A, PUBLICACION P WHERE A.IDPUBLICACION=? 
									AND (A.FORMATO='application/pdf' OR A.FORMATO='application/force-download') LIMIT 1 ");

		$pstmt->execute(array($idpub));
		$idarchivo = $pstmt->fetch(PDO::FETCH_ASSOC);
		return $idarchivo["IDARCHIVO"];

	}

	function registraListaPublicacion(){
		$request = \Slim\Slim::getInstance()->request();
		$data = json_decode($request->getBody(),TRUE);

		$con=getConnection();

		$pstmt = $con->prepare("INSERT INTO LISTAPUBLICACION VALUES(null,?,'1000',CURDATE(),1)");
		$pstmt->execute(array($data["tema"]));

		$lastLista = $con->lastInsertId();

		for($i=0; $i<count($data["grupos"]); $i++) {
			$idgrupo=$data["grupos"][$i]["id"];
			$pstmt = $con->prepare("INSERT INTO LISTAPUBXGRUPO VALUES(?,?)");
			$pstmt->execute(array($idgrupo,$lastLista));
		}

		$mensajes=array();

		for($i=0; $i<count($data["lecturas"]); $i++) {
			$lectura=$data["lecturas"][$i];
			$idarchivo = obtieneIdArchivo($lectura["idpublicacion"]);
			if($idarchivo==null) {
				$mensajes[]="error";
				break;
			}
			$pstmt = $con->prepare("INSERT INTO LECTURAASIGNADA VALUES(null,?,?,?,?,?,?,?)");
			$pstmt->execute(array($lectura["titulo"],$lectura["palabrasclave"],$lectura["notaslectura"],
									$lectura["observaciones"],$lectura["autores"],$lastLista,$idarchivo));
		}

		if(count($mensajes)>0){
			echo json_encode(array("status"=>0));
		}
		else echo json_encode(array("status"=>1));

	}

	function modificaListaPublicacion(){
		$request = \Slim\Slim::getInstance()->request();
		$data = json_decode($request->getBody(),TRUE);

		$con=getConnection();

		$pstmt = $con->prepare("UPDATE LISTAPUBLICACION SET NOMBREABR=? WHERE IDLISTAPUBLICACION=?");
		$pstmt->execute(array($data["tema"],$data["idlp"]));

		//GRUPOS
		$pstmt = $con->prepare("DELETE FROM LISTAPUBXGRUPO WHERE IDLISTAPUBLICACION=?");
		$pstmt->execute(array($data["idlp"]));
		for($i=0; $i<count($data["grupos"]); $i++) {
			$idgrupo=$data["grupos"][$i]["id"];
			$pstmt = $con->prepare("INSERT INTO LISTAPUBXGRUPO VALUES(?,?)");
			$pstmt->execute(array($idgrupo,$data["idlp"]));
		}

		//PUBLICACIONES
		$pstmt = $con->prepare("DELETE FROM LECTURAASIGNADA WHERE IDLISTAPUBLICACION=?");
		$pstmt->execute(array($data["idlp"]));

		$mensajes=array();

		for($i=0; $i<count($data["lecturas"]); $i++) {
			$lectura=$data["lecturas"][$i];
			$idarchivo = obtieneIdArchivo($lectura["idpublicacion"]);
			if($idarchivo==null) {
				$mensajes[]="error";
				break;
			}
			$pstmt = $con->prepare("INSERT INTO LECTURAASIGNADA VALUES(null,?,?,?,?,?,?,?)");
			$pstmt->execute(array($lectura["titulo"],$lectura["palabrasclave"],$lectura["notaslectura"],
									$lectura["observaciones"],$lectura["autores"],$data["idlp"],$idarchivo));
		}

		if(count($mensajes)>0){
			echo json_encode(array("status"=>0));
		}
		else echo json_encode(array("status"=>1));

	}

	function eliminaListaPublicacion(){
		$request = \Slim\Slim::getInstance()->request();
		$data = json_decode($request->getBody(),TRUE);

		$con=getConnection();

		$pstmt = $con->prepare("UPDATE LISTAPUBLICACION SET ESTADO=0 WHERE IDLISTAPUBLICACION=?");
		$pstmt->execute(array($data["idlp"]));

		echo json_encode(array("IDLISTAPUBLICACION"=>$data["idlp"]));
	}

	function buscarPublicacion(){
		$request = \Slim\Slim::getInstance()->request();
		$data = json_decode($request->getBody(),TRUE);

		$con=getConnection();

		$sql = "SELECT P.IDPUBLICACION,
				    P.TITULO,	
				    T.NOMBRE as TIPO,
				    I.NOMBRE as IDIOMA,
				   (select distinct
				            GROUP_CONCAT(tabla.autor
				                    SEPARATOR ', ') as autores
				        FROM            
				            (select 
				                A.nom_ape AS AUTOR, PU.idpublicacion
				            FROM
				                PUBLICACIONXAUTOR PA, AUTOR A, publicacion PU
				            where
				                PA.IDAUTOR = A.IDAUTOR
				                    AND PA.IDPUBLICACION = PU.IDPUBLICACION) as tabla
				        where
				            tabla.idpublicacion = p.idpublicacion) AS AUTORES
				from
				    publicacion P,
				    tipopublicacion T,
				    idioma I
				where
				    T.idtipopublicacion = P.idtipopublicacion
				        and P.ididioma = I.ididioma
				        and P.titulo like CONCAT('%',?,'%')";
		
		$pstmt = $con->prepare($sql);
		$pstmt->execute(array($data["criterio"]));

		$listaPublicaciones = array();
		while($req = $pstmt->fetch(PDO::FETCH_ASSOC)){
			$listaPublicaciones[] = $req;
		}
		echo json_encode($listaPublicaciones);

	}

?>