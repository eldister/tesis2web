<?php


	$app->post('/AU_getListaGrupo','getListaGrupo');
	//$app->get('/AU_getInstitucion/:id','getInstitucion');
	$app->post('/AU_registraGrupo','registraGrupo');
	$app->get('/AU_getListaPersonas/:id','getListaPersonas');
	$app->get('/AU_damePadre/:id','damePadre');
	$app->post('/AU_getPadre','damePadreQueVeo');
	$app->get('/AU_damePermiso/:id','damePermiso2');
?>