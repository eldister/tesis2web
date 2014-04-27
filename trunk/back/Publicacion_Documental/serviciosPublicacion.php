<?php
	//IMPORTS NECESARIOS
    header("Content-type: text/html; charset=utf8");
	include('routesPublicacion.php');
	include ('modelPublicacion.php');
	include_once '../back/conexion.php';

	function getListaPublicacion(){
		$con=getConnection();
		$pstmt = $con->prepare("SELECT P.IDPUBLICACION, P.TITULO, P.FUENTE, P.OBTENIDO, P.ANIO,
										P.MES,P.PAGINAS,P.VOLUMEN,P.DOI, P.ISSN,P.FECHAREGISTRO,
										I.NOMBRE as IDIOMA,T.NOMBRE as TIPO
								FROM PUBLICACION P,IDIOMA I, TIPOPUBLICACION T 
								WHERE P.ESTADO=1 AND I.IDIDIOMA=P.IDIDIOMA 
								AND P.IDTIPOPUBLICACION=T.IDTIPOPUBLICACION");
		$pstmt->execute();

		$listaPublicacion = array();
		while($element = $pstmt->fetch(PDO::FETCH_ASSOC)){
			$listaPublicacion[] = $element;
		}
		echo json_encode($listaPublicacion);
	}	

	function getPublicacion($id){

	    $con=getConnection();
	 
		$pstmt = $con->prepare("SELECT  P.TITULO, P.FUENTE, P.OBTENIDO, P.ANIO,
										P.MES,P.PAGINAS,P.VOLUMEN,P.DOI, P.ISSN,P.FECHAREGISTRO,
										I.NOMBRE as IDIOMA,T.NOMBRE as TIPO, P.IDIDIOMA, P.IDTIPOPUBLICACION
								FROM PUBLICACION P,IDIOMA I, TIPOPUBLICACION T 
								WHERE P.IDPUBLICACION=? AND I.IDIDIOMA=P.IDIDIOMA 
								AND P.IDTIPOPUBLICACION=T.IDTIPOPUBLICACION");
		$pstmt->execute(array($id));
		$publicacion = $pstmt->fetch(PDO::FETCH_ASSOC);
		echo json_encode($publicacion);
	}

	function modificaPublicacion(){

		$request = \Slim\Slim::getInstance()->request(); //json parameters
		$data = json_decode($request->getBody());

		try{
			$con= getConnection();
			$pstmt = $con->prepare("UPDATE PUBLICACION P 
									SET P.TITULO=?,P.FUENTE=?,P.OBTENIDO=?,P.ANIO=?,P.MES=?,P.PAGINAS=?, 
										P.VOLUMEN=?,P.DOI=?,P.ISSN=?,P.IDIDIOMA=?,P.IDTIPOPUBLICACION=?
									WHERE P.IDPUBLICACION=?");
			
			$pstmt->execute(array($data->{"TITULO"},
								  $data->{"FUENTE"},
								  $data->{"OBTENIDO"},
								  $data->{"ANIO"},
								  $data->{"MES"},
								  $data->{"PAGINAS"},
								  $data->{"VOLUMEN"},
								  $data->{"DOI"},
								  $data->{"ISSN"},
								  $data->{"IDIDIOMA"},
								  $data->{"IDTIPOPUBLICACION"},
								  $data->{"IDPUBLICACION"}
								  )
							);

			$array=array('IDPUBLICACION'=>$data->{"IDPUBLICACION"});
			echo json_encode($array);

		}catch (PDOException $e){
			echo json_encode(array("me" => $e->getMessage()));
		}
	}

	function registraPublicacion(){

		$request = \Slim\Slim::getInstance()->request(); //json parameters
	    $data = json_decode($request->getBody());

	    try{
			$con= getConnection();
			$pstmt = $con->prepare("INSERT INTO PUBLICACION (TITULO,FUENTE,OBTENIDO,ANIO,MES,PAGINAS,
									VOLUMEN,DOI,ISSN,ESTADO,FECHAREGISTRO,IDIDIOMA,IDTIPOPUBLICACION) 
									VALUES (?,?,?,?,?,?,?,?,?,1,CURDATE(),?,?)");

			$pstmt->execute(array($data->{"TITULO"},
								  $data->{"FUENTE"},
								  $data->{"OBTENIDO"},
								  $data->{"ANIO"},
								  $data->{"MES"},
								  $data->{"PAGINAS"},
								  $data->{"VOLUMEN"},
								  $data->{"DOI"},
								  $data->{"ISSN"},
								  $data->{"IDIDIOMA"},
								  $data->{"IDTIPOPUBLICACION"}
								  )
							);

			$lastInsertId = $con->lastInsertId();

			$array=array('IDPUBLICACION'=>$lastInsertId);
			echo json_encode($array);
		}catch (PDOException $e){
			echo json_encode(array("me" => $e->getMessage()));
		}
	}

	function eliminaPublicacion(){
		$request = \Slim\Slim::getInstance()->request(); //json parameters
		$data = json_decode($request->getBody());

		$con= getConnection();
		$pstmt = $con->prepare("UPDATE PUBLICACION P SET P.ESTADO = 0 WHERE P.IDPUBLICACION=?");
		$pstmt->execute(array($data->{"IDPUBLICACION"}));

		echo $request->getBody();
	}

	function registraPublicacionxEtiqueta(){
		$request = \Slim\Slim::getInstance()->request(); //json parameters
		$data = json_decode($request->getBody(),TRUE);

		try{
			$con= getConnection();
			$idpublicacion = $data["IDPUBLICACION"];
			for($i=0; $i<count($data["0"]); $i++) {
			    $pstmt = $con->prepare("INSERT INTO PUBLICACIONXETIQUETAS(IDPUBLICACION,IDETIQUETA)
			    						VALUES(?,?)");
			    $pstmt->execute(array($idpublicacion,$data["0"][$i]["id"]));
			}
			echo json_encode(array("status" => 1));
		}catch(PDOException $e){
			echo json_encode(array("status" => 0));
		}
	}

	function registraPublicacionxAutor(){
		$request = \Slim\Slim::getInstance()->request(); //json parameters
		$data = json_decode($request->getBody(),TRUE);

		try{
			$con= getConnection();
			$idpublicacion = $data["IDPUBLICACION"];
			for($i=0; $i<count($data["0"]); $i++) {
			    $pstmt = $con->prepare("INSERT INTO PUBLICACIONXAUTOR(IDPUBLICACION,IDAUTOR)
			    						VALUES(?,?)");
			    $pstmt->execute(array($idpublicacion,$data["0"][$i]["id"]));
			}
			echo json_encode(array("status" => 1));
		}catch(PDOException $e){
			echo json_encode(array("status" => 0));
		}
	}

	function getEtiquetaPublicacion($id){

		$con=getConnection();
		$pstmt = $con->prepare("SELECT  E.IDETIQUETA, E.NOMBRE 
			  					from publicacion P,etiqueta E,publicacionxetiquetas PE 
			 					where PE.idpublicacion=P.idpublicacion and E.idetiqueta=PE.idetiqueta
										and PE.idpublicacion=?");
		$listaEtiquetas = array();
		$pstmt->execute(array($id));
		while($element = $pstmt->fetch(PDO::FETCH_ASSOC)){
			$listaEtiquetas[] = $element;
		}
		echo json_encode($listaEtiquetas);

	}

	function getAutorPublicacion($id){

		$con=getConnection();
		$pstmt = $con->prepare("SELECT  A.IDAUTOR, A.NOM_APE 
			  					from publicacion P,autor A,PUBLICACIONXAUTOR PA 
			 					where PA.idpublicacion=P.idpublicacion and A.idautor=PA.idautor
										and PA.idpublicacion=?");
		$listaAutor = array();
		$pstmt->execute(array($id));
		while($element = $pstmt->fetch(PDO::FETCH_ASSOC)){
			$listaAutor[] = $element;
		}
		echo json_encode($listaAutor);
	}

	function modificaPublicacionxEtiqueta(){
		$request = \Slim\Slim::getInstance()->request(); //json parameters
		$data = json_decode($request->getBody(),TRUE);

		try{
			$con= getConnection();
			$idpublicacion = $data["IDPUBLICACION"];
			$pstmt = $con->prepare("DELETE FROM PUBLICACIONXETIQUETAS WHERE IDPUBLICACION=?");
			$pstmt->execute(array($idpublicacion));
			$pstmt=null;

			for($i=0; $i<count($data["0"]); $i++) {
			    $pstmt = $con->prepare("INSERT INTO PUBLICACIONXETIQUETAS(IDPUBLICACION,IDETIQUETA)
			    						VALUES(?,?)");
			    $pstmt->execute(array($idpublicacion,$data["0"][$i]["id"]));
			}
			echo $request->getBody();
		}catch(PDOException $e){
			echo json_encode(array("me" => $e->getMessage()));
		}
	}

	function modificaPublicacionxAutor(){
		$request = \Slim\Slim::getInstance()->request(); //json parameters
		$data = json_decode($request->getBody(),TRUE);

		try{
			$con= getConnection();
			$idpublicacion = $data["IDPUBLICACION"];
			$pstmt = $con->prepare("DELETE FROM PUBLICACIONXAUTOR WHERE IDPUBLICACION=?");
			$pstmt->execute(array($idpublicacion));
			$pstmt=null;

			for($i=0; $i<count($data["0"]); $i++) {
			    $pstmt = $con->prepare("INSERT INTO PUBLICACIONXAUTOR(IDPUBLICACION,IDAUTOR)
			    						VALUES(?,?)");
			    $pstmt->execute(array($idpublicacion,$data["0"][$i]["id"]));
			}
			echo $request->getBody();
		}catch(PDOException $e){
			echo json_encode(array("me" => $e->getMessage()));
		}
	}

	function subirArchivos(){ 
		print_r($_FILES);
		print_r($_POST);
		$uploaddir = '../files/';
		$idpublicacion = $_POST['IDPUBLICACION'];
		$archivoNombres = $_FILES['file']['name'];
		$archivoUbTemp = $_FILES['file']['tmp_name'];
		$formato = $_FILES['file']['type'];
		$con=getConnection();
		//try{
		for ($i=0; $i < count($archivoNombres) ; $i++) { 
			$uploadfile = $uploaddir . basename($archivoNombres[$i]);
			if(move_uploaded_file($archivoUbTemp[$i], $uploadfile)){
			//PROBAR CON VARIOS ARCHIVOS, INSERTAR EN BD POR CADA ENTRADA SATISFACTORIA
				$pstmt = $con->prepare("INSERT INTO ARCHIVO
									(nombre, url, descripcion, formato, fecha_subida, estado, idpublicacion) 	
						   			VALUES (?,?,?,?,curdate(),?,?)");
				$pstmt->execute(array($archivoNombres[$i],$uploadfile,null,$formato[$i],1,$idpublicacion));
			}
		}
		echo json_encode(array("status" => 1));
		//}catch(PDOException $e){
		//	echo json_encode(array("status" => 0));
		//}
	}

?>