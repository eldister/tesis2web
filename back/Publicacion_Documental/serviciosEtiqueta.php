<?php
	//IMPORTS NECESARIOS
    header("Content-type: text/html; charset=utf8");
	include('routesEtiqueta.php');
	include ('modelEtiqueta.php');
	include_once '../back/conexion.php';

	function getListaEtiqueta(){
		$con=getConnection();
		$pstmt = $con->prepare("SELECT E.IDETIQUETA, E.NOMBRE, E.OBSERVACION, I.NOMBRE as IDIOMA,E.IDIDIOMA, E.IDETIQUETARELACIONADA 
								FROM ETIQUETA E, IDIOMA I WHERE E.ESTADO=1 AND I.IDIDIOMA=E.IDIDIOMA");
		$pstmt->execute();

		$listaEtiqueta = array();
		while($element = $pstmt->fetch(PDO::FETCH_ASSOC)){
			$listaEtiqueta[] = $element;
		}
		echo json_encode($listaEtiqueta);
	}	

	function getEtiqueta($id){

	    $con=getConnection();	 
		$pstmt = $con->prepare("SELECT E.IDETIQUETA, E.NOMBRE, E.OBSERVACION, E.IDETIQUETARELACIONADA, I.NOMBRE as IDIOMA,E.IDIDIOMA 
								FROM ETIQUETA E, IDIOMA I WHERE E.IDETIQUETA=? AND I.IDIDIOMA=E.IDIDIOMA");		
		$pstmt->execute(array($id));

		$etiqueta = $pstmt->fetch(PDO::FETCH_ASSOC);
		echo json_encode($etiqueta);
	}

	function getEtiquetaRel($id){
		$con=getConnection();
		$pstmt = $con->prepare("SELECT E.IDETIQUETA, E.NOMBRE, E.OBSERVACION, I.NOMBRE as IDIOMA,E.IDIDIOMA
								from (select ET.IDETIQUETARELACIONADA from ETIQUETA ET where ET.IDETIQUETA=?) A, ETIQUETA E, IDIOMA I
								WHERE E.IDETIQUETARELACIONADA=A.IDETIQUETARELACIONADA AND E.ESTADO=1 AND I.IDIDIOMA=E.IDIDIOMA");
		$pstmt->execute(array($id));

		$listaEtiqueta = array();
		while($element = $pstmt->fetch(PDO::FETCH_ASSOC)){
			$listaEtiqueta[] = $element;
		}
		echo json_encode($listaEtiqueta);
	}

	function modificaEtiqueta(){

		$request = \Slim\Slim::getInstance()->request(); //json parameters
		$data = json_decode($request->getBody(),TRUE);

		//cambio 30/08
		//1.Obtener cantidad de idiomas a recorrer
		$con= getConnection();

		//2.Obtener Etiqueta relacionada en caso se trate de un nuevo insert, como se que el primero siempre tendra un valor..
		$pstmt = $con->prepare("SELECT ET.IDETIQUETARELACIONADA from ETIQUETA ET where ET.IDETIQUETA=?");
		$pstmt->execute(array($data[0]["idet"]));

		$etiquetaRelacionada = $pstmt->fetch(PDO::FETCH_ASSOC)["IDETIQUETARELACIONADA"];

		//3.Recorrer la data y actualizar si existe etiqueta en el idioma o agregar si se esta ingresando la 
		//etiqueta por primera vez en ese idioma

		$contIdioma=1;

		while($contIdioma<= count($data)){
			$pstmt = $con->prepare("SELECT count(*) existeIdioma from etiqueta E where E.idetiquetaRelacionada=? and E.ididioma=?");
			$pstmt->execute(array($etiquetaRelacionada,$contIdioma));

			$existeIdioma = $pstmt->fetch(PDO::FETCH_ASSOC)["existeIdioma"];

			if($existeIdioma==1){//existe el idioma de la etiqueta, es update
				$pstmt = $con->prepare("UPDATE ETIQUETA E SET E.NOMBRE=? WHERE E.IDETIQUETA=?");
				$pstmt->execute(array($data[$contIdioma-1]["nombre"],$data[$contIdioma-1]["idet"]));
			}
			else{ //no existe etiqueta en el idioma pensado, por tanto se hace insert
				$pstmt = $con->prepare("INSERT INTO ETIQUETA (NOMBRE,OBSERVACION,ESTADO,IDIDIOMA,IDETIQUETARELACIONADA) 
											VALUES (?,'',1,?,?)");
				$pstmt->execute(array($data[$contIdioma-1]["nombre"],$data[$contIdioma-1]["ididioma"],$etiquetaRelacionada));
			}
			$contIdioma+=1;
		}

		echo $request->getBody(); 
	}

	function registraEtiqueta(){

		$request = \Slim\Slim::getInstance()->request(); //json parameters
	    $data = json_decode($request->getBody(),TRUE);

		$con= getConnection();

		$listaEtiquetas=array();

		$pstmt = $con->prepare("INSERT INTO ETIQUETARELACIONADA (IDETIQUETARELACIONADA,DESCRIPCION) VALUES (NULL,'Vacio por mientras')");
		$pstmt->execute();

		$lastEtiquetaRelacionada = $con->lastInsertId();

		for ($i=0; $i < count($data); $i++) {

			if($data[$i]["nombre"]!=""){ 
				$pstmt = $con->prepare("INSERT INTO ETIQUETA (NOMBRE,OBSERVACION,ESTADO,IDIDIOMA,IDETIQUETARELACIONADA) 
										VALUES (?,'',1,?,?)");
				$pstmt->execute(array($data[$i]["nombre"],$data[$i]["ididioma"],$lastEtiquetaRelacionada));

				$lastInsertId = $con->lastInsertId();

				$etiqueta=array("NOMBRE"=>$data[$i]["nombre"],
					            "IDIDIOMA"=>$data[$i]["ididioma"],
					            "IDIOMA"=>$data[$i]["idioma"],
					            "IDETIQUETA"=>$lastInsertId,
					            "IDETIQUETARELACIONADA"=>$lastEtiquetaRelacionada
					            );
				array_push($listaEtiquetas,$etiqueta);
			}
		}

		echo json_encode($listaEtiquetas);

	}

	function eliminaEtiqueta(){
		$request = \Slim\Slim::getInstance()->request(); //json parameters
		$data = json_decode($request->getBody(),TRUE);

		$con= getConnection();

		$pstmt = $con->prepare("SELECT E.IDETIQUETARELACIONADA 
								FROM ETIQUETA E WHERE E.IDETIQUETA=?");		
		$pstmt->execute(array($data["IDETIQUETA"]));

		$idetiquetaRelacionada = $pstmt->fetch(PDO::FETCH_ASSOC);

		$con= getConnection();
		$pstmt = $con->prepare("UPDATE ETIQUETA E SET E.ESTADO = 0 WHERE E.IDETIQUETARELACIONADA=?");
		$pstmt->execute(array($idetiquetaRelacionada["IDETIQUETARELACIONADA"]));

		$pstmt = $con->prepare("SELECT E.IDETIQUETA 
								FROM ETIQUETA E WHERE E.IDETIQUETARELACIONADA=?");		
		$pstmt->execute(array($idetiquetaRelacionada["IDETIQUETARELACIONADA"]));

		$listaEtiqueta = array();
		while($element = $pstmt->fetch(PDO::FETCH_ASSOC)){
			$listaEtiqueta[] = $element;
		}

		echo json_encode($listaEtiqueta);
	}

?>