<?php
   // header("Content-type: text/html; charset=utf8");
	include('routesBusqueda.php');
	include_once '../back/conexion.php';


function damePermisoB($id){

	$con=getConnection();
	$pstmt = $con->prepare("SELECT U.IDPERMISO FROM USUARIO U WHERE U.IDUSUARIO=$id");
	$pstmt->execute();
	$permiso = $pstmt->fetch(PDO::FETCH_ASSOC)["IDPERMISO"];
	return $permiso;
}	

function damePublicacionesQueVeo($listaP,$id){

	$lista=array();
	
	$con=getConnection();
	$PERMISO=damePermisoB($id);
	if($PERMISO==1){
		return $listaP;
	}
	else{
		$pstmt = $con->prepare("SELECT DISTINCT(GU.IDPUBLICACION) FROM GRUXPUBXUSU GU WHERE GU.IDUSUARIO=$id AND GU.ESTADO=1");
		$pstmt->execute(array());
		while($req = $pstmt->fetch(PDO::FETCH_ASSOC)){
			$idP = $pstmt->fetch(PDO::FETCH_ASSOC)["IDPUBLICACION"];

			for($i=0;$i<count($listaP);$i++){
				if($listaP[$i]["id"]==$idP){
					array_push($lista, $listaP["id"]);
				}
			}
		}
	}
	return $lista;
}

function insertaItem($valor,$publicacion,$listaO){

	$listaNueva=array();
	$entro=false;

	for($i=0;$i<count($listaO);$i++){
		if(($listaO[$i]["valor"]>$valor) && ($entro==false)){
			array_push($listaNueva,$listaO[$i]);
		}
		elseif(($listaO[$i]["valor"]<=$valor) && ($entro==false)){
			$entro=true;
			$item=array();
			$item["valor"]=$valor;
			$item["id"]=$publicacion["id"];
			array_push($listaNueva, $item);
		}
		elseif ($entro==true) {
			array_push($listaNueva, $listaO[$i]);
		}
	}

	if($entro==false){
		$item=array();
		$item["valor"]=$valor;
		$item["id"]=$publicacion["id"];
		array_push($listaNueva, $item);
	}

	return $listaNueva;	
}

function ordenaListaPublicaciones($listaPublicaciones){

	//SACO LAS PUBLICACIONES

	$listaOrdenada=array();

	for($i=0;$i<count($listaPublicaciones);$i++){
		$con=getConnection();
		//echo $listaPublicaciones[$i]["id"];

		$pstmt = $con->prepare("SELECT AVG(H.NUMVECES) as NVECES FROM HISTORIALBUSQUEDA H WHERE H.IDPUBLICACION=?");
		$pstmt->execute(array($listaPublicaciones[$i]["id"]));
	    
		$NVECES = $pstmt->fetch(PDO::FETCH_ASSOC)["NVECES"];

		$valor=$listaPublicaciones[$i]["cant"]*10+$NVECES*2;

		$listaOrdenada=insertaItem($valor,$listaPublicaciones[$i],$listaOrdenada);
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
	    						 (SELECT DISTINCT(E.IDETIQUETARELACIONADA) FROM ETIQUETA E WHERE E.ESTADO!=0 AND E.NOMBRE LIKE CONCAT('%',?,'%')))");

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

	$final=ordenaListaPublicaciones($listaPubliFinal);

	//echo json_encode($final);
	$listaPublicacionesOrdenadas=array();	

	for($k=0;$k<count($final);$k++){
		$con=getConnection();
		//ECHO $final[$k]["id"];
		$pstmt = $con->prepare("SELECT P.IDPUBLICACION,P.TITULO,P.FUENTE,T.DESCRIPCION,I.NOMBRE FROM PUBLICACION P, TIPOPUBLICACION T, IDIOMA I WHERE P.IDPUBLICACION=? AND 
								P.ESTADO=1 AND T.IDTIPOPUBLICACION=P.IDTIPOPUBLICACION AND I.IDIDIOMA=P.IDIDIOMA");
		$pstmt->execute(array($final[$k]["id"]));

		while($req = $pstmt->fetch(PDO::FETCH_ASSOC)){	
			$publicacion=array();
			$publicacion[$k]["IDPUBLICACION"]=$req["IDPUBLICACION"];
			$publicacion[$k]["TITULO"]=$req["TITULO"];
			$publicacion[$k]["FUENTE"]=$req["FUENTE"];	
			$publicacion[$k]["DESCRIPCION"]=$req["DESCRIPCION"];	
			$publicacion[$k]["IDIOMA"]=$req["NOMBRE"];
			array_push($listaPublicacionesOrdenadas, $publicacion);
		}
	}

	$RESULTADO=[
			'CANTIDADP'=>count($listaPublicacionesOrdenadas),
			'PUBLICACIONES'=>$listaPublicacionesOrdenadas
		];

	echo json_encode($RESULTADO);

}


?>