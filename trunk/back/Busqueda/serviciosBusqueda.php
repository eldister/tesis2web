<?php
   // header("Content-type: text/html; charset=utf8");
	include('routesBusqueda.php');
	include_once '../back/conexion.php';


function dameEtiquetaBQ(){


    $con=getConnection();
    $pstmt = $con->prepare("SELECT E.NOMBRE, E.IDETIQUETA FROM ETIQUETA E WHERE E.ESTADO=1");
	$pstmt->execute(array());
	$listaEtiqueta = array();
	while($req = $pstmt->fetch(PDO::FETCH_ASSOC)){
		$listaEtiqueta[] = $req;
	}

	echo json_encode($listaEtiqueta);
}

function guardaHistorialP(){

	$request = \Slim\Slim::getInstance()->request(); //json parameters
    $data = json_decode($request->getBody());
    $IDPUBLICACION=$data->{"IDPUBLICACION"};
    $IDUSUARIO=$data->{"IDUSUARIO"};

    $con=getConnection();
    $pstmt = $con->prepare("SELECT H.NUMVECES, H.IDHISTORIALBUSQUEDA FROM HISTORIALBUSQUEDA H WHERE H.IDPUBLICACION=$IDPUBLICACION AND H.IDUSUARIO=$IDUSUARIO");
	$pstmt->execute(array());
	$NUMVECES = $pstmt->fetch(PDO::FETCH_ASSOC)["NUMVECES"];
    $IDHISTORIALBUSQUEDA = $pstmt->fetch(PDO::FETCH_ASSOC)["IDHISTORIALBUSQUEDA"];

    if($NUMVECES==0){
    	//INSERTO
    	$NUMVECES=$NUMVECES+1;
    	$pstmt = $con->prepare("INSERT INTO HISTORIALBUSQUEDA(IDPUBLICACION,NUMVECES,IDUSUARIO) VALUES  (?,?,?) ");
		$pstmt->execute(array($IDPUBLICACION,$NUMVECES,$IDUSUARIO));
    }
    else{
    	$NUMVECES=$NUMVECES+1;
    	$pstmt = $con->prepare("UPDATE HISTORIALBUSQUEDA H SET H.NUMVECES=? WHERE H.IDUSUARIO=? AND H.IDPUBLICACION=?");
		$pstmt->execute(array($NUMVECES,$IDUSUARIO,$IDPUBLICACION));
    }
}


function guardaHistorialH(){

	$request = \Slim\Slim::getInstance()->request(); //json parameters
    $data = json_decode($request->getBody());
    $IDFICHA=$data->{"IDFICHA"};
    $IDUSUARIO=$data->{"IDUSUARIO"};

    $con=getConnection();
    $pstmt = $con->prepare("SELECT H.NUMVECES, H.IDHISTORIALBUSQUEDA FROM HISTORIALBUSQUEDA H WHERE H.IDFICHABIB=$IDFICHA AND H.IDUSUARIO=$IDUSUARIO");
	$pstmt->execute();
	$NUMVECES = $pstmt->fetch(PDO::FETCH_ASSOC)["NUMVECES"];
    $IDHISTORIALBUSQUEDA = $pstmt->fetch(PDO::FETCH_ASSOC)["IDHISTORIALBUSQUEDA"];

    if($NUMVECES==0){
    	//INSERTO
    	$NUMVECES=$NUMVECES+1;
    	$pstmt = $con->prepare("INSERT INTO HISTORIALBUSQUEDA(IDFICHABIB,NUMVECES,IDUSUARIO) VALUES  (?,?,?) ");
		$pstmt->execute(array($IDFICHA,$NUMVECES,$IDUSUARIO));
    }
    else{
    	$NUMVECES=$NUMVECES+1;
    	$pstmt = $con->prepare("UPDATE HISTORIALBUSQUEDA H SET H.NUMVECES=? WHERE H.IDUSUARIO=? AND H.IDFICHABIB=?");
		$pstmt->execute(array($NUMVECES,$IDUSUARIO,$IDFICHA));
    }
}



function damePermisoB($id){

	$con=getConnection();
	$pstmt = $con->prepare("SELECT U.IDPERMISO FROM USUARIO U WHERE U.IDUSUARIO=$id");
	$pstmt->execute();
	$permiso = $pstmt->fetch(PDO::FETCH_ASSOC)["IDPERMISO"];
	return $permiso;
}	

function damePublicacionesQueVeo($listaP,$idd){

	$lista=array();
	//print_r($listaP);
	//print_r($id);
	$con=getConnection();
	$PERMISO=damePermisoB($idd);
	if($PERMISO==1){
		return $listaP;
	}
	else{
		$pstmt = $con->prepare("SELECT DISTINCT(GU.IDPUBLICACION) FROM GRUXPUBXUSU GU WHERE GU.IDUSUARIO=? AND GU.ESTADO=1");
		$pstmt->execute(array($idd));
		while($req = $pstmt->fetch(PDO::FETCH_ASSOC)){
			$idP = $req["IDPUBLICACION"];
			
			//print_r($idP);
			for($i=0;$i<count($listaP);$i++){
				//print_r("El id pasado es=")
				//print_r($listaP[$i]["id"]);
				if($listaP[$i]["id"]==$idP){
					array_push($lista, $listaP[$i]/*["id"]*/);
				}
			}
		}
	}
	//print_r($lista);
	return $lista;
}

