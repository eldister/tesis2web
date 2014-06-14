var seleccionEtiquetas=[];
var seleccionGrupos=[];
var seleccionResponsable=[];
var seleccionMiembros=[];

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

var idiomas;
function popularSelectIdioma(){
	$.ajax({
		type: 'GET',
	    url:'../../api/PD_getListaIdioma',
	    dataType: "json",
	    contentType: "application/json; charset=utf-8",
	    success: function(data) {
	    	idiomas=data;
	        armarModalBody(data);
		   	for (var i=0; i<data.length; i++) {		     
		      	var opt='<option value="' + data[i].IDIDIOMA + '">' + data[i].NOMBRE + '</option>';
		      	$("#IDIOMA_SELECT_MODAL").append(opt);
		      	$("#selectIdiomaEtiqueta").append(opt);
		  	}
	    }
	});
}

function popularSelectTipoFicha(){
	$.ajax({
		type: 'GET',
	    url:'../../api/PD_getListaTipoFicha',
	    dataType: "json",
	    contentType: "application/json; charset=utf-8",
	    success: function(data) {
		   	for (var i=0; i<data.length; i++) {
		     	$("#TIPOFICHA_SELECT").append('<option value="' + data[i].IDTIPOFICHA + '">' + data[i].NOMBRE + '</option>');
		   	}
	    }
	});
}

function popularEtiquetas(ididioma){
	$.ajax({
		type: 'GET',
	    url:'../../api/PD_getListaEtiqueta',
	    dataType: "json",
	    contentType: "application/json; charset=utf-8",
	    async: false,
	    success: function(data) {
	    	$("#sel2Multi3").empty();
		   	for (var i=0; i<data.length; i++) {
		   		if(ididioma===data[i].IDIDIOMA){
		   			if(seleccionEtiquetas!=null){
		   				var cont=0;
			   			for (var j=0; j<seleccionEtiquetas.length; j++) {
			   				//obtener idrelacionado
			   				var idBuscar=seleccionEtiquetas[j]["id"];
			   				var obj =  $.grep(data, function(e){ return e.IDETIQUETA == idBuscar; });				   				

							if(obj[0].IDETIQUETARELACIONADA===data[i].IDETIQUETARELACIONADA){
								cont+=1;
							}						
						}
						if (cont>0) continue;
					}
		    		$("#sel2Multi3").append('<option value="' + data[i].IDETIQUETA + '">' + data[i].NOMBRE + '</option>');
		    	}
		   	}
	    }
	});
}

function armarModalBody(data){

	for (var i=0; i<data.length; i++) {
		var fila ='<input type="hidden" id="IDETIQUETA" class="form-control" />';
		fila += '<span id="ididioma-'+data[i].IDIDIOMA+'">'+data[i].NOMBRE+'</span>';
		fila += '<div class="form-group"><div class="input-group"><span class="input-group-addon"><i class="fa fa-book"></i></span>';
		fila += '<input type="NOMBRE" class="form-control" id="NOMBRE-'+data[i].IDIDIOMA+'"></div></div>';
		$('#bodyEtiquetas').append(fila);
	}

}

function llenarDatosPublicacion(){
	var idpub=getUrlParameters("idpublicacion","",true);
	$.ajax({
		type: 'GET',
	    url:'../../api/PD_getPublicacion/'+ idpub,
	    dataType: "json",
	    contentType: "application/json; charset=utf-8",
	    success: function(data) {
	    	$('#TITULO').val(data["TITULO"]);
			$('#IDIOMA').val(data["IDIOMA"]);
			$('#TIPOPUBLICACION').val(data["TIPO"]);
			$('#FECHAPUB').val(data["FECHAREGISTRO"]);
	    }
	});
}

function cleanInput(){
	$('#ENCABEZADO').val('');
	$('#TIPOFICHA_SELECT').val('');
	$('#CONTENIDO').val('');
	$('#IDIOMA_SELECT').val("Seleccione el Idioma");
	$('#TIPOFICHA_SELECT').val("Seleccione el tipo de publicación");
    $('#sel2Multi3').select2({
		placeholder: 'Seleccione una etiqueta',
		allowClear: true
	});
	$('#sel2Grupo').select2({
		placeholder: 'Seleccione un grupo',
		allowClear: true
	});
}

function guardarFichaxEtiqueta(data){
	//juntando los json
	var etiquetas=[];
	var ob;
	for (var i=0; i<seleccionEtiquetas.length; i++) {
		ob={id:seleccionEtiquetas[i]["id"]};
		etiquetas.push(ob);
	}

	var obj= { idficha:data["IDFICHABIB"],
				etiquetas:etiquetas };

	$.ajax({
		type: 'POST',
		url : "../../api/PD_registraFichaxEtiqueta",
		dataType: "json",
		data: JSON.stringify(obj),
		contentType: "application/json; charset=utf-8",
		success: function(data){
			return data["status"];			
		}
	});
}

