<?php


	$app->get('/AU_getListaUsuario','getListaUsuario');
	$app->get('/AU_getUsuario/:id','getUsuario');
	$app->post('/AU_registraUsuario','registraUsuario');
	$app->post('/AU_modificaUsuario','modificaUsuario');
	$app->post('/AU_eliminaUsuario','eliminaUsuario');
	$app->get('/AU_getTipoUsuario','getTipoUsuario');

	
?>