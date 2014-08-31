function clearErrors(){
	$(".errorMsg").remove();
	$(".has-error").removeClass("has-error");
}

function addErrorMsg(elementId,message){
	var spanError = '<span class="errorMsg help-block" >'+message+'</span>';
	$('#'+elementId).parent().parent().addClass("has-error");
	$('#'+elementId).parent().parent().append(spanError);
}

function addErrorMsgSelect2(elementId,message){
	var spanError = '<span class="errorMsg help-block" style="color:#DD504C">'+message+'</span>';
	//$('#'+elementId).parent().parent().addClass("has-error");
	$('#'+elementId).append(spanError);
}

function validateMandatory(elementId, message){
	if ($('#'+elementId).val() == "" || $('#'+elementId).val() == null){
		addErrorMsg(elementId,message);
		return false;
	}
	return true;
}

function validateLength(elementId, minLength, maxLength, errorMsgMin, errorMsgMax){
	var text = $('#'+elementId).val();
	if(text.length < minLength){
		addErrorMsg(elementId,errorMsgMin);
		return false;
	}
	if(text.length > maxLength){
		addErrorMsg(elementId,errorMsgMax);
		return false;
	}
	return true;
}

function validateInteger(elementId , min, max, errorMsgRange, errorMsg){
	if ($('#'+elementId).val() == "") return true;
	var val = parseFloat($('#'+elementId).val());
	if(isNaN(val) ||  val % 1 != 0){
		addErrorMsg(elementId,errorMsg);
		return false;
	}
	if (val < min || val > max ){
		addErrorMsg(elementId,errorMsgRange);
		return false;
	}
	return true;
}

function validateFloat(elementId , min, max, errorMsgRange, errorMsg){
	if ($('#'+elementId).val() == "") return true;
	var val = parseFloat($('#'+elementId).val());
	if(isNaN(val)){
		addErrorMsg(elementId,errorMsg);
		return false;
	}
	if (val < min || val > max ){
		addErrorMsg(elementId,errorMsgRange);
		return false;
	}	
	return true;
}

function validateEmail(elementId, errorMsg){//beta!
	var val = $('#'+elementId).val();
	var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!re.test(val)){
    	addErrorMsg(elementId,errorMsg);
		return false;
    }
    return true;
}

function validateExtention(elementId, validExtentions ,errorMsg){
	var validList = validExtentions.split("|");
	var tokens = ($('#'+elementId)[0].files[0].name).split(".");
	var ext = tokens[tokens.length - 1];
	if(validList.indexOf(ext) == -1){
		addErrorMsg(elementId,errorMsg);
		return false;
	}
	return true;
}

function showAlert(formId ,valid, successMsg, errorMsg){
	$(".alert").remove();
	var divClass;
	var msg;
	if(valid){
		divClass = 'class="alert alert-success"';
		msg = successMsg;
	}
	else{
		divClass = 'class="alert alert-danger"';
		msg = errorMsg;
	}
	$("#"+formId).prepend('<div '+divClass+'>'+msg+'</div>');
}

function validateLengthCampoSelect(elementId,elementos,errorMsg){
	if(elementos.length===0){
		addErrorMsgSelect2(elementId,errorMsg);
		return false;
	}
	return true;
}

function validarUsuario(){
	clearErrors(); //limpiar los errores anteriores
	var camposValidos = true;//comenzar a validar campos 
	//la variable camposValidos siempre debe ir al final para evitar lazy evaluation
	camposValidos = validateMandatory("NOMBRES","El campo es obligatorio") && camposValidos;
	camposValidos = validateMandatory("APELLIDOS","El campo es obligatorio") && camposValidos;
	camposValidos = validateMandatory("CORREO_INSTITUCIONAL","El campo es obligatorio") && camposValidos;

	camposValidos = validateEmail("CORREO_INSTITUCIONAL","El formato de correo es inválido") && camposValidos;

	/*if (camposValidos)
		camposValidos = validateEmail("CORREO_ALTERNO","El formato de correo es inválido") && camposValidos;*/
	
	//camposValidos = validateInteger("MESES_TERMINAR",1,Number.POSITIVE_INFINITY,"Debe ingresar un número positivo","Debe ingresar un número entero") && camposValidos;
	
	return camposValidos;
}


