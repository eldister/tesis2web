<?php

//DEFINIR CLASES MAPEADAS CON BD
class tipopublicacion {
		public $id;
		public $nombre;
		public $descripcion;
		public $estado;
		
	function __construct($id,$nombre, $descripcion, $estado) {
			$this->id=$id;
			$this->nombre = $nombre;
			$this->descripcion = $descripcion;
			$this->estado = $estados;
			
		}
	}

?>