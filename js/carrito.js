//_____________ARMADO CARRITO______________________

const Armar_carrito = () => {

    carrito_contenedor.innerHTML = ''; // Limpio el contenido previo del carrito
    
    //cabecera del carrito
    const carrito_header = document.createElement("div");
    carrito_header.className = "cart_header";
    carrito_header.innerHTML = `
        <h1 class="cart_title">Carrito</h1>
    `;
    carrito_contenedor.appendChild(carrito_header); //lo adjunto al div del carrito
    
    //boton de cierre del carrito, al lado de la cabecera
    const btn_cierre = document.createElement("span");
    btn_cierre.className = "cart_header_btn";
    btn_cierre.innerText = "X";
    btn_cierre.addEventListener("click", () => {
        carrito_contenedor.style.display = "none"; // Oculto el carrito cuando hago clic en el botón de cierre
    });
    carrito_header.appendChild(btn_cierre);//adjunto el btn de cierre al header del carrito
    
    //recorro el carrito y creo el contenido que muestra
    carrito.forEach((producto) => {
        let carrito_content = document.createElement("div");
        carrito_content.className = "cart_content";
        carrito_content.innerHTML = `
            <img src="${producto.imagen}"> 
            <h4>${producto.nombre}</h4>
            <span class= "restar"> ➖ </span>
            <p>Cantidad: ${producto.cantidad}</p>
            <span class= "sumar"> ➕ </span>
            <p>Precio: ${producto.precio * producto.cantidad} $</p>
            <span class= "delete_item"> ❌ </span>
        `;
        //si quiero q muestre el precio por cant de productos: producto.precio * producto.cantidad
        carrito_contenedor.append(carrito_content);


        //Comando botones de suma, resta y eliminar del carrito
        let flag;// bandera q uso para modificar la alerta de toastify
        let sumar = carrito_content.querySelector(".sumar");
        sumar.addEventListener("click", () =>{
            producto.cantidad ++;
            flag= true;
            alertaToasty(flag); //le agrego la alerta de agregar producto
            saveLocal();
            Armar_carrito();
        })

        let restar= carrito_content.querySelector(".restar"); 
        restar.addEventListener("click", ()=>{
            if(producto.cantidad !== 1){
                flag= false;
                alertaToasty(flag); //le agrego la alerta de quitar producto
                producto.cantidad--;
            }
            saveLocal();
            Armar_carrito();
        })

        let eliminar= carrito_content.querySelector(".delete_item");
        //le agrego el sweet alert al boton de eliminar junto con la funcion 
        eliminar.addEventListener("click", ()=>{
            Swal.fire({
                title: `Estas seguro de eliminar ${producto.nombre}?`,
                text: "Se eliminan todas sus unidades",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Si, borralo!"
              }).then((result) => {
                if (result.isConfirmed) {
                  Swal.fire({
                    title: "Eliminado!",
                    // text: "Sacaste todos.",
                    icon: "success"
                  });

                  eliminar_item(producto.id); //le paso la funcion de eliminar
                }else { 
                    Swal.fire({
                        title: "No eliminado!",
                        text: "El producto sigue en tu carrito.",
                        icon: "error"
                      });
                }
              });
            
        })
    });
    
    //footer del carrito= calcular el total de los productos
    const total = carrito.reduce((acc, el) => acc + el.precio * el.cantidad, 0);
    const total_compra = document.createElement("div");
    total_compra.innerText = `Total a pagar: ${total} $`;
    total_compra.className = "cart_total";
    carrito_contenedor.append(total_compra);
    
    carrito_contenedor.style.display = "block"; // Muestro el carrito
    
}

//boton para abrir o cerrar el carrito:
verCarrito.addEventListener("click", Armar_carrito) //cuando hago click, arma y muestra el carrito

const eliminar_item =(id) => {
    const foundId= carrito.find((el) => el.id === id); //encuentra el id del producto
    carrito = carrito.filter ((carritoId) =>{
        return carritoId !== foundId; //me carga el carrito con todos los elementos q no tengan el id que quiero borrar
    })

    cart_counter();
    saveLocal();
    Armar_carrito(); //llamo a la funcion q me arma el carrito 
}

//creo funcion para que aumente el contador del carrito
const cart_counter = () => {
    cantCarrito.style.display = "block";
    cantCarrito.innerText= carrito.length;

    //guardo el numero en el localstorage
    const carritoLength= carrito.length; 
    localStorage.setItem ("carrito_length", JSON.stringify(carritoLength)); //lo guardo en ls

    cantCarrito.innerText= JSON.parse(localStorage.getItem("carrito_length")) //lo recupero con la clave
}

cart_counter(); //invoco la funcion para q siempre aparezca el numero al recargar la pagina