function validarGrupo(responsable,miembros){
	clearErrors(); 
	var camposValidos = true;
	camposValidos = validateMandatory("NOMBRES","El campo es obligatorio") && camposValidos;
	camposValidos = validateLengthCampoSelect("s2id_sel2Multi1",responsable,"Debe seleccionar un responsable para el grupo") && camposValidos;
	camposValidos = validateLengthCampoSelect("s2id_sel2Multi2",miembros,"Debe seleccionar al menos un miembro para el grupo") && camposValidos;

	return camposValidos;
}

function validarInstitucion(){
	clearErrors(); 
	var camposValidos = true;
	camposValidos = validateMandatory("NOMBRE_INSTITUCION","El campo es obligatorio") && camposValidos;

	return camposValidos;
}

function validarFicha(grupo){
	clearErrors(); 
	var camposValidos = true;
	camposValidos = validateMandatory("ENCABEZADO","El campo es obligatorio") && camposValidos;
	camposValidos = validateLengthCampoSelect("s2id_sel2Grupo",grupo,"Debe seleccionar un grupo al menos") && camposValidos;

	return camposValidos;
}

function validarEtiqueta(idiomas){
	clearErrors(); 
	var camposValidos = true;

	//CAMBIO 27/08 solo el primer idioma (español)
	//for (var i=0; i<idiomas.length; i++) {
	camposValidos = validateMandatory("NOMBRE-"+idiomas[0].IDIDIOMA+"","El campo es obligatorio") && camposValidos;
	//}

	return camposValidos;
}

function validarEtiquetaInd(nombreEtiqueta){
	clearErrors(); 
	if ($(nombreEtiqueta).val() == "" || $(nombreEtiqueta).val() == null){
		var spanError = '<span class="errorMsg help-block" >El campo es obligatorio</span>';
		$(nombreEtiqueta).parent().parent().addClass("has-error");
		$(nombreEtiqueta).parent().parent().append(spanError);
		return false;
	}
	return true;
}


function validarGrupo2(responsable,miembros){
	clearErrors(); 
	var camposValidos = true;
	camposValidos = validateMandatory("NOMBRES","El campo es obligatorio") && camposValidos;
	camposValidos = validateLengthCampoSelect("s2id_sel2Responsable",responsable,"Debe seleccionar un responsable para el grupo") && camposValidos;
	camposValidos = validateLengthCampoSelect("s2id_sel2Miembros",miembros,"Debe seleccionar al menos un miembro para el grupo") && camposValidos;

	return camposValidos;
}

function validateLengthData(elementId,lista,message){
	if(listaLecturas.length==0){
		var spanError = '<span class="errorMsg help-block" style="color:#DD504C">'+message+'</span>';
		$('#'+elementId).append(spanError);
		return false;
	}
	return true;
}

function validarListaPublicacion(grupos,listaLecturas){
	clearErrors(); 
	var camposValidos = true;

	camposValidos = validateMandatory("Tema","El campo es obligatorio") && camposValidos;
	camposValidos = validateLengthCampoSelect("s2id_sel2grupo",grupos,"Debe seleccionar al menos un grupo") && camposValidos;
	camposValidos = validateLengthData("lectAsig",listaLecturas,"Debe agregar al menos una lectura") && camposValidos;

	return camposValidos;
}

function validateSeleccionLectura(checkedradio){
	if(checkedradio==null){
		var spanError = '<span class="errorMsg help-block" style="color:#DD504C">Debe agregar una lectura</span>';
		//$('#'+elementId).parent().parent().addClass("has-error");
		$('#criterioBusqueda2').parent().append(spanError);
		return false;
	} 
	return true;
}

function validarAgregarLectura(checkedradio){
	clearErrors(); 
	var camposValidos = true;
	camposValidos = validateMandatory("PALABRACLAVE","El campo es obligatorio") && camposValidos;
	camposValidos = validateSeleccionLectura(checkedradio) && camposValidos;

	return camposValidos;

}

