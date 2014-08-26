function cargaElementos(data){

	for(var i=0; i < data.length ; i++){
		var fila = '<tr id=fila-'+ data[i]["IDFICHABIB"] +'>';
		fila +='<td style="display:none;">';
		fila += '<td class="text-center">'+data[i]["TITULO_PUBLICACION"]+'</td>';
		fila += '<td class="text-center">'+data[i]["ENCABEZADO"]+'</td>';
		fila += '<td class="text-center">'+data[i]["TIPO"]+'</td>';
		fila += '<td class="text-center">'+data[i]["USUARIO"]+'</td>';		
		fila += '<td style="width: 23%;padding-left: 30px;">'
		fila+= '<a class="ver-ficha table-link" href="ViewVerFicha.html?idficha='+data[i]["IDFICHABIB"]+'"><span class="fa-stack"><i class="fa fa-square fa-stack-2x"></i><i class="fa fa-search-plus fa-stack-1x fa-inverse"></i></span></a>';
		fila+= '<a class="modificar-ficha table-link" href="ViewModificarFicha.html?idficha='+data[i]["IDFICHABIB"]+'"><span class="fa-stack"><i class="fa fa-square fa-stack-2x"></i><i class="fa fa-pencil fa-stack-1x fa-inverse"></i></span></a>';
		fila+= '<a class="eliminar-ficha table-link danger" idpublicacion='+data[i]["IDFICHABIB"]+'><span class="fa-stack"><i class="fa fa-square fa-stack-2x"></i><i class="fa fa-trash-o fa-stack-1x fa-inverse"></i></span></a>';
		fila += '</td></tr>';
		$('#listaFicha').append(fila);
		$('#listaFicha').trigger("update");
	}
	$(document).on('click', '.eliminar-ficha', eliminarFicha);
}

function eliminarFicha(){
	$(".selected").removeClass("selected");
	$(this).parent().parent().addClass("selected");
	var idtipo=this.getAttribute("idpublicacion");
	var obj;

	$.ajax({
		type: 'GET',
		url : '../../api/PD_getFicha/'+ idtipo,
		dataType: "json",
		contentType: "application/json; charset=utf-8",
		success: function(data){
			$('#IDFICHA').val(idtipo);
			$('#TITULO').val(data["ENCABEZADO"]);
			$('#TIPOFICHA').val(data["TIPO"]);
			$('#CREADOR').val(data["USUARIO"]);			
		}
	});
	$('#TITULO').attr('readOnly',true);
	$('#TIPOFICHA').attr('readOnly',true);
	$('#CREADOR').attr('readOnly',true);
	$('#detalleFicha').removeClass('insertar');
	$('#detalleFicha').removeClass('modificar');
	$('#detalleFicha').removeClass('eliminar');
	$('#tituloModal').html("Eliminar Publicacion");
	$('#tituloBoton').html("Eliminar");
	$('#detalleFicha').addClass('eliminar');
	$('#detalleFicha').modal('show');
}

function elimina(data){
	$('#detalleFicha').modal('hide');	
	resetForm();
	$('#fila-'+data["IDFICHABIB"]+'').remove();
	$('#listaFicha').trigger("update");
	return false;
}

function resetForm(){
	$('#TITULO').attr('readOnly',false);
	$('#TIPOFICHA').attr('readOnly',false);
	$('#CREADOR').attr('readOnly',false);
	$("input.form-control").val("");
	$(".alert").remove();
}

function guardarCambios(){
	
	var obj = {};

	obj["IDFICHABIB"]= $('#IDFICHA').val();
	var ruta = "";
	var callback;

	if($('#detalleFicha').hasClass("eliminar")){
		ruta = "../../api/PD_eliminaFicha";
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

function getId(){
	if( localStorage.uid ){
		return IDUSUARIO = localStorage.uid;
	}
	else{
		return IDUSUARIO = 1;
	}
}

function cargaListaFicha(){
	var obj={idusulogueado:getId(),
			 idMiGrupo:localStorage.idMiGrupo 
			};

	$.ajax({
		type: 'POST',
		url : '../../api/PD_getListaFicha',
		dataType: "json",
		data: JSON.stringify(obj),
		contentType: "application/json; charset=utf-8",
		success: cargaElementos
	});
	$("table#tabla").tablesorter({ widthFixed: true, sortList: [[0, 0]] })
       .tablesorterPager({ container: $("#pager"), size: $(".pagesize option:selected").val() });
}

$(document).ready(function(){
	cargaListaFicha();
	$("#guardar").click(guardarCambios);
	$("#cerrar").click(resetForm);

});