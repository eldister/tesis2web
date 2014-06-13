
var seleccionResponsable;
var seleccionMiembros;


var test = $('#sel2Multi1');
$(test).change(function() {
    seleccionResponsable = ($(test).select2('data')) ;
    dameResponsable();
});

var test2 = $('#sel2Multi2');
$(test2).change(function() {
    seleccionMiembros = ($(test2).select2('data')) ;
    dameMiembros();
});

function dameResponsable(){
	//juntando los json
	
	var data = [];

	for (var i=0; i<seleccionResponsable.length; i++) {
		data.push(seleccionResponsable[i]["id"]);
	}
	
	console.log(data);
	console.log(JSON.stringify(data));
	return data;
}

function dameMiembros(){
	//juntando los json
	var data = [];

	for (var i=0; i<seleccionMiembros.length; i++) {
		data.push(seleccionMiembros[i]["id"]);
	}
	
	console.log(data);
	console.log(JSON.stringify(data));
	return data;
}

function getGrupo(){
	if( localStorage.uid ){
	return IDGRUPO = (localStorage.idGrupo)*1;
	}
	else{
		return IDGRUPO =1;
	}
}

function guardarCambios(){

	var data = $(".form-control");
	var obj = {};
	
	obj["IDGRUPO_PADRE"]=getGrupo();
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

	console.log(obj2);
	console.log(JSON.stringify(obj2));
	$.ajax({
		type: 'POST',
		url : ruta,
		dataType: "json",
		data: JSON.stringify(obj2),
		contentType: "application/json; charset=utf-8",
		success: function (data){
			alert("El grupo se creoCorrectamente");
			window.location.href='../Administracion_Usuario_Grupo/ViewListaGrupo.html';
		}
	});
}

function borrar(){
	$("input").val("");
}

function getId(){
	if( localStorage.uid ){
	return IDUSUARIO = localStorage.uid;
	}
	else{
		return IDUSUARIO =1;
	}
}

function iniciarNiceSelectBoxes(){
	
	$('#sel2Multi1').select2({
		placeholder: 'Seleccione solo un usuario',
		maximumSelectionSize: 1,
		allowClear: true
	});

	$('#sel2Multi2').select2({
		placeholder: 'Seleccione los usuarios',
		allowClear: true
	});
}

function cargarListaPersonas1(){
	/*var obj = {};
	var IDUSUARIO=getId();

	$.ajax({
		type: 'GET',
		url : '../../api/AU_getListaPersonas/'+IDUSUARIO,
		dataType: "json",
		data: JSON.stringify(obj),
		contentType: "application/json; charset=utf-8",
		success: function(obj){
			for (var i=0; i<obj.length; i++) {
				$("#sel2Multi1").append('<option value="' + obj[i].IDUSUARIO + '">' + obj[i].NOMBRE + '</option>');
			}
		}
	});*/

	var IDUSUARIO=getId();
		var obj = {};
		obj["IDUSUARIO"]=IDUSUARIO;
		//obj["IDGRUPO"]=getUrlParameters("id","",true);


		$.ajax({
			type: 'POST',
			url : '../../api/AU_getGPersonas4',
			dataType: "json",
			data: JSON.stringify(obj),
			contentType: "application/json; charset=utf-8",
			success: function(obj){
				for (var i=0; i<obj.length; i++) {
					$("#sel2Multi1").append('<option value="' + obj[i].IDUSUARIO + '">' + obj[i].NOMBRES + '</option>');
				}
			}
		});
}

function cargarListaPersonas2(){
	/*var obj = {};
	var IDUSUARIO=getId();

	$.ajax({
		type: 'GET',
		url : '../../api/AU_getListaPersonas/'+IDUSUARIO,
		dataType: "json",
		data: JSON.stringify(obj),
		contentType: "application/json; charset=utf-8",
		success: function(obj){
			for (var i=0; i<obj.length; i++) {
				$("#sel2Multi2").append('<option value="' + obj[i].IDUSUARIO + '">' + obj[i].NOMBRE + '</option>');
			}
		}
	});*/
	var IDUSUARIO=getId();
		var obj = {};
		obj["IDUSUARIO"]=IDUSUARIO;
		//obj["IDGRUPO"]=getUrlParameters("id","",true);


		$.ajax({
			type: 'POST',
			url : '../../api/AU_getGPersonas4',
			dataType: "json",
			data: JSON.stringify(obj),
			contentType: "application/json; charset=utf-8",
			success: function(obj){
				for (var i=0; i<obj.length; i++) {
					$("#sel2Multi2").append('<option value="' + obj[i].IDUSUARIO + '">' + obj[i].NOMBRES + '</option>');
				}
			}
		});
}

function cargaHora(){

	/*var dateObj = new Date();
    var month = dateObj.getUTCMonth();
    var day = dateObj.getUTCDate();
    var year = dateObj.getUTCFullYear();
    var newdate = day  + "/" + month + "/" + year;
    $('#FECHA_CREACION').val(newdate);*/



    var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth()+1; //January is 0!
	var yyyy = today.getFullYear();

	if(dd<10) {
	    dd='0'+dd
	} 

	if(mm<10) {
	    mm='0'+mm
	} 

	today = dd+'/'+mm+'/'+yyyy;
	$('#FECHA_CREACION').val(today);
	//document.write(today);


}

$(document).ready(function(){
	iniciarNiceSelectBoxes();
	cargarListaPersonas1();
	cargarListaPersonas2();
	cargaHora();
	
	$("#guardarCambios").click(guardarCambios);
	$("#clear").click(borrar);
});