function guardarFichaxGrupo(data){
	var grupos=[];
	var ob;
	for (var i=0; i<seleccionGrupos.length; i++) {
		ob={id:seleccionGrupos[i]["id"]};
		grupos.push(ob);
	}

	var obj= { idficha:data["IDFICHABIB"],
				idpublicacion:data["IDPUBLICACION"],
				grupos:grupos};
	gruposArchivo=grupos;			

	$.ajax({
		type: 'POST',
		url : "../../api/PD_registraFichaxGrupo",
		dataType: "json",
		data: JSON.stringify(obj),
		contentType: "application/json; charset=utf-8",
		success: function(data){
			return data["status"];			
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

function guardarCambios(){
	var obj = {};

	obj["ENCABEZADO"]=$('#ENCABEZADO').val();
	obj["IDTIPOFICHA"]=$('#TIPOFICHA_SELECT').val();
	obj["CONTENIDO"]=$('#CONTENIDO').val();
	obj["IDCREADOR"]=getId();
	obj["IDGRUPO"]=localStorage.idMiGrupo;
	obj["IDPUBLICACION"]=getUrlParameters("idpublicacion","",true);

	if(!validarFicha(seleccionGrupos)){
		return;
	}

	$.ajax({
		type: 'POST',
		url : "../../api/PD_registraFicha",
		dataType: "json",
		data: JSON.stringify(obj),
		contentType: "application/json; charset=utf-8",
		success: function(data){
			if(data["status"]===0){
				alert("Ocurrió un error interno");
				window.location.href='ViewListaFicha.html';
			}else{
				guardarFichaxEtiqueta(data);
				guardarFichaxGrupo(data);
				alert("Ficha registrada correctamente");
				window.location.href='ViewListaFicha.html';
			}
		}
	});
}


function guardarEtiqueta(){
	var listEtiquetas =[];
	var obj = {};

	var ruta = "";

	ruta = "../../api/PD_registraEtiqueta";

	for (var i=0; i<idiomas.length; i++) {
		obj = { nombre:$('#NOMBRE-'+idiomas[i].IDIDIOMA+'').val(),
				ididioma: idiomas[i].IDIDIOMA,
				idioma: idiomas[i].NOMBRE
				};
		listEtiquetas.push(obj);
	}

	if(!validarEtiqueta(idiomas)){
		return;
	}

	$.ajax({
		type: 'POST',
		url : ruta,
		dataType: "json",
		data: JSON.stringify(listEtiquetas),
		contentType: "application/json; charset=utf-8",
		success: function(data){
			$('#detalleEtiqueta').modal('hide');
			$("#sel2Multi3").append('<option value="' + data[ididioma-1].IDETIQUETA + '">' + data[ididioma-1].NOMBRE + '</option>');
		}
	});
	$('#bodyEtiquetas').empty();
	armarModalBody(idiomas);
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

	if(!validarGrupo2(dameResponsable(),dameMiembros())){
		return;
	}

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

function cargaGrupos(){

	var obj={
			IDPADRE:localStorage.getItem('idMiGrupo'),
			IDUSUARIO: getId()
			};

	$.ajax({
		type: 'POST',
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

function iniciarNiceSelectBoxes(){

    $('#sel2Multi3').select2({
		placeholder: 'Seleccione una etiqueta',
		allowClear: true
	});

	$('#sel2Grupo').select2({
		placeholder: 'Seleccione un grupo',
		allowClear: true
	});

	$('#sel2Responsable').select2({
		placeholder: 'Seleccione un responsable',
		maximumSelectionSize: 1,
		allowClear: true
	});

	$('#sel2Miembros').select2({
		placeholder: 'Seleccione miembros para el grupo',
		allowClear: true
	});
}


var test = $('#sel2Multi3');
$(test).change(function() {
    seleccionEtiquetas = ($(test).select2('data'));
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

var ididioma="1";
function cambioIdiomaCombo(){
	$("#selectIdiomaEtiqueta").change(function(){
		ididioma=$(this).val();
		popularEtiquetas(ididioma);
	});
}

$(document).ready(function(){
	cambioIdiomaCombo();
	popularSelectIdioma();
	cargarListaPersonas1();
	cargarListaPersonas2();
	cargaGrupos();
	popularSelectTipoFicha();
	llenarDatosPublicacion();
	iniciarNiceSelectBoxes();
	popularEtiquetas(ididioma);
	$("#guardar").click(guardarCambios);
	$("#limpiar").click(cleanInput);
	$("#guardarEtiqueta").click(guardarEtiqueta);
	$("#guardarGrupo").click(guardarGrupo);

});