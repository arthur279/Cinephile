
        const app = Vue.createApp({

            mounted(){
                this.LLamarTendencia();
                const carritoGuardado = JSON.parse(localStorage.getItem('carrito')) || [];
    this.carrito = carritoGuardado;
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
                            this.pelicula = respuesta.data.results;
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
                            this.pelicula = respuesta.data.results;
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
                            this.pelicula = respuesta.data.results;
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
                    // Recuperamos el carrito desde localStorage
                    let carritoGuardado = JSON.parse(localStorage.getItem('carrito')) || [];
            
                    // Verificamos si la película ya está en el carrito
                    const existe = carritoGuardado.find(item => item.id === pelicula.id);
            
                    // Si existe, aumentamos la cantidad
                    if (existe) {
                        existe.cantidad++;
                    } else {
                        // Si no existe, agregamos la película al carrito con cantidad 1
                        carritoGuardado.push({ ...pelicula, cantidad: 1 });
                    }
            
                    // Guardamos el carrito actualizado en localStorage
                    localStorage.setItem('carrito', JSON.stringify(carritoGuardado));
            
                    // Actualizamos el carrito local en Vue
                    this.carrito = carritoGuardado;

                    alert(`${pelicula.title} ha sido agregada al carrito.`);
                },
                modificarCantidad(index, delta) {
                    let carritoGuardado = JSON.parse(localStorage.getItem('carrito')) || [];
            
                    // Modificamos la cantidad de la película en el carrito
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
            
                    // Eliminamos la película seleccionada
                    carritoGuardado.splice(index, 1);
            
                    // Actualizamos el carrito en localStorage
                    localStorage.setItem('carrito', JSON.stringify(carritoGuardado));
            
                    // Actualizamos el carrito local en Vue
                    this.carrito = carritoGuardado;
                },
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
                    return this.carrito.reduce((total, item) => total + item.cantidad * 50, 0);
                },
            },



        });

        app.mount('#contenedor');


