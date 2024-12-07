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
            localStorage.setItem('carrito', JSON.stringify(carritoGuardado));
            alert(`${this.producto.title} ha sido agregado al carrito.`);
        },
    },
});
appDetalle.mount('#detalleApp');


