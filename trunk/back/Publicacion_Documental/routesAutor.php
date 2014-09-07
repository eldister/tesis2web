<?php


	$app->get('/PD_getListaAutor','getListaAutor');
	$app->get('/PD_getAutor/:id','getAutor');
	$app->post('/PD_registraAutor','registraAutor');
	$app->post('/PD_modificaAutor','modificaAutor');
	$app->post('/PD_eliminaAutor','eliminaAutor');
	

	$app->get('/PD_getAutor2/:id','getAutor2');
	$app->get('/PD_getAutor3/:id','getAutor3');
	$app->post('/PD_listaInstitucion','listaPublicacionAU');
	$app->post('/AU_registraAutorIns','registraAutorIns');
	$app->post('/AU_registraAutorIns2','registraAutorIns2');
	$app->post('/AU_registraInstitucion2','registraInstitucion2');
	$app->post('/PD_modificaAutor2','modificaAutor2_institucion');


?>