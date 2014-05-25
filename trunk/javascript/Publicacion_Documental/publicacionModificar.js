var seleccionAutores;
var seleccionEtiquetas;
var idpublicacion=getUrlParameters("idpublicacion", "", true);
var seleccionGrupos;
var seleccionResponsable;
var seleccionMiembros;

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
	var etiquetas=[];
	var ob;
	for (var i=0; i<seleccionEtiquetas.length; i++) {
		ob={id:seleccionEtiquetas[i]["id"]};
		etiquetas.push(ob);
	}

	var obj= { idpublicacion:data["IDPUBLICACION"],
				etiquetas:etiquetas };

	$.ajax({
		type: 'POST',
		url : "../../api/PD_modificaPublicacionxEtiqueta",
		dataType: "json",
		data: JSON.stringify(obj),
		contentType: "application/json; charset=utf-8",
		success: function(data){
			return data["status"];			
		}
	});
}

function guardarPublicacionxAutor(data){
	//juntando los json
	var autores=[];
	var ob;
	for (var i=0; i<seleccionAutores.length; i++) {
		ob={id:seleccionAutores[i]["id"]};
		autores.push(ob);
	}

	var obj= { idpublicacion:data["IDPUBLICACION"],
				autores:autores };

	$.ajax({
		type: 'POST',
		url : "../../api/PD_modificaPublicacionxAutor",
		dataType: "json",
		data: JSON.stringify(obj),
		contentType: "application/json; charset=utf-8",
		success: function(data){
			return data["status"];			
		}
	});
}

function guardarArchivos(data){	
	
	myDropzone.on("sendingmultiple", function(file, xhr, formData) {
	  formData.append('IDPUBLICACION',data['IDPUBLICACION']);
	  formData.append('IDGRUPO',localStorage.idMiGrupo);
	  formData.append('IDUSUARIO',getId());
	  formData.append('GRUPOS',JSON.stringify(gruposArchivo));
	});
	myDropzone.processQueue();
}

var gruposArchivo;
function guardarPublicacionxGrupo(data){
	var grupos=[];
	var ob;
	for (var i=0; i<seleccionGrupos.length; i++) {
		ob={id:seleccionGrupos[i]["id"]};
		grupos.push(ob);
	}

	var obj= { idpublicacion:data["IDPUBLICACION"],
				idusuario:getId(),
				grupos:grupos};
	gruposArchivo=grupos;			

	$.ajax({
		type: 'POST',
		url : "../../api/PD_modificaPublicacionxGrupo",
		dataType: "json",
		data: JSON.stringify(obj),
		contentType: "application/json; charset=utf-8",
		success: function(data){
			return data["status"];			
		}
	});
}

function guardarCambios(){
	var obj = {};
	obj["TITULO"]=$('#TITULO').val();
	obj["FUENTE"]=$('#FUENTE').val();
	obj["OBTENIDO"]=$('#OBTENIDO').val();
	obj["PAGINAS"]=$('#PAGINAS').val();
	obj["VOLUMEN"]=$('#VOLUMEN').val();
	obj["DOI"]=$('#DOI').val();
	obj["ISSN"]=$('#ISSN').val();
	obj["IDIDIOMA"]=$('#IDIOMA_SELECT').val();
	obj["IDTIPOPUBLICACION"]=$('#TIPOPUBLICACION_SELECT').val();
	obj["FECHAPUB"]=$('#FECHAPUB').val();
	obj["IDPUBLICACION"]=idpublicacion;
	obj["IDGRUPO"]=localStorage.idMiGrupo;

	$.ajax({
		type: 'POST',
		url : "../../api/PD_modificaPublicacion",
		dataType: "json",
		data: JSON.stringify(obj),
		contentType: "application/json; charset=utf-8",
		success: function(data){
			//guardar etiquetas, autores y archivos
			var status1=guardarPublicacionxEtiqueta(data); 
			var status2=guardarPublicacionxAutor(data);			
			var status3=guardarPublicacionxGrupo(data);
			var status4=guardarArchivos(data);
			if(data["status"]===0){
				alert("Ocurrió un error interno");
				window.location.href='ViewListaPublicacion.html';
			}
			else{
				alert("Publicación creada correctamente");
				window.location.href='ViewListaPublicacion.html';
			}
		}
	});
}

function dameResponsable(){
	//juntando los json
	
	var data = [];

	for (var i=0; i<seleccionResponsable.length; i++) {
		data.push(seleccionResponsable[i]["id"]);
	}	
	return data;
}

function dameMiembros(){
	//juntando los json
	var data = [];

	for (var i=0; i<seleccionMiembros.length; i++) {
		data.push(seleccionMiembros[i]["id"]);
	}	
	return data;
}

