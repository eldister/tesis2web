
var idpermiso;
var idUsuario;
var idResonsable;

function cargaElementos(data){

	for(var i=0; i < data.length ; i++){
		var fila = '<tr id=fila-'+ data[i]["IDPUBLICACION"] +'>';
		fila +='<td style="display:none;">';
		fila += '<td class="text-center">'+data[i]["TITULO"]+'</td>';
		fila += '<td class="text-center">'+data[i]["FECHAREGISTRO"]+'</td>';
		fila += '<td class="text-center">'+data[i]["TIPO"]+'</td>';
		fila += '<td class="text-center">'+data[i]["IDIOMA"]+'</td>';
		fila+= '<td class="text-center"><a class="agregar-ficha table-link" href="../Publicacion_Documental/ViewCrearFicha.html?idpublicacion='+data[i]["IDPUBLICACION"]+'"><span class="fa-stack"><i class="fa fa-square fa-stack-2x"></i><i class="fa fa-file-o fa-stack-1x fa-inverse"></i></span></a></td>';
		fila+= '<td style="width: 23%;padding-left: 30px;">'
		//fila+= '<a class="table-link" href="ViewModificarIdioma.html?ididioma='+data[i]["IDIDIOMA"]+'""><span class="fa-stack"><i class="fa fa-square fa-stack-2x"></i><i class="fa fa-pencil fa-stack-1x fa-inverse"></i></span></a>';
		//fila+= '<a class="table-link danger" data-toggle="modal" href="#myModal?ididioma='+data[i]["IDIDIOMA"]+'""><span class="fa-stack"><i class="fa fa-square fa-stack-2x"></i><i class="fa fa-trash-o fa-stack-1x fa-inverse"></i></span></a>';
		//fila+= '<a class="table-link danger" data-toggle="modal" href="#myModal"><span class="fa-stack"><i class="fa fa-square fa-stack-2x"></i><i class="fa fa-trash-o fa-stack-1x fa-inverse"></i></span></a>';
		//fila+= '<a  class="eliminarRequisito" data-toggle="modal" ididioma='+data[i]["IDIDIOMA"]+'""><span class="fa-stack"><i class="fa fa-square fa-stack-2x"></i><i class="fa fa-trash-o fa-stack-1x fa-inverse"></i></span></a>';
		
		fila+= '<a class="ver-publicacion table-link" href="../Publicacion_Documental/ViewVerPublicacion.html?idpublicacion='+data[i]["IDPUBLICACION"]+'"><span class="fa-stack"><i class="fa fa-square fa-stack-2x"></i><i class="fa fa-search-plus fa-stack-1x fa-inverse"></i></span></a>';
		if((idpermiso==1)||(idUsuario==idResonsable)){
			fila+= '<a class="modificar-publicacion table-link" href="../Publicacion_Documental/ViewModificarPublicacion.html?idpublicacion='+data[i]["IDPUBLICACION"]+'"><span class="fa-stack"><i class="fa fa-square fa-stack-2x"></i><i class="fa fa-pencil fa-stack-1x fa-inverse"></i></span></a>';
			fila+= '<a class="eliminar-publicacion table-link danger"idpublicacion='+data[i]["IDPUBLICACION"]+'><span class="fa-stack"><i class="fa fa-square fa-stack-2x"></i><i class="fa fa-trash-o fa-stack-1x fa-inverse"></i></span></a>';
		}
		fila += '</td></tr>';
		$('#listaPublicacion').append(fila);
		$('#listaPublicacion').trigger("update");

		$(document).on('click', '.eliminar-publicacion', eliminarPublicacionXGrupo);
	}
}

