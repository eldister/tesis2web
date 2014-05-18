
function llenarEtiquetas(){
	$.ajax({
		type: 'GET',
		url : '../../api/PD_getListaEtiqueta',
		dataType: "json",
		contentType: "application/json; charset=utf-8",
		success: function(data){
			var etiquetas="";
			for(var i=0; i < data.length ; i++){
				etiquetas+= data[i]["NOMBRE"] + ", ";
			}
			$('#etiquetasLista').append(etiquetas);
		}
	});
}


function llenarAutores(){
	$.ajax({
		type: 'GET',
		url : '../../api/PD_getListaAutor',
		dataType: "json",
		contentType: "application/json; charset=utf-8",
		success: function(data){
			var autores="";
			for(var i=0; i < data.length ; i++){
				autores+= data[i]["NOM_APE"] + ", ";
			}
			$('#autoresLista').append(autores);
		}
	});
}

function llenarDatosPublicacion(){
	$.ajax({
		type: 'GET',
		url : '../../api/PD_getPublicacion/'+ idpub,
		dataType: "json",
		contentType: "application/json; charset=utf-8",
		success: function(data){
			$('#TITULO').val(data["TITULO"]);
			$('#FUENTE').val(data["FUENTE"]);
			$('#OBTENIDO').val(data["OBTENIDO"]);
			$('#IDIOMA').val(data["IDIOMA"]);
			$('#TIPOPUBLICACION').val(data["TIPO"]);
			$('#FECHAPUB').val(data["FECHAREGISTRO"]);
			$('#PAGINAS').val(data["PAGINAS"]);
			$('#VOLUMEN').val(data["VOLUMEN"]);
			$('#DOI').val(data["DOI"]);
			$('#ISSN').val(data["ISSN"]);
		}
	});
}

function getUrlParameters(parameter, staticURL, decode){
   /*
    Function: getUrlParameters
    Description: Get the value of URL parameters either from 
                 current URL or static URL
    Author: Tirumal
    URL: www.code-tricks.com
   */
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

function cargaArchivos(data){

	if(data.length===0){
		$('#archivosTitulo').hide();
		$('#divArchivos').attr("style","display:none");
	}
	
	for(var i=0; i < data.length ; i++){
		var fila = '';
		if(data[i]["FORMATO"]==="application/force-download" || data[i]["FORMATO"]==="application/pdf" ){
			fila = '<li class="list-group-item"><span class="badge badge-primary"><a class="ver-archivo btn-link danger" url="'+data[i]["URL"]+'">';
			fila += '<span class="fa-stack"><i class="fa fa-search fa-stack-1x fa-inverse"></i></span></a></span><h6 id="nomArchivo">'+data[i]["NOMBRE"]+'<h6></li>';	
			$('#listaArchivos').append(fila);
		}
	}

	$(document).on('click', '.ver-archivo', verArchivo);
}

function getId(){
	if( localStorage.uid ){
		return IDUSUARIO = localStorage.uid;
	}
	else{
		return IDUSUARIO = 1;
	}
}

function verArchivo(){
	$(".selected").removeClass("selected");
	$(this).parent().parent().addClass("selected");
	var url=this.getAttribute("url");
	var newurl='../'+url;
	var myPDF = new PDFObject({
	  url: newurl,
	  id: "archPDF",
	  width: "700px",
  	  height: "900px",
	  pdfOpenParams: {
	  	toolbar: 0,
	    navpanes: 0,
	    statusbar: 0,
	    view: "FitH",
	  }
	}).embed("modalDiv");
	$('#detalleArchivo').modal("show");

}

function cargaFichas(data){

	if(data.length===0){
		$('#fichasTitulo').hide();
		$('#divFichas').attr("style","display:none");
	}

	for(var i=0; i < data.length ; i++){
		var fila = '<tr id=fila-'+ data[i]["IDFICHABIB"] +'>';
		fila +='<td style="display:none;">';
		fila += '<td class="text-center">'+data[i]["ENCABEZADO"]+'</td>';
		fila += '<td class="text-center">'+data[i]["USUARIO"]+'</td>';
		fila+= '<td style="width: 23%;padding-left: 30px;">'
		//fila+= '<a class="table-link" href="ViewModificarIdioma.html?ididioma='+data[i]["IDIDIOMA"]+'""><span class="fa-stack"><i class="fa fa-square fa-stack-2x"></i><i class="fa fa-pencil fa-stack-1x fa-inverse"></i></span></a>';
		//fila+= '<a class="table-link danger" data-toggle="modal" href="#myModal?ididioma='+data[i]["IDIDIOMA"]+'""><span class="fa-stack"><i class="fa fa-square fa-stack-2x"></i><i class="fa fa-trash-o fa-stack-1x fa-inverse"></i></span></a>';
		//fila+= '<a class="table-link danger" data-toggle="modal" href="#myModal"><span class="fa-stack"><i class="fa fa-square fa-stack-2x"></i><i class="fa fa-trash-o fa-stack-1x fa-inverse"></i></span></a>';
		//fila+= '<a  class="eliminarRequisito" data-toggle="modal" ididioma='+data[i]["IDIDIOMA"]+'""><span class="fa-stack"><i class="fa fa-square fa-stack-2x"></i><i class="fa fa-trash-o fa-stack-1x fa-inverse"></i></span></a>';
		fila+= '<a class="ver-ficha table-link" idficha='+data[i]["IDFICHABIB"]+'><span class="fa-stack"><i class="fa fa-square fa-stack-2x"></i><i class="fa fa-search-plus fa-stack-1x fa-inverse"></i></span></a>';
		fila += '</td></tr>';
		$('#listaFichas').append(fila);
		//$('#listaFichas').trigger("update");
	}
	$(document).on('click', '.ver-ficha', verficha);
}

function verficha(){
	$(".selected").removeClass("selected");
	$(this).parent().parent().addClass("selected");
	var idficha=this.getAttribute("idficha");
	var obj;
	$('#contenidoFicha').html("");

	$.ajax({
		type: 'GET',
		url : '../../api/PD_getFicha/'+ idficha,
		dataType: "json",
		contentType: "application/json; charset=utf-8",
		success: function(data){
			console.log(data);
			$('#contenidoFicha').html(data["CONTENIDO"]);
		}
	});

	$('#detalleFicha').modal("show");

}

function llenarFichas(){
	var obj={idpublicacion:idpub,
			 idusulogueado:getId()
		};
	$.ajax({
		type: 'POST',
		url : '../../api/PD_getListaFichaPublicacion',
		dataType: "json",
		data:JSON.stringify(obj),
		contentType: "application/json; charset=utf-8",
		success: cargaFichas
	});
}


function llenarArchivos(){
	$.ajax({
		type: 'GET',
		url : '../../api/PD_getArchivosPublicacion/'+idpub,
		dataType: "json",
		contentType: "application/json; charset=utf-8",
		success: cargaArchivos
	});
}

var idpub;
$(document).ready(function(){
	idpub=getUrlParameters("idpublicacion","",true);
	llenarDatosPublicacion();
	llenarAutores();
	llenarEtiquetas();
	llenarArchivos();
	llenarFichas();

});