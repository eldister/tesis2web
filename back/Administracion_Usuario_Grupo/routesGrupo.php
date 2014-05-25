<?php


	$app->post('/AU_getListaGrupo','getListaGrupo');
	//$app->get('/AU_getInstitucion/:id','getInstitucion');
	$app->post('/AU_registraGrupo','registraGrupo');
	$app->get('/AU_getListaPersonas/:id','getListaPersonas');
	$app->get('/AU_damePadre/:id','damePadre');
	$app->post('/AU_getPadre','damePadreQueVeo');
	$app->get('/AU_damePermiso/:id','damePermiso2');
	$app->post('/AU_getListaIntegrantes','dameListaIntegrantes');
	$app->post('/AU_getGrupo','dameGrupo');
	$app->post('/AU_getGrupo2','dameGrupo2');
	$app->post('/AU_getGPersonas2','damePersonas2');
	$app->post('/AU_modificaGrupo','modificaGrupo');
	$app->post('/AU_getGPersonas3','damePersonas3');
	$app->post('/AU_getGPersonas4','damePersonas4');
	$app->post('/AU_getListaPublicacion/:id','getListaPublicacionesN');
	$app->post('/AU_dameResponsable','dameResponsableN');
	$app->post('/AU_eliminaPublicacionXGrupo','eliminaPublicacionXGrupo');
	$app->post('/AU_eliminaGrupo','eliminarGrupoN');
?>