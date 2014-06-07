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
				//solucion temporal porque usuario puede tener muchos grupos por usuario
				$pstmt = $con->prepare("SELECT idgrupo from usuarioxgrupo where idusuario=? limit 1");
				$pstmt->execute(array($array["idusuario"]));
				$grupo =  $pstmt->fetch(PDO::FETCH_ASSOC);

				echo json_encode(array('respuesta'=>1,'userid'=>$array["idusuario"], 'grupoid'=>$grupo["idgrupo"]));
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
