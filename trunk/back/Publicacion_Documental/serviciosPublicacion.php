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
									SET P.TITULO=?,P.FUENTE=?,P.OBTENIDO=?,P.PAGINAS=?, 
										P.VOLUMEN=?,P.DOI=?,P.ISSN=?,P.IDIDIOMA=?,P.FECHAREGISTRO=?,P.IDTIPOPUBLICACION=?
									WHERE P.IDPUBLICACION=?");
			
			$pstmt->execute(array($data->{"TITULO"},
								  $data->{"FUENTE"},
								  $data->{"OBTENIDO"},
								  $data->{"PAGINAS"},
								  $data->{"VOLUMEN"},
								  $data->{"DOI"},
								  $data->{"ISSN"},
								  $data->{"IDIDIOMA"},
								  $data->{"FECHAPUB"},
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
									VALUES (?,?,?,'1990','Set',?,?,?,?,1,?,?,?)");

			$pstmt->execute(array($data->{"TITULO"},
								  $data->{"FUENTE"},
								  $data->{"OBTENIDO"},
								  $data->{"PAGINAS"},
								  $data->{"VOLUMEN"},
								  $data->{"DOI"},
								  $data->{"ISSN"},
								  $data->{"FECHAPUB"},
								  $data->{"IDIDIOMA"},
								  $data->{"IDTIPOPUBLICACION"}
								  )
							);
			$lastInsertId = $con->lastInsertId();

			$pstmt=null;
			$pstmt = $con->prepare("INSERT INTO LOG (FECHA_REGISTRO,USUARIO_IDUSUARIO,PUBLICACION_IDPUBLICACION) 
									VALUES (now(),?,?)");

			//agregando en log
			$pstmt->execute(array($data->{"IDCREADOR"},
								  $lastInsertId));

			//agregando en gruxpubxusu
			$pstmt=null;
			$pstmt = $con->prepare("INSERT INTO GRUXPUBXUSU (IDUSUARIO,IDGRUPO,IDPUBLICACION,VISIBILIDAD,ESTADO) 
									VALUES (?,?,?,1,1)");
			$pstmt->execute(array($data->{"IDCREADOR"},$data->{"IDGRUPO"},$lastInsertId));

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

		$pstmt = $con->prepare("DELETE FROM gruxpubxusu WHERE IDPUBLICACION=?");
		$pstmt->execute(array($data->{"IDPUBLICACION"}));

		$pstmt = $con->prepare("DELETE FROM usuxarxgru WHERE IDPUBLICACION=?");
		$pstmt->execute(array($data->{"IDPUBLICACION"}));

		$pstmt = $con->prepare("DELETE FROM PUBLICACIONXETIQUETAS WHERE IDPUBLICACION=?");
		$pstmt->execute(array($data->{"IDPUBLICACION"}));

		echo $request->getBody();
	}

	function registraPublicacionxGrupo(){
		$request = \Slim\Slim::getInstance()->request(); //json parameters
		$data = json_decode($request->getBody(),TRUE);

		try{
			$con= getConnection();
			$idpublicacion = $data["idpublicacion"];
			for($i=0; $i<count($data["grupos"]); $i++) {
				//ingresamos integrantes de cada grupo
				$pstmt = $con->prepare("SELECT U.IDUSUARIO FROM USUARIOXGRUPO UG, USUARIO U 
									WHERE UG.IDGRUPO=? AND UG.ESTADO=1 AND UG.IDUSUARIO=U.IDUSUARIO");
				$idgrupo=$data["grupos"][$i]["id"];
				$pstmt->execute(array($idgrupo));

				$integrantes = array();
				while($req = $pstmt->fetch(PDO::FETCH_ASSOC)){
					$integrantes[] = $req;
				}
				for($j=0;$j<count($integrantes); $j++){
					$pstmt = $con->prepare("INSERT INTO gruxpubxusu(IDUSUARIO,IDGRUPO,IDPUBLICACION,VISIBILIDAD,ESTADO)
			    						VALUES(?,?,?,1,1)");
					$pstmt->execute(array($integrantes[$j]["IDUSUARIO"],$idgrupo,$idpublicacion));
				}
			}
			echo json_encode(array("status" => 1));
		}catch(PDOException $e){
			echo json_encode(array("status" => 0));
		}
	}

	function registraPublicacionxEtiqueta(){
		$request = \Slim\Slim::getInstance()->request(); //json parameters
		$data = json_decode($request->getBody(),TRUE);

		try{
			$con= getConnection();
			$idpublicacion = $data["idpublicacion"];
			for($i=0; $i<count($data["etiquetas"]); $i++) {
			    $pstmt = $con->prepare("INSERT INTO PUBLICACIONXETIQUETAS(IDPUBLICACION,IDETIQUETA)
			    						VALUES(?,?)");
			    $pstmt->execute(array($idpublicacion,$data["etiquetas"][$i]["id"]));
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
			$idpublicacion = $data["idpublicacion"];
			for($i=0; $i<count($data["autores"]); $i++) {
			    $pstmt = $con->prepare("INSERT INTO PUBLICACIONXAUTOR(IDPUBLICACION,IDAUTOR)
			    						VALUES(?,?)");
			    $pstmt->execute(array($idpublicacion,$data["autores"][$i]["id"]));
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

	function getGrupoPublicacion($id){

		$con=getConnection();
		$pstmt = $con->prepare("SELECT G.IDGRUPO, G.NOMBRE 
			  					from publicacion P,grupo G,gruxpubxusu GPU 
			 					where GPU.idpublicacion=P.idpublicacion and G.idgrupo=GPU.idgrupo
										and GPU.idpublicacion=?");
		$listaGrupo = array();
		$pstmt->execute(array($id));
		while($element = $pstmt->fetch(PDO::FETCH_ASSOC)){
			$listaGrupo[] = $element;
		}
		echo json_encode($listaGrupo);
	}

	function modificaPublicacionxEtiqueta(){
		$request = \Slim\Slim::getInstance()->request(); //json parameters
		$data = json_decode($request->getBody(),TRUE);

		try{
			$con= getConnection();
			$idpublicacion = $data["idpublicacion"];
			$pstmt = $con->prepare("DELETE FROM PUBLICACIONXETIQUETAS WHERE IDPUBLICACION=?");
			$pstmt->execute(array($idpublicacion));
			$pstmt=null;

			for($i=0; $i<count($data["etiquetas"]); $i++) {
			    $pstmt = $con->prepare("INSERT INTO PUBLICACIONXETIQUETAS(IDPUBLICACION,IDETIQUETA)
			    						VALUES(?,?)");
			    $pstmt->execute(array($idpublicacion,$data["etiquetas"][$i]["id"]));
			}
			echo json_encode(array("status" => 1));
		}catch(PDOException $e){
			echo json_encode(array("status" => 0));
		}
	}

	function modificaPublicacionxAutor(){
		$request = \Slim\Slim::getInstance()->request(); //json parameters
		$data = json_decode($request->getBody(),TRUE);

		try{
			$con= getConnection();
			$idpublicacion = $data["idpublicacion"];
			$pstmt = $con->prepare("DELETE FROM PUBLICACIONXAUTOR WHERE IDPUBLICACION=?");
			$pstmt->execute(array($idpublicacion));
			$pstmt=null;

			for($i=0; $i<count($data["autores"]); $i++) {
			    $pstmt = $con->prepare("INSERT INTO PUBLICACIONXAUTOR(IDPUBLICACION,IDAUTOR)
			    						VALUES(?,?)");
			    $pstmt->execute(array($idpublicacion,$data["autores"][$i]["id"]));
			}
			echo json_encode(array("status" => 1));
		}catch(PDOException $e){
			echo json_encode(array("status" => 0));
		}
	}

	function modificaPublicacionxGrupo(){
		$request = \Slim\Slim::getInstance()->request(); //json parameters
		$data = json_decode($request->getBody(),TRUE);

		try{
			$con= getConnection();

			$idpublicacion = $data["idpublicacion"];
			$idusuario=$data["idusuario"];
			//IDUSUARIO<>? AND  --> para no eliminar a el mismo pero se da constraint integrity
			$pstmt = $con->prepare("DELETE FROM gruxpubxusu WHERE IDPUBLICACION=?");
			$pstmt->execute(array($idpublicacion));

			for($i=0; $i<count($data["grupos"]); $i++) {
				//ingresamos integrantes de cada grupo
				$pstmt = $con->prepare("SELECT U.IDUSUARIO FROM USUARIOXGRUPO UG, USUARIO U 
									WHERE UG.IDGRUPO=? AND UG.ESTADO=1 AND UG.IDUSUARIO=U.IDUSUARIO");
				$idgrupo=$data["grupos"][$i]["id"];
				$pstmt->execute(array($idgrupo));

				$integrantes = array();
				while($req = $pstmt->fetch(PDO::FETCH_ASSOC)){
					$integrantes[] = $req;
				}
				for($j=0;$j<count($integrantes); $j++){
					$pstmt = $con->prepare("INSERT INTO gruxpubxusu(IDUSUARIO,IDGRUPO,IDPUBLICACION,VISIBILIDAD,ESTADO)
			    						VALUES(?,?,?,1,1)");
					$pstmt->execute(array($integrantes[$j]["IDUSUARIO"],$idgrupo,$idpublicacion));
				}
			}
			//verificar si el usuario creador esta dentro de los usuarios modificados, de lo contrario agregarlo
			//PENDIENTE
			echo json_encode(array("status" => 1));
		}catch(PDOException $e){
			echo json_encode(array("status" => $e->getMessage()));
		}
	}

	function guardarEnGrupos($idarchivo,$grupos,$idpublicacion){
		$con= getConnection();

		for($i=0; $i<count($grupos); $i++) {
			//ingresamos integrantes de cada grupo
			$pstmt = $con->prepare("SELECT U.IDUSUARIO FROM USUARIOXGRUPO UG, USUARIO U 
								WHERE UG.IDGRUPO=? AND UG.ESTADO=1 AND UG.IDUSUARIO=U.IDUSUARIO");
			$idgrupo=$grupos[$i]["id"];
			$pstmt->execute(array($idgrupo));

			$integrantes = array();
			while($req = $pstmt->fetch(PDO::FETCH_ASSOC)){
				$integrantes[] = $req;
			}
			for($j=0;$j<count($integrantes); $j++){
				$pstmt = $con->prepare("INSERT INTO usuxarxgru(IDUSUARIO,IDGRUPO,IDARCHIVO,IDPUBLICACION,VISIBILIDAD,ESTADO)
		    						VALUES(?,?,?,?,1,1)");
				$pstmt->execute(array($integrantes[$j]["IDUSUARIO"],$idgrupo,$idarchivo,$idpublicacion));
			}
		}
	}

	function subirArchivos(){ 
		print_r($_FILES);
		print_r($_POST);
		$uploaddir = '../files/';
		$idpublicacion = $_POST['IDPUBLICACION'];
		$idusuario = $_POST['IDUSUARIO'];
		$idgrupo= $_POST['IDGRUPO'];
		$grupos=json_decode($_POST['GRUPOS'],TRUE);
		$archivoNombres = $_FILES['file']['name'];
		$archivoUbTemp = $_FILES['file']['tmp_name'];
		$formato = $_FILES['file']['type'];
		$con=getConnection();
		try{
			for ($i=0; $i < count($archivoNombres) ; $i++) { 
				$uploadfile = $uploaddir . basename($archivoNombres[$i]);
				if(move_uploaded_file($archivoUbTemp[$i], $uploadfile)){
				//PROBAR CON VARIOS ARCHIVOS, INSERTAR EN BD POR CADA ENTRADA SATISFACTORIA
					$pstmt = $con->prepare("INSERT INTO ARCHIVO
										(nombre, url, descripcion, formato, fecha_subida, estado, idpublicacion) 	
							   			VALUES (?,?,?,?,curdate(),?,?)");
					$pstmt->execute(array($archivoNombres[$i],$uploadfile,null,$formato[$i],1,$idpublicacion));
					$lastInsertId = $con->lastInsertId();
					//guardando en usuxarxgru
					$pstmt=null;
					$pstmt = $con->prepare("INSERT INTO USUXARXGRU (IDUSUARIO,IDGRUPO,IDPUBLICACION,IDARCHIVO,VISIBILIDAD,ESTADO) 
											VALUES (?,?,?,?,1,1)");
					$pstmt->execute(array($idusuario,$idgrupo,$idpublicacion,$lastInsertId));
					guardarEnGrupos($lastInsertId,$grupos,$idpublicacion);
				}
			}
			
			echo json_encode(array("status" => 1));
		}catch(PDOException $e){
			echo json_encode(array("status" => 0));
		}
	}

	function getArchivosPublicacion($id){
		$con=getConnection();
	 
		$pstmt = $con->prepare("SELECT P.TITULO, A.URL, A.FORMATO, A.NOMBRE, A.IDARCHIVO
								from archivo A, publicacion P
								where P.idpublicacion=? AND P.IDPUBLICACION=A.IDPUBLICACION AND A.ESTADO=1");
		$pstmt->execute(array($id));

		$listaArchivos = array();
		while($element = $pstmt->fetch(PDO::FETCH_ASSOC)){
			$listaArchivos[] = $element;
		}
		echo json_encode($listaArchivos);
	}

	function eliminaArchivo(){
		$request = \Slim\Slim::getInstance()->request(); //json parameters
		$data = json_decode($request->getBody(),TRUE);

		try{
			$con=getConnection();
			$pstmt = $con->prepare("UPDATE ARCHIVO SET ESTADO=0 WHERE IDARCHIVO=?");
			$pstmt->execute(array($data["idarchivo"]));
			echo json_encode(array("status" => 1));
		}catch(PDOException $e){
			echo json_encode(array("status" => 0));
		}

	}

	function getListaFichaPublicacion(){

		$request = \Slim\Slim::getInstance()->request(); //json parameters
		$data = json_decode($request->getBody(),TRUE);

		try{
			$con=getConnection();
			$pstmt = $con->prepare("SELECT DISTINCT F.IDFICHABIB, F.ENCABEZADO, CONCAT(U.NOMBRES,' ', U.APELLIDOS) AS USUARIO
									FROM FICHABIB F, PUBLICACION P, USUARIO U, gruxfixusu GFU 
									WHERE F.ESTADO=1 AND  P.IDPUBLICACION=F.IDPUBLICACION AND U.IDUSUARIO=F.IDCREADOR
										AND F.IDPUBLICACION=? AND GFU.IDUSUARIO=? AND GFU.ESTADO=1");

			$pstmt->execute(array($data["idpublicacion"],$data["idusulogueado"]));

			$listaFicha = array();
			while($element = $pstmt->fetch(PDO::FETCH_ASSOC)){
				$listaFicha[] = $element;
			}
			echo json_encode($listaFicha);			
		}catch(PDOException $e){
			echo json_encode(array("status" => 0));
		}
	}


	function damePermisoN($id){
		$con=getConnection();
		$pstmt = $con->prepare("SELECT U.IDPERMISO FROM USUARIO U WHERE U.ESTADO = 1 AND U.IDUSUARIO=?");
		$pstmt->execute(array($id));
		$idPermiso = $pstmt->fetch(PDO::FETCH_ASSOC)["IDPERMISO"];
		return $idPermiso;
	}



	function getListaGrupoN(){

		$request = \Slim\Slim::getInstance()->request(); //json parameters
	    $data = json_decode($request->getBody());
	    $IDGRUPO=$data->{"IDPADRE"}; //GRUPO DONDE ESTOY
	    $IDUSUARIO=$data->{"IDUSUARIO"};

	    $con=getConnection();

	    //SACO PERMISO
	    $IDPERMISO=damePermisoN($IDUSUARIO);

	    if($IDPERMISO==1){//SI SOY EL ADMINISTRADOR PUEDO VER TODOS LOS GRUPOS 
	    	$pstmt = $con->prepare("SELECT G.IDGRUPO,G.NOMBRE FROM  GRUPO G  WHERE G.ESTADO = 1");
			$pstmt->execute(array($IDGRUPO));

			$listaGrupo = array();
			while($req = $pstmt->fetch(PDO::FETCH_ASSOC)){

				$grupo= [
					'IDGRUPO'=> $req["IDGRUPO"],
					'NOMBRE'=> $req["NOMBRE"]
				];
				$listaGrupo[] = $grupo;
			}
	    }
	    else{ // SI NO SOY EL ADMINISTRADOR DEBO DE VER SOLO LOS GRUPOS A LOS QUE TENGO ACCESO
	    	$pstmt = $con->prepare("SELECT UG.IDGRUPO,G.NOMBRE FROM  USUARIOXGRUPO UG,GRUPO G  WHERE G.ESTADO = 1 AND UG.ESTADO=1 AND 
	    							UG.IDUSUARIO=? AND UG.IDGRUPO=G.IDGRUPO");
			$pstmt->execute(array($IDUSUARIO));

			$listaGrupo = array();
			while($req = $pstmt->fetch(PDO::FETCH_ASSOC)){

				$grupo= [
					'IDGRUPO'=> $req["IDGRUPO"],
					'NOMBRE'=> $req["NOMBRE"]
				];
				$listaGrupo[] = $grupo;
			}
	    }

	    echo json_encode($listaGrupo);


	}



?>