function dameFichasQueVeo($listaP,$id){

	$lista=array();
	
	$con=getConnection();
	$PERMISO=damePermisoB($id);
	if($PERMISO==1){
		return $listaP;
	}
	else{
		$pstmt = $con->prepare("SELECT DISTINCT(GU.IDFICHABIB) FROM GRUXFIXUSU GU WHERE GU.IDUSUARIO=? AND GU.ESTADO=1");
		$pstmt->execute(array($id));
		while($req = $pstmt->fetch(PDO::FETCH_ASSOC)){
			$idP = $req["IDFICHABIB"];

			for($i=0;$i<count($listaP);$i++){
				if($listaP[$i]["id"]==$idP){
					array_push($lista, $listaP[$i]/*["id"]*/);
				}
			}
		}
	}
	return $lista;
}


function insertaItem($valor,$publicacion,$listaO){

	$listaNueva=array();
	$entro=false;
	//echo count($listaO);

	for($i=0;$i<count($listaO);$i++){
		//echo $listaO[$i]["valor"];
		if(($listaO[$i]["valor"]>$valor) && ($entro==false)){
			array_push($listaNueva,$listaO[$i]);
		}
		elseif(($listaO[$i]["valor"]<=$valor) && ($entro==false)){
			//echo "entre aca !";
			array_push($listaNueva,$listaO[$i]);
			$entro=true;
			$item=array();
			$item["valor"]=$valor;
			$item["id"]=$publicacion["id"];
			array_push($listaNueva, $item);
		}
		elseif ($entro==true) {
			array_push($listaNueva, $listaO[$i]);
		}
		//echo json_encode($listaNueva);
	}

	if($entro==false){
		//echo "entre";
		$item=array();
		$item["valor"]=$valor;
		$item["id"]=$publicacion["id"];
		array_push($listaNueva, $item);
	}

	//echo "LISTA";
	//echo json_encode($listaNueva);
	return $listaNueva;	
}

function ordenaListaPublicaciones($listaPublicaciones){

	//SACO LAS PUBLICACIONES

	$listaOrdenada=array();

	//print_r("entreeeeee aqui !!!");
	//print_r($listaPublicaciones);

	for($i=0;$i<count($listaPublicaciones);$i++){
		$con=getConnection();
		//print_r($listaPublicaciones[$i]["id"]);

		$pstmt = $con->prepare("SELECT AVG(H.NUMVECES) as NVECES FROM HISTORIALBUSQUEDA H WHERE H.IDPUBLICACION=?");
		$pstmt->execute(array($listaPublicaciones[$i]["id"]));
	    
		$NVECES = $pstmt->fetch(PDO::FETCH_ASSOC)["NVECES"];

		$valor=$listaPublicaciones[$i]["cant"]*10+$NVECES*8;
		//echo $valor;

		$listaOrdenada=insertaItem($valor,$listaPublicaciones[$i],$listaOrdenada);
	}
	return $listaOrdenada;
}

function ordenaListaFicha($listaFichas){

	$listaOrdenada=array();

	for($i=0;$i<count($listaFichas);$i++){
		$con=getConnection();
		//echo $listaPublicaciones[$i]["id"];

		$pstmt = $con->prepare("SELECT AVG(H.NUMVECES) as NVECES FROM HISTORIALBUSQUEDA H WHERE H.IDFICHABIB=?");
		$pstmt->execute(array($listaFichas[$i]["id"]));
	    
		$NVECES = $pstmt->fetch(PDO::FETCH_ASSOC)["NVECES"];

		$valor=$listaFichas[$i]["cant"]*10+$NVECES*8;

		$listaOrdenada=insertaItem($valor,$listaFichas[$i],$listaOrdenada);
	}
	return $listaOrdenada;
}

