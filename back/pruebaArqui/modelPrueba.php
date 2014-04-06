<?php

//DEFINIR CLASES MAPEADAS CON BD
class usuario {
		public $id;
		public $nombre;
		public $apellido;
		public $correo;
		
	function __construct($id,$nombre, $apellido, $correo) {
			$this->id=$id;
			$this->nombre = $nombre;
			$this->apellido = $apellido;
			$this->correo = $correo;
			
		}
	}

?>