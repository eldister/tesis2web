<?php
	//IMPORTS NECESARIOS
    header("Content-type: text/html; charset=utf8");
	include('routesLogin.php');
	include_once '../back/conexion.php';
	include_once '../back/Administracion_Usuario_Grupo/modelEncriptacion.php';

	function login(){
		$request = \Slim\Slim::getInstance()->request(); //json parameters
		$data = json_decode($request->getBody());

		$con=getConnection();
		$pstmt = $con->prepare("SELECT password,idusuario from usuario where username=?");
		$pstmt->execute(array($data->{"USERNAME"}));

		$array = $pstmt->fetch(PDO::FETCH_ASSOC);

		if ($array["password"] != null){

			$passfeliz=Encrypter::decrypt($array["password"]);

			if($passfeliz==$data->{"PASSWORD"}) {
				echo json_encode(array('respuesta'=>1,'userid'=>$array["idusuario"]));
			}
			else{
				echo json_encode(array('respuesta'=>0));
			}

		}
		else{
			echo json_encode(array('respuesta'=>0));			
		}
	}

?>
