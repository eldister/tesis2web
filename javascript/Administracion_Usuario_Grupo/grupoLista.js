
var idpadre;
var idpermiso;

function cargaListaGrupo(data){

	//SE PASA:  IDGRUPO, NOMBRE,IDGRUPO_PADRE,IDRESPONSABLE,CANTIDAD
	if(getIdGrupo()=="1") {
		$('#regresar').hide();
	}
	else{
		$('#regresar').show();
	}
	
	//SI ES EL ADMINISTRADOR Y SE ENCUENTRA EN LA PRIMERA RAIZ QUE APARESCA EL BOTON DE CREAR GRUPO ARRIBA
	if((idpermiso=="1")&&(getIdGrupo()=="1")){
		$('#creaGrupo').show();
	}
	else{
		$('#creaGrupo').hide();
	}
	
	for(var i=0; i < data.length ; i++){
		var fila = '<tr id=fila-'+ data[i]["IDGRUPO"] +'>';

		if(data[i]["HIJOS"]>0){
			if((data[i]["IDRESPONSABLE"]==getId())||(idpermiso=="1")){
				fila+= '<td class="text-center" style="width: 10%;padding-left: 30px;"><a class="ir-grupo table-link text-center" IDGRUPO='+data[i]["IDGRUPO"]+'><img src="../../template/img/folder2.png" height="55" width="70"></a></td>';
			}
			else
			{
				fila+= '<td class="text-center" style="width: 10%;padding-left: 30px;"><a class="ir-grupo table-link text-center" IDGRUPO='+data[i]["IDGRUPO"]+'><img src="../../template/img/folder_NR.png" height="55" width="70"></a></td>';
			}
		}
		else if(data[i]["HIJOS"]==0){
			if((data[i]["IDRESPONSABLE"]==getId())||(idpermiso=="1")){
				fila+= '<td class="text-center" style="width: 10%;padding-left: 30px;"><a class="table-link text-center" IDGRUPO='+data[i]["IDGRUPO"]+'><img src="../../template/img/folder2.png" height="55" width="70"></a></td>';
			}
			else{
				fila+= '<td class="text-center" style="width: 10%;padding-left: 30px;"><a class="table-link text-center" IDGRUPO='+data[i]["IDGRUPO"]+'><img src="../../template/img/folder_NR.png" height="55" width="70"></a></td>';
			}
		}

		for(key in data[i]){
				if(key==="IDGRUPO"){
					fila+='<td style="display:none;">'
				}
				else if (key==="IDGRUPO_PADRE"){
					fila+='<td style="display:none;">'
				}
				else if (key==="IDRESPONSABLE"){
					fila+='<td style="display:none;">'
				}
				else if (key==="HIJOS"){
					fila+='<td style="display:none;">'
				}
				else
				fila += '<td class="text-center">'+data[i][key]+'</td>';
		}

		fila+= '<td class="text-center" style="width: 10%;padding-left: 30px;"> <a  class="ver-listaUsuario table-link" IDGRUPO='+data[i]["IDGRUPO"]+'><img src="../../template/img/folder_people.png" height="55" width="70"></a></td>';
		fila+= '<td class="text-center" style="width: 10%;padding-left: 30px;"> <a  class="ver-listaPublicacion table-link" IDGRUPO='+data[i]["IDGRUPO"]+'><img src="../../template/img/folder_file.png" height="55" width="70"></a></td>';
		fila+= '<td style="width: 23%;padding-left: 30px;">'
		fila+= '<a  href="ViewVerGrupo.html?id='+data[i]["IDGRUPO"]+'" class="ver-usuario table-link" IDGRUPO='+data[i]["IDGRUPO"]+'><span class="fa-stack"><i class="fa fa-square fa-stack-2x"></i><i class="fa fa-search fa-stack-1x fa-inverse"></i></span></a>';
		if((data[i]["IDRESPONSABLE"]==getId()) || (idpermiso=="1")){
			fila+= '<a  href="ViewModificarGrupo.html?id='+data[i]["IDGRUPO"]+'" class="modificar-grupo table-link" IDGRUPO='+data[i]["IDGRUPO"]+'><span class="fa-stack"><i class="fa fa-square fa-stack-2x"></i><i class="fa fa-pencil fa-stack-1x fa-inverse"></i></span></a>';
		}
		if((data[i]["IDRESPONSABLE"]==getId()) || (idpermiso=="1")){
			fila+= '<a  class="eliminar-grupo table-link danger" IDGRUPO='+data[i]["IDGRUPO"]+'><span class="fa-stack"><i class="fa fa-square fa-stack-2x"></i><i class="fa fa-trash-o fa-stack-1x fa-inverse"></i></span></a>';
		}	
		if((data[i]["IDRESPONSABLE"]==getId()) || (idpermiso=="1")){
			fila+= '<a   type="button" class="crear-grupo btn btn-primary pull-right" style="padding-left: 5px;padding-right: 5px;padding-top: 3px;padding-bottom: 3px;border-left-width: 10px;width: 80px;" IDGRUPO='+data[i]["IDGRUPO"]+'><i class="fa fa-plus-circle fa-lg"></i><span>Grupo</span></a>';
		}

		
		fila += '</td></tr>';
		$('#listaGrupo').append(fila);
	}
	$(document).on('click', '.ver-listaUsuario', verListaUsuario);
	$(document).on('click', '.ver-listaPublicacion', verListaPublicacion);
	$(document).on('click', '.eliminar-grupo', eliminarGrupo);
	$(document).on('click','.ir-grupo',pasarALosHijos); //NO OLVIDAR PUNTO :p
	$(document).on('click', '.crear-grupo', crearGrupo2);
	
}

