<?php


	$app->get('/PD_getListaAutor','getListaAutor');
	$app->get('/PD_getAutor/:id','getAutor');
	$app->post('/PD_registraAutor','registraAutor');
	$app->post('/PD_modificaAutor','modificaAutor');
	$app->post('/PD_eliminaAutor','eliminaAutor');
	
?>