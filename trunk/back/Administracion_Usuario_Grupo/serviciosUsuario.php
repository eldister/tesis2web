<?php
   // header("Content-type: text/html; charset=utf8");
	include('routesUsuario.php');
	include ('modelEncriptacion.php');
	include_once '../back/conexion.php';


function getListaUsuario(){
		$request = \Slim\Slim::getInstance()->request();
		$con=getConnection();
		
		$pstmt = $con->prepare("SELECT U.IDUSUARIO,U.NOMBRES,U.APELLIDOS,U.CORREO_INSTITUCIONAL,U.CORREO_ALTERNO,U.NUMERO_CELULAR,
								U.NUMERO_TEL_ALTERNO,U.CUENTA_SKYPE,I.NOMBRE_INSTITUCION,U.MESES_TERMINAR,U.COMPROMISO,P.NOMBRE,U.USERNAME,U.PASSWORD
								 FROM USUARIO U, PERMISO P, INSTITUCION I WHERE U.ESTADO =1 AND U.IDPERMISO=P.IDPERMISO AND U.IDINSTITUCION=I.IDINSTITUCION");

		$pstmt->execute();

		$listaUsuario = array();
		while($req = $pstmt->fetch(PDO::FETCH_ASSOC)){
			$listaUsuario[] = $req;
		}
		echo json_encode($listaUsuario);
}

function getUsuario2($id){
	$con=getConnection();
 
	$pstmt = $con->prepare("SELECT U.IDUSUARIO,U.NOMBRES,U.APELLIDOS,U.CORREO_INSTITUCIONAL,U.CORREO_ALTERNO,U.NUMERO_CELULAR,
							U.NUMERO_TEL_ALTERNO,U.CUENTA_SKYPE,U.IDINSTITUCION,U.MESES_TERMINAR,U.COMPROMISO,U.IDPERMISO,U.USERNAME
							FROM USUARIO U WHERE U.ESTADO =1 AND U.IDUSUARIO=?");
	$pstmt->execute(array($id));
	$IDUSUARIO = $pstmt->fetch(PDO::FETCH_ASSOC);
	echo json_encode($IDUSUARIO);
}

function getUsuario($id){
    $con=getConnection();
 
	$pstmt = $con->prepare("SELECT U.IDUSUARIO,U.NOMBRES,U.APELLIDOS,U.CORREO_INSTITUCIONAL,U.CORREO_ALTERNO,U.NUMERO_CELULAR,
							U.NUMERO_TEL_ALTERNO,U.CUENTA_SKYPE,I.NOMBRE_INSTITUCION,U.MESES_TERMINAR,U.COMPROMISO,P.NOMBRE,U.USERNAME
							FROM USUARIO U, PERMISO P, INSTITUCION I WHERE U.ESTADO =1 AND U.IDPERMISO=P.IDPERMISO AND 
							I.IDINSTITUCION=U.IDINSTITUCION AND U.IDUSUARIO=?");
	$pstmt->execute(array($id));
	$IDUSUARIO = $pstmt->fetch(PDO::FETCH_ASSOC);
	echo json_encode($IDUSUARIO);
}

function modificaUsuario(){
	$request = \Slim\Slim::getInstance()->request(); //json parameters
    $data = json_decode($request->getBody());

	$con= getConnection();
	$pstmt = $con->prepare("UPDATE USUARIO U SET U.NOMBRES=?,U.APELLIDOS=?,U.CORREO_INSTITUCIONAL=?,U.CORREO_ALTERNO=?,U.NUMERO_CELULAR=?,
							U.NUMERO_TEL_ALTERNO=?,U.CUENTA_SKYPE=?,U.IDINSTITUCION=?,U.MESES_TERMINAR=?,U.COMPROMISO=?,U.IDPERMISO=?,U.USERNAME=?
							WHERE U.IDUSUARIO=?");
	$pstmt->execute(array($data->{"NOMBRES"},$data->{"APELLIDOS"},$data->{"CORREO_INSTITUCIONAL"},$data->{"CORREO_ALTERNO"},$data->{"NUMERO_CELULAR"},
						$data->{"NUMERO_TEL_ALTERNO"},$data->{"CUENTA_SKYPE"},$data->{"IDINSTITUCION"},$data->{"MESES_TERMINAR"},
						$data->{"COMPROMISO"},$data->{"IDPERMISO"},$data->{"USERNAME"},$data->{"IDUSUARIO"}));

	echo $request->getBody();
}

function registraUsuario(){

	$request = \Slim\Slim::getInstance()->request(); //json parameters
    $data = json_decode($request->getBody());

	$con= getConnection();

	//DEBO CREAR EL USERNAME Y PASSWORD

	$USERNAME1= substr($data->{"NOMBRES"}, 0, 1);
	$USER='.';
	$USERNAME2= $data->{"APELLIDOS"};
	$USERN=$USERNAME1.$USER.$USERNAME2;
	$USERNAME= strtolower(str_replace(' ', '', $USERN));

	//ECHO $USERNAME;

	$PASSWORD=Encrypter::encrypt($USERNAME);
	//ECHO $PASSWORD;

	$pstmt = $con->prepare("INSERT INTO USUARIO (NOMBRES,APELLIDOS,CORREO_INSTITUCIONAL,CORREO_ALTERNO,NUMERO_CELULAR,NUMERO_TEL_ALTERNO,
										CUENTA_SKYPE,IDINSTITUCION,MESES_TERMINAR,COMPROMISO,IDPERMISO,USERNAME,PASSWORD,ESTADO) 
							VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,1)");
	$pstmt->execute(array($data->{"NOMBRES"},$data->{"APELLIDOS"},$data->{"CORREO_INSTITUCIONAL"},$data->{"CORREO_ALTERNO"},
					$data->{"NUMERO_CELULAR"},$data->{"NUMERO_TEL_ALTERNO"},$data->{"CUENTA_SKYPE"},$data->{"IDINSTITUCION"},
					$data->{"MESES_TERMINAR"},$data->{"COMPROMISO"},$data->{"IDPERMISO"},$USERNAME,$PASSWORD));

	$lastInsertId = $con->lastInsertId();

	$array=array(
			array('IDUSUARIO'=>$lastInsertId),
			array('NOMBRES'=>$data->{"NOMBRES"}),
			array('APELLIDOS'=> $data->{"APELLIDOS"}),
			array('CORREO_INSTITUCIONAL'=>$data->{"CORREO_INSTITUCIONAL"}),
			array('CORREO_ALTERNO'=> $data->{"CORREO_ALTERNO"}),
			array('NUMERO_CELULAR'=>$data->{"NUMERO_CELULAR"}),
			array('NUMERO_TEL_ALTERNO'=> $data->{"NUMERO_TEL_ALTERNO"}),
			array('CUENTA_SKYPE'=>$data->{"CUENTA_SKYPE"}),
			array('IDINSTITUCION'=> $data->{"IDINSTITUCION"}),
			array('MESES_TERMINAR'=> $data->{"MESES_TERMINAR"}),
			array('COMPROMISO'=>$data->{"COMPROMISO"}),
			array('IDPERMISO'=> $data->{"IDPERMISO"}),
			array('USERNAME'=> $USERNAME),
			array('PASSWORD'=> $PASSWORD)
		);
	echo json_encode($array);
}

function eliminaUsuario(){
	$request = \Slim\Slim::getInstance()->request(); //json parameters
	$data = json_decode($request->getBody());
	$con= getConnection();
	$pstmt = $con->prepare("UPDATE USUARIO U SET U.ESTADO = 0 WHERE U.IDUSUARIO=?");
	$pstmt->execute(array($data->{"IDUSUARIO"}));

	$array=array(
		array('IDUSUARIO'=>$data->{"IDUSUARIO"})
		);
	echo json_encode($array);
}

function getTipoUsuario(){
	$con= getConnection();
	$pstmt = $con->prepare("SELECT P.IDPERMISO, P.NOMBRE FROM PERMISO P WHERE P.ESTADO=1");
	$pstmt->execute(array());

	$listaTipoUsuario = array();
		while($req = $pstmt->fetch(PDO::FETCH_ASSOC)){
			$listaTipoUsuario[] = $req;
		}
	echo json_encode($listaTipoUsuario);
}

function getInstituciones(){
	$con= getConnection();
	$pstmt = $con->prepare("SELECT P.IDINSTITUCION, P.NOMBRE_INSTITUCION FROM INSTITUCION P WHERE P.ESTADO=1");
	$pstmt->execute(array());

	$listaInstitucion = array();
		while($req = $pstmt->fetch(PDO::FETCH_ASSOC)){
			$listaInstitucion[] = $req;
		}
	echo json_encode($listaInstitucion);
}
?>