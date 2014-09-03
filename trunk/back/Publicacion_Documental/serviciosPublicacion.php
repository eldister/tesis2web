<?php
	//IMPORTS NECESARIOS
    header("Content-type: text/html; charset=utf8");
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
									P.MES,P.PAGINAS,P.VOLUMEN,P.DOI, P.ISSN,P.FECHAREGISTRO,A.URL,
									I.NOMBRE as IDIOMA,T.NOMBRE as TIPO
							FROM PUBLICACION P,IDIOMA I, TIPOPUBLICACION T, gruxpubxusu GPU, LOG L, ARCHIVO A
							WHERE P.ESTADO=1 AND I.IDIDIOMA=P.IDIDIOMA AND L.PUBLICACION_IDPUBLICACION=P.IDPUBLICACION
									AND P.IDTIPOPUBLICACION=T.IDTIPOPUBLICACION AND (L.USUARIO_IDUSUARIO=? OR GPU.IDGRUPO=?)
									AND GPU.IDPUBLICACION=P.IDPUBLICACION AND GPU.ESTADO=1 AND P.IDPUBLICACION=A.IDPUBLICACION 
									and I.ESTADO=1 and T.ESTADO=1");
			$pstmt->execute(array($data["idUsuario"],$data["idMiGrupo"]));
		}
	    else{
			$pstmt = $con->prepare("SELECT distinct P.IDPUBLICACION, P.TITULO, P.FUENTE, P.OBTENIDO, P.ANIO,
											P.MES,P.PAGINAS,P.VOLUMEN,P.DOI, P.ISSN,P.FECHAREGISTRO,A.URL,
											I.NOMBRE as IDIOMA,T.NOMBRE as TIPO
									FROM PUBLICACION P,IDIOMA I, TIPOPUBLICACION T, ARCHIVO A
									WHERE P.ESTADO=1 AND I.IDIDIOMA=P.IDIDIOMA 
									AND P.IDTIPOPUBLICACION=T.IDTIPOPUBLICACION AND P.IDPUBLICACION=A.IDPUBLICACION 
									and I.ESTADO=1 and T.ESTADO=1");
			$pstmt->execute();
		}
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
									VOLUMEN,DOI,ISSN,ESTADO,FECHAREGISTRO,IDIDIOMA,IDTIPOPUBLICACION) 
									VALUES (?,?,?,'1990',?,?,?,?,?,1,curdate(),?,?)");

			$pstmt->execute(array($data->{"TITULO"},
								  $data->{"FUENTE"},
								  $data->{"OBTENIDO"},
								  $data->{"FECHAPUB"},
								  $data->{"PAGINAS"},
								  $data->{"VOLUMEN"},
								  $data->{"DOI"},
								  $data->{"ISSN"},								  
								  $data->{"IDIDIOMA"},
								  $data->{"IDTIPOPUBLICACION"}
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
		$pstmt->execute(array($idioma));
		$req = $pstmt->fetch(PDO::FETCH_ASSOC);
		
		if($req["CANTIDAD"]>0){
			$ididioma = $req["IDIDIOMA"];
			return $ididioma;
		}
		else
		{
			$pstmt = $con->prepare("INSERT INTO IDIOMA (NOMBRE,OBSERVACION,ESTADO) VALUES (?,'',1)");
			$pstmt->execute(array($idioma));
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
		$pstmt->execute(array($tipo));
		$req = $pstmt->fetch(PDO::FETCH_ASSOC);
		
		if($req["CANTIDAD"]>0){
			return $req["IDTIPOPUBLICACION"];
		}
		else
		{
			$pstmt = $con->prepare("INSERT INTO TIPOPUBLICACION (NOMBRE,DESCRIPCION,ESTADO) VALUES (?,'',1)");
			$pstmt->execute(array($tipo));
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
    $pstmt = $con->prepare("SELECT A.NOM_APE FROM AUTOR A WHERE A.IDAUTOR IN 
    						(SELECT p.idautor from publicacionxautor p where p.idpublicacion=?)");
	$pstmt->execute(array($IDPUBLICACION));

	$listaAutores = "";
	while($req = $pstmt->fetch(PDO::FETCH_ASSOC)){
		$grupo= [
			'NOM_APE'=> $req["NOM_APE"]
		];
		$listaCitacion[] = $grupo;
	}

    if($IDTIPO_CITACION==1){$uneAutor=";"; $ultimoAutor="&";$finAutor="";$ultimo=".";}
    else if ($IDTIPO_CITACION==2){$uneAutor=","; $ultimoAutor="and";$finAutor="";$ultimo=".";}
    else if ($IDTIPO_CITACION==3){$uneAutor=","; $ultimoAutor="&";$finAutor=".";$ultimo="";}
    else if ($IDTIPO_CITACION==4){$uneAutor=","; $ultimoAutor="&";$finAutor="";$ultimo=".";}
    else if ($IDTIPO_CITACION==5){$uneAutor=","; $ultimoAutor="&";$finAutor=".";$ultimo="";}

    $stringAutores="";

    if($cantidadAutor==1){
    	$stringAutores=$stringAutores.$listaCitacion[0]["NOM_APE"].".";
    }
    else{

		for($i=1;$i<=$cantidadAutor-1;$i++){
			$stringAutores=$stringAutores.$listaCitacion[$i]["NOM_APE"];
			$stringAutores=$stringAutores.$uneAutor;
		}	
		$stringAutores=$stringAutores." ".$ultimoAutor." ".$listaCitacion[$cantidadAutor-1]["NOM_APE"].$finAutor.$ultimo;
	}

	$pstmt = $con->prepare("SELECT p.titulo from publicacion p where p.idpublicacion=?");
	$pstmt->execute(array($IDPUBLICACION));
	$TITULO = $pstmt->fetch(PDO::FETCH_ASSOC)["titulo"];

	$nombreLibro="";
	if($IDTIPO_CITACION==1){$nombreLibro="<b>NEGRITO</b>";}
    else if ($IDTIPO_CITACION==2){}
    else if ($IDTIPO_CITACION==3){}
    else if ($IDTIPO_CITACION==4){}
    else if ($IDTIPO_CITACION==5){}

   // $orig = "<b>Este texto debería ser negrita</b>";
    $a = htmlentities($nombreLibro);
	//$b = html_entity_decode($a);
	$b = htmlspecialchars_decode($a);

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
		
			$pstmt = $con->prepare("SELECT count(P.IDAUTOR) as CANTIDAD, P.IDAUTOR FROM 
									AUTOR P WHERE P.ESTADO=1 AND 
									P.NOM_APE LIKE CONCAT('%',?,'%')");
			$pstmt->execute(array($autoresGrupo[$i]));
			$req = $pstmt->fetch(PDO::FETCH_ASSOC);
			
			if($req["CANTIDAD"]>0){
				$listaGrupo[] = $req["IDAUTOR"];
			}
			else
			{
				$pstmt = $con->prepare("INSERT INTO AUTOR (NOM_APE,IDINSTITUCION,ESTADO) VALUES (?,1,1)");
				$pstmt->execute(array($autoresGrupo[$i]));
				$listaGrupo[] = $con->lastInsertId();
			}
		}

		return $listaGrupo;
	}

	function procesarLinea($line){
		$publicacion = explode("|", $line);
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

		//verificamos el idioma, tipo de publicacion, y autores si ya existen, de lo contrario se crea, la funcion
		//devuelve el ID (nuevo o antiguo) para agregar en BD
		$ididioma=verificaIdioma($idioma);
		$idtipo=verificaTipo($tipo);
		$autores=verificaAutores($autores); //separado x comas
		//try{
			$con=getConnection();

			$pstmt = $con->prepare("INSERT INTO PUBLICACION (TITULO,FUENTE,OBTENIDO,ANIO,MES,PAGINAS,
									VOLUMEN,DOI,ISSN,ESTADO,FECHAREGISTRO,IDIDIOMA,IDTIPOPUBLICACION) 
									VALUES (?,?,?,'1990',?,?,?,?,?,1,curdate(),?,?)");

			$pstmt->execute(array($titulo,
								  $fuente,
								  $referencia,
								  $fechapub,
								  $paginas,
								  $volumen,
								  $doi,
								  $issn,								  
								  $ididioma,
								  $idtipo
								  )
							);
			$lastInsertId = $con->lastInsertId();

			//agregar etiquetas del título
			agregaEtiquetasTitulo($titulo,$ididioma,$lastInsertId);			

			$pstmt=null;
			$pstmt = $con->prepare("INSERT INTO LOG (FECHA_REGISTRO,USUARIO_IDUSUARIO,PUBLICACION_IDPUBLICACION) 
									VALUES (now(),?,?)");

			//agregando en log
			$pstmt->execute(array(1,
								  $lastInsertId));

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

				foreach($top200 as $line)
				{
				    $listaArchivos[]=procesarLinea($line);
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