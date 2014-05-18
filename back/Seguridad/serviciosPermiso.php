<?php
	//IMPORTS NECESARIOS
    header("Content-type: text/html; charset=utf8");
	include('routesPermiso.php');
	include_once '../back/conexion.php';

	function getListaPermiso(){
		$con=getConnection();
		$pstmt = $con->prepare("SELECT P.IDPERMISO,P.NOMBRE,P.DESCRIPCION from permiso P where ESTADO=1");
		$pstmt->execute();

		$listaPermiso = array();
		while($element = $pstmt->fetch(PDO::FETCH_ASSOC)){
			$listaPermiso[] = $element;
		}
		echo json_encode($listaPermiso);
	}	

	function getPermiso($id){

	    $con=getConnection();	 
		$pstmt = $con->prepare("SELECT P.IDPERMISO,P.NOMBRE,P.DESCRIPCION from permiso P where ESTADO=1 AND P.IDPERMISO=?");		
		$pstmt->execute(array($id));

		$etiqueta = $pstmt->fetch(PDO::FETCH_ASSOC);
		echo json_encode($etiqueta);
	}

	function getFuncionalidadUsuario($id){

		$con=getConnection();
		$pstmt = $con->prepare("SELECT F.NOMBRE,PF.IDFUNCIONALIDAD from permisoxfuncionalidad PF, 
									FUNCIONALIDAD F, USUARIO U, PERMISO P where U.IDPERMISO=P.IDPERMISO 
									AND PF.IDFUNCIONALIDAD=F.IDFUNCIONALIDAD AND PF.IDPERMISO = P.IDPERMISO 
									AND U.IDUSUARIO=?");
		$pstmt->execute(array($id));

		$listaFuncionalidades = array();
		while($element = $pstmt->fetch(PDO::FETCH_ASSOC)){
			$listaFuncionalidades[] = $element;
		}

		echo json_encode($listaFuncionalidades);
	}

	function getFuncionalidadesPermiso($id){
		$con=getConnection();
		$pstmt = $con->prepare("SELECT PF.IDFUNCIONALIDAD,F.NOMBRE from permisoxfuncionalidad PF, FUNCIONALIDAD F 
								where PF.IDPERMISO=? AND PF.IDFUNCIONALIDAD=F.IDFUNCIONALIDAD");		
		$pstmt->execute(array($id));

		$listaFuncionalidades = array();
		while($element = $pstmt->fetch(PDO::FETCH_ASSOC)){
			$listaFuncionalidades[] = $element;
		}

		echo json_encode($listaFuncionalidades);
	}

	function getPermisoUsuario($id){

	    $con=getConnection();	 
		$pstmt = $con->prepare("SELECT U.IDPERMISO  
								FROM USUARIO U WHERE U.IDUSUARIO=?");		
		$pstmt->execute(array($id));

		$permiso = $pstmt->fetch(PDO::FETCH_ASSOC);
		return $permiso;
	}

	function registrarPermiso(){

		$request = \Slim\Slim::getInstance()->request(); //json parameters
		$data = json_decode($request->getBody(),TRUE);

		$con= getConnection();
		$pstmt = $con->prepare("INSERT INTO PERMISO (NOMBRE,ESTADO,DESCRIPCION) VALUES (?,1,?)");
		$pstmt->execute(array($data["NOMBRE"],$data["DESCRIPCION"]));

		$lastInsertId = $con->lastInsertId();
		$con=null;

		for ($i=0; $i < count($data["PERMISOS"]); $i++) { 
			$hijos=$data["PERMISOS"][$i]["children"];
			for ($j=0; $j < count($hijos); $j++) { 
				if($hijos[$j]["checked"]=="true"){
					$con= getConnection();
					$pstmt = $con->prepare("INSERT INTO permisoxfuncionalidad (IDPERMISO,IDFUNCIONALIDAD) VALUES (?,?)");
					$pstmt->execute(array($lastInsertId,$hijos[$j]["id"]));
					$con=null;
				}
			}
		}

		echo json_encode(array("status"=>1));
	}

	function modificarPermiso(){

		$request = \Slim\Slim::getInstance()->request(); //json parameters
	    $data = json_decode($request->getBody(),TRUE);

		$con= getConnection();
		$pstmt = $con->prepare("UPDATE PERMISO P SET P.NOMBRE=?,P.DESCRIPCION=? WHERE P.IDPERMISO=?");
		$pstmt->execute(array($data["NOMBRE"],$data["DESCRIPCION"],$data["IDPERMISO"]));

		$idpermiso = $data["IDPERMISO"];

		$con= getConnection();
	    $pstmt = $con->prepare("DELETE FROM permisoxfuncionalidad WHERE IDPERMISO=?");
		$pstmt->execute(array($data["IDPERMISO"]));
		$con=null;

		for ($i=0; $i < count($data["PERMISOS"]); $i++) { 
			$hijos=$data["PERMISOS"][$i]["children"];
			for ($j=0; $j < count($hijos); $j++) { 
				if($hijos[$j]["checked"]=="true"){
					$con= getConnection();
					$pstmt = $con->prepare("INSERT INTO permisoxfuncionalidad (IDPERMISO,IDFUNCIONALIDAD) VALUES (?,?)");
					$pstmt->execute(array($idpermiso,$hijos[$j]["id"]));
					$con=null;
				}
			}
		}

		echo json_encode(array("status"=>1));

	}

	function eliminarPermiso(){
		$request = \Slim\Slim::getInstance()->request(); //json parameters
		$data = json_decode($request->getBody());

		$con= getConnection();
		$pstmt = $con->prepare("UPDATE PERMISO P SET P.ESTADO = 0 WHERE P.IDPERMISO=?");
		$pstmt->execute(array($data->{"IDETIQUETA"}));

		echo json_encode($request->getBody());
	}

	function validarEliminacionPermiso($id){
		$request = \Slim\Slim::getInstance()->request(); //json parameters
		$data = json_decode($request->getBody());

		$con= getConnection();
		$pstmt = $con->prepare("SELECT count(u.IDUSUARIO) as numUsuPermiso FROM usuario U WHERE U.IDPERMISO =?");
		$pstmt->execute(array($id));

		$numUsuPermiso = $pstmt->fetch(PDO::FETCH_ASSOC);
		echo json_encode($numUsuPermiso);

	}

?>