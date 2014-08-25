<?php
    header("Content-type: text/html; charset=utf8");
	include('routesListaPublicacion.php');
	include_once '../back/conexion.php';

	function getListaListaPublicacion(){
		$request = \Slim\Slim::getInstance()->request();
		$data = json_decode($request->getBody(),TRUE);

	    $permiso=getPermisoUsuario($data["idUsuario"]);

	    $con=getConnection();

	    if($permiso["IDPERMISO"]!=1){
			$pstmt = $con->prepare("SELECT L.idlistapublicacion, L.nombreabr, DATE_FORMAT(L.fecharegistro,'%e-%m-%y') as fecharegistro, L.estado, L.tokenlink 
										from listapublicacion L, listapubxgrupo G, usuarioxgrupo UG
										where L.idlistapublicacion = G.idlistapublicacion and G.idgrupo=UG.idgrupo 
										and UG.idusuario=? and L.estado=1;");
			$pstmt->execute(array($data["idUsuario"]));
		}
		else{ //es admin
			$pstmt = $con->prepare("SELECT L.idlistapublicacion, L.nombreabr, DATE_FORMAT(L.fecharegistro,'%e-%m-%y') as fecharegistro, L.estado, L.tokenlink
    								from listapublicacion L where L.estado=1");
			$pstmt->execute();			
		}

		$listaListaPublicaciones = array();
		while($element = $pstmt->fetch(PDO::FETCH_ASSOC)){
			$listaListaPublicaciones[] = $element;
		}
		echo json_encode($listaListaPublicaciones);
	}

	function getPublicacionesLista(){
		$request = \Slim\Slim::getInstance()->request();
		$data = json_decode($request->getBody(),TRUE);

		$con=getConnection();
		$pstmt = $con->prepare("SELECT LP.NOMBREABR, L.IDLECTURAASIGNADA, L.TITULO, L.PALABRASCLAVE, L.NOTASLECTURA, 
								L.OBSERVACIONES, L.AUTORES, A.URL, P.IDPUBLICACION
								from LECTURAASIGNADA L, ARCHIVO A, LISTAPUBLICACION LP, PUBLICACION P
								WHERE L.IDLISTAPUBLICACION=? AND A.IDARCHIVO=L.IDARCHIVO AND 
									LP.IDLISTAPUBLICACION=L.IDLISTAPUBLICACION AND P.IDPUBLICACION=A.IDPUBLICACION");
		$pstmt->execute(array($data["idlp"]));

		$listaLecturas = array();
		while($element = $pstmt->fetch(PDO::FETCH_ASSOC)){
			
			$pstmt2 = $con->prepare("SELECT CONTENIDO FROM NOTALECTURA WHERE IDLECTURAASIGNADA=?");
			$pstmt2->execute(array($element["IDLECTURAASIGNADA"]));

			$notaslectura=array();
			while($nota = $pstmt2->fetch(PDO::FETCH_ASSOC)){
				$notaslectura[]=$nota;
			}

			$nodo = array(
					"NOMBREABR"=>$element["NOMBREABR"],
					"IDLECTURAASIGNADA"=>$element["IDLECTURAASIGNADA"],
					"TITULO"=>$element["TITULO"],
					"PALABRASCLAVE"=>$element["PALABRASCLAVE"],
					"NOTASLECTURA"=>$notaslectura,
					"OBSERVACIONES"=>$element["OBSERVACIONES"],
					"AUTORES"=>$element["AUTORES"],
					"URL"=>$element["URL"],
					"IDPUBLICACION"=>$element["IDPUBLICACION"],
					);			

			$listaLecturas[] = $nodo;
		}
		//print_r($listaLecturas);
		echo json_encode($listaLecturas);
	}

	function getGrupoListaPublicacion($id){

		$con=getConnection();
		$pstmt = $con->prepare("SELECT G.IDGRUPO, G.NOMBRE 
			  					from listapublicacion L,grupo G, LISTAPUBXGRUPO LG
			 					where LG.IDLISTAPUBLICACION=L.IDLISTAPUBLICACION and G.idgrupo=LG.idgrupo
										and LG.IDLISTAPUBLICACION=?");
		$listaGrupo = array();
		$pstmt->execute(array($id));
		while($element = $pstmt->fetch(PDO::FETCH_ASSOC)){
			$listaGrupo[] = $element;
		}
		echo json_encode($listaGrupo);
	}

	function obtieneIdArchivo($idpub){
		$con=getConnection();
		$pstmt = $con->prepare("SELECT  A.IDARCHIVO FROM ARCHIVO A, PUBLICACION P WHERE A.IDPUBLICACION=? 
									AND (A.FORMATO='application/pdf' OR A.FORMATO='application/force-download') LIMIT 1 ");

		$pstmt->execute(array($idpub));
		$idarchivo = $pstmt->fetch(PDO::FETCH_ASSOC);
		return $idarchivo["IDARCHIVO"];

	}

	function crypto_rand_secure($min, $max) {
        $range = $max - $min;
        if ($range < 0) return $min; // not so random...
        $log = log($range, 2);
        $bytes = (int) ($log / 8) + 1; // length in bytes
        $bits = (int) $log + 1; // length in bits
        $filter = (int) (1 << $bits) - 1; // set all lower bits to 1
        do {
            $rnd = hexdec(bin2hex(openssl_random_pseudo_bytes($bytes)));
            $rnd = $rnd & $filter; // discard irrelevant bits
        } while ($rnd >= $range);
        return $min + $rnd;
	}

	function getToken($length){
	    $token = "";
	    $codeAlphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	    $codeAlphabet.= "abcdefghijklmnopqrstuvwxyz";
	    $codeAlphabet.= "0123456789";
	    for($i=0;$i<$length;$i++){
	        $token .= $codeAlphabet[crypto_rand_secure(0,strlen($codeAlphabet))];
	    }
	    return $token;
	}

	function enviarCorreo($lista,$tokenlink){
			
		$MENSAJE='Estimados participantes:'."\r\n".'Se acaba de crear una nueva lista de publicacion para su revision'."\r\n";
		$MENSAJE.='Pueden ingresar a esta a traves del siguiente enlace:'."\r\n\n".'http://inv-tool.inf.pucp.edu.pe/tesis2web/listapublicacion.html?id='.$tokenlink;
		$MENSAJE.="\r\n\n".'Saludos Cordiales';
		//pendiente firma del mensaje
		$MENSAJE.="\r\n\n".'PD: Tildes omitidas intencionalmente';

		include('Mail.php');
		
		$correos=array();
		for ($i=0; $i < count($lista) ; $i++) { 
			$correos[]=$lista[$i]["correo_institucional"];
		}

	    $recipients = implode(", ",$correos);

	    $headers['From']    = 'eli03nage@gmail.com';
	    $headers['To']      = $recipients;
	    $headers['Subject'] = 'ProCal-ProSer - Nueva Lista de Publicación';

	    $body = $MENSAJE;

	    $smtpinfo["host"] = "smtp.gmail.com";
	    $smtpinfo["port"] = "587";
	    $smtpinfo["auth"] = true;
	    $smtpinfo["username"] = "eli03nage";
	    $smtpinfo["password"] = "nadyab90";

	    $mail_object =& Mail::factory("smtp", $smtpinfo); 
	    $mail_object->send($recipients, $headers, $body);
	}

	function registraListaPublicacion(){
		$request = \Slim\Slim::getInstance()->request();
		$data = json_decode($request->getBody(),TRUE);

		$con=getConnection();		

		$tokenlink = getToken(8);		

		$pstmt = $con->prepare("INSERT INTO LISTAPUBLICACION VALUES(null,?,'1000',CURDATE(),1,?)");
		$pstmt->execute(array($data["tema"],$tokenlink));

		$lastLista = $con->lastInsertId();

		for($i=0; $i<count($data["grupos"]); $i++) {
			$idgrupo=$data["grupos"][$i]["id"];
			$pstmt = $con->prepare("INSERT INTO LISTAPUBXGRUPO VALUES(?,?)");
			$pstmt->execute(array($idgrupo,$lastLista));
		}

		$mensajes=array();

		for($i=0; $i<count($data["lecturas"]); $i++) {
			$lectura=$data["lecturas"][$i];
			$idarchivo = obtieneIdArchivo($lectura["idpublicacion"]);
			if($idarchivo==null) {
				$mensajes[]="error";
				break;
			}
			$pstmt = $con->prepare("INSERT INTO LECTURAASIGNADA VALUES(null,?,?,'notasDemo',?,?,?,?)");
			$pstmt->execute(array($lectura["titulo"],$lectura["palabrasclave"],
						$lectura["observaciones"],$lectura["autores"],$lastLista,$idarchivo));

			$lastlectura = $con->lastInsertId();
			$notasLectura = $data["lecturas"][$i]["notaslectura"];

			for($j=0; $j<count($notasLectura); $j++){
				$pstmt = $con->prepare("INSERT INTO NOTALECTURA VALUES(NULL,?,?)");
				$pstmt->execute(array($notasLectura[$j]["contenido"],$lastlectura));
			}
		}

		//ENVIAR A MIEMBROS DE GRUPOS SELECCIONADOS (probado)
		$pstmt = $con->prepare("SELECT idgrupo from LISTAPUBXGRUPO where idlistapublicacion=?");
		$pstmt->execute(array($lastLista));
		$listaIdsGrupo=array();
		while($element = $pstmt->fetch(PDO::FETCH_ASSOC)){
			$listaIdsGrupo[]=$element["idgrupo"];
		}

		$cadenaGrupos=implode(",",$listaIdsGrupo);		
		
		$pstmt = $con->prepare("SELECT distinct U.nombres, U.apellidos, U.correo_institucional
								from usuarioxgrupo GU, usuario U
								where GU.idgrupo in (?) and U.idusuario<>1 and GU.idusuario=U.idusuario");
		$pstmt->execute(array($cadenaGrupos));
		$listaUsuarios=array();
		while($element = $pstmt->fetch(PDO::FETCH_ASSOC)){
			$listaUsuarios[]=$element;
		}
		enviarCorreo($listaUsuarios,$tokenlink);

		if(count($mensajes)>0){
			 echo json_encode(array("status"=>0));
		}
		else echo json_encode(array("status"=>1));

	}

	function modificaListaPublicacion(){
		$request = \Slim\Slim::getInstance()->request();
		$data = json_decode($request->getBody(),TRUE);

		$con=getConnection();

		$pstmt = $con->prepare("SELECT TOKENLINK FROM LISTAPUBLICACION WHERE IDLISTAPUBLICACION=?");
		$pstmt->execute(array($data["idlp"]));
		$tokenlink = $pstmt->fetch(PDO::FETCH_ASSOC)["TOKENLINK"];

		$pstmt = $con->prepare("UPDATE LISTAPUBLICACION SET NOMBREABR=? WHERE IDLISTAPUBLICACION=?");
		$pstmt->execute(array($data["tema"],$data["idlp"]));

		//GRUPOS
		$pstmt = $con->prepare("DELETE FROM LISTAPUBXGRUPO WHERE IDLISTAPUBLICACION=?");
		$pstmt->execute(array($data["idlp"]));
		for($i=0; $i<count($data["grupos"]); $i++) {
			$idgrupo=$data["grupos"][$i]["id"];
			$pstmt = $con->prepare("INSERT INTO LISTAPUBXGRUPO VALUES(?,?)");
			$pstmt->execute(array($idgrupo,$data["idlp"]));
		}

		//PUBLICACIONES
		$pstmt = $con->prepare("SELECT IDLECTURAASIGNADA FROM LECTURAASIGNADA WHERE IDLISTAPUBLICACION=?");
		$pstmt->execute(array($data["idlp"]));
		$listaIds = array();
		while($element = $pstmt->fetch(PDO::FETCH_ASSOC)){
			$listaIds[] = $element;
		}

		for ($i=0; $i < count($listaIds); $i++) { 
			$pstmt = $con->prepare("DELETE FROM NOTALECTURA WHERE IDLECTURAASIGNADA=?");
			$pstmt->execute(array($listaIds[$i]["IDLECTURAASIGNADA"]));
		}

		$pstmt = $con->prepare("DELETE FROM LECTURAASIGNADA WHERE IDLISTAPUBLICACION=?");
		$pstmt->execute(array($data["idlp"]));

		$mensajes=array();

		for($i=0; $i<count($data["lecturas"]); $i++) {
			$lectura=$data["lecturas"][$i];
			$idarchivo = obtieneIdArchivo($lectura["idpublicacion"]);
			if($idarchivo==null) {
				$mensajes[]="error";
				break;
			}
			$pstmt = $con->prepare("INSERT INTO LECTURAASIGNADA VALUES(null,?,?,'notasDemo',?,?,?,?)");
			$pstmt->execute(array($lectura["titulo"],$lectura["palabrasclave"],
									$lectura["observaciones"],$lectura["autores"],$data["idlp"],$idarchivo));

			$lastlectura = $con->lastInsertId();
			$notasLectura = $data["lecturas"][$i]["notaslectura"];

			for($j=0; $j<count($notasLectura); $j++){
				$pstmt = $con->prepare("INSERT INTO NOTALECTURA VALUES(NULL,?,?)");
				$pstmt->execute(array($notasLectura[$j]["contenido"],$lastlectura));
			}
		}

		//ENVIAR A MIEMBROS DE GRUPOS SELECCIONADOS (probado)
		$pstmt = $con->prepare("SELECT idgrupo from LISTAPUBXGRUPO where idlistapublicacion=?");
		$pstmt->execute(array($data["idlp"]));
		$listaIdsGrupo=array();
		while($element = $pstmt->fetch(PDO::FETCH_ASSOC)){
			$listaIdsGrupo[]=$element["idgrupo"];
		}

		$cadenaGrupos=implode(",",$listaIdsGrupo);		
		
		$pstmt = $con->prepare("SELECT distinct U.nombres, U.apellidos, U.correo_institucional
								from usuarioxgrupo GU, usuario U
								where GU.idgrupo in (?) and U.idusuario<>1 and GU.idusuario=U.idusuario");
		$pstmt->execute(array($cadenaGrupos));
		$listaUsuarios=array();
		while($element = $pstmt->fetch(PDO::FETCH_ASSOC)){
			$listaUsuarios[]=$element;
		}
		enviarCorreo($listaUsuarios,$tokenlink);

		print_r($listaUsuarios);
		if(count($mensajes)>0){
			echo json_encode(array("status"=>0));
		}
		else echo json_encode(array("status"=>1));

	}

	function eliminaListaPublicacion(){
		$request = \Slim\Slim::getInstance()->request();
		$data = json_decode($request->getBody(),TRUE);

		$con=getConnection();

		$pstmt = $con->prepare("UPDATE LISTAPUBLICACION SET ESTADO=0 WHERE IDLISTAPUBLICACION=?");
		$pstmt->execute(array($data["idlp"]));

		echo json_encode(array("IDLISTAPUBLICACION"=>$data["idlp"]));
	}

	function buscarPublicacion(){
		$request = \Slim\Slim::getInstance()->request();
		$data = json_decode($request->getBody(),TRUE);

		$con=getConnection();

		$sql = "SELECT distinct P.IDPUBLICACION,
				    P.TITULO,	
				    T.NOMBRE as TIPO,
				    I.NOMBRE as IDIOMA,
				   (select distinct
				            GROUP_CONCAT(tabla.autor
				                    SEPARATOR ', ') as autores
				        FROM            
				            (select 
				                A.nom_ape AS AUTOR, PU.idpublicacion
				            FROM
				                PUBLICACIONXAUTOR PA, AUTOR A, publicacion PU
				            where
				                PA.IDAUTOR = A.IDAUTOR
				                    AND PA.IDPUBLICACION = PU.IDPUBLICACION) as tabla
				        where
				            tabla.idpublicacion = p.idpublicacion) AS AUTORES
				from
				    publicacion P,
				    tipopublicacion T,
				    idioma I,
				    archivo A
				where
				    T.idtipopublicacion = P.idtipopublicacion
				        and P.ididioma = I.ididioma and p.estado=1
				        and P.titulo like CONCAT('%',?,'%') and P.idpublicacion=A.idpublicacion and A.idarchivo is not NULL";
		
		$pstmt = $con->prepare($sql);
		$pstmt->execute(array($data["criterio"]));

		$listaPublicaciones = array();
		while($req = $pstmt->fetch(PDO::FETCH_ASSOC)){
			$listaPublicaciones[] = $req;
		}
		echo json_encode($listaPublicaciones);
	}

	function getPublicacionesEnlace(){
		$request = \Slim\Slim::getInstance()->request();
		$data = json_decode($request->getBody(),TRUE);
			
		$con=getConnection();
		$pstmt = $con->prepare("SELECT LP.IDLISTAPUBLICACION, LP.NOMBREABR, L.IDLECTURAASIGNADA, L.TITULO, L.PALABRASCLAVE, L.NOTASLECTURA, 
								L.OBSERVACIONES, L.AUTORES, A.URL, P.IDPUBLICACION
								from LECTURAASIGNADA L, ARCHIVO A, LISTAPUBLICACION LP, PUBLICACION P
								WHERE LP.TOKENLINK=? AND A.IDARCHIVO=L.IDARCHIVO AND 
									LP.IDLISTAPUBLICACION=L.IDLISTAPUBLICACION AND P.IDPUBLICACION=A.IDPUBLICACION");
		$pstmt->execute(array($data["idenlace"]));

		$listaLecturas = array();
		while($element = $pstmt->fetch(PDO::FETCH_ASSOC)){
			
			$pstmt2 = $con->prepare("SELECT CONTENIDO FROM NOTALECTURA WHERE IDLECTURAASIGNADA=?");
			$pstmt2->execute(array($element["IDLECTURAASIGNADA"]));

			$notaslectura=array();
			while($nota = $pstmt2->fetch(PDO::FETCH_ASSOC)){
				$notaslectura[]=$nota;
			}

			$nodo = array(
					"IDLISTAPUBLICACION"=>$element["IDLISTAPUBLICACION"],
					"NOMBREABR"=>$element["NOMBREABR"],
					"IDLECTURAASIGNADA"=>$element["IDLECTURAASIGNADA"],
					"TITULO"=>$element["TITULO"],
					"PALABRASCLAVE"=>$element["PALABRASCLAVE"],
					"NOTASLECTURA"=>$notaslectura,
					"OBSERVACIONES"=>$element["OBSERVACIONES"],
					"AUTORES"=>$element["AUTORES"],
					"URL"=>$element["URL"],
					"IDPUBLICACION"=>$element["IDPUBLICACION"],
					);			

			$listaLecturas[] = $nodo;
		}
		//print_r($listaLecturas);
		echo json_encode($listaLecturas);
	}

?>