var seleccionAutores=[];
var seleccionEtiquetas=[];
var seleccionGrupos=[];
var seleccionResponsable=[];
var seleccionMiembros=[];
var seleccionInstituciones=[];
var myDropzone;
var idiomas;

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
		     $("#IDIOMA_SELECT").append(opt);
		     $("#IDIOMA_SELECT_MODAL").append(opt);
		     $("#selectIdiomaEtiqueta").append(opt);
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
	    	$("#sel2Multi2").empty();
		   for (var i=0; i<data.length; i++) {
		     $("#sel2Multi2").append('<option value="' + data[i].IDAUTOR + '">' + data[i].NOMBRE +" "+ data[i].NOM_APE + '</option>');
		   }
	    }
	});
}

function obtenerIdrelacionado(id){
	$.ajax({
		type: 'GET',
	    url:'../../api/PD_getEtiqueta/'+id,
	    dataType: "json",
	    contentType: "application/json; charset=utf-8",
	    async: false,
	    success: function(data) {
	    	return data["IDETIQUETARELACIONADA"];
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
	 $('#sel2Grupo').select2({
		placeholder: 'Seleccione un grupo',
		allowClear: true
	});
	$('#sel2Responsable').select2({
		placeholder: 'Seleccione un responsable',
		allowClear: true
	});

	$('#sel2Miembros').select2({
		placeholder: 'Seleccione miembros para el grupo',
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
		url : "../../api/PD_registraPublicacionxEtiqueta",
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
		url : "../../api/PD_registraPublicacionxAutor",
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
	myDropzone.on("successmultiple",function(file,response){
		alert("Publicación creada correctamente");
		IDGRUPO= getUrlParameters("id","",true);		
		window.location.href = "../Administracion_Usuario_Grupo/ViewListaPublicacionPorGrupo.html?id=" + IDGRUPO;
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

var gruposArchivo;
function guardarPublicacionxGrupo(data){
	var grupos=[];

	var idgrupo= getUrlParameters("id","",true);
	var ob;
	for (var i=0; i<1; i++) {
		ob={id:idgrupo}
		grupos.push(ob);
	}

	var obj= { idpublicacion:data["IDPUBLICACION"],
				grupos:grupos};
	gruposArchivo=grupos;			

	$.ajax({
		type: 'POST',
		url : "../../api/PD_registraPublicacionxGrupo",
		dataType: "json",
		data: JSON.stringify(obj),
		contentType: "application/json; charset=utf-8",
		success: function(data){
			return data["status"];			
		}
	});
}

function guardarCambios(){

	var answer = confirm("Desea crear la publicacion ?")
	if (answer){
		var obj = {};

		IDGRUPO= getUrlParameters("id","",true);
		obj["IDGRUPO"]= getUrlParameters("id","",true);
		obj["TITULO"]=$('#TITULO').val();
		obj["FUENTE"]=$('#FUENTE').val();
		obj["OBTENIDO"]=$('#OBTENIDO').val();
		//obj["ANIO"]=$('#ANIO').val();
		//obj["MES"]=$('#MES').val();
		obj["PAGINAS"]=$('#PAGINAS').val();
		obj["VOLUMEN"]=$('#VOLUMEN').val();
		obj["DOI"]=$('#DOI').val();
		obj["ISSN"]=$('#ISSN').val();
		obj["IDIDIOMA"]=$('#IDIOMA_SELECT').val();
		obj["IDTIPOPUBLICACION"]=$('#TIPOPUBLICACION_SELECT').val();
		obj["FECHAPUB"]=$('#FECHAPUB').val();
		obj["IDCREADOR"]=getId();
		obj["IDGRUPO"]=localStorage.idMiGrupo;
		obj["PAIS"]=$("#PAIS").val();
		obj["CIUDAD"]=$("#CIUDAD").val();

		if(!validarPublicacionGrupo(seleccionAutores)){
			return;
		}

		$.ajax({
			type: 'POST',
			url : "../../api/PD_registraPublicacion",
			dataType: "json",
			data: JSON.stringify(obj),
			contentType: "application/json; charset=utf-8",
			success: function(data){
				//guardar etiquetas, autores y archivos
				var status1=guardarPublicacionxEtiqueta(data); 
				var status2=guardarPublicacionxAutor(data);			
				var status3=guardarPublicacionxGrupo(data);
				if(myDropzone.getQueuedFiles()==0){
						alert("Publicación creada correctamente");
						window.location.href = "../Administracion_Usuario_Grupo/ViewListaPublicacionPorGrupo.html?id=" + IDGRUPO;
				} 
				else {
					guardarArchivos(data);
				}
			}
		});
	}
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

function guardarAutor(){

	/*obj["NOM_APE"] = $('#NOM_APE').val();
	obj["PAGINA_WEB"] = $('#PAGINA_WEB').val();
	obj["INSTITUCION"] = $('#INSTITUCION').val();
	obj["TRABAJO"] = $('#TRABAJO').val();

	if(!validarAutor()){
		return;
	}

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
	});*/
	
	var obj = {};
	var ruta = "";
	var callback;
	
	ruta = "../../api/AU_registraAutorIns3";
	obj["NOMBRE"] = $('#NOMBRE').val();
	obj["NOM_APE"] = $('#NOM_APE').val();
	obj["PAGINA_WEB"] = $('#PAGINA_WEB').val();
	obj["TRABAJO"] = $('#TRABAJO').val();	

	var parent= [];

	if(!validarAutor4(dameAutor())){
		return;
	}

	parent.push(dameAutor());
	var obj2 = $.extend({},obj,parent);

	console.log(obj2);
	console.log(JSON.stringify(obj2));
	$.ajax({
		type: 'POST',
		url : ruta,
		dataType: "json",
		data: JSON.stringify(obj2),
		contentType: "application/json; charset=utf-8",
		success: function (data){
			/*alert("El autor se agrego correctamente");
			window.location.href='../Publicacion_Documental/ViewListaAutores.html';*/
			$('#detalleAutor').modal('hide');
			$("#sel2Multi2").append('<option value="' + data.IDAUTOR + '">' + data.NOM_APE + '</option>');
		}
	});
	
	$('#NOMBRE').val("");
	$('#NOM_APE').val("");
	$('#PAGINA_WEB').val("");
	//$('#INSTITUCION').val("");
	$('#TRABAJO').val("");
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

function guardarInstitucion(){
	var obj = {};

	obj["INSTITUCION"] = $('#INSTITUCION').val();
	obj["NOM_INSTITUCION"] = $('#NOM_INSTITUCION').val();

	if(!validarInstitucionAU()){
		return;
	}

	$.ajax({
		type: 'POST',
		url : "../../api/AU_registraInstitucion2",
		dataType: "json",
		data: JSON.stringify(obj),
		contentType: "application/json; charset=utf-8",
		success: function(obj){
			$('#detalleInstitucion').modal('hide');
			$("#sel2Institucion").append('<option value="' + obj[0].IDINSTITUCION + '">' + obj[1].NOMBRE_INSTITUCION + '</option>');
		}
	});

	$('#INSTITUCION').val("");
	$('#NOM_INSTITUCION').val("");

}

function dameAutor(){
	//juntando los json
	
	var data = [];

	for (var i=0; i<seleccionInstituciones.length; i++) {
		data.push(seleccionInstituciones[i]["id"]);
	}
	
	return data;
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
			$("#sel2Responsable").empty();
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
			$("#sel2Miembros").empty();
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
			$("#sel2Grupo").empty();
			for (var i=0; i<data.length; i++) {
				$("#sel2Grupo").append('<option value="' + data[i].IDGRUPO + '">' + data[i].NOMBRE + '</option>');
			}
		}
	});
}

function iniciarNiceSelectBoxes(){
	$('#sel2').select2();

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
		placeholder: 'Seleccione un responsable',
		maximumSelectionSize: 1,
		allowClear: true
	});

	$('#sel2Miembros').select2({
		placeholder: 'Seleccione miembros para el grupo',
		allowClear: true
	});

	$('#sel2Institucion').select2({
		placeholder: 'Seleccione solo una institucion',
		maximumSelectionSize: 1,
		allowClear: true
	});
}

function cargarListaInstituciones(){

	//var IDUSUARIO=getId();
		var obj = {};
		//obj["IDUSUARIO"]=IDUSUARIO;
		//obj["IDGRUPO"]=getUrlParameters("id","",true);


		$.ajax({
			type: 'POST',
			url : '../../api/PD_listaInstitucion',
			dataType: "json",
			data: JSON.stringify(obj),
			contentType: "application/json; charset=utf-8",
			success: function(obj){
				$("#sel2Institucion").empty();
				for (var i=0; i<obj.length; i++) {
					$("#sel2Institucion").append('<option value="' + obj[i].IDINSTITUCION + '">' + obj[i].NOMBRE_INSTITUCION + '</option>');
				}
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
	    //acceptedFiles:'application/pdf',
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

$('#sel2Multi2').on('select2-open',function(){
	popularAutores();
});

var test3 = $('#sel2Grupo');
$(test3).change(function() {
    seleccionGrupos = ($(test3).select2('data'));
});

$('#sel2Grupo').on('select2-open',function(){
	cargaGrupos();
});

var test4 = $('#sel2Responsable');
$(test4).change(function() {
    seleccionResponsable = ($(test4).select2('data'));
});

$('#sel2Responsable').on('select2-open',function(){
	cargarListaPersonas1();
});

var test5 = $('#sel2Miembros');
$(test5).change(function() {
    seleccionMiembros = ($(test5).select2('data'));
});

$('#sel2Miembros').on('select2-open',function(){
	cargarListaPersonas2();
});

var test6 = $('#sel2Institucion');
$(test6).change(function() {
    seleccionInstituciones = ($(test6).select2('data'));
});

$('#sel2Institucion').on('select2-open',function(){
	cargarListaInstituciones();
});

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

var ididioma="1";
function cambioIdiomaCombo(){
	$("#selectIdiomaEtiqueta").change(function(){
		ididioma=$(this).val();
		popularEtiquetas(ididioma);
	});
}

function regresar(){

	IDGRUPO= getUrlParameters("id","",true);
	window.location.href = "../Administracion_Usuario_Grupo/ViewListaPublicacionPorGrupo.html?id=" + IDGRUPO;

}

$(document).ready(function(){
	//$('#FECHAPUB').datepicker({
	 // format: 'yyyy-mm-dd'
	//});
	$("#FECHAPUB").mask("99/9999");
	//$("#ISSN").mask("9999-9999");
	cargaHora();
	cambioIdiomaCombo();
	configurarDropzone();
	cargarListaPersonas1();
	cargarListaInstituciones();
	cargarListaPersonas2();
	cargaGrupos();
	popularSelectIdioma();
	popularSelectTipoPublicacion();
	iniciarNiceSelectBoxes();
	popularAutores();
	popularEtiquetas(ididioma);
	$("#guardar").click(guardarCambios);
	$("#limpiar").click(cleanInput);
	$("#guardarEtiqueta").click(guardarEtiqueta);
	$("#guardarAutor").click(guardarAutor);
	$("#guardarInstitucion").click(guardarInstitucion);
	$("#guardarGrupo").click(guardarGrupo);
	$("#regresar").click(regresar);

});