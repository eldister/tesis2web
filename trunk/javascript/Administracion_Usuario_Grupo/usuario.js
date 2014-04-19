
function cargaListaUsuario(data){

	for(var i=0; i < data.length ; i++){
		var fila = '<tr id=fila-'+ data[i]["IDUSUARIO"] +'>';
		for(key in data[i]){
				if(key==="IDUSUARIO"){
					fila+='<td style="display:none;">'
				}
				else if (key==="CORREO_ALTERNO"){
					fila+='<td style="display:none;">'
				}
				else if (key==="NUMERO_CELULAR"){
					fila+='<td style="display:none;">'
				}
				else if (key==="NUMERO_TEL_ALTERNO"){
					fila+='<td style="display:none;">'
				}
				else if (key==="CUENTA_SKYPE"){
					fila+='<td style="display:none;">'
				}
				else if (key==="MESES_TERMINAR"){
					fila+='<td style="display:none;">'
				}
				else if (key==="COMPROMISO"){
					fila+='<td style="display:none;">'
				}
				else
				fila += '<td class="text-center">'+data[i][key]+'</td>';
		}

		fila+= '<td style="width: 23%;padding-left: 30px;">'
		fila+= '<a   class="ver-usuario table-link" IDUSUARIO='+data[i]["IDUSUARIO"]+'><span class="fa-stack"><i class="fa fa-square fa-stack-2x"></i><i class="fa fa-search fa-stack-1x fa-inverse"></i></span></a>';
		fila+= '<a  href="ViewModificarUsuario.html"  class="modificar-usuario table-link" IDUSUARIO='+data[i]["IDUSUARIO"]+'><span class="fa-stack"><i class="fa fa-square fa-stack-2x"></i><i class="fa fa-pencil fa-stack-1x fa-inverse"></i></span></a>';
		fila+= '<a  class="eliminar-usuario table-link danger" IDUSUARIO='+data[i]["IDUSUARIO"]+'><span class="fa-stack"><i class="fa fa-square fa-stack-2x"></i><i class="fa fa-trash-o fa-stack-1x fa-inverse"></i></span></a>';


		fila += '</td></tr>';
		$('#listaUsuario').append(fila);
	}
	$(document).on('click', '.ver-usuario', verUsuario);
	$(document).on('click', '.modificar-usuario', modificarUsuario);
	$(document).on('click', '.eliminar-usuario', eliminarUsuario);
}

function verUsuario(){
	$(".selected").removeClass("selected");
	$(this).parent().parent().addClass("selected");
	var IDUSUARIO=this.getAttribute("IDUSUARIO");
	var obj;

	$.ajax({
		type: 'GET',
		url : '../../api/AU_getUsuario/'+ IDUSUARIO,
		dataType: "json",
		contentType: "application/json; charset=utf-8",
		success: function(data){ 
			$('#IDUSUARIO').val(data["IDUSUARIO"]);
			$('#NOMBRES').val(data["NOMBRES"]);
			$('#APELLIDOS').val(data["APELLIDOS"]);
			$('#CORREO_INSTITUCIONAL').val(data["CORREO_INSTITUCIONAL"]);
			$('#CORREO_ALTERNO').val(data["CORREO_ALTERNO"]);
			$('#NUMERO_CELULAR').val(data["NUMERO_CELULAR"]);
			$('#NUMERO_TEL_ALTERNO').val(data["NUMERO_TEL_ALTERNO"]);
			$('#CUENTA_SKYPE').val(data["CUENTA_SKYPE"]);
			$('#INSTITUCION').val(data["INSTITUCION"]);
			$('#MESES_TERMINAR').val(data["MESES_TERMINAR"]);
			$('#COMPROMISO').val(data["COMPROMISO"]);
			$('#NOMBRE').val(data["NOMBRE"]);
			$.post("http://localhost/tesis2web/front/administracion_usuario_grupo/ViewVerUsuario.html", data);
		}
	});

	
}