function crearGrupo2(){
	$(".selected").removeClass("selected");
	$(this).parent().parent().addClass("selected");
	var IDGRUPO=this.getAttribute("IDGRUPO");

	localStorage.setItem('idGrupo',IDGRUPO);
	window.location.href='../Administracion_Usuario_Grupo/ViewCrearGrupo.html';
}

function verListaPublicacion(){
	$(".selected").removeClass("selected");
	$(this).parent().parent().addClass("selected");
	var IDGRUPO=this.getAttribute("IDGRUPO");

	//localStorage.setItem('idGrupo',IDGRUPO);
	//window.location.href='../Administracion_Usuario_Grupo/ViewListaPublicacionPorGrupo.html?id='+IDGRUPO;
	window.location.href = "../Administracion_Usuario_Grupo/ViewListaPublicacionPorGrupo.html?id=" + IDGRUPO;
}

function verListaUsuario(){
	$(".selected").removeClass("selected");
	$(this).parent().parent().addClass("selected");
	var IDGRUPO=this.getAttribute("IDGRUPO");
	var obj={};

	obj["IDUSUARIO"]=getId();
	obj["IDGRUPO"]=IDGRUPO*1;

	$.ajax({
		type: 'POST',
		url : '../../api/AU_getListaIntegrantes',
		dataType: "json",
		data: JSON.stringify(obj),
		contentType: "application/json; charset=utf-8",
		success: function(data){
			
			for(var i=0; i < data.length ; i++){
				var fila = '<tr>';
				for(key in data[i]){
					fila += '<td class="text-center">'+data[i][key]+'</td>';
				}
				fila += '</td></tr>';
				$('#listaUsuarios').append(fila);
			}
		}
	});

	$('#detalleGrupo').modal('show');
}

function pasarALosHijos(){
	$(".selected").removeClass("selected");
	$(this).parent().parent().addClass("selected");
	var IDGRUPO1=this.getAttribute("IDGRUPO");
	localStorage.setItem('idGrupo',IDGRUPO1);
	window.location.href='../Administracion_Usuario_Grupo/ViewListaGrupo.html';
	//location.attr('href','../tesis2web/front/administracion_usuario_grupo/viewListaGrupo.html');
} 

function eliminarGrupo(){
	$(".selected").removeClass("selected");
	$(this).parent().parent().addClass("selected");
	var IDGRUPO=this.getAttribute("IDGRUPO");
	var obj={};
	obj["IDGRUPO"]= IDGRUPO;

	var answer = confirm("Desea eliminar el grupo?")
	if (answer){
		$.ajax({
			type: 'POST',
			url : '../../api/AU_eliminaGrupo',
			dataType: "json",
			data: JSON.stringify(obj),
			contentType: "application/json; charset=utf-8",
			success: function(data){ 
				window.location.href='../Administracion_Usuario_Grupo/ViewListaGrupo.html';
				$('#fila-'+IDGRUPO+'').remove();
				alert("Se elimino correctamente el grupo");
			}
		});
		//window.location.href='../Administracion_Usuario_Grupo/ViewListaGrupo.html';
	}
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
	$("#listaUsuarios").empty();
	//$(".alert").remove();
}

function getId(){
	if( localStorage.uid ){
	return IDUSUARIO = (localStorage.uid)*1;
	}
	else{
		return IDUSUARIO =1;
	}
}

function getIdGrupo(){
	if( localStorage.idGrupo ){
	return IDGRUPO_PADRE = (localStorage.idGrupo)*1;
	}
	else{
		return IDGRUPO_PADRE =1;
	}
}

function cargaElementos(){
	var obj = {};
	obj["IDUSUARIO"]= getId();
	//obj["IDPADRE"] = $('#IDGRUPO').val();
	obj["IDPADRE"] = getIdGrupo();

	$.ajax({
		type: 'POST',
		url : '../../api/AU_getListaGrupo',
		dataType: "json",
		data: JSON.stringify(obj),
		contentType: "application/json; charset=utf-8",
		success: cargaListaGrupo
	});
}



function damePadre(){
	var obj = {};

	obj["IDUSUARIO"]= getId();
	obj["IDGRUPO"] = getIdGrupo();

	$.ajax({
		type: 'POST',
		url : '../../api/AU_getPadre',
		dataType: "json",
		data: JSON.stringify(obj),
		contentType: "application/json; charset=utf-8",
		success: function(data){
			idpadre=data["IDGRUPO"];
		}
	});
	return idpadre;
}	


function damePermiso(){
	var obj = {};

	obj["IDUSUARIO"]= getId();

	$.ajax({
		type: 'GET',
		url : '../../api/AU_damePermiso/'+getId(),
		dataType: "json",
		data: JSON.stringify(obj),
		contentType: "application/json; charset=utf-8",
		success: function(data){
			idpermiso=data["IDPERMISO"];
		}
	});
	return idpermiso;
}		

function regresaGrupo(){
	var obj = {};
	obj["IDPADRE"] = idpadre;
	
	localStorage.setItem('idGrupo',obj["IDPADRE"]);
	window.location.href='../Administracion_Usuario_Grupo/ViewListaGrupo.html';
}

$(document).ready(function(){

	idpadre = damePadre();
	idpermiso = damePermiso();
	setTimeout(cargaElementos,250);

	
	//$("#guardar").click(guardarCambios);

	$("#cerrar").click(resetForm);

	$('#regresar').click(regresaGrupo);
});