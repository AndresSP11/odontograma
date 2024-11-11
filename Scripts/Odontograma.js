
let mover = false;
let img = null;
let resize = null;
let elementoSeleccionado = null;
let objSeleccionado = {}

let especiales = {
    "27": {
        estilo:"blue",
        modal:["IM|IM-Incrustación Metálica",
        "AM|AM-Amalgama",
        "R|R-Resina",
        "IV|IV-Ionomero de vidrio",
        "IE|IE-Incrustación estética",
        "SI|SI-Semi-impactación"

        ]},
    "3": {
        estilo: "blue",
        modal:[
        "CC|CC-Corona Definitiva",
        "CF|CF-Corona Fenestrada",
        "CMC|CMC-Corona metal cerámica",
        "3/4|3/4-Corona Parcial",
        "4/5|4/5-Corona Parcial",
        "7/8|7/8-Corona Parcial",
        "CV|CV-Corona Veneer",
        "CJ|CJ-Corona Jacket",
        "DES|DES-Desgaste oclusal/Incisal",
        "DIS|DIS-Diente Discromico",
        "E|E-Diente Ectópico",
        "I|I-Impactación",
        "IMP|IMP-Implante",
        "MAC|MAC-Macrodoncia",
        "MIC|MIC-Microdoncia",
        "M1|M1-Movilidad",
        "M2|M2-Movilidad",
        "M3|M3-Movilidad",
        ]
    },
    "2": {
        estilo: "red",
    },
    "28": {
        estilo: "red",
    }
}

