const appCarrito = Vue.createApp({
    data() {
        return {
            carrito: [],
        };
    },
    mounted() {
        const carritoGuardado = JSON.parse(localStorage.getItem('carrito')) || [];
        this.carrito = carritoGuardado;
    },
    methods: {
        modificarCantidad(index, delta) {
            let carritoGuardado = JSON.parse(localStorage.getItem('carrito')) || [];
            carritoGuardado[index].cantidad += delta;
            if (carritoGuardado[index].cantidad <= 0) {
                carritoGuardado.splice(index, 1);
            }
            localStorage.setItem('carrito', JSON.stringify(carritoGuardado));
            this.carrito = carritoGuardado;
        },
        eliminarDelCarrito(index) {
            let carritoGuardado = JSON.parse(localStorage.getItem('carrito')) || [];
            carritoGuardado.splice(index, 1);
            localStorage.setItem('carrito', JSON.stringify(carritoGuardado));
            this.carrito = carritoGuardado;
        },
    },
    computed: {
        totalCarrito() {
            return this.carrito.reduce((total, item) => total + item.cantidad * 50, 0);
        },
    },
});
appCarrito.mount('#carrito');