<?php

//DEFINIR CLASES MAPEADAS CON BD
class tipoficha {
		public $idtipoficha;
		public $nombre;
		public $descripcion;
		public $estado;
		
	function __construct($idtipoficha,$nombre, $descripcion, $estado) {
			$this->ididtipoficha=$idtipoficha;
			$this->nombre = $nombre;
			$this->descripcion = $descripcion;
			$this->estado = $estado;
			
		}
	}

?>