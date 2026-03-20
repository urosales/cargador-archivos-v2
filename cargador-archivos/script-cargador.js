class Cargar{

    constructor(data){
        this.box = document.querySelector(`#${data.box}`);
        this.input_file = this.box.querySelector('input[type="file"]');
        this.contenedorListaArchivos = this.box.querySelector('.container-files');
        this.btnFake = this.box.querySelector('span'); //Botón que activa el input file
        this.extensions = (data && data.extensions) || [];//Tipo de extensiones permitidas
        this.url || "./server.php" ;

        if(data)//Se autoelimina o no el archivo
            this.auto_delete = data.auto_delete === false ? false : true;
        else
            this.auto_delete = true;

        this.time_delete = (data && Number(data.time_delete) && data.time_delete) || 10; //Al cuanto tiempo se elimina el archivo


        //Al dar click en el botón falso llamamos al real
        this.btnFake.onclick = ()=>this.input_file.click();
    
        //Detectamos cambios en el input_file
        this.input_file.onchange = (e)=>{
            for(let i=0;i<e.target.files.length;i++ )
                this.uploadFile(e.target.files[i]);
            this.input_file.value = '';
        };

       //Efecto de arrastrar sobre la caja
        this.box.ondragover = (e)=>{
            e.preventDefault();
            e.stopPropagation();
            this.box.classList.add('dragover');
        };

        //Efecto de soltar sobre la caja
        this.box.ondrop = (e)=>{
            e.preventDefault();
            e.stopPropagation();
            this.box.classList.remove('dragover');
            for(let i=0;i<e.dataTransfer.items.length;i++ ){
                if (e.dataTransfer.items[i].kind === "file") {
                    const file = e.dataTransfer.items[i].getAsFile();
                    this.uploadFile(file);
                }
            }
        };

        //Efecto de dejar la caja
        this.box.ondragleave = (e)=>{
            e.preventDefault();
            e.stopPropagation();
            this.box.classList.remove('dragover');
        };

        //Guardamos la referencia y asegura que `this` siga apuntando a la instancia de la clase
        this.eventListenerClick = this.eventListenerClick.bind(this);

        this.contenedorListaArchivos.addEventListener('click', this.eventListenerClick);

    }

    eventListenerClick(e){
        if (e.target.matches('i.fa-close')) {
            this.deleteFile(e);
        }
    }

    //Si por alguna razón se necesitan eliminar los addEventListener (tal vez el uso de un one page por ejemplo para evitar eventos duplicados)
    destroy() {
        this.contenedorListaArchivos.removeEventListener('click', this.eventListenerClick);
    }

    //Eliminamos el archivo seleccionado
    deleteFile(e){
        e.target.closest('.file-container').remove();
    }


    //Cargamos el archivo a la caja
    uploadFile(file){

        //Si extensions está vacia entonces permitimos cualquier tipo de archivo
        if(this.extensions.length > 0){
            //Sólo aceptamos el formato que se defina
            const regex = new RegExp(`\\.(${this.extensions.join('|')})$`, 'i');
            if (!regex.test(file.name.toLowerCase())) 
                return;
        }
       
        const id = Math.floor(Math.random() * 100000); 

        //Añadimos al final
        this.contenedorListaArchivos.insertAdjacentHTML('beforeend',
             `<div id=${id} class="file-container">
                <label style="margin-bottom:10px;position:relative;">
                    <div class="dinamic"></div>
                    <progress value="0" max="100" style="width:100%;"></progress> 
                    <div style="white-space: nowrap;overflow: hidden;text-overflow: ellipsis;padding:0 20px;">${file.name}</div>
                    <div>Tamaño: ${Cargar.formatBytes(file.size)}</div>
                </label>
            </div>`
        );


        let formdata = new FormData();
        formdata.append('file',file);

        let xhr = new XMLHttpRequest();

        xhr.upload.onprogress = (e)=>Cargar.progressHandler(e,id);
        xhr.onload = (e)=>Cargar.completeHandler(e,id,this.auto_delete,this.time_delete);
        xhr.onerror = Cargar.errorHandler;
        xhr.onabort = Cargar.abortHandler;
        xhr.open("POST",this.url);
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        xhr.responseType = 'json';
        xhr.send(formdata);
    }

    static progressHandler(e,id){
        let percent = (e.loaded / e.total) * 100;
        percent = Math.round(percent);
        
        const element = document.getElementById(`${id}`);
        element.querySelector('progress').value = percent;
        element.querySelector('.dinamic').innerHTML = `${percent}% (${Cargar.formatBytes(e.loaded)} de ${Cargar.formatBytes(e.total)})`;
    }

    static completeHandler(e,id,auto_delete,time_delete){

        console.log(e.target.response);

        const element = document.getElementById(`${id}`);
        let text = "";

        if(e.target.response?.error)
            text = `Ocurrio un error <i class="fa fa-close fa-2x eliminar" style="position:absolute;right:1px;top:-1px;cursor:pointer;padding:5px;"></i>`;
        else{
            if(auto_delete)
                new Contador(time_delete,element);
            else
                text = `Archivo cargado <i class="fa fa-close fa-2x eliminar" style="position:absolute;right:1px;top:-1px;cursor:pointer;padding:5px;"></i>`
        }

        element.querySelector('.dinamic').innerHTML = text
        
    }

    static errorHandler(e){
        console.log(e.target.response);
        console.log("Upload Failed");  
    }

    static abortHandler(e){
        console.log(e.target.response);
        console.log("Upload Aborted"); 
    }

    //Calculamos el peso del archivo
    static formatBytes(bytes, decimals = 2) {

        if (bytes === 0) 
            return '0 Bytes';

        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }    
}


class Contador{
    constructor(time,element){
        this.timer = setInterval(()=>{
            element.querySelector('.dinamic').innerHTML = `Archivo cargado (limpiando en: ${time} segundo${ time > 1 ? 's' : ''})` ;
            time = time  - 1
            if(time < 0){
                clearInterval(this.timer);
                element.remove();
            }
        },1000);
    }
}