function busquedaBasica(){

	$request = \Slim\Slim::getInstance()->request(); //json parameters
    $data = json_decode($request->getBody());
    $CRITERIO=$data->{"criterio"};
    $IDUSUARIO=$data->{"IDUSUARIO"};
    $RESULTADO;

    $con=getConnection();

    //PUBLICACIONES

    $listaPublicacionesConCoindicencia = array();
	$words = explode(' ', $CRITERIO);
	//echo 'The sentence has ' . count($words) . ' words.<br />'; 
	for ($i = 0; $i < count($words); $i++)
	{
		//echo $words[$i];

	    $pstmt = $con->prepare(" SELECT PE.IDPUBLICACION FROM PUBLICACIONXETIQUETAS PE WHERE PE.IDETIQUETA IN (SELECT EE.IDETIQUETA FROM ETIQUETA EE WHERE EE.ESTADO!=0 AND EE.IDETIQUETARELACIONADA IN
	    						 (SELECT DISTINCT(E.IDETIQUETARELACIONADA) FROM ETIQUETA E WHERE /*E.ESTADO!=0*/ E.ESTADO=2 AND E.NOMBRE=?/* LIKE CONCAT('%',?,'%')*/))");

		$pstmt->execute(array($words[$i]));
	    //lleno el array donde van a estar:   IDPUBLICACION - NUMCOINCIDENCIA

		while($req = $pstmt->fetch(PDO::FETCH_ASSOC)){
			$idPublicacion = $req["IDPUBLICACION"];
			//echo $idPublicacion;

			$cant=count($listaPublicacionesConCoindicencia);
			$esta=false;
			for($j=0;$j<$cant;$j++){
				if($listaPublicacionesConCoindicencia[$j]["id"]==$idPublicacion){
					$num=$listaPublicacionesConCoindicencia[$j]["cant"]+1;
					$listaPublicacionesConCoindicencia[$j]["cant"]=$num;
					$esta=true;
					break;
				}
			}
			if($esta==false){
				//entonces solo inserto uno
				$listaPublicacionesConCoindicencia[$cant]=array();
				$listaPublicacionesConCoindicencia[$cant]["id"]=$idPublicacion;
				$listaPublicacionesConCoindicencia[$cant]["cant"]=1;
			}

		}

	}

	$listaPubliFinal=damePublicacionesQueVeo($listaPublicacionesConCoindicencia,$IDUSUARIO);
	//echo json_encode($listaPubliFinal);

	$final=ordenaListaPublicaciones($listaPubliFinal);

	//echo json_encode($final);
	$listaPublicacionesOrdenadas=array();	

	$cant=0;
	for($k=0;$k<count($final);$k++){
		$con=getConnection();
		//ECHO $final[$k]["id"];
		$pstmt = $con->prepare("SELECT P.IDPUBLICACION,P.TITULO,P.FUENTE,T.DESCRIPCION,I.NOMBRE FROM PUBLICACION P, TIPOPUBLICACION T, IDIOMA I WHERE P.IDPUBLICACION=? AND 
								P.ESTADO=1 AND T.IDTIPOPUBLICACION=P.IDTIPOPUBLICACION AND I.IDIDIOMA=P.IDIDIOMA");
		$pstmt->execute(array($final[$k]["id"]));

		while($req = $pstmt->fetch(PDO::FETCH_ASSOC)){	
			$publicacion=array();
			$publicacion[$cant]["IDPUBLICACION"]=$req["IDPUBLICACION"];
			$publicacion[$cant]["TITULO"]=$req["TITULO"];
			$publicacion[$cant]["FUENTE"]=$req["FUENTE"];	
			$publicacion[$cant]["DESCRIPCION"]=$req["DESCRIPCION"];	
			$publicacion[$cant]["IDIOMA"]=$req["NOMBRE"];
			array_push($listaPublicacionesOrdenadas, $publicacion);
			$cant=$cant+1;
		}
	}

	//----------------------------------------------------------------------------------------------------------------------------------------------

	//FICHAS BIBLIOGRAFICAS

	$listaFichasConCoindicencia = array();
	$words = explode(' ', $CRITERIO);
	//echo 'The sentence has ' . count($words) . ' words.<br />'; 
	for ($i = 0; $i < count($words); $i++)
	{
		//echo $words[$i];

	    $pstmt = $con->prepare(" SELECT PE.IDFICHABIB FROM FICHAXETIQUETA PE WHERE PE.IDETIQUETA IN (SELECT EE.IDETIQUETA FROM ETIQUETA EE WHERE EE.ESTADO!=0 AND EE.IDETIQUETARELACIONADA IN
	    						 (SELECT DISTINCT(E.IDETIQUETARELACIONADA) FROM ETIQUETA E WHERE /*E.ESTADO!=0*/ E.ESTADO=2 AND E.NOMBRE=?/* LIKE CONCAT('%',?,'%')*/))");
		$pstmt->execute(array($words[$i]));
	    //lleno el array donde van a estar:   IDFICHABIB - NUMCOINCIDENCIA

		while($req = $pstmt->fetch(PDO::FETCH_ASSOC)){
			$idFicha = $req["IDFICHABIB"];
			//echo $idPublicacion;

			$cant=count($listaFichasConCoindicencia);
			$esta=false;
			for($j=0;$j<$cant;$j++){
				if($listaFichasConCoindicencia[$j]["id"]==$idFicha){
					$num=$listaFichasConCoindicencia[$j]["cant"]+1;
					$listaFichasConCoindicencia[$j]["cant"]=$num;
					$esta=true;
					break;
				}
			}
			if($esta==false){
				//entonces solo inserto uno
				$listaFichasConCoindicencia[$cant]=array();
				$listaFichasConCoindicencia[$cant]["id"]=$idFicha;
				$listaFichasConCoindicencia[$cant]["cant"]=1;
			}

		}

	}

	$listaFichaFinal=dameFichasQueVeo($listaFichasConCoindicencia,$IDUSUARIO);

	$final=ordenaListaFicha($listaFichaFinal);

	//echo json_encode($final);
	$listaFichasOrdenadas2=array();	

	$cantp=0;
	for($k=0;$k<count($final);$k++){
		$con=getConnection();
		//ECHO $final[$k]["id"];
		$pstmt = $con->prepare("SELECT P.IDFICHABIB,P.ENCABEZADO,P.TITULO_ABREVIADO,T.NOMBRE FROM FICHABIB P, TIPOFICHA T  WHERE P.IDFICHABIB=? AND 
								P.ESTADO=1 AND T.IDTIPOFICHA=P.IDTIPOFICHA ");
		$pstmt->execute(array($final[$k]["id"]));

		while($req = $pstmt->fetch(PDO::FETCH_ASSOC)){	
			$publicacion=array();
			$publicacion[$cantp]["IDFICHABIB"]=$req["IDFICHABIB"];
			$publicacion[$cantp]["ENCABEZADO"]=$req["ENCABEZADO"];
			$publicacion[$cantp]["TITULO_ABREVIADO"]=$req["TITULO_ABREVIADO"];	
			$publicacion[$cantp]["NOMBRE"]=$req["NOMBRE"];
			array_push($listaFichasOrdenadas2, $publicacion);
			$cantp=$cantp+1;
		}
	}


	$RESULTADO=[
			'CANTIDADP'=>count($listaPublicacionesOrdenadas),
			'PUBLICACIONES'=>$listaPublicacionesOrdenadas,
			'CANTIDADF'=>count($listaFichasOrdenadas2),
			'FICHAS'=>$listaFichasOrdenadas2
		];

	echo json_encode($RESULTADO);

}


//BUQUEDA ASISTIDA ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function busquedaAsistida(){
	$request = \Slim\Slim::getInstance()->request(); //json parameters
    $data = json_decode($request->getBody(),true);
    //$CRITERIO=$data->{"criterio"};
    $IDUSUARIO=$data["IDUSUARIO"];
    //echo $IDUSUARIO;
    $RESULTADO;
	//Object {0: Array[1], IDUSUARIO: "1"}
	//$words=array();
    //$words=$data[0][0];
    $con=getConnection();

    //PUBLICACIONES

    $listaPublicacionesConCoindicencia = array();
	//$words = explode(' ', $CRITERIO);
	//echo 'The sentence has ' . count($words) . ' words.<br />'; 
	//for ($i = 0; $i < count($words); $i++)
	for ($i = 0; $i < count($data[0]); $i++)	
	{	
		$pstmt = $con->prepare("SELECT E.NOMBRE FROM ETIQUETA E WHERE E.IDETIQUETA=?");
		//$pstmt->execute(array($words[$i]));
		$pstmt->execute(array($data[0][$i]));
		$nombreEtiqueta=$req = $pstmt->fetch(PDO::FETCH_ASSOC)["NOMBRE"];
		//echo $words[$i];

	    $pstmt = $con->prepare(" SELECT PE.IDPUBLICACION FROM PUBLICACIONXETIQUETAS PE WHERE PE.IDETIQUETA IN (SELECT EE.IDETIQUETA FROM ETIQUETA EE WHERE EE.ESTADO!=0 AND EE.IDETIQUETARELACIONADA IN
	    						 (SELECT DISTINCT(E.IDETIQUETARELACIONADA) FROM ETIQUETA E WHERE /*E.ESTADO!=0*/ E.ESTADO=1 AND E.NOMBRE=?/* LIKE CONCAT('%',?,'%')*/))");

		$pstmt->execute(array($nombreEtiqueta));
	    //lleno el array donde van a estar:   IDPUBLICACION - NUMCOINCIDENCIA

		while($req = $pstmt->fetch(PDO::FETCH_ASSOC)){
			$idPublicacion = $req["IDPUBLICACION"];
			//echo $idPublicacion;

			$cant=count($listaPublicacionesConCoindicencia);
			$esta=false;
			for($j=0;$j<$cant;$j++){
				if($listaPublicacionesConCoindicencia[$j]["id"]==$idPublicacion){
					$num=$listaPublicacionesConCoindicencia[$j]["cant"]+1;
					$listaPublicacionesConCoindicencia[$j]["cant"]=$num;
					$esta=true;
					break;
				}
			}
			if($esta==false){
				//entonces solo inserto uno
				$listaPublicacionesConCoindicencia[$cant]=array();
				$listaPublicacionesConCoindicencia[$cant]["id"]=$idPublicacion;
				$listaPublicacionesConCoindicencia[$cant]["cant"]=1;
			}

		}

	}

	$listaPubliFinal=damePublicacionesQueVeo($listaPublicacionesConCoindicencia,$IDUSUARIO);
	//echo json_encode($listaPubliFinal);

	$final=ordenaListaPublicaciones($listaPubliFinal);

	//echo json_encode($final);
	$listaPublicacionesOrdenadas=array();	

	$cantp=0;
	for($k=0;$k<count($final);$k++){
		$con=getConnection();
		//ECHO $final[$k]["id"];
		$pstmt = $con->prepare("SELECT P.IDPUBLICACION,P.TITULO,P.FUENTE,T.DESCRIPCION,I.NOMBRE FROM PUBLICACION P, TIPOPUBLICACION T, IDIOMA I WHERE P.IDPUBLICACION=? AND 
								P.ESTADO=1 AND T.IDTIPOPUBLICACION=P.IDTIPOPUBLICACION AND I.IDIDIOMA=P.IDIDIOMA");
		$pstmt->execute(array($final[$k]["id"]));

		while($req = $pstmt->fetch(PDO::FETCH_ASSOC)){	
			$publicacion=array();
			$publicacion[$cantp]["IDPUBLICACION"]=$req["IDPUBLICACION"];
			$publicacion[$cantp]["TITULO"]=$req["TITULO"];
			$publicacion[$cantp]["FUENTE"]=$req["FUENTE"];	
			$publicacion[$cantp]["DESCRIPCION"]=$req["DESCRIPCION"];	
			$publicacion[$cantp]["IDIOMA"]=$req["NOMBRE"];
			array_push($listaPublicacionesOrdenadas, $publicacion);
			$cantp=$cantp+1;
		}
	}

	//----------------------------------------------------------------------------------------------------------------------------------------------

	//FICHAS BIBLIOGRAFICAS

	$listaFichasConCoindicencia = array();
	//$words = explode(' ', $CRITERIO);
	//echo 'The sentence has ' . count($words) . ' words.<br />'; 
	for ($i = 0; $i < count($data[0]); $i++)
	{
		$pstmt = $con->prepare("SELECT E.NOMBRE FROM ETIQUETA E WHERE E.IDETIQUETA=?");
		//$pstmt->execute(array($words[$i]));
		$pstmt->execute(array($data[0][$i]));
		$nombreEtiqueta=$req = $pstmt->fetch(PDO::FETCH_ASSOC)["NOMBRE"];
		//echo $words[$i];

	    $pstmt = $con->prepare(" SELECT PE.IDFICHABIB FROM FICHAXETIQUETA PE WHERE PE.IDETIQUETA IN (SELECT EE.IDETIQUETA FROM ETIQUETA EE WHERE EE.ESTADO!=0 AND EE.IDETIQUETARELACIONADA IN
	    						 (SELECT DISTINCT(E.IDETIQUETARELACIONADA) FROM ETIQUETA E WHERE /*E.ESTADO!=0*/ E.ESTADO=1 AND E.NOMBRE=?/* LIKE CONCAT('%',?,'%')*/))");
		$pstmt->execute(array($nombreEtiqueta));
	    //lleno el array donde van a estar:   IDFICHABIB - NUMCOINCIDENCIA

		while($req = $pstmt->fetch(PDO::FETCH_ASSOC)){
			$idFicha = $req["IDFICHABIB"];
			//echo $idPublicacion;

			$cant=count($listaFichasConCoindicencia);
			$esta=false;
			for($j=0;$j<$cant;$j++){
				if($listaFichasConCoindicencia[$j]["id"]==$idFicha){
					$num=$listaFichasConCoindicencia[$j]["cant"]+1;
					$listaFichasConCoindicencia[$j]["cant"]=$num;
					$esta=true;
					break;
				}
			}
			if($esta==false){
				//entonces solo inserto uno
				$listaFichasConCoindicencia[$cant]=array();
				$listaFichasConCoindicencia[$cant]["id"]=$idFicha;
				$listaFichasConCoindicencia[$cant]["cant"]=1;
			}

		}

	}

	$listaFichaFinal=dameFichasQueVeo($listaFichasConCoindicencia,$IDUSUARIO);

	$final=ordenaListaFicha($listaFichaFinal);

	//echo json_encode($final);
	$listaFichasOrdenadas2=array();	

	for($k=0;$k<count($final);$k++){
		$con=getConnection();
		//ECHO $final[$k]["id"];
		$pstmt = $con->prepare("SELECT P.IDFICHABIB,P.ENCABEZADO,P.TITULO_ABREVIADO,T.NOMBRE FROM FICHABIB P, TIPOFICHA T  WHERE P.IDFICHABIB=? AND 
								P.ESTADO=1 AND T.IDTIPOFICHA=P.IDTIPOFICHA ");
		$pstmt->execute(array($final[$k]["id"]));

		while($req = $pstmt->fetch(PDO::FETCH_ASSOC)){	
			$publicacion=array();
			$publicacion[$k]["IDFICHABIB"]=$req["IDFICHABIB"];
			$publicacion[$k]["ENCABEZADO"]=$req["ENCABEZADO"];
			$publicacion[$k]["TITULO_ABREVIADO"]=$req["TITULO_ABREVIADO"];	
			$publicacion[$k]["NOMBRE"]=$req["NOMBRE"];
			array_push($listaFichasOrdenadas2, $publicacion);
		}
	}


	$RESULTADO=[
			'CANTIDADP'=>count($listaPublicacionesOrdenadas),
			'PUBLICACIONES'=>$listaPublicacionesOrdenadas,
			'CANTIDADF'=>count($listaFichasOrdenadas2),
			'FICHAS'=>$listaFichasOrdenadas2
	];

	echo json_encode($RESULTADO);
}


//BUSQUEDA AVANZADA/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function busquedaAvanzada(){
	
	$request = \Slim\Slim::getInstance()->request(); //json parameters
    $data = json_decode($request->getBody(),true);
    $con=getConnection();
    $TIPOBUSQUEDA=$data["TIPOBUSQUEDA"];
	$IDUSUARIO=$data["IDUSUARIO"];
	$ARREGLO=$data["BUSQUEDA"];
	$listaPublicacionesOrdenadas=array();
	$listaFichasOrdenadas=array();
	//LAS TABLAS PUBLICACION P, AUTOR A, PUBLICACIONXAUTOR PA , TIPOPUBLICACION T 


	
	$QUERYMEDIO="WHERE ";
	$QUERFIN=" AND P.ESTADO=1 ";
	

		if($TIPOBUSQUEDA==1){ //BUSCO PUBLICACIONES
			$QUERYPRINCIPIO="SELECT distinct(P.IDPUBLICACION) as id FROM PUBLICACION P ";
			$entroAutor=false;
			$entroTipo=false;
			$QUERYTOTALP=" ";

			for($i=0;$i<count($ARREGLO);$i++){

				$palabra=$ARREGLO[$i]["campo"];
				$atributo=$ARREGLO[$i]["columna"];

			// ARMO LA CONDICION
				if($i==0){
					$condicion="";
				}
				else {
					if($ARREGLO[$i]["cond"]=="NOT"){
						$condicion=" AND ".$ARREGLO[$i]["cond"];
					}
					else{
						$condicion=$ARREGLO[$i]["cond"];
					}
				}
				$QUERYMEDIO=$QUERYMEDIO." ".$condicion." ";

			//ARMO EL PRINCIPIO
				if(($atributo==="Autor") && ($entroAutor==false)){
					$QUERYPRINCIPIO=$QUERYPRINCIPIO." ".", PUBLICACIONXAUTOR PA, AUTOR A ";
					$QUERFIN=$QUERFIN." "."AND PA.IDPUBLICACION=P.IDPUBLICACION AND A.IDAUTOR=PA.IDAUTOR ";
					$entroAutor=true;
				}
				if(($atributo==="Tipo de Publicacion") && ($entroTipo==false)){
					$QUERYPRINCIPIO=$QUERYPRINCIPIO." ".", TIPOPUBLICACION T ";
					$QUERFIN=$QUERFIN." "."AND T.IDTIPOPUBLICACION=P.IDTIPOPUBLICACION ";
					$entroTipo=true;
				}

			//ARMO EL WHERE
				if($atributo==="Titulo"){$QUERYMEDIO=$QUERYMEDIO." "."P.titulo like '%".$palabra."%' ";}
				elseif ($atributo==="Fuente"){$QUERYMEDIO=$QUERYMEDIO." "."P.fuente like'%".$palabra."%' ";}
				elseif ($atributo==="Obtenido de"){$QUERYMEDIO=$QUERYMEDIO." "."P.obtenido like '%".$palabra."%' ";}
				elseif ($atributo==="Volumen") {$QUERYMEDIO=$QUERYMEDIO." "."P.volumen=".$palabra." ";}
				elseif ($atributo==="DOI") {$QUERYMEDIO=$QUERYMEDIO." "."P.doi like '%".$palabra."%' ";}
				elseif ($atributo==="ISSN") {$QUERYMEDIO=$QUERYMEDIO." "."P.issn like'%".$palabra."%' ";}	
				elseif ($atributo==="Autor") {$QUERYMEDIO=$QUERYMEDIO." "."A.nom_ape like '%".$palabra."%' ";}
				elseif ($atributo==="Tipo de Publicacion"){ $QUERYMEDIO=$QUERYMEDIO." "."T.nombre like '%".$palabra."%' ";}	
			}

			$QUERYTOTAL=$QUERYPRINCIPIO." ".$QUERYMEDIO." ".$QUERFIN;	
			//print_r($QUERYTOTAL);
			$pstmt = $con->prepare($QUERYTOTAL);
			$pstmt->execute(array());

			$listaIDPublicacionesPrimero=array();
			$listaPublicacionesConCoindicencia=array();
			$a=0;
			while($req = $pstmt->fetch(PDO::FETCH_ASSOC)){
				$idPublicacion=$req["id"];
				$listaPublicacionesConCoindicencia[$a]=array();
				$listaPublicacionesConCoindicencia[$a]["id"]=$idPublicacion;
				$listaPublicacionesConCoindicencia[$a]["cant"]=1;
				//array_push($listaIDPublicacionesPrimero,$listaPublicacionesConCoindicencia);
				$a=$a+1;
			}		
			//print_r($listaPublicacionesConCoindicencia);
			$listaPublicacionesAcceso=array();
			$listaPublicacionesAcceso=damePublicacionesQueVeo($listaPublicacionesConCoindicencia,$IDUSUARIO);
			//print_r($listaPublicacionesAcceso);
			//echo json_encode($listaPubliFinal);

			$final=ordenaListaPublicaciones($listaPublicacionesAcceso);
			//print_r($listaPublicacionesAcceso);
			//print_r($final);
			//$listaPublicacionesOrdenadas=array();	
			$cantp=0;
			for($k=0;$k<count($final);$k++){
				$con=getConnection();
				//ECHO $final[$k]["id"];
				$pstmt = $con->prepare("SELECT P.IDPUBLICACION,P.TITULO,P.FUENTE,T.DESCRIPCION,I.NOMBRE FROM PUBLICACION P, TIPOPUBLICACION T, IDIOMA I WHERE P.IDPUBLICACION=? AND 
										P.ESTADO=1 AND T.IDTIPOPUBLICACION=P.IDTIPOPUBLICACION AND I.IDIDIOMA=P.IDIDIOMA");
				$pstmt->execute(array($final[$k]["id"]));

				while($req = $pstmt->fetch(PDO::FETCH_ASSOC)){	
					$publicacion=array();
					$publicacion[$cantp]["IDPUBLICACION"]=$req["IDPUBLICACION"];
					$publicacion[$cantp]["TITULO"]=$req["TITULO"];
					$publicacion[$cantp]["FUENTE"]=$req["FUENTE"];	
					$publicacion[$cantp]["DESCRIPCION"]=$req["DESCRIPCION"];	
					$publicacion[$cantp]["IDIOMA"]=$req["NOMBRE"];
					array_push($listaPublicacionesOrdenadas, $publicacion);
					$cantp=$cantp+1;
				}
			}
		}
		else{

			$QUERYPRINCIPIO="SELECT distinct(F.IDFICHABIB) as id FROM FICHABIB F ";
			$entroAutor=false;
			$entroTipo=false;
			$QUERYTOTALP=" ";

			for($i=0;$i<count($ARREGLO);$i++){

				$palabra=$ARREGLO[$i]["campo"];
				$atributo=$ARREGLO[$i]["columna"];

			// ARMO LA CONDICION
				if($i==0){
					$condicion="";
				}
				else {
					if($ARREGLO[$i]["cond"]=="NOT"){
						$condicion=" AND ".$ARREGLO[$i]["cond"];
					}
					else{
						$condicion=$ARREGLO[$i]["cond"];
					}
				}
				$QUERYMEDIO=$QUERYMEDIO." ".$condicion." ";

			//ARMO EL PRINCIPIO
				
				if(($atributo==="Tipo de Ficha") && ($entroTipo==false)){
					$QUERYPRINCIPIO=$QUERYPRINCIPIO." ".", TIPOFICHA T ";
					$QUERFIN=$QUERFIN." "."AND T.IDFICHABIB=T.IDFICHABIB ";
					$entroTipo=true;
				}

			//ARMO EL WHERE
				if($atributo==="Nombre de Ficha"){$QUERYMEDIO=$QUERYMEDIO." "."F.encabezado like '%".$palabra."%' ";}
				elseif ($atributo==="Tipo de Ficha"){ $QUERYMEDIO=$QUERYMEDIO." "."T.nombre like '%".$palabra."%' ";}	
				elseif ($atributo==="Contenido"){$QUERYMEDIO=$QUERYMEDIO." "."F.Contenido like'%".$palabra."%' ";}					
			}

			$QUERYTOTAL=$QUERYPRINCIPIO." ".$QUERYMEDIO." ".$QUERFIN;	
			$pstmt = $con->prepare($QUERYTOTAL);
			$pstmt->execute(array());

			//$listaIDPublicacionesPrimero=array();
			$listaFichasConCoindicencia=array();
			$a=0;
			while($req = $pstmt->fetch(PDO::FETCH_ASSOC)){
				$idPublicacion=$req["id"];
				$listaFichasConCoindicencia[$a]=array();
				$listaFichasConCoindicencia[$a]["id"]=$idPublicacion;
				$listaFichasConCoindicencia[$a]["cant"]=1;
				$a=$a+1;
			}		
			$listaFichasAcceso=array();
			$listaFichasAcceso=dameFichasQueVeo($listaFichasConCoindicencia,$IDUSUARIO);

			//echo json_encode($listaPubliFinal);

			$final=ordenaListaFicha($listaFichasAcceso);
			//print_r($final);
			//$listaFichasOrdenadas=array();	

			$cantp=0;
			for($k=0;$k<count($final);$k++){
				$con=getConnection();
				//ECHO $final[$k]["id"];
				$pstmt = $con->prepare("SELECT P.IDFICHABIB,P.ENCABEZADO,P.TITULO_ABREVIADO,T.NOMBRE FROM FICHABIB P, TIPOFICHA T  WHERE P.IDFICHABIB=? AND 
										P.ESTADO=1 AND T.IDTIPOFICHA=P.IDTIPOFICHA ");
				$pstmt->execute(array($final[$k]["id"]));

				while($req = $pstmt->fetch(PDO::FETCH_ASSOC)){	
					$publicacion=array();
					$publicacion[$cantp]["IDFICHABIB"]=$req["IDFICHABIB"];
					$publicacion[$cantp]["ENCABEZADO"]=$req["ENCABEZADO"];
					$publicacion[$cantp]["TITULO_ABREVIADO"]=$req["TITULO_ABREVIADO"];	
					$publicacion[$cantp]["NOMBRE"]=$req["NOMBRE"];
					array_push($listaFichasOrdenadas, $publicacion);
					$cantp=$cantp+1;
				}
			}
		}

		$RESULTADO=[
			'CANTIDADP'=>count($listaPublicacionesOrdenadas),
			'PUBLICACIONES'=>$listaPublicacionesOrdenadas,
			'CANTIDADF'=>count($listaFichasOrdenadas),
			'FICHAS'=>$listaFichasOrdenadas
		];

		echo json_encode($RESULTADO);

}	





function busquedaGuardar(){

	$request = \Slim\Slim::getInstance()->request(); //json parameters
    $data = json_decode($request->getBody(),true);
    $con=getConnection();
    $IDUSUARIO=$data["IDUSUARIO"];
	$NOMBRES=$data["NOMBRES"];
	$FECHA=$today = date("Y-m-d");


	//INSERTO LA BUSQUEDA
	$pstmt = $con->prepare("INSERT INTO BUSQUEDA(nombre,fecha_hora,estado,idusuario) VALUES (?,?,1,?)");
	$pstmt->execute(array($NOMBRES,$FECHA,$IDUSUARIO));
	$lastInsertId = $con->lastInsertId();//ESTE ES EL ID DEL  QUE SE CREO


	for ($i = 0; $i < count($data[0]); $i++)	
	{	
		$pstmt = $con->prepare("INSERT INTO BUSQUEDAXETIQUETA(IDBUSQUEDA,IDETIQUETA) VALUE (?,?)");
		$pstmt->execute(array($lastInsertId,$data[0][$i]));
	}

	echo json_encode($lastInsertId);

}


function dameMisBusquedas(){

	$request = \Slim\Slim::getInstance()->request(); //json parameters
    $data = json_decode($request->getBody(),true);
    $con=getConnection();
    $IDUSUARIO=$data["IDUSUARIO"];
    
    $pstmt = $con->prepare("SELECT B.IDBUSQUEDA, B.NOMBRE, DATE_FORMAT(b.fecha_hora,'%e-%m-%y')/* DATE(b.fecha_hora)*/FROM BUSQUEDA B where b.idusuario=? and b.estado=1");
	$pstmt->execute(array($IDUSUARIO));

	$listaBusqueda = array();
		while($req = $pstmt->fetch(PDO::FETCH_ASSOC)){
			$listaBusqueda[] = $req;
		}
	echo json_encode($listaBusqueda);	

}



function eliminaMiBusqueda($id){

	$request = \Slim\Slim::getInstance()->request(); //json parameters
    //$data = json_decode($request->getBody());
    //$IDBUSQUEDA=$data->{"IDBUSQUEDA"};

    $con=getConnection();

	$pstmt = $con->prepare("DELETE FROM BUSQUEDAXETIQUETA WHERE IDBUSQUEDA=?");
	$pstmt->execute(array($id));

	$pstmt = $con->prepare("UPDATE BUSQUEDA B SET B.ESTADO=0 WHERE B.IDBUSQUEDA=?");
	$pstmt->execute(array($id));
	
	echo json_encode(array("status"=>1));

}


function dameEtiquetasBQ(){

	$request = \Slim\Slim::getInstance()->request(); //json parameters
    $data = json_decode($request->getBody());
    $IDBUSQUEDA=$data->{"IDBUSQUEDA"};
    $con=getConnection();


    $pstmt = $con->prepare("SELECT B.IDETIQUETA FROM BUSQUEDAXETIQUETA B WHERE B.IDBUSQUEDA=?");
	$pstmt->execute(array($IDBUSQUEDA));

	$resp = array();
	while($req = $pstmt->fetch(PDO::FETCH_ASSOC)){
		$gr=[
			'IDETIQUETA'=>$req["IDETIQUETA"],
		];
		array_push($resp, $gr);
	}


	$etiquetas=[
		'IDETIQUETA'=>$resp
	];

	echo json_encode($etiquetas);
}

?>