window.onload = function () {

    let js_boton = document.querySelector(".js_boton");
    js_boton.onclick = async function () {


        let el = document.querySelector(".js_contenedorImprimir");
        let c = el.getBoundingClientRect();
        console.log("inicio");
       let base64=await html2canvas(el, {
            scrollX: -window.scrollX,
            scrollY: -window.scrollY,
            windowWidth: document.documentElement.offsetWidth,
            windowHeight: (el.scrollHeight + 100),
        }).then(function (c) {

            let image = c.toDataURL();
            let ar = image.split(",");
            let cadena = atob(ar[1]);
            let n = cadena.length;
            let arUint = new Uint8Array(n);
            for (let i = 0; i < n; i++) {
                arUint[i] = cadena.charCodeAt(i);
            }

            let blob = new Blob([arUint], { type: "image/png" });

            let aDownload = document.createElement("a");
            aDownload.href = URL.createObjectURL(blob);
            aDownload.download = "Error.png";
            aDownload.click();
            console.log("preparando");
            return ar[1];

        });
        console.log("fin");

    }


    let moveimage = document.querySelector(".moveimage");
    let js_content = document.querySelector(".js_content")

    js_content.onmousemove = function (e) {

        e.preventDefault();
        if (mover && (img||resize)) {
            let x = e.layerX;
            let y = e.layerY;

            if (img) {
                img.style.cssText = `top:${y}px;left:${x}px`;
            }
            if (resize) {
                let element = resize.parentNode;
                let _img = element.firstElementChild;

                let posX = element.style.left.replace("px","") * 1;
                let newWidth = x - posX;
                console.log("nuevo ancho", newWidth)
                _img.style.width = `${newWidth}px`;
            }

            console.log(x, y);

            console.log(`cliente top:${e.clientY}px;left:${e.clientX}px`)
            console.log(`page top:${e.pageY}px;left:${e.pageX}px`)
            console.log(`offset top:${e.offsetY}px;left:${e.offsetX}px`)
            console.log(`layer top:${e.layerY}px;left:${e.layerX}px`)
            
        }

    }
    /*
    moveimage.onmousedown = function (e) {
        e.preventDefault();
        mover = true;
        img = this;
        img.classList.add("activo");
         
        console.log("habilita moveer");

    }*/
    js_content.onmouseup = function (e) {
        e.preventDefault();
        mover = false;
        if (img) {
           // img.classList.remove("activo");
            img = null;
        }
        if (resize) {
            resize = null;
        }
   
        console.log("deshabilita moveer");

    }
/*
    let imageresize = document.querySelector(".imageresize");
    imageresize.onmousedown = function (e) {
        e.preventDefault();
        e.stopPropagation();
        mover = true;
        resize = this;


        console.log("habilita resize");

    }*/

    let js_contenedorImprimir = document.querySelector(".js_contenedorImprimir");
    js_contenedorImprimir.oncontextmenu = function (e) {

        e.preventDefault();
        let x = e.clientX;
        let y = e.clientY;
        elementoSeleccionado = e.target;
        console.log(elementoSeleccionado);

        if (elementoSeleccionado.getAttribute("data-eliminar")) {

            let js_modalOdontologia = document.querySelector(".js_modalOdontologia");
            js_modalOdontologia.firstElementChild.innerHTML = "<li data-valor='-1'>Borrar</li>";
            js_modalOdontologia.style.display = "block";
            js_modalOdontologia.style.top = y + "px";
            js_modalOdontologia.style.left = x+"px";

        }
    }
    js_contenedorImprimir.onclick = function (e) {
        e.preventDefault();
        manipularDientes(true);
        if (objSeleccionado.hasOwnProperty("url") && ["2", "3", "27", "28"].indexOf(objSeleccionado.order)==-1) {

            let x = e.layerX;
            let y = e.layerY;

            let html = `<span class="moveimage" data-eliminar="1" style="top: ${y}px; left: ${x}px;">
                        <img src="../Imagen/${objSeleccionado.url}" style="pointer-events:none;width:48px;height:23px" />
                        <span class="imageresize"></span>
                    </span>`;

            let js_contenedorImprimir = document.querySelector(".js_contenedorImprimir");
            js_contenedorImprimir.insertAdjacentHTML("afterbegin", html);
            objSeleccionado = {};
            configurarElementos();
            console.log(e.target);

        }
        if (["2", "3", "27", "28"].indexOf(objSeleccionado.order) > -1) {

            elementoSeleccionado = e.target;

            let obj = especiales[objSeleccionado.order];

            if (obj.hasOwnProperty("modal")) {
                let lista = obj.modal;
                let n = lista.length;
                let js_modalOdontologia = document.querySelector(".js_modalOdontologia");
                let campos, html = "";
                for (let i = 0; i < n; i++) {
                    campos = lista[i].split("|");
                    html += "<li data-valor='";
                    html += campos[0];
                    html += "'>";
                    html += campos[1];
                    html += "</li>";

                }

                js_modalOdontologia.firstElementChild.innerHTML = html;

                let x = e.clientX;
                let y = e.clientY;
                

                js_modalOdontologia.style.display = "block";
                js_modalOdontologia.style.top = y + "px";
                js_modalOdontologia.style.left = x + "px";

            } 
            let formas = ["rectangulo-izq", "rectangulo-der", "cuadrado", "rectangulo", "rectangulo-small"];
            let clase = elementoSeleccionado.className;
            if (["3", "28"].indexOf(objSeleccionado.order) > -1) {

                if (formas.indexOf(clase) > -1) {
                    elementoSeleccionado.style.cssText = "border:2px solid " + obj.estilo;
                } else {
                    let aclase = clase.split("-");
                    elementoSeleccionado.style.cssText = `border-style: double;border-${aclase[aclase.length - 1]}-color:${obj.estilo}`;
                }

            } else {
                if (formas.indexOf(clase) > -1) {
                    elementoSeleccionado.style.cssText = "background-color:" + obj.estilo;

                } else {
                    let aclase = clase.split("-");
                    elementoSeleccionado.style.cssText = `border-${aclase[aclase.length - 1]}-color:${obj.estilo}`;
                }
            }
            elementoSeleccionado.setAttribute("data-eliminar", "2");    
            objSeleccionado = {};
        }
    }

    let js_modalOdontologia = document.querySelector(".js_modalOdontologia");
    js_modalOdontologia.onmouseleave = function () {
        this.style.display = "none";
    }
    js_modalOdontologia.onclick = function (e) {

        let element = e.target;
        if (element.nodeName == "LI") {
            let valor = element.getAttribute("data-valor");
            if (valor == "-1") {
                let tipoEliminacion = elementoSeleccionado.getAttribute("data-eliminar");
                if (tipoEliminacion == "1") {
                    let js_contenedorImprimir = document.querySelector(".js_contenedorImprimir");
                    js_contenedorImprimir.removeChild(elementoSeleccionado);
                }
                if (tipoEliminacion == "2") {
                    let diente = elementoSeleccionado.parentNode;
                    let destino = diente.getAttribute("data-destino");
                    let texto = document.querySelector("." + destino);
                    if (texto) {
                        texto.textContent = "";
                    }
                    elementoSeleccionado.style.cssText = "";
                    elementoSeleccionado.removeAttribute("data-eliminar");
                }

            } else {
                let diente = elementoSeleccionado.parentNode;
                let destino = diente.getAttribute("data-destino");
                let texto = document.querySelector("." + destino);
                if (texto) {
                    texto.textContent = valor;
                }

            }
        }
        this.style.display = "none";
    }

    var opcsli = document.getElementsByClassName("opcs");
    for (var i = 0; i < opcsli.length; i++) {
        opcsli[i].onclick = function (e) {
            
            objSeleccionado.type = this.dataset.opc;
            objSeleccionado.url = this.dataset.url || "";
            objSeleccionado.order = this.dataset.order || "";
            console.log("selecciono imagen");
          
        };
    }

}

function configurarElementos() {

    let moveimage = document.querySelectorAll(".moveimage");
    moveimage.forEach((element) => {

        element.onmousedown = function (e) {
            e.preventDefault();
            mover = true;
            img = this;
            img.classList.add("activo");
            console.log("habilita moveer");
            manipularDientes(false);

        }
        element.onmouseup =  function (e) {
            e.preventDefault();
            mover = false;
            if (img) {
                // img.classList.remove("activo");
                img = null;
            }
            if (resize) {
                resize = null;
            }
            console.log("deshabilita moveer");
            manipularDientes(true);
        }
    })

    let imageresize = document.querySelectorAll(".imageresize");
    imageresize.forEach((element) => {
        element.onmousedown = function (e) {
            e.preventDefault();
            e.stopPropagation();
            mover = true;
            resize = this;

            console.log("habilita resize");
        }

    });
}

function manipularDientes(esHabilidato) {

    let dientes = document.querySelectorAll(".diente");
    dientes.forEach((diente)=> {

        if (esHabilidato) {
            diente.classList.remove("noevent");
        } else {
            diente.classList.add("noevent");
        }

    })
}