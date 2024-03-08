document.addEventListener("DOMContentLoaded", function () {
    let formulario = document.getElementById('miFormularioPrincipal');
    let mensajeSuscripcion = document.getElementById('mensajeSuscripcion');

    // Agregar un evento de escucha al envío del formulario
    formulario.addEventListener('submit', function (event) {
        event.preventDefault();

        const valor1 = document.getElementById('exampleInputEmail1').value.trim();
        const valor2 = document.getElementById('exampleInputPassword1').value.trim();

        if (valor1 === '' || valor2 === '') {
            alert('Por favor, complete todos los campos.');
            return;
        }

        localStorage.setItem('email', valor1);
        localStorage.setItem('password', valor2);

        const parrafo1 = document.createElement('p');
        parrafo1.textContent = 'Email: ' + valor1;

        const parrafo2 = document.createElement('p');
        parrafo2.textContent = 'Password: ' + valor2;

        const contenedorDatos = document.getElementById('datosDelFormulario');
        contenedorDatos.innerHTML = '';
        contenedorDatos.appendChild(parrafo1);
        contenedorDatos.appendChild(parrafo2);

        document.getElementById('exampleInputEmail1').value = '';
        document.getElementById('exampleInputPassword1').value = '';
    });

    // Mostrar mensaje de suscripción
    const formSuscripcion = document.querySelector('form[action="#!"]');
    const inputCorreo = document.getElementById('email-newsletter');
    formSuscripcion.addEventListener('submit', function (event) {
        event.preventDefault();
        const correoElectronico = inputCorreo.value;
        inputCorreo.value = '';
        mensajeSuscripcion.textContent = 'We will send you information to: ' + correoElectronico;
    });

    // Funciones relacionadas con el carrito de compras
    const apiProducto = 'https://fakestoreapi.com/products';
    const contenedorMarket = document.getElementById("contenedorMarket");
    let carrito = [];

    function agregarAlCarrito(producto) {
        carrito.push(producto);
        mostrarCarrito();
        document.getElementById('cantidadCarrito').textContent = carrito.length; // Actualizar la cantidad directamente con la longitud del carrito
    }

    function mostrarCarrito() {
        const tbody = document.querySelector("#carrito tbody");
        tbody.innerHTML = "";

        let total = 0;
        carrito.forEach((producto, index) => {
            const fila = document.createElement("tr");
            fila.innerHTML = `
            <td>${producto.title}</td>
            <td>$${producto.price}</td>
            <td><button class="btn btn-danger" onclick="eliminarProducto(${index})">x</button></td>
          `;
            tbody.appendChild(fila);
            total += producto.price;
        });

        const totalElement = document.getElementById("total");
        totalElement.textContent = `$${total.toFixed(2)}`;
    }

    function eliminarProducto(index) {
        carrito.splice(index, 1);
        mostrarCarrito();
        document.getElementById('cantidadCarrito').textContent = parseInt(document.getElementById('cantidadCarrito').textContent) - 1;
    }
    // Asignar la función al objeto window para hacerla global
    window.eliminarProducto = eliminarProducto;

    // Mostrar productos
    fetch(apiProducto)
        .then(res => res.json())
        .then(json => {
            console.table(json);
            mostrarMarket(json);
        })
        .catch(error => {
            console.error('Error al obtener los datos de la API:', error);
        });

    function mostrarMarket(datos) {
        datos.forEach(prod => {
            const card = document.createElement("div");
            card.classList.add("card");

            const imagen = document.createElement("img");
            imagen.src = prod.image;
            imagen.alt = prod.title;
            imagen.style.maxHeight = "200px";
            imagen.style.objectFit = "contain";

            const titulo = document.createElement("h6");
            titulo.textContent = prod.title;

            const precio = document.createElement("p");
            precio.textContent = `$ ${prod.price}`;

            const categoria = document.createElement("p");
            categoria.textContent = `Category: ${prod.category}`;

            const botonAgregar = document.createElement("button");
            botonAgregar.textContent = "add to cart";
            botonAgregar.classList.add("btn", "btn-primary");
            botonAgregar.addEventListener("click", function () {
                agregarAlCarrito(prod);
            });

            card.appendChild(imagen);
            card.appendChild(titulo);
            card.appendChild(precio);
            card.appendChild(categoria);
            card.appendChild(botonAgregar);

            contenedorMarket.appendChild(card);
        });
    }

    // Mostrar el formulario de compra al presionar el botón Confirm
    document.getElementById('confirmButton').addEventListener('click', function () {
        if (carrito.length > 0) {
            document.getElementById('miFormulario').style.display = 'block';
        } else {
            alert('Add at least one product to cart before continuing.');
        }
        formulario()
    });

    // Modificar la función que maneja el envío del formulario de compra
    document.getElementById('miFormulario').addEventListener('submit', function (event) {
        event.preventDefault();

        // Guardar los datos del formulario de compra en variables
        const nombre = document.getElementById('nombre').value.trim();
        const apellido = document.getElementById('apellido').value.trim();
        const telefono = document.getElementById('telefono').value.trim();
        const correo = document.getElementById('correo').value.trim();

        // Mostrar los datos en el modal
        mostrarDatosEnModal(nombre, apellido, telefono, correo);

        // Mostrar el modal
        const myModal = new bootstrap.Modal(document.getElementById('myModal'));
        myModal.show();
    });

    // Función para mostrar los datos del formulario de compra en el modal
    function mostrarDatosEnModal(nombre, apellido, telefono, correo) {
        const modalBody = document.getElementById('modalBody');
        modalBody.innerHTML = `
        <div class="modal-header">
        
    </div>
    <div class="modal-content">
        <p>Dear <strong>${nombre}</strong><strong>${apellido}</strong></p>
        <p>We will send the details of your purchase to: ${correo}</p>
        <p><strong>Thanks for your purchase!</strong></p>
        
    </div>

        `;

    }

    // Escucha el clic en el botón para abrir el modal SweetAlert
    document.getElementById('openModalBtn').addEventListener('click', function () {
        // Recupera los datos del formulario
        const nombre = document.getElementById('nombre').value.trim();
        const apellido = document.getElementById('apellido').value.trim();
        const telefono = document.getElementById('telefono').value.trim();
        const correo = document.getElementById('correo').value.trim();

        // Construye el mensaje de SweetAlert
        const mensaje = `
        <p><strong>Name:</strong> ${nombre}</p>
        <p><strong>Last name:</strong> ${apellido}</p>
        <p><strong>Phone:</strong> ${telefono}</p>
        <p><strong>Email:</strong> ${correo}</p>
    `;


        // Muestra el SweetAlert
        //Swal.fire({
        // title: 'Detalles del Pedido',
        // html: mensaje,
        //icon: 'info',
        //confirmButtonText: 'Cerrar'
        //});
    });


    // Función para reiniciar el carrito de compras
    function reiniciarCarrito() {
        carrito = []; // Limpiar el carrito
        mostrarCarrito(); // Actualizar la vista del carrito
        document.getElementById('cantidadCarrito').textContent = '0'; // Actualizar la cantidad de productos en el carrito a cero
        // Ocultar el formulario
        document.getElementById('miFormulario').style.display = 'none';
    }

    // Agrega un evento de clic al botón para cerrar el modal
    document.getElementById('cerrarModalBtn').addEventListener('click', function () {
        // Encuentra el modal por su ID
        var modal = document.getElementById('myModal');
        // Cierra el modal
        modal.style.display = 'none';
        // Resetea el formulario
        document.getElementById('miFormulario').reset();
        // Elimina la clase modal-open del cuerpo del documento
        document.body.classList.remove('modal-open');
        // Elimina el fondo oscuro
        var backdrop = document.getElementsByClassName('modal-backdrop')[0];
        backdrop.parentNode.removeChild(backdrop);
        reiniciarCarrito();

    });

    // Agregar un evento de escucha cuando el modal se cierre

    $('#myModal').on('hidden.bs.modal', function (e) {
        $('body').removeClass('modal-open');
        $('.modal-backdrop').remove();
        reiniciarCarrito();

    });





});