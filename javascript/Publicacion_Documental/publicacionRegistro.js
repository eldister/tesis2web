var seleccionAutores;
var seleccionCarpetas;
var seleccionEtiquetas;

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
		url : "../../api/PD_registraPublicacionxEtiqueta",
		dataType: "json",
		data: JSON.stringify(obj),
		contentType: "application/json; charset=utf-8",
		success: function(data){
			alert("etiquetas agregadas");			
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
		url : "../../api/PD_registraPublicacionxAutor",
		dataType: "json",
		data: JSON.stringify(obj),
		contentType: "application/json; charset=utf-8",
		success: function(data){
			alert("autores agregados");			
		}
	});
}

function guardarCambios(){
	var obj = {};
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
		url : "../../api/PD_registraPublicacion",
		dataType: "json",
		data: JSON.stringify(obj),
		contentType: "application/json; charset=utf-8",
		success: function(data){
			guardarPublicacionxEtiqueta(data);
			guardarPublicacionxAutor(data);
			alert("Publicación registrada correctamente");
			window.history.go(-1);
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
			popularEtiquetas();
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
			popularAutores();
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

var test = $('#sel2Multi3');
$(test).change(function() {
    seleccionEtiquetas = ( JSON.stringify($(test).select2('data')) );
});

var test2 = $('#sel2Multi2');
$(test2).change(function() {
    seleccionAutores = ( JSON.stringify($(test2).select2('data')) );
});


$(document).ready(function(){
	popularSelectIdioma();
	popularSelectTipoPublicacion();
	iniciarNiceSelectBoxes();
	popularAutores();
	popularEtiquetas();
	$("#guardar").click(guardarCambios);
	$("#limpiar").click(cleanInput);
	$("#guardarEtiqueta").click(guardarEtiqueta);
	$("#guardarAutor").click(guardarAutor);

});