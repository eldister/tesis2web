<?php
   // header("Content-type: text/html; charset=utf8");
	include('routesUsuario.php');
	include ('modelEncriptacion.php');
	include_once '../back/conexion.php';

function encriptaAdmin(){
	$USERNAME="admin";
	$PASSWORD=Encrypter::encrypt($USERNAME);
	echo $PASSWORD;
}

function damePermisoNP($id){
	$con=getConnection();
	$pstmt = $con->prepare("SELECT U.IDPERMISO FROM USUARIO U WHERE U.ESTADO = 1 AND U.IDUSUARIO=?");
	$pstmt->execute(array($id));
	$idPermiso = $pstmt->fetch(PDO::FETCH_ASSOC)["IDPERMISO"];
	return $idPermiso;
}

function getListaUsuario(){

		$request = \Slim\Slim::getInstance()->request(); //json parameters
    	$data = json_decode($request->getBody());
		//$request = \Slim\Slim::getInstance()->request();
		//$data = json_decode($request->getBody(),true);
    	$IDUSUARIO=$data->{"IDUSUARIO"};
    	//echo $IDUSUARIO;
		

		$PERMISO=damePermisoNP($IDUSUARIO);
		//echo $PERMISO;

		$con=getConnection();
		$listaUsuario = array();
		if($PERMISO==1){
			$pstmt = $con->prepare("SELECT U.IDUSUARIO,U.NOMBRES,U.APELLIDOS,U.CORREO_INSTITUCIONAL,U.CORREO_ALTERNO,U.NUMERO_CELULAR,
								U.NUMERO_TEL_ALTERNO,U.CUENTA_SKYPE,I.NOMBRE_INSTITUCION,U.MESES_TERMINAR,U.COMPROMISO,P.NOMBRE,U.USERNAME,U.PASSWORD
								 FROM USUARIO U, PERMISO P, INSTITUCION I WHERE U.ESTADO =1 AND U.IDPERMISO=P.IDPERMISO AND U.IDINSTITUCION=I.IDINSTITUCION");

			$pstmt->execute();
			while($req = $pstmt->fetch(PDO::FETCH_ASSOC)){
				$listaUsuario[] = $req;
			}
		}
		else{
			$pstmt = $con->prepare("SELECT DISTINCT(UG2.IDUSUARIO),U.NOMBRES,U.APELLIDOS,U.CORREO_INSTITUCIONAL,U.CORREO_ALTERNO,U.NUMERO_CELULAR,
									U.NUMERO_TEL_ALTERNO,U.CUENTA_SKYPE,I.NOMBRE_INSTITUCION,U.MESES_TERMINAR,U.COMPROMISO,P.NOMBRE,U.USERNAME,
									U.PASSWORD FROM usuarioxgrupo UG2,usuario U, institucion I,permiso p WHERE I.idinstitucion=U.idinstitucion 
									AND U.idusuario=UG2.idusuario AND P.idpermiso=u.idpermiso AND UG2.idgrupo IN 
									(SELECT UG.idgrupo FROM usuarioxgrupo UG WHERE UG.ESTADO=1 AND UG.idusuario=?)");

			$pstmt->execute(array($IDUSUARIO));
			while($req = $pstmt->fetch(PDO::FETCH_ASSOC)){
				$listaUsuario[] = $req;
			}
		}
		echo json_encode($listaUsuario);
}

function getUsuario3($id){
	$con=getConnection();
 
	$pstmt = $con->prepare("SELECT U.IDUSUARIO,U.NOMBRES,U.APELLIDOS,U.CORREO_INSTITUCIONAL,U.CORREO_ALTERNO,U.NUMERO_CELULAR,
							U.NUMERO_TEL_ALTERNO,U.CUENTA_SKYPE,U.IDINSTITUCION,U.MESES_TERMINAR,U.COMPROMISO,U.IDPERMISO,U.USERNAME
							FROM USUARIO U WHERE U.ESTADO =1 AND U.IDUSUARIO=?");
	$pstmt->execute(array($id));
	$pUSUARIO = $pstmt->fetch(PDO::FETCH_ASSOC);
	echo json_encode($pUSUARIO);
}

function getUsuario2($id){
	$con=getConnection();
 
	$pstmt = $con->prepare("SELECT U.IDUSUARIO,U.NOMBRES,U.APELLIDOS,U.CORREO_INSTITUCIONAL,U.CORREO_ALTERNO,U.NUMERO_CELULAR,
							U.NUMERO_TEL_ALTERNO,U.CUENTA_SKYPE,U.IDINSTITUCION,U.IDPERMISO,U.USERNAME,U.PASSWORD, P.NOMBRE
							FROM USUARIO U, PERMISO P WHERE U.ESTADO =1 AND U.IDPERMISO=P.IDPERMISO AND U.IDUSUARIO=?");
	$pstmt->execute(array($id));
	$pUSUARIO = $pstmt->fetch(PDO::FETCH_ASSOC);
	$PASS=Encrypter::decrypt($pUSUARIO["PASSWORD"]);
	//$persona=array();
	$persona=array(
			array('IDUSUARIO'=>$pUSUARIO["IDUSUARIO"]),
			array('NOMBRES'=>$pUSUARIO["NOMBRES"]),
			array('APELLIDOS'=>$pUSUARIO["APELLIDOS"]),
			array('CORREO_INSTITUCIONAL'=>$pUSUARIO["CORREO_INSTITUCIONAL"]),
			array('CORREO_ALTERNO'=>$pUSUARIO["CORREO_ALTERNO"]),
			array('NUMERO_CELULAR'=>$pUSUARIO["NUMERO_CELULAR"]),
			array('NUMERO_TEL_ALTERNO'=>$pUSUARIO["NUMERO_TEL_ALTERNO"]),
			array('CUENTA_SKYPE'=>$pUSUARIO["CUENTA_SKYPE"]),
			array('IDINSTITUCION'=>$pUSUARIO["IDINSTITUCION"]),
			//array('MESES_TERMINAR'=>$pUSUARIO["MESES_TERMINAR"]),
			//array('COMPROMISO'=>$pUSUARIO["COMPROMISO"]),
			array('IDPERMISO'=>$pUSUARIO["IDPERMISO"]),
			array('USERNAME'=>$pUSUARIO["USERNAME"]),
			array('NOMBRE'=>$pUSUARIO["NOMBRE"]),
			array('PASSWORD'=>$PASS)	
		);

	echo json_encode($persona);
}

function getUsuario($id){
    $con=getConnection();	
 
	$pstmt = $con->prepare("SELECT U.IDUSUARIO,U.NOMBRES,U.APELLIDOS,U.CORREO_INSTITUCIONAL,U.CORREO_ALTERNO,U.NUMERO_CELULAR,
							U.NUMERO_TEL_ALTERNO,U.CUENTA_SKYPE,I.NOMBRE_INSTITUCION,P.NOMBRE,U.USERNAME
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
							U.NUMERO_TEL_ALTERNO=?,U.CUENTA_SKYPE=?,U.IDINSTITUCION=?,U.IDPERMISO=?,U.USERNAME=?
							WHERE U.IDUSUARIO=?");
	$pstmt->execute(array($data->{"NOMBRES"},$data->{"APELLIDOS"},$data->{"CORREO_INSTITUCIONAL"},$data->{"CORREO_ALTERNO"},$data->{"NUMERO_CELULAR"},
						$data->{"NUMERO_TEL_ALTERNO"},$data->{"CUENTA_SKYPE"},$data->{"IDINSTITUCION"},
						$data->{"IDPERMISO"},$data->{"USERNAME"},$data->{"IDUSUARIO"}));

	echo $request->getBody();
}


function modificaUsuario2(){
	$request = \Slim\Slim::getInstance()->request(); //json parameters
    $data = json_decode($request->getBody());

	$con= getConnection();
	$PASS=Encrypter::encrypt($data->{"PASSWORD"});
	$pstmt = $con->prepare("UPDATE USUARIO U SET U.NOMBRES=?,U.APELLIDOS=?,U.CORREO_INSTITUCIONAL=?,U.CORREO_ALTERNO=?,U.NUMERO_CELULAR=?,
							U.NUMERO_TEL_ALTERNO=?,U.CUENTA_SKYPE=?,U.IDINSTITUCION=?,U.IDPERMISO=?,U.USERNAME=?,
							U.PASSWORD=?
							WHERE U.IDUSUARIO=?");
	$pstmt->execute(array($data->{"NOMBRES"},$data->{"APELLIDOS"},$data->{"CORREO_INSTITUCIONAL"},$data->{"CORREO_ALTERNO"},$data->{"NUMERO_CELULAR"},
						$data->{"NUMERO_TEL_ALTERNO"},$data->{"CUENTA_SKYPE"},$data->{"IDINSTITUCION"},
						$data->{"IDPERMISO"},$data->{"USERNAME"},$PASS,$data->{"IDUSUARIO"}));

	echo $request->getBody();
}

function registraUsuario(){

	$request = \Slim\Slim::getInstance()->request(); //json parameters
    $data = json_decode($request->getBody());

	$con= getConnection();

	//DEBO CREAR EL USERNAME Y PASSWORD

	$USERNAME1= substr($data->{"NOMBRES"}, 0, 1);
	$USER='.';
	$extra=explode(" ", $data->{"APELLIDOS"});
	$USERNAME2= $extra[0];
	$USERN=$USERNAME1.$USER.$USERNAME2;
	$USERNAME= strtolower(str_replace(' ', '', $USERN));

	$PASSWORD=Encrypter::encrypt($USERNAME);

	$pstmt = $con->prepare("INSERT INTO USUARIO (NOMBRES,APELLIDOS,CORREO_INSTITUCIONAL,CORREO_ALTERNO,NUMERO_CELULAR,NUMERO_TEL_ALTERNO,
										CUENTA_SKYPE,IDINSTITUCION,IDPERMISO,USERNAME,PASSWORD,ESTADO) 
							VALUES (?,?,?,?,?,?,?,?,?,?,?,1)");
	$pstmt->execute(array($data->{"NOMBRES"},$data->{"APELLIDOS"},$data->{"CORREO_INSTITUCIONAL"},$data->{"CORREO_ALTERNO"},
					$data->{"NUMERO_CELULAR"},$data->{"NUMERO_TEL_ALTERNO"},$data->{"CUENTA_SKYPE"},$data->{"IDINSTITUCION"},
					$data->{"IDPERMISO"},$USERNAME,$PASSWORD));

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
			//array('MESES_TERMINAR'=> $data->{"MESES_TERMINAR"}),
			//array('COMPROMISO'=>$data->{"COMPROMISO"}),
			array('IDPERMISO'=> $data->{"IDPERMISO"}),
			array('USERNAME'=> $USERNAME),
			array('PASSWORD'=> $PASSWORD)
		);

	$CORREO_INSTITUCIONAL=$data->{"CORREO_INSTITUCIONAL"};
	$CORREO_ALTERNO=$data->{"CORREO_ALTERNO"};
	$NOMBRES=$data->{"NOMBRES"};
	$APELLIDOS=$data->{"APELLIDOS"};

	enviarMensaje($USERNAME,$PASSWORD,$CORREO_INSTITUCIONAL,$NOMBRES,$APELLIDOS,$CORREO_ALTERNO);
	echo json_encode($array);
}

function enviarMensaje($username,$password,$CORREO_INSTITUCIONAL,$NOMBRES,$APELLIDOS,$CORREO_ALTERNO){
	$PASS=Encrypter::decrypt($password);
	$ESPACIO=' ';
	$USER=$NOMBRES.$ESPACIO.$APELLIDOS;
	$MENSAJE='Estimado '.$USER."\r\n".' Acaba de ser registrado como un nuevo miembro del Proyecto ProCal-ProSer'."\r\n".' Para poder ingresar al sistema debera hacer uso de los siguientes datos:'."\r\n".'  USUARIO:  '.$username."\r\n".'  PASSWORD:  '.$PASS;

	
	include('Mail.php');

    $recipients = $CORREO_INSTITUCIONAL;

    $headers['From']    = 'eli03nage@gmail.com';
    $headers['To']      = $recipients;
    $headers['Subject'] = 'ProCal-ProSer - Registro de Nuevo Miembro';

    $body = $MENSAJE;

    $smtpinfo["host"] = "smtp.gmail.com";
    $smtpinfo["port"] = "587";
    $smtpinfo["auth"] = true;
    $smtpinfo["username"] = "eli03nage";
    $smtpinfo["password"] = "nadyab90";

    $mail_object =& Mail::factory("smtp", $smtpinfo); 
    $mail_object->send($recipients, $headers, $body);
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