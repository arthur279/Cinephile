const app = Vue.createApp({
    mounted(){
        this.LLamarTendencia();
        const carritoGuardado = JSON.parse(localStorage.getItem('carrito')) || [];
        this.carrito = carritoGuardado;
        const posicion = localStorage.getItem('posicionScroll');
        if (posicion) {
            window.scrollTo(0, parseInt(posicion, 10));
            localStorage.removeItem('posicionScroll');
        }
    },
    data() {
        return {
            pelicula: [],
            peliculasFiltradas: [],
            busqueda: '',
            mostrarTendencias: false,
            mostrarPopular: false,
            mostrarPuntuacion: false,
            carrito: [],
        };
    },
    methods: {
        LLamarTendencia() {
            const API_KEY = '3b5e72388c7203c96df4caf933255a83';
            const URL = `https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}`;
            axios.get(URL)
                .then((respuesta) => {
                    this.pelicula = respuesta.data.results.map(pelicula => ({
                        ...pelicula,
                        precio: parseFloat((Math.random() * (100 - 20) + 20).toFixed(2))
                    }));
                    this.filtrarPeliculas();
                    this.mostrarTendencias = true;
                    this.mostrarPopular = false;
                    this.mostrarPuntuacion = false;
                })
                .catch((error) => {
                    console.error('Error al llamar a la API de tendencias:', error);
                });
        },
        LLamarPopular() {
            const API_KEY = '3b5e72388c7203c96df4caf933255a83';
            const URL = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}`;
            axios.get(URL)
                .then((respuesta) => {
                    this.pelicula = respuesta.data.results.map(pelicula => ({
                        ...pelicula,
                        precio: parseFloat((Math.random() * (100 - 20) + 20).toFixed(2))
                    }));
                    this.filtrarPeliculas();
                    this.mostrarPopular = true;
                    this.mostrarTendencias = false;
                    this.mostrarPuntuacion = false;
                })
                .catch((error) => {
                    console.error('Error al llamar a la API de populares:', error);
                });
        },
        LLamarPuntuada() {
            const API_KEY = '3b5e72388c7203c96df4caf933255a83';
            const URL = `https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}`;
            axios.get(URL)
                .then((respuesta) => {
                    this.pelicula = respuesta.data.results.map(pelicula => ({
                        ...pelicula,
                        precio: parseFloat((Math.random() * (100 - 20) + 20).toFixed(2))
                    }));
                    this.filtrarPeliculas();
                    this.mostrarPuntuacion = true;
                    this.mostrarTendencias = false;
                    this.mostrarPopular = false;
                })
                .catch((error) => {
                    console.error('Error al llamar a la API de puntuadas:', error);
                });
        },
        filtrarPeliculas() {
            const buscarUpper = this.busqueda.toUpperCase();
            this.peliculasFiltradas = this.pelicula.filter(peli =>
                peli.title && peli.title.toUpperCase().includes(buscarUpper)
            );
        },
        agregarCarrito(pelicula) {
            let carritoGuardado = JSON.parse(localStorage.getItem('carrito')) || [];
            const existe = carritoGuardado.find(item => item.id === pelicula.id);
            if (existe) {
                existe.cantidad++;
            } else {
                const precioRandom = parseFloat((Math.random() * (100 - 20) + 20).toFixed(2));
                carritoGuardado.push({ 
                    ...pelicula, 
                    cantidad: 1, 
                    precio: precioRandom 
                });
            }
            localStorage.setItem('carrito', JSON.stringify(carritoGuardado));
            this.carrito = carritoGuardado;
            alert(`${pelicula.title} ha sido agregada al carrito por $${pelicula.precio}.`);
        },
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
        verDetalle(pelicula) {
            localStorage.setItem('productoSeleccionado', JSON.stringify(pelicula));
            localStorage.setItem('posicionScroll', window.scrollY);
            window.location.href = 'Detalles.html';
        }
    },
    watch: {
        busqueda() {
            this.filtrarPeliculas();
        }
    },
    computed: {
        pelisEncontrados() {
            return this.peliculasFiltradas.length;
        },
        porcentaje() {
            const total = this.pelicula.length || 1;
            return Math.round((this.pelisEncontrados / total) * 100);
        },
        color() {
            const porcentaje = this.porcentaje;
            return porcentaje > 75
                ? 'bg-success'
                : porcentaje > 50
                ? 'bg-warning'
                : 'bg-danger';
        },
        totalCarrito() {
            return this.carrito.reduce((total, item) => total + item.cantidad * item.precio, 0).toFixed(2);
        }
    }
});
app.mount('#contenedor');
