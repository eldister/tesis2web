<?php

	$app->get('/SE_getListaPermiso','getListaPermiso');
	$app->get('/SE_getPermiso/:id','getPermiso');
	$app->get('/SE_getPermisoUsuario/:id','getPermisoUsuario');
	$app->get('/SE_getFuncionalidadesPermiso/:id','getFuncionalidadesPermiso');
	$app->post('/SE_registrarPermiso','registrarPermiso');
	$app->post('/SE_modificarPermiso','modificarPermiso');
	$app->post('/SE_eliminarPermiso','eliminarPermiso');
	$app->get('/SE_validarEliminacionPermiso/:id','validarEliminacionPermiso');
	$app->get('/SE_getFuncionalidadUsuario/:id','getFuncionalidadUsuario');
	
?>