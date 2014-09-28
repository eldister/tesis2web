<?php
	//IMPORTS NECESARIOS
    header("Content-type: text/html; charset=utf16");
	include('routesPublicacion.php');
	include ('modelPublicacion.php');
	include_once '../back/conexion.php';

	function getListaPublicacion(){

		$request = \Slim\Slim::getInstance()->request(); //json parameters
	    $data = json_decode($request->getBody(),TRUE);

	    $permiso=getPermisoUsuario($data["idUsuario"]);

	    $con=getConnection();

	    if($permiso["IDPERMISO"]!=1){
	    	$pstmt = $con->prepare("SELECT DISTINCT P.IDPUBLICACION, P.TITULO, P.FUENTE, P.OBTENIDO, P.ANIO,
									P.MES,P.PAGINAS,P.VOLUMEN,P.DOI, P.ISSN,P.FECHAREGISTRO,
									I.NOMBRE as IDIOMA,T.NOMBRE as TIPO
							FROM PUBLICACION P,IDIOMA I, TIPOPUBLICACION T, gruxpubxusu GPU, LOG L
							WHERE P.ESTADO=1 AND I.IDIDIOMA=P.IDIDIOMA AND L.PUBLICACION_IDPUBLICACION=P.IDPUBLICACION
									AND P.IDTIPOPUBLICACION=T.IDTIPOPUBLICACION AND (L.USUARIO_IDUSUARIO=? OR GPU.IDGRUPO=?)
									AND GPU.IDPUBLICACION=P.IDPUBLICACION AND GPU.ESTADO=1 
									and I.ESTADO=1 and T.ESTADO=1");
			$pstmt->execute(array($data["idUsuario"],$data["idMiGrupo"]));
		}
	   else{
			$pstmt = $con->prepare("SELECT distinct P.IDPUBLICACION, P.TITULO, P.FUENTE, P.OBTENIDO, P.ANIO,
											P.MES,P.PAGINAS,P.VOLUMEN,P.DOI, P.ISSN,P.FECHAREGISTRO,
											I.NOMBRE as IDIOMA,T.NOMBRE as TIPO
									FROM PUBLICACION P,IDIOMA I, TIPOPUBLICACION T
									WHERE P.ESTADO=1 AND I.IDIDIOMA=P.IDIDIOMA 
									AND P.IDTIPOPUBLICACION=T.IDTIPOPUBLICACION 
									and I.ESTADO=1 and T.ESTADO=1");
			$pstmt->execute();
		}
		$listaPublicacion = array();
		while($element = $pstmt->fetch(PDO::FETCH_ASSOC)){
			$pstmt2 = $con->prepare("SELECT A.URL,A.FORMATO FROM PUBLICACION P, ARCHIVO A 
									WHERE P.IDPUBLICACION=? AND A.IDPUBLICACION=P.idpublicacion 
									and (A.FORMATO='application/pdf' or A.formato = 'application/force-download')
									ORDER BY P.IDPUBLICACION LIMIT 1");
			$pstmt2->execute(array($element["IDPUBLICACION"]));
			$url=$pstmt2->fetch(PDO::FETCH_ASSOC);			
			
			if($url["URL"]==null){
				$element["URL"]="0";
			}
			else{
				$element["URL"]=$url["URL"];
				
				$element["FORMATO"]=$url["FORMATO"];				
			}
			$listaPublicacion[] = $element;
		}
		echo json_encode($listaPublicacion);
	}	

	function getPublicacion($id){

	    $con=getConnection();
	 
		$pstmt = $con->prepare("SELECT  P.TITULO, P.FUENTE, P.OBTENIDO, P.ANIO,
										P.MES,P.PAGINAS,P.VOLUMEN,P.DOI, P.ISSN,P.FECHAREGISTRO,
										I.NOMBRE as IDIOMA,T.NOMBRE as TIPO, P.IDIDIOMA, P.IDTIPOPUBLICACION, P.PAIS_PUBLI, P.CIUDAD_PUBLI	
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
										P.VOLUMEN=?,P.DOI=?,P.ISSN=?,P.IDIDIOMA=?,P.MES=?,P.IDTIPOPUBLICACION=?
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

				

			$array=array('IDPUBLICACION'=>$data->{"IDPUBLICACION"},'IDIDIOMA'=> $data->{"IDIDIOMA"},'TITULO'=>$data->{"TITULO"},"status"=>1);
			echo json_encode($array);

		}catch (PDOException $e){
			echo json_encode(array("me" => $e->getMessage(),"status"=>0));
		}
	}

	function agregaEtiquetasTitulo($titulo,$ididioma,$idpublicacion){
		$palabras = str_word_count($titulo, 1);
		$con2= getConnection();
		for ($i=0; $i < count($palabras); $i++) { 
			$pstmt = $con2->prepare("INSERT INTO ETIQUETARELACIONADA VALUES(NULL,'Vacio por mientras')");
			$pstmt->execute();
			$lastInsertId = $con2->lastInsertId();

			$pstmt = $con2->prepare("INSERT INTO ETIQUETA VALUES(NULL,?,'No importa',2,?,?)");
			$pstmt->execute(array($palabras[$i],$ididioma,$lastInsertId));
			$lastInsertEtiqueta = $con2->lastInsertId();

			$pstmt = $con2->prepare("INSERT INTO PUBLICACIONXETIQUETAS VALUES(?,?)");
			$pstmt->execute(array($idpublicacion,$lastInsertEtiqueta));
		}
	}

	function registraPublicacion(){

		$request = \Slim\Slim::getInstance()->request(); //json parameters
	    $data = json_decode($request->getBody());

	    try{
			$con= getConnection();
			$pstmt = $con->prepare("INSERT INTO PUBLICACION (TITULO,FUENTE,OBTENIDO,ANIO,MES,PAGINAS,
									VOLUMEN,DOI,ISSN,ESTADO,FECHAREGISTRO,IDIDIOMA,IDTIPOPUBLICACION,PAIS_PUBLI,CIUDAD_PUBLI) 
									VALUES (?,?,?,'1990',?,?,?,?,?,1,curdate(),?,?,?,?)");

			$volumen=$data->{"VOLUMEN"}=="" ? 1: $data->{"VOLUMEN"};
			
			$pstmt->execute(array($data->{"TITULO"},
								  $data->{"FUENTE"},
								  $data->{"OBTENIDO"},
								  $data->{"FECHAPUB"},
								  $data->{"PAGINAS"},
								  $volumen,
								  $data->{"DOI"},
								  $data->{"ISSN"},								  
								  $data->{"IDIDIOMA"},
								  $data->{"IDTIPOPUBLICACION"},
								  $data->{"PAIS"},
								  $data->{"CIUDAD"}
								  )
							);
			$lastInsertId = $con->lastInsertId();

			//agregar etiquetas del título
			agregaEtiquetasTitulo($data->{"TITULO"},$data->{"IDIDIOMA"},$lastInsertId);			

			$pstmt=null;
			$pstmt = $con->prepare("INSERT INTO LOG (FECHA_REGISTRO,USUARIO_IDUSUARIO,PUBLICACION_IDPUBLICACION) 
									VALUES (now(),?,?)");

			//agregando en log
			$pstmt->execute(array($data->{"IDCREADOR"},
								  $lastInsertId));

			//agregando en gruxpubxusu
			//modificacion 27/08: se guarda en grupo padre ProCalProSer originalmente
			$pstmt=null;
			$pstmt = $con->prepare("INSERT INTO GRUXPUBXUSU (IDUSUARIO,IDGRUPO,IDPUBLICACION,VISIBILIDAD,ESTADO) 
									VALUES (?,1,?,1,1)");
			$pstmt->execute(array($data->{"IDCREADOR"},$lastInsertId));

			$array=array('IDPUBLICACION'=>$lastInsertId,"status"=>1);
			echo json_encode($array);
		}catch (PDOException $e){
			echo json_encode(array("me" => $e->getMessage(),"status"=>0));
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
										and PE.idpublicacion=? and E.estado<>2");
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

			//modificar etiquetas del título
			agregaEtiquetasTitulo($data["titulo"],$data["ididioma"],$idpublicacion);

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
					if(count($grupos)>0){
						guardarEnGrupos($lastInsertId,$grupos,$idpublicacion);
					}
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
	    	$pstmt = $con->prepare("SELECT G.IDGRUPO,G.NOMBRE FROM  GRUPO G  WHERE G.ESTADO = 1 AND G.IDGRUPO NOT IN (1)");
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

	function verificaIdioma($idioma){
		$con= getConnection();

		$pstmt = $con->prepare("SELECT count(P.IDIDIOMA) as CANTIDAD, P.IDIDIOMA FROM IDIOMA P WHERE P.ESTADO=1 AND 
								P.NOMBRE LIKE CONCAT('%',?,'%')");
		$pstmt->execute(array(utf8_encode($idioma)));
		$req = $pstmt->fetch(PDO::FETCH_ASSOC);
		
		if($req["CANTIDAD"]>0){
			$ididioma = $req["IDIDIOMA"];
			return $ididioma;
		}
		else
		{
			$pstmt = $con->prepare("INSERT INTO IDIOMA (NOMBRE,OBSERVACION,ESTADO) VALUES (?,'',1)");
			$pstmt->execute(array(utf8_encode($idioma)));
			return $con->lastInsertId();
		}
	}


function getListaTipoCitacion(){

    $con=getConnection();
    $pstmt = $con->prepare("SELECT G.IDTIPO_CITACION,G.NOMBRE_CITACION FROM  TIPO_CITACION G");
	$pstmt->execute(array());

	$listaCitacion = array();
	while($req = $pstmt->fetch(PDO::FETCH_ASSOC)){

		$grupo= [
			'IDTIPO_CITACION'=> $req["IDTIPO_CITACION"],
			'NOMBRE_CITACION'=> $req["NOMBRE_CITACION"]
		];
		$listaCitacion[] = $grupo;
	}

	echo json_encode($listaCitacion);
}

function verificaTipo($tipo){
		$con= getConnection();
		$pstmt = $con->prepare("SELECT count(P.IDTIPOPUBLICACION) as CANTIDAD, P.IDTIPOPUBLICACION FROM 
								TIPOPUBLICACION P WHERE P.ESTADO=1 AND 
								P.NOMBRE LIKE CONCAT('%',?,'%')");
		$pstmt->execute(array(utf8_encode($tipo)));
		$req = $pstmt->fetch(PDO::FETCH_ASSOC);
		
		if($req["CANTIDAD"]>0){
			return $req["IDTIPOPUBLICACION"];
		}
		else
		{
			$pstmt = $con->prepare("INSERT INTO TIPOPUBLICACION (NOMBRE,DESCRIPCION,ESTADO) VALUES (?,'',1)");
			$pstmt->execute(array(utf8_encode($tipo)));
			return $con->lastInsertId();
		}
	}


function getBibliografia(){

	$request = \Slim\Slim::getInstance()->request(); //json parameters
    $data = json_decode($request->getBody());
    $IDTIPO_CITACION=$data->{"IDTIPO_CITACION"};
    $IDPUBLICACION=$data->{"IDPUBLICACION"};

    $con=getConnection();
    //CANTIDAD DE AUTORES
    $pstmt = $con->prepare("SELECT count(p.idautor) as cantidad from publicacionxautor p where p.idpublicacion=?");
	$pstmt->execute(array($IDPUBLICACION));
	$cantidadAutor = $pstmt->fetch(PDO::FETCH_ASSOC)["cantidad"];

	//LISTA DE AUTORES
    $pstmt = $con->prepare("SELECT A.NOMBRE,A.NOM_APE FROM AUTOR A WHERE A.IDAUTOR IN 
    						(SELECT p.idautor from publicacionxautor p where p.idpublicacion=?)");
	$pstmt->execute(array($IDPUBLICACION));

	$listaAutores = "";
	while($req = $pstmt->fetch(PDO::FETCH_ASSOC)){
		$grupo= [
			'NOMBRE'=> $req["NOMBRE"],
			'NOM_APE'=> $req["NOM_APE"]
		];
		$listaCitacion[] = $grupo;
	}

    if($IDTIPO_CITACION==1){$uneNombre=", ";$uneAutor=";"; $ultimoAutor="&";$finAutor="";$ultimo=". ";}
    else if ($IDTIPO_CITACION==2){$uneNombre=". ";$uneAutor=","; $ultimoAutor="and";$finAutor="";$ultimo=", ";}
    else if ($IDTIPO_CITACION==3){$uneNombre=", ";$uneAutor=","; $ultimoAutor="&";$finAutor=".";$ultimo="";}
    else if ($IDTIPO_CITACION==4){$uneNombre=" ";$uneAutor=","; $ultimoAutor="&";$finAutor="";$ultimo=".";}
    else if ($IDTIPO_CITACION==5){$uneNombre=", ";$uneAutor=","; $ultimoAutor="&";$finAutor=".";$ultimo="";}

    $stringAutores="";

    if($cantidadAutor==1){
    	if(($IDTIPO_CITACION==1) OR ($IDTIPO_CITACION==3) OR ($IDTIPO_CITACION==5))
    		{$stringAutores=$stringAutores.$listaCitacion[0]["NOM_APE"].", ".$listaCitacion[0]["NOMBRE"].".";}
    	elseif(($IDTIPO_CITACION==2))
    		{$stringAutores=$stringAutores.$listaCitacion[0]["NOM_APE"].". ".$listaCitacion[0]["NOMBRE"].".";}
    	elseif(($IDTIPO_CITACION==4))
    		{$stringAutores=$stringAutores.$listaCitacion[0]["NOMBRE"]." ".$listaCitacion[0]["NOM_APE"].".";}
    }
    else{
		for($i=0;$i<$cantidadAutor-1;$i++){
			$N_AUTOR=$listaCitacion[$i]["NOMBRE"];
			$A_AUTOR=$listaCitacion[$i]["NOM_APE"];

			if(($IDTIPO_CITACION==1) OR ($IDTIPO_CITACION==3) OR ($IDTIPO_CITACION==5) OR ($IDTIPO_CITACION==2))
    			{$PRIMERO=$A_AUTOR;$SEGUNDO=$N_AUTOR;}
    		elseif(($IDTIPO_CITACION==4))
    			{$PRIMERO=$N_AUTOR;$SEGUNDO=$A_AUTOR;}

			$stringAutores=$stringAutores.$PRIMERO;
			$stringAutores=$stringAutores.$uneNombre;
			$stringAutores=$stringAutores.$SEGUNDO;
			$stringAutores=$stringAutores.$uneAutor;
		}	
		//$stringAutores=$stringAutores." ".$ultimoAutor." ".$listaCitacion[$cantidadAutor-1]["NOM_APE"].$finAutor.$ultimo;
		$N_AUTOR=$listaCitacion[$cantidadAutor-1]["NOMBRE"];
		$A_AUTOR=$listaCitacion[$cantidadAutor-1]["NOM_APE"];

		if(($IDTIPO_CITACION==1) OR ($IDTIPO_CITACION==3) OR ($IDTIPO_CITACION==5) OR ($IDTIPO_CITACION==2))
			{$PRIMERO=$A_AUTOR;$SEGUNDO=$N_AUTOR;}
		elseif(($IDTIPO_CITACION==4))
			{$PRIMERO=$N_AUTOR;$SEGUNDO=$A_AUTOR;}

		$stringAutores=$stringAutores." ".$ultimoAutor." ".$PRIMERO.$uneNombre.$SEGUNDO.$finAutor.$ultimo;
	}

	$pstmt = $con->prepare("SELECT p.titulo from publicacion p where p.idpublicacion=?");
	$pstmt->execute(array($IDPUBLICACION));
	$TITULO = $pstmt->fetch(PDO::FETCH_ASSOC)["titulo"];

	$pstmt = $con->prepare("SELECT p.volumen from publicacion p where p.idpublicacion=?");
	$pstmt->execute(array($IDPUBLICACION));
	$VOLUMEN = $pstmt->fetch(PDO::FETCH_ASSOC)["volumen"];

	$pstmt = $con->prepare("SELECT p.fuente from publicacion p where p.idpublicacion=?");
	$pstmt->execute(array($IDPUBLICACION));
	$EDITORIAL = $pstmt->fetch(PDO::FETCH_ASSOC)["fuente"];

	$pstmt = $con->prepare("SELECT p.obtenido from publicacion p where p.idpublicacion=?");
	$pstmt->execute(array($IDPUBLICACION));
	$LINK = $pstmt->fetch(PDO::FETCH_ASSOC)["obtenido"];

	$pstmt = $con->prepare("SELECT p.mes from publicacion p where p.idpublicacion=?");
	$pstmt->execute(array($IDPUBLICACION));
	$MESANIO = $pstmt->fetch(PDO::FETCH_ASSOC)["mes"];

	$pstmt = $con->prepare("SELECT p.anio from publicacion p where p.idpublicacion=?");
	$pstmt->execute(array($IDPUBLICACION));
	$ANIO = $pstmt->fetch(PDO::FETCH_ASSOC)["anio"];

	$pstmt = $con->prepare("SELECT p.pais_publi from publicacion p where p.idpublicacion=?");
	$pstmt->execute(array($IDPUBLICACION));
	$PAIS = $pstmt->fetch(PDO::FETCH_ASSOC)["pais_publi"];

	$pstmt = $con->prepare("SELECT p.ciudad_publi from publicacion p where p.idpublicacion=?");
	$pstmt->execute(array($IDPUBLICACION));
	$CIUDAD = $pstmt->fetch(PDO::FETCH_ASSOC)["ciudad_publi"];

	$terminacion="";
	$ultimoCaracter = substr($VOLUMEN, -1);
	switch ($ultimoCaracter) {
				case "0": $terminacion=" th";break;
			    case "1": $terminacion=" st";break;
			    case "2": $terminacion=" nd";break;
			    case "3": $terminacion=" rd";break;
			    case "4": $terminacion=" th";break;
			    case "5": $terminacion=" th";break;
			    case "6": $terminacion=" th";break;
			    case "7": $terminacion=" th";break;
			    case "8": $terminacion=" th";break;
			    case "9": $terminacion=" th";break;
			    }


	$nombreLibro="";
	if($IDTIPO_CITACION==1 or $IDTIPO_CITACION==3 or $IDTIPO_CITACION==4 or $IDTIPO_CITACION==5){
		if($IDTIPO_CITACION==5){
			if($ANIO<>""){$nombreLibro=$nombreLibro." ".$ANIO.".";}
		}
		if($IDTIPO_CITACION==3){
			if($ANIO<>""){$nombreLibro=$nombreLibro." (".$ANIO.").";}
		}
		$nombreLibro=$nombreLibro." <em>".$TITULO;
		if($VOLUMEN<>""){$nombreLibro=$nombreLibro.", ".$VOLUMEN." ".$terminacion." Edition";}
		$nombreLibro=$nombreLibro." </em>".".";	
	}
    else if ($IDTIPO_CITACION==2){
    	$nombreLibro=$nombreLibro." «".$TITULO;
    	$nombreLibro=$nombreLibro.", ".$VOLUMEN." ".$terminacion." Edition";
    	$nombreLibro=$nombreLibro." ,»";
    }
   
    $fuenteLibro="";
    
    if($IDTIPO_CITACION==1){
    	if($EDITORIAL<>""){$fuenteLibro=$EDITORIAL;}
    	if($ANIO<>""){$fuenteLibro=$fuenteLibro.", ".$ANIO;}
    	if($LINK<>""){$fuenteLibro=$fuenteLibro.". ".$LINK;}
    	
    	$fuenteLibro=$fuenteLibro.""; 
    }
    
    elseif($IDTIPO_CITACION==2){
    	if($EDITORIAL<>""){$fuenteLibro=$EDITORIAL;}
    	if($CIUDAD<>""){$fuenteLibro=$fuenteLibro.", ".$CIUDAD;}
    	if($PAIS<>""){$fuenteLibro=$fuenteLibro.", ".$PAIS;}
    	if($ANIO>0){$fuenteLibro=$fuenteLibro.", ".$ANIO;}
    	if($LINK<>""){$fuenteLibro=$fuenteLibro.". ".$LINK;}
    	$fuenteLibro=$fuenteLibro."";
    }
    
    elseif ($IDTIPO_CITACION==3) {
    	//MESANIO


    	if($ANIO<>""){
	    	$porciones = explode("/", $MESANIO);
			$mes0=$porciones[0];
			switch ($mes0) {
			    case "01": $mes="January";break;
			    case "02": $mes="February";break;
			    case "03": $mes="March";break;
			    case "04": $mes="April";break;
			    case "05": $mes="May";break;
			    case "06": $mes="June";break;
			    case "07": $mes="July";break;
			    case "08": $mes="August";break;
			    case "09": $mes="September";break;
			    case "10": $mes="October";break;
			    case "11": $mes="November";break;
			    case "12": $mes="December";break;
			}
	    	$fuenteLibro="Retrieved ".$mes.", ".$ANIO;
    	}
    	if($EDITORIAL<>""){$fuenteLibro=$fuenteLibro.", from the ".$EDITORIAL;}
    	//if($c2>0 and $c1>0){$fuenteLibro=$fuenteLibro.", ".$OBTENIDO;}//FALTARIA CIUDAD,PAIS+LINK
    	if($LINK<>""){$fuenteLibro=$fuenteLibro.", website: ".$LINK;}
    	$fuenteLibro=$fuenteLibro.".";		    
   	}
   	
   	elseif($IDTIPO_CITACION==4){
   		//+FALTA CIUDAD,PAIS: ...
   		if($CIUDAD<>""){$fuenteLibro=$fuenteLibro." ".$CIUDAD;}
    	if($PAIS<>""){$fuenteLibro=$fuenteLibro.", ".$PAIS;}
    	if($EDITORIAL<>""){$fuenteLibro=$fuenteLibro." : ".$EDITORIAL;}
    	if($ANIO<>""){$fuenteLibro=$fuenteLibro.", ".$ANIO;}
    	if($LINK){$fuenteLibro=$fuenteLibro.", ".$LINK;}
    	$fuenteLibro=$fuenteLibro.".";
    }
    
    elseif($IDTIPO_CITACION==5){
   		//+FALTA CIUDAD: ...
   		if($CIUDAD<>""){$fuenteLibro=$fuenteLibro." ".$CIUDAD;}
    	if($EDITORIAL<>""){$fuenteLibro=$fuenteLibro." : ".$EDITORIAL;}
    	if($LINK<>""){$fuenteLibro=$fuenteLibro.". ".$LINK;}
    	$fuenteLibro=$fuenteLibro.".";
    }

   // $orig = "<b>Este texto debería ser negrita</b>";
    $a = htmlentities($nombreLibro." ".$fuenteLibro);
	$b = html_entity_decode($a);
	//$b = htmlspecialchars_decode($a);

	$BIBLIOGRAFIA= [
			'BIBLIOGRAFIA'=> $stringAutores." ".$b
	];

	echo json_encode($BIBLIOGRAFIA);

}

	function verificaAutores($autores){
		$con= getConnection();

		$autoresGrupo = explode(",", $autores);

		$listaGrupo = array();

		for($i=0; $i<count($autoresGrupo);$i++){

			$autornomape=explode(" ",$autoresGrupo[$i]);
			$strape="";
			for($j=1;$j<count($autornomape);$j++){
				$strape.=$autornomape[$j]." ";
			}
		
			$pstmt = $con->prepare("SELECT count(P.IDAUTOR) as CANTIDAD, P.IDAUTOR FROM 
									AUTOR P WHERE P.ESTADO=1 AND 
									P.NOM_APE LIKE CONCAT('%',?,'%')");
			$pstmt->execute(array(utf8_encode($strape)));
			$req = $pstmt->fetch(PDO::FETCH_ASSOC);
			
			if($req["CANTIDAD"]>0){
				$listaGrupo[] = $req["IDAUTOR"];
			}
			else
			{									
				$pstmt = $con->prepare("INSERT INTO AUTOR (NOMBRE,NOM_APE,IDINSTITUCION,ESTADO) VALUES (?,?,1,1)");
				$pstmt->execute(array($autornomape[0],utf8_encode($strape)));
				$listaGrupo[] = $con->lastInsertId();
			}
		}

		return $listaGrupo;
	}

	function procesarLinea($line){
		$publicacion = explode("	", $line);
		$titulo=$publicacion[0];
		$fuente=$publicacion[1];
		$referencia=$publicacion[2];
		$idioma=$publicacion[3];
		$tipo=$publicacion[4];
		$fechapub=$publicacion[5];
		$paginas=$publicacion[6];
		$volumen=$publicacion[7];
		$doi=$publicacion[8];
		$issn=$publicacion[9];
		$autores=$publicacion[10];
		$archivo=$publicacion[11];
		$pais=$publicacion[12];
		$ciudad=$publicacion[13];

		//verificamos el idioma, tipo de publicacion, y autores si ya existen, de lo contrario se crea, la funcion
		//devuelve el ID (nuevo o antiguo) para agregar en BD
		$ididioma=verificaIdioma($idioma);
		$idtipo=verificaTipo($tipo);
		$autores=verificaAutores($autores); //separado x comas
		//try{
			$con=getConnection();

			$pstmt = $con->prepare("INSERT INTO PUBLICACION (TITULO,FUENTE,OBTENIDO,ANIO,MES,PAGINAS,
									VOLUMEN,DOI,ISSN,ESTADO,FECHAREGISTRO,IDIDIOMA,IDTIPOPUBLICACION,PAIS_PUBLI,CIUDAD_PUBLI) 
									VALUES (?,?,?,'1990',?,?,?,?,?,1,curdate(),?,?,?,?)");

			$pstmt->execute(array(utf8_encode($titulo),
								  utf8_encode($fuente),
								  utf8_encode($referencia),
								  $fechapub,
								  $paginas,
								  $volumen,
								  $doi,
								  $issn,								  
								  $ididioma,
								  $idtipo,
								  utf8_encode($pais),
								  utf8_encode($ciudad)
								  )
							);
			$lastInsertId = $con->lastInsertId();

			//agregar etiquetas del título
			agregaEtiquetasTitulo(utf8_encode($titulo),$ididioma,$lastInsertId);			

			$pstmt=null;
			$pstmt = $con->prepare("INSERT INTO LOG (FECHA_REGISTRO,USUARIO_IDUSUARIO,PUBLICACION_IDPUBLICACION) 
									VALUES (now(),?,?)");

			//agregando en log
			$pstmt->execute(array(1,$lastInsertId));

			//agregando en gruxpubxusu
			//modificacion 27/08: se guarda en grupo padre ProCalProSer originalmente
			$pstmt=null;
			$pstmt = $con->prepare("INSERT INTO GRUXPUBXUSU (IDUSUARIO,IDGRUPO,IDPUBLICACION,VISIBILIDAD,ESTADO) 
									VALUES (?,1,?,1,1)");
			$pstmt->execute(array(1,$lastInsertId));

			//agregamos en autorxpublicacion
			for($i=0; $i<count($autores); $i++) {
			    $pstmt = $con->prepare("INSERT INTO PUBLICACIONXAUTOR(IDPUBLICACION,IDAUTOR)
			    						VALUES(?,?)");
			    $pstmt->execute(array($lastInsertId,$autores[$i]));
			}

			//guardando en Archivo 
			$pstmt = $con->prepare("INSERT INTO ARCHIVO(nombre, url, descripcion, formato, fecha_subida, estado, idpublicacion) 	
					   			VALUES (?,?,?,?,curdate(),?,?)");
			$uploadfile='../files/'.$archivo;
			$pstmt->execute(array($archivo,$uploadfile,null,'application/pdf',0,$lastInsertId));
			$lastInsertIdArchivo = $con->lastInsertId();
			//guardando en usuxarxgru
			$pstmt=null;
			$pstmt = $con->prepare("INSERT INTO USUXARXGRU (IDUSUARIO,IDGRUPO,IDPUBLICACION,IDARCHIVO,VISIBILIDAD,ESTADO) 
									VALUES (?,?,?,?,1,1)");
			$pstmt->execute(array(1,1,$lastInsertId,$lastInsertIdArchivo));

			return $archivo; //para armar la lista de archivos que el usuario debe subir
		
		//}catch (PDOException $e){

		//}
	}

	function subirArchivoTexto(){

		$uploaddir = '../masiveCharge/';

		$archivoNombres = $_FILES['file']['name'];
		$archivoUbTemp = $_FILES['file']['tmp_name'];
		$formato = $_FILES['file']['type'];

		//try{			
			$uploadfile = $uploaddir . basename($archivoNombres);
			if(move_uploaded_file($archivoUbTemp, $uploadfile)){
				//cambiamos nombre de archivo
				$nuevoNombre=$uploaddir . date('Ymd_Hi').'.txt';
				rename($uploadfile,$nuevoNombre);
				$lines = file($nuevoNombre);
				$top200 = array_slice(array_reverse($lines),0,200);
				$listaArchivos=array();
				//print_r($top200);
				for($i=0; $i<count($top200);$i++)
				{
				    if($i!=count($top200)-1)
				    	$listaArchivos[]=procesarLinea($top200[$i]);
				}
			}						
			echo json_encode($listaArchivos);
		//}catch(PDOException $e){
			//echo json_encode(array("status" => 0));
		//}
	}

	function subirArchivosPDF(){
		$uploaddir = '../files/';

		$archivoNombres = $_FILES['file']['name'];
		$archivoUbTemp = $_FILES['file']['tmp_name'];
		$formato = $_FILES['file']['type'];
		$con=getConnection();
		//try{
			for ($i=0; $i < count($archivoNombres) ; $i++) {

				//DUDA: verificar si el archivo a subir esta dentro de la lista de archivos registrados				

				$uploadfile = $uploaddir . basename($archivoNombres[$i]);
				if(move_uploaded_file($archivoUbTemp[$i], $uploadfile)){
					$pstmt = $con->prepare("UPDATE ARCHIVO SET ESTADO=1 WHERE NOMBRE=?");
					$pstmt->execute(array($archivoNombres[$i]));
				}
			}						
		//}catch(PDOException $e){
			//echo json_encode(array("status" => 0));
		//}
	}


	
?>