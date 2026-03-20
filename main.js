
//Creamos la instacia de nuestra caja de archivos

/*box es obligatorio/*

/*auto_delete es opcional, en caso de no añadirlo por defecto sera true 
true = los archivos cargados al servidor seran eliminados de la lista automáticamente despues de ser cargados al servidor
false = se eliminan de la lista despues de que el usuario los seleccione manualmente*/

/*time_delete es opcional, en caso de no añadirlo por defecto sera 10 
es el tiempo en segundos que los archivos se eliminaran de la lista de archivos una vez cargados al servidor
/*

/*url es la ruta o el endpoint en donde se cargara el archivo
en caso de necesitar configurar token puedes modificar la línea: xhr.open("POST",this.url);
*/

/*extensions es opcional, definimos los tipos de archivos permitidos, en caso de no añadir la opción todos los tipos de archivos son permitidos*/


const cargadorArchivos = new Cargar({
    box:'containerBox',
    auto_delete : true,
    time_delete : 12,
    url:'./server.php'
    //extensions:  ['xlsx', 'pdf', 'xml']
});





