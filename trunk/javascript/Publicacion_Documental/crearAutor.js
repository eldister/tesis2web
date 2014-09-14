
var seleccionResponsable=[];

var test = $('#sel2Multi1');
$(test).change(function() {
    seleccionResponsable = ($(test).select2('data')) ;
    dameResponsable();
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




function guardarCambios(){
	var answer = confirm("Desea crear el autor?")
	if (answer){
		var data = $(".form-control");
		var obj = {};
		var ruta = "";
		var callback;
		
		ruta = "../../api/AU_registraAutorIns";
		obj["NOMBRE"] = $('#NOMBRE').val();
		obj["NOM_APE"] = $('#NOM_APE').val();
		obj["PAGINA_WEB"] = $('#PAGINA_WEB').val();
		obj["TRABAJO"] = $('#TRABAJO').val();	

		var parent= [];

		if(!validarAutor2(dameResponsable())){
			return;
		}

		parent.push(dameResponsable());
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
				alert("El autor se agrego correctamente");
				window.location.href='../Publicacion_Documental/ViewListaAutores.html';
			}
		});
	}
	else{}
}
function borrar(){
	$("input").val("");
}

/*function getId(){
	if( localStorage.uid ){
	return IDUSUARIO = localStorage.uid;
	}
	else{
		return IDUSUARIO =1;
	}
}*/

function iniciarNiceSelectBoxes(){
	
	$('#sel2Multi1').select2({
		placeholder: 'Seleccione solo una institucion',
		maximumSelectionSize: 1,
		allowClear: true
	});
}

function cargarListaPersonas1(){

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
					$("#sel2Multi1").append('<option value="' + obj[i].IDINSTITUCION + '">' + obj[i].NOMBRE_INSTITUCION + '</option>');
				}
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
			$("#sel2Multi1").append('<option value="' + obj[0].IDINSTITUCION + '">' + obj[1].NOMBRE_INSTITUCION + '</option>');
		}
	});

	$('#INSTITUCION').empty();
	$('#NOM_INSTITUCION').empty();

}


$(document).ready(function(){
	iniciarNiceSelectBoxes();
	cargarListaPersonas1();
	
	$("#guardarCambios").click(guardarCambios);
	//$("#clear").click(borrar);
	$("#guardarInstitucion").click(guardarInstitucion);
});


