<?php
	//IMPORTS NECESARIOS
    header("Content-type: text/html; charset=utf8");
	include('routesFicha.php');
	include ('modelFicha.php');
	include_once '../back/conexion.php';
	//include_once '../back/Seguridad/serviciosPermiso.php';

	function getListaFicha(){

		$request = \Slim\Slim::getInstance()->request(); //json parameters
	    $data = json_decode($request->getBody(),TRUE);

	    $permiso=getPermisoUsuario($data["idusulogueado"]);

	    $con=getConnection();

	    if($permiso["IDPERMISO"]!=1){
			$pstmt = $con->prepare("SELECT DISTINCT F.IDFICHABIB, F.ENCABEZADO, F.TITULO_ABREVIADO, F.CONTENIDO,
											P.TITULO as TITULO_PUBLICACION, P.IDPUBLICACION, T.NOMBRE AS TIPO,  T.IDTIPOFICHA,
											F.FECHAREGISTRO, CONCAT(U.NOMBRES,' ', U.APELLIDOS) AS USUARIO
									FROM FICHABIB F, PUBLICACION P, TIPOFICHA T, USUARIO U , gruxfixusu GFU 
									WHERE F.ESTADO=1 AND  P.IDPUBLICACION=F.IDPUBLICACION AND U.IDUSUARIO=F.IDCREADOR
										AND F.IDTIPOFICHA=T.IDTIPOFICHA AND (GFU.IDGRUPO=? OR F.IDCREADOR=?) AND GFU.IDFICHABIB=F.IDFICHABIB AND GFU.ESTADO=1");
			$pstmt->execute(array($data["idMiGrupo"],$data["idusulogueado"]));
		}
		else{ //es admin
			$pstmt = $con->prepare("SELECT DISTINCT F.IDFICHABIB, F.ENCABEZADO, F.TITULO_ABREVIADO, F.CONTENIDO,
											P.TITULO as TITULO_PUBLICACION, P.IDPUBLICACION, T.NOMBRE AS TIPO,  T.IDTIPOFICHA,
											F.FECHAREGISTRO, CONCAT(U.NOMBRES,' ', U.APELLIDOS) AS USUARIO
									FROM FICHABIB F, PUBLICACION P, TIPOFICHA T, USUARIO U
									WHERE F.ESTADO=1 AND  P.IDPUBLICACION=F.IDPUBLICACION AND U.IDUSUARIO=F.IDCREADOR
										AND F.IDTIPOFICHA=T.IDTIPOFICHA");
			$pstmt->execute();			
		}

		$listaFicha = array();
		while($element = $pstmt->fetch(PDO::FETCH_ASSOC)){
			$listaFicha[] = $element;
		}
		echo json_encode($listaFicha);
	}	

	function getFicha($id){
	    $con=getConnection();	 
		$pstmt = $con->prepare("SELECT  F.ENCABEZADO, F.TITULO_ABREVIADO, F.CONTENIDO,
										P.TITULO as TITULO_PUBLICACION, P.IDPUBLICACION, T.NOMBRE AS TIPO, T.IDTIPOFICHA,
										F.FECHAREGISTRO, F.IDCREADOR, CONCAT(U.NOMBRES,' ', U.APELLIDOS) AS USUARIO
								FROM FICHABIB F, PUBLICACION P, TIPOFICHA T, USUARIO U
								WHERE F.IDFICHABIB =? AND P.IDPUBLICACION = F.IDPUBLICACION  AND U.IDUSUARIO=F.IDCREADOR
										AND  F.IDTIPOFICHA=T.IDTIPOFICHA");
		$pstmt->execute(array($id));
		$ficha = $pstmt->fetch(PDO::FETCH_ASSOC);
		echo json_encode($ficha);
	}

	function getPublicacionDeFicha($id){
		$con=getConnection();
		$pstmt = $con->prepare("SELECT F.IDPUBLICACION FROM FICHABIB F WHERE F.IDFICHABIB=?");
		$pstmt->execute(array($id));
		$publicacion = $pstmt->fetch(PDO::FETCH_ASSOC);
		echo json_encode($publicacion);
	}

	function agregaEtiquetasTitulo2($titulo,$ididioma,$idpublicacion){
		$palabras = str_word_count($titulo, 1);
		$con2= getConnection();
		for ($i=0; $i < count($palabras); $i++) { 
			$pstmt = $con2->prepare("INSERT INTO ETIQUETARELACIONADA VALUES(NULL,'Vacio por mientras')");
			$pstmt->execute();
			$lastInsertId = $con2->lastInsertId();

			$pstmt = $con2->prepare("INSERT INTO ETIQUETA VALUES(NULL,?,'No importa',2,?,?)");
			$pstmt->execute(array($palabras[$i],$ididioma,$lastInsertId));
			$lastInsertEtiqueta = $con2->lastInsertId();

			$pstmt = $con2->prepare("INSERT INTO FICHAXETIQUETA VALUES(?,?)");
			$pstmt->execute(array($idpublicacion,$lastInsertEtiqueta));
		}
	}

	function registraFicha(){

		$request = \Slim\Slim::getInstance()->request(); //json parameters
	    $data = json_decode($request->getBody());

	    try{
	    	$idgrupo=$data->{"IDGRUPO"};
	    	if($idgrupo==null)$idgrupo=1;
			$con= getConnection();
			$pstmt = $con->prepare("INSERT INTO FICHABIB (ENCABEZADO,TITULO_ABREVIADO,CONTENIDO,ESTADO,IDPUBLICACION,
									IDTIPOFICHA,FECHAREGISTRO,IDCREADOR) VALUES (?,?,?,1,?,?,CURDATE(),?)");

			$pstmt->execute(array($data->{"ENCABEZADO"},
								  'titulo null',
								  $data->{"CONTENIDO"},
								  $data->{"IDPUBLICACION"},
								  $data->{"IDTIPOFICHA"},
								  $data->{"IDCREADOR"}
								  )
							);

			$lastInsertId = $con->lastInsertId();

			agregaEtiquetasTitulo2($data->{"ENCABEZADO"},1,$lastInsertId);

			$pstmt = $con->prepare("INSERT INTO gruxfixusu(IDUSUARIO,IDGRUPO,IDFICHABIB,IDPUBLICACION,VISIBILIDAD,ESTADO)
			    						VALUES(?,?,?,?,1,1)");
			$pstmt->execute(array($data->{"IDCREADOR"},$idgrupo,$lastInsertId,$data->{"IDPUBLICACION"}));

			$array=array('IDFICHABIB'=>$lastInsertId,'IDPUBLICACION'=>$data->{"IDPUBLICACION"},'status'=>1);
			echo json_encode($array);
		}catch (PDOException $e){
			echo json_encode(array("status" => 0,"me"=>$e->getMessage()));
		}
	}


	function modificaFicha(){

		$request = \Slim\Slim::getInstance()->request(); //json parameters
		$data = json_decode($request->getBody());

		try{
			$con= getConnection();
			$pstmt = $con->prepare("UPDATE FICHABIB F 
									SET F.ENCABEZADO=?,F.TITULO_ABREVIADO=?,F.CONTENIDO=?,F.IDPUBLICACION=?,F.IDTIPOFICHA=?
									WHERE F.IDFICHABIB=?");
			
			$pstmt->execute(array($data->{"ENCABEZADO"},
								  'titulo null',
								  $data->{"CONTENIDO"},
								  $data->{"IDPUBLICACION"},
								  $data->{"IDTIPOFICHA"},
								  $data->{"IDFICHABIB"}
								  )
							);

			$array=array('IDFICHABIB'=>$data->{"IDFICHABIB"},'IDPUBLICACION'=>$data->{"IDPUBLICACION"},'status'=>1);
			echo json_encode($array);

		}catch (PDOException $e){
			echo json_encode(array("me" => $e->getMessage()));
		}
	}

	function eliminaFicha(){
		$request = \Slim\Slim::getInstance()->request(); //json parameters
		$data = json_decode($request->getBody());

		$con= getConnection();
		$pstmt = $con->prepare("UPDATE FICHABIB F SET F.ESTADO = 0 WHERE F.IDFICHABIB=?");
		$pstmt->execute(array($data->{"IDFICHABIB"}));

		$pstmt = $con->prepare("DELETE FROM gruxfixusu WHERE IDFICHABIB=?");
		$pstmt->execute(array($data->{"IDFICHABIB"}));

		$pstmt = $con->prepare("DELETE FROM fichaxetiqueta WHERE IDFICHABIB=?");
		$pstmt->execute(array($data->{"IDFICHABIB"}));

		echo $request->getBody();
	}

	function registraFichaxEtiqueta(){
		$request = \Slim\Slim::getInstance()->request(); //json parameters
		$data = json_decode($request->getBody(),TRUE);

		try{
			$con= getConnection();
			$idficha = $data["idficha"];
			for($i=0; $i<count($data["etiquetas"]); $i++) {
			    $pstmt = $con->prepare("INSERT INTO FICHAXETIQUETA(IDFICHABIB,IDETIQUETA)
			    						VALUES(?,?)");
			    $pstmt->execute(array($idficha,$data["etiquetas"][$i]["id"]));
			}
			echo $request->getBody();
		}catch(PDOException $e){
			echo json_encode(array("me" => $e->getMessage(),"status"=>0));
		}
	}

	function registraFichaxGrupo(){
		$request = \Slim\Slim::getInstance()->request(); //json parameters
		$data = json_decode($request->getBody(),TRUE);

		try{
			$con= getConnection();
			$idpublicacion = $data["idpublicacion"];
			$idficha = $data["idficha"];
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
					$pstmt = $con->prepare("INSERT INTO gruxfixusu(IDUSUARIO,IDGRUPO,IDFICHABIB,IDPUBLICACION,VISIBILIDAD,ESTADO)
			    						VALUES(?,?,?,?,1,1)");
					$pstmt->execute(array($integrantes[$j]["IDUSUARIO"],$idgrupo,$idficha,$idpublicacion));
				}
			}
			echo json_encode(array("status" => 1));
		}catch(PDOException $e){
			echo json_encode(array("status" => 0,"message"=>$e->getMessage()));
		}
	}

	function getGrupoFicha($id){
		$con=getConnection();
		$pstmt = $con->prepare("SELECT DISTINCT G.IDGRUPO, G.NOMBRE 
			  					from fichabib F,grupo G,gruxfixusu GFU 
			 					where GFU.IDFICHABIB=F.IDFICHABIB and G.idgrupo=GFU.idgrupo and G.idgrupo<>1
										and GFU.IDFICHABIB=?");
		$listaGrupo = array();
		$pstmt->execute(array($id));
		while($element = $pstmt->fetch(PDO::FETCH_ASSOC)){
			$listaGrupo[] = $element;
		}
		echo json_encode($listaGrupo);
	}

	function getEtiquetaFicha($id){

		$con=getConnection();
		$pstmt = $con->prepare("SELECT  E.IDETIQUETA, E.NOMBRE 
			  					from FICHABIB F,ETIQUETA E,FICHAXETIQUETA FE 
			 					where FE.IDFICHABIB=F.IDFICHABIB and E.IDETIQUETA=FE.IDETIQUETA
										and FE.IDFICHABIB=? and E.ESTADO=1");
		$listaEtiquetas = array();
		$pstmt->execute(array($id));
		while($element = $pstmt->fetch(PDO::FETCH_ASSOC)){
			$listaEtiquetas[] = $element;
		}
		echo json_encode($listaEtiquetas);

	}

	function modificaFichaxEtiqueta(){
		$request = \Slim\Slim::getInstance()->request(); //json parameters
		$data = json_decode($request->getBody(),TRUE);

		try{
			$con= getConnection();
			$idficha = $data["idficha"];
			$pstmt = $con->prepare("DELETE FROM FICHAXETIQUETA WHERE IDFICHABIB=?");
			$pstmt->execute(array($idficha));
			$pstmt=null;

			for($i=0; $i<count($data["etiquetas"]); $i++) {
			    $pstmt = $con->prepare("INSERT INTO FICHAXETIQUETA(IDFICHABIB,IDETIQUETA)
			    						VALUES(?,?)");
			    $pstmt->execute(array($idficha,$data["etiquetas"][$i]["id"]));
			}
			echo $request->getBody();
		}catch(PDOException $e){
			echo json_encode(array("me" => $e->getMessage()));
		}
	}

	function modificaFichaxGrupo(){
		$request = \Slim\Slim::getInstance()->request(); //json parameters
		$data = json_decode($request->getBody(),TRUE);

		try{
			$con= getConnection();
			$idficha = $data["idficha"];
			$idpublicacion = $data["idpublicacion"];
			$idusuario=$data["idusuario"];
			//IDUSUARIO<>? AND  --> para no eliminar a el mismo pero se da constraint integrity
			$pstmt = $con->prepare("DELETE FROM gruxfixusu WHERE IDFICHABIB=?");
			$pstmt->execute(array($idficha));

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
					$pstmt = $con->prepare("INSERT INTO gruxfixusu(IDUSUARIO,IDGRUPO,IDFICHABIB,IDPUBLICACION,VISIBILIDAD,ESTADO)
			    						VALUES(?,?,?,?,1,1)");
					$pstmt->execute(array($integrantes[$j]["IDUSUARIO"],$idgrupo,$idficha,$idpublicacion));
				}
			}
			//verificar si el usuario creador esta dentro de los usuarios modificados, de lo contrario agregarlo
			//PENDIENTE
			echo json_encode(array("status" => 1));
		}catch(PDOException $e){
			echo json_encode(array("status" => $e->getMessage()));
		}
	}

?>