function validarModificarLectura(){
	clearErrors(); 
	var camposValidos = true;
	camposValidos = validateMandatory("PALABRACLAVE","El campo es obligatorio") && camposValidos;

	return camposValidos;
}

function validarPublicacion(grupos,autores){
	clearErrors(); 
	var camposValidos = true;
	camposValidos = validateMandatory("TITULO","El campo es obligatorio") && camposValidos;
	camposValidos = validateMandatory("FUENTE","El campo es obligatorio") && camposValidos;
	camposValidos = validateMandatory("OBTENIDO","El campo es obligatorio") && camposValidos;
	camposValidos = validateMandatory("FECHAPUB","El campo es obligatorio") && camposValidos;
	//camposValidos = validateLengthCampoSelect("s2id_sel2Grupo",grupos,"Debe seleccionar al menos un grupo") && camposValidos;
	camposValidos = validateLengthCampoSelect("s2id_sel2Multi2",autores,"Debe seleccionar al menos un autor") && camposValidos;

	return camposValidos;
}	

function validarAutor(){
	clearErrors(); 
	var camposValidos = true;
	camposValidos = validateMandatory("NOM_APE","El campo es obligatorio") && camposValidos;
	//camposValidos = validateMandatory("PAGINA_WEB","El campo es obligatorio") && camposValidos;

	return camposValidos;
}

function validarIdioma(){
	clearErrors(); 
	var camposValidos = true;
	camposValidos = validateMandatory("NOMBRE","El campo es obligatorio") && camposValidos;

	return camposValidos;
}

function validarTipoFicha(){
	clearErrors(); 
	var camposValidos = true;
	camposValidos = validateMandatory("NOMBRE","El campo es obligatorio") && camposValidos;

	return camposValidos;
}

function validarTipoPublicacion(){
	clearErrors(); 
	var camposValidos = true;
	camposValidos = validateMandatory("NOMBRE","El campo es obligatorio") && camposValidos;

	return camposValidos;
}

function validarPermiso(){
	clearErrors(); 
	var camposValidos = true;
	camposValidos = validateMandatory("NOMBRE","El campo es obligatorio") && camposValidos;

	return camposValidos;
}

function validarBuscar(etiquetas){
	clearErrors(); 
	var camposValidos = true;
	camposValidos = validateLengthCampoSelect("s2id_sel2Multi1",etiquetas,"Debe seleccionar al menos una etiqueta") && camposValidos;
	return camposValidos;
}

function validarAutor2(responsable){
	clearErrors(); //limpiar los errores anteriores
	var camposValidos = true;//comenzar a validar campos 
	//la variable camposValidos siempre debe ir al final para evitar lazy evaluation
	camposValidos = validateMandatory("NOM_APE","El campo es obligatorio") && camposValidos;
	camposValidos = validateLengthCampoSelect("s2id_sel2Multi1",responsable,"Debe seleccionar una institucion") && camposValidos;
	/*if (camposValidos)
		camposValidos = validateEmail("CORREO_ALTERNO","El formato de correo es inválido") && camposValidos;*/
	
	//camposValidos = validateInteger("MESES_TERMINAR",1,Number.POSITIVE_INFINITY,"Debe ingresar un número positivo","Debe ingresar un número entero") && camposValidos;
	
	return camposValidos;
}

function validarInstitucionAU(){
	clearErrors(); //limpiar los errores anteriores
	var camposValidos = true;//comenzar a validar campos 
	camposValidos = validateMandatory("INSTITUCION","El campo es obligatorio") && camposValidos;
	return camposValidos;
}

function validarAutor3(responsable){
	clearErrors(); //limpiar los errores anteriores
	var camposValidos = true;//comenzar a validar campos 
	//la variable camposValidos siempre debe ir al final para evitar lazy evaluation
	camposValidos = validateMandatory("NOM_APE2","El campo es obligatorio") && camposValidos;
	camposValidos = validateLengthCampoSelect("s2id_sel2Multi1",responsable,"Debe seleccionar una institucion") && camposValidos;
	
	return camposValidos;
}