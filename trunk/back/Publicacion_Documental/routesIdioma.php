<?php


	$app->get('/PD_getListaIdioma','getListaIdioma');
	$app->get('/PD_getIdioma/:id','getIdioma');
	$app->post('/PD_registraIdioma','registraIdioma');
	$app->post('/AL_modificaIdioma','modificaIdioma');
	
?>