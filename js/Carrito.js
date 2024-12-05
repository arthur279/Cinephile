const appCarrito = Vue.createApp({
    data() {
        return {
            carrito: [],
        };
    },
    mounted() {
        // Cargamos el carrito desde localStorage cuando la página del carrito se monta
        const carritoGuardado = JSON.parse(localStorage.getItem('carrito')) || [];
        this.carrito = carritoGuardado;
    },
    methods: {
        modificarCantidad(index, delta) {
            let carritoGuardado = JSON.parse(localStorage.getItem('carrito')) || [];

            // Modificamos la cantidad de la película
            carritoGuardado[index].cantidad += delta;

            // Si la cantidad es 0 o menos, eliminamos el producto
            if (carritoGuardado[index].cantidad <= 0) {
                carritoGuardado.splice(index, 1);
            }

            // Actualizamos el carrito en localStorage
            localStorage.setItem('carrito', JSON.stringify(carritoGuardado));

            // Actualizamos el carrito local en Vue
            this.carrito = carritoGuardado;
        },
        eliminarDelCarrito(index) {
            let carritoGuardado = JSON.parse(localStorage.getItem('carrito')) || [];

            // Eliminamos el producto del carrito
            carritoGuardado.splice(index, 1);

            // Actualizamos el carrito en localStorage
            localStorage.setItem('carrito', JSON.stringify(carritoGuardado));

            // Actualizamos el carrito local en Vue
            this.carrito = carritoGuardado;
        },
        comprar() {
            alert("¡Gracias por tu compra!");
            this.carrito = [];

            // Borramos el carrito de localStorage
            localStorage.removeItem('carrito');
        },
    },
    computed: {
        totalCarrito() {
            return this.carrito.reduce((total, item) => total + item.cantidad * 50, 0);
        },
    },
});

appCarrito.mount('#carrito');