function modificarUsuario(){
	
}

function eliminarUsuario(){
	$(".selected").removeClass("selected");
	$(this).parent().parent().addClass("selected");
	var IDUSUARIO=this.getAttribute("IDUSUARIO");
	var obj;

	$.ajax({
		type: 'GET',
		url : '../../api/AU_getUsuario/'+ IDUSUARIO,
		dataType: "json",
		contentType: "application/json; charset=utf-8",
		success: function(data){ 
			$('#IDUSUARIO').val(data["IDUSUARIO"]);
			$('#NOMBRES').val(data["NOMBRES"]);
			$('#APELLIDOS').val(data["APELLIDOS"]);
			$('#CORREO_INSTITUCIONAL').val(data["CORREO_INSTITUCIONAL"]);
			$('#CORREO_ALTERNO').val(data["CORREO_ALTERNO"]);
			$('#NUMERO_CELULAR').val(data["NUMERO_CELULAR"]);
			$('#NUMERO_TEL_ALTERNO').val(data["NUMERO_TEL_ALTERNO"]);
			$('#CUENTA_SKYPE').val(data["CUENTA_SKYPE"]);
			$('#INSTITUCION').val(data["INSTITUCION"]);
			$('#MESES_TERMINAR').val(data["MESES_TERMINAR"]);
			$('#COMPROMISO').val(data["COMPROMISO"]);
			$('#NOMBRE').val(data["NOMBRE"]);
		}
	});
	$('#IDUSUARIO').prop('readOnly',true);
	$('#NOMBRES').prop('readOnly',true);
	$('#APELLIDOS').prop('readOnly',true);
	$('#CORREO_INSTITUCIONAL').prop('readOnly',true);
	$('#CORREO_ALTERNO').prop('readOnly',true);
	$('#NUMERO_CELULAR').prop('readOnly',true);
	$('#NUMERO_TEL_ALTERNO').prop('readOnly',true);
	$('#CUENTA_SKYPE').prop('readOnly',true);
	$('#INSTITUCION').prop('readOnly',true);
	$('#MESES_TERMINAR').prop('readOnly',true);
	$('#COMPROMISO').prop('readOnly',true);
	$('#NOMBRE').prop('readOnly',true);
	$('#detalleUsuario').removeClass('insertar');
	$('#detalleUsuario').removeClass('modificar');
	$('#detalleUsuario').removeClass('eliminar');
	$('#tituloBoton').html("Eliminar");
	$('#tituloModal').html("Eliminar Usuario");
	$('#detalleUsuario').addClass('eliminar');
	$('#detalleUsuario').modal('show');
}

function elimina(data){
	$('#detalleUsuario').modal('hide');	
	resetForm();
	$('#fila-'+data[0]["IDUSUARIO"]+'').remove();
	return false;
}


function guardarCambios(){
	var data = $(".form-control");
	var obj = {};
	
	obj["IDUSUARIO"]= IDUSUARIO.value;//hardcode!
	var ruta = "";
	var callback;
	
	if($('#detalleUsuario').hasClass("eliminar")){
		ruta = "../../api/AU_eliminaUsuario";
		callback = elimina;
	}

	$.ajax({
		type: 'POST',
		url : ruta,
		dataType: "json",
		data: JSON.stringify(obj),
		contentType: "application/json; charset=utf-8",
		success: callback
	});
}

function resetForm(){
	$("input.form-control").val("");
	$(".alert").remove();
}


function cargaElementos(){
	$.ajax({
		type: 'GET',
		url : '../../api/AU_getListaUsuario',
		dataType: "json",
		contentType: "application/json; charset=utf-8",
		success: cargaListaUsuario
	});
}

$(document).ready(function(){

	cargaElementos();

	$("#guardar").click(guardarCambios);

	$("#cerrar").click(resetForm);

	//$("#agregar").click(insertaCambiosFront);
});