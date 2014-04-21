var seleccionAutores;
var seleccionCarpetas;
var seleccionEtiquetas;
var idpublicacion; getUrlParameters("idpublicacion", "", true);

function popularSelectIdioma(){
	$.ajax({
		type: 'GET',
	    url:'../../api/PD_getListaIdioma',
	    dataType: "json",
	    contentType: "application/json; charset=utf-8",
	    success: function(data) {
		   for (var i=0; i<data.length; i++) {
		     $("#IDIOMA_SELECT").append('<option value="' + data[i].IDIDIOMA + '">' + data[i].NOMBRE + '</option>');
		     $("#IDIOMA_SELECT_MODAL").append('<option value="' + data[i].IDIDIOMA + '">' + data[i].NOMBRE + '</option>');
		   }
	    }
	});
}

function popularSelectTipoPublicacion(){
	$.ajax({
		type: 'GET',
	    url:'../../api/PD_getListaTipoPublicacion',
	    dataType: "json",
	    contentType: "application/json; charset=utf-8",
	    success: function(data) {
		   for (var i=0; i<data.length; i++) {
		     $("#TIPOPUBLICACION_SELECT").append('<option value="' + data[i].IDTIPOPUBLICACION + '">' + data[i].NOMBRE + '</option>');
		   }
	    }
	});
}

function cleanInput(){
	$('textarea').val("");
	$('input').val("");
	$('#IDIOMA_SELECT').val("Seleccione el Idioma");
	$('#TIPOPUBLICACION_SELECT').val("Seleccione el tipo de publicación");
	$('#sel2').select2();
	$('#sel2Multi').select2({
		placeholder: 'Seleccione las carpetas donde estará contenida la publicación',
		allowClear: true
	});
    $('#sel2Multi2').select2({
		placeholder: 'Seleccione un autor',
		allowClear: true
	});
    $('#sel2Multi3').select2({
		placeholder: 'Seleccione una etiqueta',
		allowClear: true
	});
}

function guardarPublicacionxEtiqueta(data){
	//juntando los json
	var parent= [];
	var data2 = seleccionEtiquetas;

	var json2 = JSON.parse(data2);
	parent.push(json2);   

	var obj = $.extend({},data,parent);
	console.log(obj);
	console.log(JSON.stringify(obj));

	$.ajax({
		type: 'POST',
		url : "../../api/PD_modificaPublicacionxEtiqueta",
		dataType: "json",
		data: JSON.stringify(obj),
		contentType: "application/json; charset=utf-8",
		success: function(data){
			alert("etiquetas modificadas");			
		}
	});
}

function guardarPublicacionxAutor(data){
	//juntando los json
	var parent= [];
	var data2 = seleccionAutores;

	var json2 = JSON.parse(data2);
	parent.push(json2);   

	var obj = $.extend({},data,parent);
	console.log(obj);
	console.log(JSON.stringify(obj));

	$.ajax({
		type: 'POST',
		url : "../../api/PD_modificaPublicacionxAutor",
		dataType: "json",
		data: JSON.stringify(obj),
		contentType: "application/json; charset=utf-8",
		success: function(data){
			alert("autores modificados");			
		}
	});
}

function guardarCambios(){
	var obj = {};
	obj["IDPUBLICACION"]=idpublicacion;
	obj["TITULO"]=$('#TITULO').val();
	obj["FUENTE"]=$('#FUENTE').val();
	obj["OBTENIDO"]=$('#OBTENIDO').val();
	obj["ANIO"]=$('#ANIO').val();
	obj["MES"]=$('#MES').val();
	obj["PAGINAS"]=$('#PAGINAS').val();
	obj["VOLUMEN"]=$('#VOLUMEN').val();
	obj["DOI"]=$('#DOI').val();
	obj["ISSN"]=$('#ISSN').val();
	obj["IDIDIOMA"]=$('#IDIOMA_SELECT').val();
	obj["IDTIPOPUBLICACION"]=$('#TIPOPUBLICACION_SELECT').val();

	$.ajax({
		type: 'POST',
		url : "../../api/PD_modificaPublicacion",
		dataType: "json",
		data: JSON.stringify(obj),
		contentType: "application/json; charset=utf-8",
		success: function(data){
			guardarPublicacionxEtiqueta(data);
			guardarPublicacionxAutor(data);
			alert("Publicación modificada correctamente");
			window.history.go(-1);
		}
	});
}

function iniciarNiceSelectBoxes(){
	$('#sel2').select2();
	
	$('#sel2Multi').select2({
		placeholder: 'Seleccione las carpetas donde estará contenida la publicación',
		allowClear: true
	});

    $('#sel2Multi2').select2({
		placeholder: 'Seleccione un autor',
		allowClear: true
	});

    $('#sel2Multi3').select2({
		placeholder: 'Seleccione una etiqueta',
		allowClear: true
	});
}

