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
        cambiarCantidad(delta) {
            const nuevaCantidad = this.cantidad + delta;
            if (nuevaCantidad >= 1 && nuevaCantidad <= 6) {
                this.cantidad = nuevaCantidad;
            }
        },
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
        irAInicio(event) {
            event.preventDefault();
            window.location.href = 'index.html';
        },
        agregarAlCarrito() {
            let carritoGuardado = JSON.parse(localStorage.getItem('carrito')) || [];
            const existe = carritoGuardado.find(item => item.id === this.producto.id);
        
            if (existe) {
                existe.cantidad++;
            } else {
                carritoGuardado.push({
                    ...this.producto,
                    cantidad: 1
                });
            }
        
            // Guardar el carrito actualizado en localStorage
            localStorage.setItem('carrito', JSON.stringify(carritoGuardado));
        
            // SweetAlert con tema oscuro
            Swal.fire({
                title: `<span style="color: white;">¡${this.producto.title} agregado al carrito!</span>`,
                html: `
                    <p style="color: white;">Precio: <strong>$${this.producto.precio.toFixed(2)}</strong></p>
                    <p style="color: white;">Cantidad actual: <strong>${existe ? existe.cantidad : 1}</strong></p>
                `,
                icon: 'success',
                background: '#121212',
                color: 'white',
                showCancelButton: true,
                cancelButtonText: 'Seguir explorando',
                confirmButtonText: 'Ver carrito',
                confirmButtonColor: '#4CAF50',
                cancelButtonColor: '#f44336',
            }).then((result) => {
                if (result.isConfirmed) {
                    // Redirige al usuario al carrito
                    window.location.href = 'carrito.html';
                }
            });
        },
        
        handleMouseMove(event) {
            const backdrop = this.$el.querySelector('.backdrop-parallax');
            const x = (window.innerWidth / 2 - event.clientX) / 20; // Ajusta la sensibilidad aquí
            const y = (window.innerHeight / 2 - event.clientY) / 20; // Ajusta la sensibilidad aquí
            backdrop.style.transform = `translate(${x}px, ${y}px)`;
        }
    },
        beforeDestroy() {
        // Remover el evento para evitar fugas de memoria
        window.removeEventListener('mousemove', this.handleMouseMove);
    }
});
appDetalle.mount('#detalleApp');