function cargarListaPersonas1(){

	var IDUSUARIO=getId();

	$.ajax({
		type: 'GET',
		url : '../../api/AU_getListaPersonas/'+IDUSUARIO,
		dataType: "json",
		contentType: "application/json; charset=utf-8",
		success: function(obj){
			for (var i=0; i<obj.length; i++) {
				$("#sel2Responsable").append('<option value="' + obj[i].IDUSUARIO + '">' + obj[i].NOMBRE + '</option>');
			}
		}
	});
}

function cargarListaPersonas2(){

	var IDUSUARIO=getId();

	$.ajax({
		type: 'GET',
		url : '../../api/AU_getListaPersonas/'+IDUSUARIO,
		dataType: "json",
		contentType: "application/json; charset=utf-8",
		success: function(obj){
			for (var i=0; i<obj.length; i++) {
				$("#sel2Miembros").append('<option value="' + obj[i].IDUSUARIO + '">' + obj[i].NOMBRE + '</option>');
			}
		}
	});
}

function cargaGrupos(){

	var obj={
			IDPADRE:localStorage.getItem('idMiGrupo'),
			IDUSUARIO: getId()
			};

	$.ajax({
		type: 'POST',
		//url : '../../api/AU_getListaGrupo',
		url : '../../api/PU_getListaGrupo',
		dataType: "json",
		data: JSON.stringify(obj),
		contentType: "application/json; charset=utf-8",
		success: function (data){
			for (var i=0; i<data.length; i++) {
				$("#sel2Grupo").append('<option value="' + data[i].IDGRUPO + '">' + data[i].NOMBRE + '</option>');
			}
		}
	});
}

function iniciarNiceSelectBoxes(){

    $('#sel2Multi2').select2({
		placeholder: 'Seleccione un autor',
		allowClear: true
	});

    $('#sel2Multi3').select2({
		placeholder: 'Seleccione una etiqueta',
		allowClear: true
	});

    $('#sel2Grupo').select2({
		placeholder: 'Seleccione un grupo',
		allowClear: true
	});

    $('#sel2Responsable').select2({
		placeholder: 'Seleccione solo un responsable',
		maximumSelectionSize: 1,
		allowClear: true		
	});

	$('#sel2Miembros').select2({
		placeholder: 'Seleccione los miembros del grupo',
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
			$('#FECHAPUB').val(data["FECHAREGISTRO"]);
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
			seleccionEtiquetas = $("#sel2Multi3").select2("data");
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
	    	seleccionAutores = $("#sel2Multi2").select2("data");
	    }	
	});
}

function setCamposGrupos(){
	$.ajax({
		type: 'GET',
	    url:'../../api/PD_getGrupoPublicacion/'+ idpublicacion,
	    dataType: "json",
	    contentType: "application/json; charset=utf-8",
	    success: function(data) {
	    	var gruposPublicacion = $("#sel2Grupo").select2("val");
	    	for (var i=0; i<data.length; i++) {
	    		//var etiquetasPublicacion = $("#sel2Multi3").select2("val");
				gruposPublicacion.push(data[i].IDGRUPO);
				//$("#sel2Multi3").select2("val", null);
				//$("#sel2Multi3").select2("val", etiquetasPublicacion);
	    	}
	    	$("#sel2Grupo").select2("val", gruposPublicacion);
			seleccionGrupos = $("#sel2Grupo").select2("data");
	    }	
	});
}

function getId(){
	if( localStorage.uid ){
		return IDUSUARIO = localStorage.uid;
	}
	else{
		return IDUSUARIO = 1;
	}
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
			$("#sel2Multi3").append('<option value="' + obj[0].IDETIQUETA + '">' + obj[1].NOMBRE + '</option>');
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
			$("#sel2Multi2").append('<option value="' + obj[0].IDAUTOR + '">' + obj[1].NOM_APE + '</option>');
		}
	});
}

function guardarGrupo(){
	var obj = {};
	
	obj["IDGRUPO_PADRE"]= localStorage.getItem('idMiGrupo');
	var ruta = "";
	var callback;
	
	ruta = "../../api/AU_registraGrupo";
	obj["NOMBRES"] = $('#NOMBRES').val();
	obj["FECHA_CREACION"] = $('#FECHA_CREACION').val();
	obj["DESCRIPCION"] = $('#DESCRIPCION').val();	

	var parent= [];

	parent.push(dameResponsable());
	parent.push(dameMiembros());

	var obj2 = $.extend({},obj,parent);

	$.ajax({
		type: 'POST',
		url : ruta,
		dataType: "json",
		data: JSON.stringify(obj2),
		contentType: "application/json; charset=utf-8",
		success: function (data){
			$('#detalleGrupo').modal('hide');
			$("#sel2Grupo").append('<option value="' + data.IDGRUPO + '">' + data.NOMBRE + '</option>');
		}
	});
}

