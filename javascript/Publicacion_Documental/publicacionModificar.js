var seleccionAutores=[];
var seleccionEtiquetas=[];
var idpublicacion=getUrlParameters("idpublicacion", "", true);
var seleccionGrupos=[];
var seleccionResponsable=[];
var seleccionMiembros=[];
var seleccionInstituciones=[];
var myDropzone;

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
				titulo:data["TITULO"],
				ididioma:data["IDIDIOMA"],
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
	myDropzone.on("successmultiple",function(file,response){
		alert("Publicación modificada correctamente");
		window.location.href='ViewListaPublicacion.html';
	});
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

	if(!validarPublicacion(seleccionGrupos,seleccionAutores)){
		return;
	}

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
			if(myDropzone.getQueuedFiles()==0){
					alert("Publicación modificada correctamente");
					window.location.href='ViewListaPublicacion.html';
			} 
			else {
				guardarArchivos(data);
			}
		}
	});
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
			for (var i=0; i<obj.length; i++) {
				$("#sel2Institucion").append('<option value="' + obj[i].IDINSTITUCION + '">' + obj[i].NOMBRE_INSTITUCION + '</option>');
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

	$('#sel2Institucion').select2({
		placeholder: 'Seleccione solo una institucion',
		maximumSelectionSize: 1,
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
			$('#FECHAPUB').val(data["MES"]);
			$('#PAGINAS').val(data["PAGINAS"]);
			$('#VOLUMEN').val(data["VOLUMEN"]);
			$('#DOI').val(data["DOI"]);
			$('#ISSN').val(data["ISSN"]);
			$('#IDIOMA_SELECT').val(data["IDIDIOMA"]);
			$('#TIPOPUBLICACION_SELECT').val(data["IDTIPOPUBLICACION"]);
			$('#PAIS').val(data["PAIS_PUBLI"]);
			$('#CIUDAD').val(data["CIUDAD_PUBLI"]);
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
		     	$("#sel2Multi2").append('<option value="' + data[i].IDAUTOR + '">' + data[i].NOMBRE+" "+ data[i].NOM_APE + '</option>');
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

var test6 = $('#sel2Institucion');
$(test6).change(function() {
    seleccionInstituciones = ($(test6).select2('data'));
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

function cargaArchivos(data){

	if(data.length===0){
		$('#archivosTitulo').hide();
		$('#divArchivos').attr("style","display:none");
	}
	
	for(var i=0; i < data.length ; i++){
		var fila = '';
		if(data[i]["FORMATO"]==="application/force-download" || data[i]["FORMATO"]==="application/pdf"){ 
			fila = '<li class="list-group-item" id="fila-'+data[i]["IDARCHIVO"]+'"><span class="badge badge-danger"><a class="eliminar-archivo btn-link danger" idarchivo="'+data[i]["IDARCHIVO"]+'" url="'+data[i]["URL"]+'">';
			fila += '<span class="fa-stack"><i class="fa fa-trash-o fa-stack-1x fa-inverse"></i></span></a></span>';				
			fila += '<span class="badge badge-primary"><a class="ver-archivo btn-link danger" url="'+data[i]["URL"]+'">';
			fila += '<span class="fa-stack"><i class="fa fa-search fa-stack-1x fa-inverse"></i></span></a></span><h6 id="nomArchivo">'+data[i]["NOMBRE"]+'<h6></li>';	

			$('#listaArchivos').append(fila);
		}
		else{
			fila = '<li class="list-group-item" id="fila-'+data[i]["IDARCHIVO"]+'">';
			fila +='<span class="badge badge-danger"><a class="eliminar-archivo btn-link danger" idarchivo="'+data[i]["IDARCHIVO"]+'" url="'+data[i]["URL"]+'">';
			fila +='<span class="fa-stack"><i class="fa fa-trash-o fa-stack-1x fa-inverse"></i></span></a></span>';
			fila +='<span class="badge badge-primary"><a href="../'+data[i]["URL"]+'" target="_blank">';
			fila +='<span class="fa-stack"><i class="fa fa-download fa-stack-1x fa-inverse"></i></span></a></span>';
			fila +='<h6 id="nomArchivo">'+data[i]["NOMBRE"]+'<h6></li>';	
			$('#listaArchivos').append(fila);
		}
	}

	$(document).on('click', '.eliminar-archivo', eliminarArchivo);
	$(document).on('click', '.ver-archivo', verArchivo);
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

function llenarArchivos(){
	$.ajax({
		type: 'GET',
		url : '../../api/PD_getArchivosPublicacion/'+idpublicacion,
		dataType: "json",
		contentType: "application/json; charset=utf-8",
		success: cargaArchivos
	});
}

var ididioma="1";
function cambioIdiomaCombo(){
	$("#selectIdiomaEtiqueta").change(function(){
		ididioma=$(this).val();
		popularEtiquetas(ididioma);
	});
}

$(document).ready(function(){
	idpublicacion = getUrlParameters("idpublicacion","", true);	
	//$('#FECHAPUB').datepicker({
	  //format: 'yyyy-mm-dd'
	//});
	//$("#FECHAPUB").mask("99/9999");
	//$("#ISSN").mask("9999-9999");
	cargaHora();
	cambioIdiomaCombo();
	configurarDropzone();
	cargarListaInstituciones();
	cargarListaPersonas1();
	cargarListaPersonas2();
	cargaGrupos();
	popularSelectIdioma();
	popularSelectTipoPublicacion();
	iniciarNiceSelectBoxes();
	popularAutores();
	popularEtiquetas(ididioma);
	llenarArchivos();
	setTimeout(llenarCampos,20);
	setTimeout(setCamposGrupos,300);
	setTimeout(setCamposEtiquetas,100);
	setTimeout(setCamposAutor,200);

	$("#guardar").click(guardarCambios);
	//$("#limpiar").click(cleanInput);
	$("#guardarEtiqueta").click(guardarEtiqueta);
	$("#guardarAutor").click(guardarAutor);
	$("#guardarInstitucion").click(guardarInstitucion);
	$("#guardarGrupo").click(guardarGrupo);

});