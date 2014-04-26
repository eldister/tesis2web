
$(document).ready(function(){

	$("#ingresar").click(ingresar);

	//$("#cerrar").click(resetForm);

});

function ingresar(){
	var username,password;
	username = $("#USERNAME").val();
	password = $("#PASSWORD").val();
	var obj={
		'USERNAME':username,
		'PASSWORD':password
	};


	$.ajax({
		type: 'POST',
		url : '../tesis2web/api/SE_login',
		dataType: "json",
		data:JSON.stringify(obj),
		contentType: "application/json; charset=utf-8",
		success: function(data){
			if(data["respuesta"]==1){ 
				alert("BIEN JUGADO");
				localStorage.setItem('uid',data["idusuario"]);
				//uid codigo de usuario en BD
				//redirigir a pagina correspondiente
			}
			else alert("Usuario o Contraseña Incorrectas");
		}
	});
}