function llenarCampos(){
	//var idpublicacion = getUrlParameters("idpublicacion", "", true);
	$.ajax({
		type: 'GET',
		url : '../../api/PD_getPublicacion/'+ idpublicacion,
		dataType: "json",
		contentType: "application/json; charset=utf-8",
		success: function(data){
			$('#TITULO').val(data["TITULO"]);
			$('#FUENTE').val(data["FUENTE"]);
			$('#OBTENIDO').val(data["OBTENIDO"]);
			$('#ANIO').val(data["ANIO"]);
			$('#MES').val(data["MES"]);
			$('#PAGINAS').val(data["PAGINAS"]);
			$('#VOLUMEN').val(data["VOLUMEN"]);
			$('#DOI').val(data["DOI"]);
			$('#ISSN').val(data["ISSN"]);
			$('#IDIOMA_SELECT').val(data["IDIDIOMA"]);
			$('#TIPOPUBLICACION_SELECT').val(data["IDTIPOPUBLICACION"]);
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

function popularAutores(){
	$.ajax({
		type: 'GET',
	    url:'../../api/PD_getListaAutor',
	    dataType: "json",
	    contentType: "application/json; charset=utf-8",
	    success: function(data) {
		   for (var i=0; i<data.length; i++) {
		     	$("#sel2Multi2").append('<option value="' + data[i].IDAUTOR + '">' + data[i].NOM_APE + '</option>');
		   }
	    }
	});
}

function popularEtiquetas(){
	$.ajax({
		type: 'GET',
	    url:'../../api/PD_getListaEtiqueta',
	    dataType: "json",
	    contentType: "application/json; charset=utf-8",
	    success: function(data) {
		   	for (var i=0; i<data.length; i++) {
			    $("#sel2Multi3").append('<option value="' + data[i].IDETIQUETA + '">' + data[i].NOMBRE + '</option>');
		   	}
	    }
	});
}

function setCamposEtiquetas(){
	$.ajax({
		type: 'GET',
	    url:'../../api/PD_getEtiquetaPublicacion/'+ idpublicacion,
	    dataType: "json",
	    contentType: "application/json; charset=utf-8",
	    success: function(data) {
	    	var etiquetasPublicacion = $("#sel2Multi3").select2("val");
	    	for (var i=0; i<data.length; i++) {
	    		//var etiquetasPublicacion = $("#sel2Multi3").select2("val");
				etiquetasPublicacion.push(data[i].IDETIQUETA);
				//$("#sel2Multi3").select2("val", null);
				//$("#sel2Multi3").select2("val", etiquetasPublicacion);
	    	}
	    	$("#sel2Multi3").select2("val", etiquetasPublicacion);
			seleccionEtiquetas = JSON.stringify($("#sel2Multi3").select2("data"));
			//alert(seleccionEtiquetas);
	    }	
	});

}

function setCamposAutor(){
	$.ajax({
		type: 'GET',
	    url:'../../api/PD_getAutorPublicacion/'+ idpublicacion,
	    dataType: "json",
	    contentType: "application/json; charset=utf-8",
	    success: function(data) {
	    	var autoresPublicacion = $("#sel2Multi2").select2("val");
	    	for (var i=0; i<data.length; i++) {
	    		//var autoresPublicacion = $("#sel2Multi2").select2("val");
				autoresPublicacion.push(data[i].IDAUTOR);
				//$("#sel2Multi2").select2("val", null);
				//$("#sel2Multi2").select2("val", autoresPublicacion);
	    	}
	    	$("#sel2Multi2").select2("val", autoresPublicacion);
	    	seleccionAutores = JSON.stringify($("#sel2Multi2").select2("data"));
	    }	
	});
}

function guardarEtiqueta(){
	var obj = {};

	obj["NOMBRE"] = $('#NOMBRE').val();
	obj["IDIDIOMA"] =$('#IDIOMA_SELECT_MODAL').val();
	obj["IDIOMA"]=$('#IDIOMA_SELECT_MODAL option:selected').text();
	obj["OBSERVACION"] = $('#OBSERVACION').val();

	$.ajax({
		type: 'POST',
		url : "../../api/PD_registraEtiqueta",
		dataType: "json",
		data: JSON.stringify(obj),
		contentType: "application/json; charset=utf-8",
		success: function(obj){
			$('#detalleEtiqueta').modal('hide');
			$("#sel2Multi3").append('<option value="' + obj[0].IDETIQUETA + '">' + obj[0].NOMBRE + '</option>');
		}
	});
}

function guardarAutor(){
	var obj = {};

	obj["NOM_APE"] = $('#NOM_APE').val();
	obj["PAGINA_WEB"] = $('#PAGINA_WEB').val();
	obj["INSTITUCION"] = $('#INSTITUCION').val();
	obj["TRABAJO"] = $('#TRABAJO').val();

	$.ajax({
		type: 'POST',
		url : "../../api/PD_registraAutor",
		dataType: "json",
		data: JSON.stringify(obj),
		contentType: "application/json; charset=utf-8",
		success: function(obj){
			$('#detalleAutor').modal('hide');
			$("#sel2Multi2").append('<option value="' + obj[0].IDAUTOR + '">' + obj[0].NOM_APE + '</option>');
		}
	});
}

var test = $('#sel2Multi3');
//cuando se hace un cambio en el select2
$(test).change(function() {
    seleccionEtiquetas = ( JSON.stringify($(test).select2('data')) );
});

var test2 = $('#sel2Multi2');
//cuando se hace un cambio en el select2
$(test2).change(function() {
    seleccionAutores = ( JSON.stringify($(test2).select2('data')) );
});

$(document).ready(function(){
	idpublicacion = getUrlParameters("idpublicacion","", true);	
	iniciarNiceSelectBoxes();
	popularSelectIdioma();
	popularSelectTipoPublicacion();
	llenarCampos();
	// popularAutores();
	// popularEtiquetas();
	// setCamposEtiquetas();
	// setCamposAutor();
	//PROBLEMA DE CONCURRENCIA 
	$.when(popularAutores()).then(setCamposAutor());
	$.when(popularEtiquetas()).then(setCamposEtiquetas());


	$("#guardar").click(guardarCambios);
	$("#limpiar").click(cleanInput);
	$("#guardarEtiqueta").click(guardarEtiqueta);
	$("#guardarAutor").click(guardarAutor);

});