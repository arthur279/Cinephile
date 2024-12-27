const appDetalle = Vue.createApp({
    data() {
        return {
            producto: null,
            cantidad: 1,
        };
    },
    mounted() {
        const producto = JSON.parse(localStorage.getItem('productoSeleccionado'));
        if (producto) {
            this.producto = producto;
        } else {
            alert('No hay producto seleccionado.');
            window.location.href = 'index.html';
        }
        const posicion = localStorage.getItem('posicionScroll');
        if (posicion) {
            window.scrollTo(0, parseInt(posicion, 10));
            localStorage.removeItem('posicionScroll');
        }
    },
    methods: {
        agregarRepresentativo() {
            let carritoGuardado = JSON.parse(localStorage.getItem('carrito')) || [];
            const existe = carritoGuardado.find(item => item.id === this.producto.id);
            if (existe) {
                existe.cantidad = this.cantidad;
            } else {
                carritoGuardado.push({
                    ...this.producto,
                    cantidad: this.cantidad
                });
            }
        },
        agregarAlCarrito() {
            Swal.fire({
                title: `<span style="color: white;">¿Quieres agregar "${this.producto.title}" al carrito?</span>`,
                html: `<p style="color: white;">Precio: <strong>$${this.producto.precio.toFixed(2)}</strong></p>`,
                icon: 'question',
                background: '#121212',
                color: 'white',
                showCancelButton: true,
                cancelButtonText: 'Cancelar',
                confirmButtonText: 'Agregar',
                confirmButtonColor: 'linear-gradient(45deg, #800080, #0000FF)',
                cancelButtonColor: 'swal-dark-cancel-button',
            }).then((result) => {
                if (result.isConfirmed) {
                    let carritoGuardado = JSON.parse(localStorage.getItem('carrito')) || [];
                    const existe = carritoGuardado.find(item => item.id === this.producto.id);

                    if (existe) {
                        existe.cantidad += this.cantidad; 
                    } else {
                        carritoGuardado.push({
                            ...this.producto,
                            cantidad: this.cantidad
                        });
                    }
                    localStorage.setItem('carrito', JSON.stringify(carritoGuardado));
                    Swal.fire({
                        title: `<span style="color: white;">Película agregada al carrito!</span>`,
                        icon: 'success',
                        background: '#121212',
                        color: 'white',
                        showCancelButton: true,
                        confirmButtonText: 'Ir al carrito',
                        cancelButtonText: 'Regresar',
                        confirmButtonColor: 'linear-gradient(45deg, #800080, #0000FF)',
                        cancelButtonColor: 'swal-dark-cancel-button',
                    }).then((result) => {
                        if (result.isConfirmed) {
                            window.location.href = 'Carrito.html';
                        }
                    });
                }
            });
        },
    },
});
appDetalle.mount('#detalleApp');




