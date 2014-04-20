<?php


	$app->get('/AU_getListaInstitucion','getListaInstitucion');
	$app->get('/AU_getInstitucion/:id','getInstitucion');
	$app->post('/AU_registraInstitucion','registraInstitucion');
	$app->post('/AU_modificaInstitucion','modificaInstitucion');
	$app->post('/AU_eliminaInstitucion','eliminaInstitucion');
	
?>