function configurarDropzone(){
	Dropzone.autoDiscover=false;
	$('#subidaArchivos').dropzone({
	    url: '../../api/PD_subirArchivos',
	    maxFilesize: 100,
	    paramName: 'file',
	    addRemoveLinks: true,
	    autoProcessQueue: false,
	    uploadMultiple:true,
	    maxFiles:10,
	    parallelUploads:10000,
	    dictRemoveFile:'Remover archivo'
	});

}

var test = $('#sel2Multi3');
$(test).change(function() {
    seleccionEtiquetas = ($(test).select2('data'));
});

var test2 = $('#sel2Multi2');
$(test2).change(function() {
    seleccionAutores = ($(test2).select2('data'));
});

var test3 = $('#sel2Grupo');
$(test3).change(function() {
    seleccionGrupos = ($(test3).select2('data'));
});

var test4 = $('#sel2Responsable');
$(test4).change(function() {
    seleccionResponsable = ($(test4).select2('data'));
});

var test5 = $('#sel2Miembros');
$(test5).change(function() {
    seleccionMiembros = ($(test5).select2('data'));
});


var myDropzone;
Dropzone.options.subidaArchivos = {
  init: function() {
    myDropzone = this;
  }
};

function cargaHora(){

	var dateObj = new Date();
    var month = dateObj.getUTCMonth();
    var day = dateObj.getUTCDate();
    var year = dateObj.getUTCFullYear();
    var newdate = day  + "/" + month + "/" + year;
    $('#FECHA_CREACION').val(newdate);
}

function cargaArchivos(data){

	if(data.length===0){
		$('#archivosTitulo').hide();
		$('#divArchivos').attr("style","display:none");
	}
	
	for(var i=0; i < data.length ; i++){
		var fila = '';
		if(data[i]["FORMATO"]==="application/force-download" || data[i]["FORMATO"]==="application/pdf"){ 
			fila = '<li class="list-group-item" id="fila-'+data[i]["IDARCHIVO"]+'"><span class="badge badge-danger"><a class="eliminar-archivo btn-link danger" idarchivo="'+data[i]["IDARCHIVO"]+'" url="'+data[i]["URL"]+'">';
			fila += '<span class="fa-stack"><i class="fa fa-trash-o fa-stack-1x fa-inverse"></i></span></a></span><h6 id="nomArchivo"><span>'+data[i]["NOMBRE"]+'</span></h6></li>';	
			$('#listaArchivos').append(fila);
		}
	}

	$(document).on('click', '.eliminar-archivo', eliminarArchivo);
}

function eliminarArchivo(){

	$(".selected").removeClass("selected");
	$(this).parent().parent().addClass("selected");
	var idarchivo=this.getAttribute("idarchivo");
	var obj={idarchivo:idarchivo}

	$.ajax({
		type: 'POST',
		url : '../../api/PD_eliminaArchivo',
		dataType: "json",
		data: JSON.stringify(obj),
		contentType: "application/json; charset=utf-8",
		success: function (data){
			if(data["status"]===1)
				$('#fila-'+idarchivo+'').remove();
			else
				alert("Ocurrió un error al eliminar");
		}
	});
}

function llenarArchivos(){
	$.ajax({
		type: 'GET',
		url : '../../api/PD_getArchivosPublicacion/'+idpublicacion,
		dataType: "json",
		contentType: "application/json; charset=utf-8",
		success: cargaArchivos
	});
}

$(document).ready(function(){
	idpublicacion = getUrlParameters("idpublicacion","", true);	
	$('#FECHAPUB').datepicker({
	  format: 'yyyy-mm-dd'
	});
	$("#DOI").mask("999.9999/9999999.9999999");
	$("#ISSN").mask("9999-9999");
	cargaHora();
	configurarDropzone();
	cargarListaPersonas1();
	cargarListaPersonas2();
	cargaGrupos();
	popularSelectIdioma();
	popularSelectTipoPublicacion();
	iniciarNiceSelectBoxes();
	popularAutores();
	popularEtiquetas();
	llenarArchivos();
	setTimeout(llenarCampos,20);
	setTimeout(setCamposGrupos,300);
	setTimeout(setCamposEtiquetas,100);
	setTimeout(setCamposAutor,100);

	$("#guardar").click(guardarCambios);
	//$("#limpiar").click(cleanInput);
	$("#guardarEtiqueta").click(guardarEtiqueta);
	$("#guardarAutor").click(guardarAutor);
	$("#guardarGrupo").click(guardarGrupo);

});