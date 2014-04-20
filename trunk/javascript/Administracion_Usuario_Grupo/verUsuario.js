

 function getURLvar(var_name){
          var re = new RegExp(var_name + "(?:=([^&]*))?", "i");
          var pm = re.exec(decodeURIComponent(location.search));
          if(pm === null) return undefined;
          return pm[1] || "";
 } //- See more at: http://www.phonegapspain.com/topic/pasar-datos-por-get-con-javascript/#sthash.5EUVoHjY.dpuf


function verUsuario(){
//	$(".selected").removeClass("selected");
//	$(this).parent().parent().addClass("selected");
	var IDUSUARIO=getURLvar();
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

}

$(document).ready(function(){

	verUsuario();

});