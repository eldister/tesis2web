<?php


	$app->post('/AU_getListaUsuario','getListaUsuario');
	$app->get('/AU_getUsuario/:id','getUsuario');
	$app->get('/AU_getUsuario2/:id','getUsuario2');
	$app->post('/AU_registraUsuario','registraUsuario');
	$app->post('/AU_modificaUsuario','modificaUsuario');
	$app->post('/AU_eliminaUsuario','eliminaUsuario');
	$app->get('/AU_getTipoUsuario','getTipoUsuario');
	$app->get('/AU_getInstituciones','getInstituciones');
	$app->get('/AU_getUsuario3/:id','getUsuario3');
	$app->post('/AU_modificaUsuario2','modificaUsuario2');

	$app->post('/encripta','encriptaAdmin');
?>