function eliminarPublicacionXGrupo(){

	var answer = confirm("Desea eliminar la publicacion y los archivos contenidos en ella?")
	if (answer){


		$(".selected").removeClass("selected");
		$(this).parent().parent().addClass("selected");
		var IDPUBLICACION=this.getAttribute("IDPUBLICACION");
		var IDGRUPO=getUrlParameters("id","",true);
		var obj = {};

		obj["IDGRUPO"] = IDGRUPO;
		obj["IDPUBLICACION"] = IDPUBLICACION;

		$.ajax({
			type: 'POST',
			url : '../../api/AU_eliminaPublicacionXGrupo',
			dataType: "json",
			data: JSON.stringify(obj),
			contentType: "application/json; charset=utf-8",
			success: function(data){
				$('#fila-'+IDPUBLICACION+'').remove();
				alert("Se elimino correctamente la publicacion");
				$('#listaPublicacion').trigger("update");

				//window.location.href = "../Administracion_Usuario_Grupo/ViewListaPublicacionPorGrupo.html?id=" + IDGRUPO;
			}
		});
	}
	else{
	        //solo se cierra y no elimina la publicacion del grupo
	}
}

function getIdGrupo(){
	if( localStorage.idGrupo ){
	return IDGRUPO_PADRE = (localStorage.idGrupo)*1;
	}
	else{
		return IDGRUPO_PADRE =1;
	}
}

function getId(){
	if( localStorage.uid ){
	return IDGRUPO_PADRE = (localStorage.uid)*1;
	}
	else{
		return IDGRUPO_PADRE =1;
	}
}

function getUrlParameters(parameter, staticURL, decode){
   var currLocation = (staticURL.length)? staticURL : window.location.search,
       parArr = currLocation.split("?")[1].split("&"),
       returnBool = true;
   
   for(var i = 0; i < parArr.length; i++){
        parr = parArr[i].split("=");
        if(parr[0] == parameter){
            return (decode) ? decodeURIComponent(parr[1]) : parr[1];
            returnBool = true;
        }else{
            returnBool = false;            
        }
   }
   
   if(!returnBool) return false;  
}

function damePermiso(){
	var obj = {};

	obj["IDUSUARIO"]= getId();

	$.ajax({
		type: 'GET',
		url : '../../api/AU_damePermiso/'+getId(),
		dataType: "json",
		data: JSON.stringify(obj),
		contentType: "application/json; charset=utf-8",
		success: function(data){
			idpermiso=data["IDPERMISO"];
		}
	});
	return idpermiso;
}	

function dameResponsable(){
	var obj = {};

	obj["IDGRUPO"]= getUrlParameters("id","",true);

	$.ajax({
		type: 'POST',
		url : '../../api/AU_dameResponsable',
		dataType: "json",
		data: JSON.stringify(obj),
		contentType: "application/json; charset=utf-8",
		success: function(data){
			idResonsable=data["IDRESPONSABLE"];
		}
	});
	return idResonsable;
}	

function cargaListaPublicacion(){

	var IDUSUARIO=getId();
	var obj = {};
	obj["IDUSUARIO"]=IDUSUARIO;
	GRUPO =getUrlParameters("id","",true);

	$.ajax({
		type: 'POST',
		url : '../../api/AU_getListaPublicacion/'+GRUPO,
		dataType: "json",
		data: JSON.stringify(obj),
		contentType: "application/json; charset=utf-8",
		success: cargaElementos
	});
	//$("table#tabla").tablesorter({ widthFixed: true, sortList: [[0, 0]] })
    //   .tablesorterPager({ container: $("#pager"), size: $(".pagesize option:selected").val() });
}

function initTableSorter(){
	$("table#tabla").tablesorter({ widthFixed: true, sortList: [[0, 0]] })
       .tablesorterPager({ container: $("#pager"), size: $(".pagesize option:selected").val()});
}

$(document).ready(function(){
	initTableSorter();	
	idpermiso = damePermiso();
	idUsuario=getId();
	idResonsable=dameResponsable();
	//cargaListaPublicacion();
	setTimeout(cargaListaPublicacion,250);
	//$("#guardar").click(guardarCambios);
	//$("#cerrar").click(resetForm);

});