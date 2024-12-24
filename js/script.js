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
        this.obtenerGeneros();
        this.LLamarPersona();
    },
    data() {
        return {
            pelicula: [],
            peliculasFiltradas: [],
            busqueda: '',
            mostrarTendencias: false,
            mostrarPopular: false,
            mostrarPuntuacion: false,
            generoSeleccionado: null,
            carrito: [],
            generos: [], 
            persona:[],
            modalVisible: false,
            personaSeleccionada: null, // Persona seleccionada para el modal
            mostrarMas: false, // Controla si se expande la sección
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
        LLamarPersona(){
            const API_KEY = '3b5e72388c7203c96df4caf933255a83';
            const URL = `https://api.themoviedb.org/3/person/popular?api_key=${API_KEY}`;
            axios.get(URL)
                 .then((respuesta) => {
                    this.persona = respuesta.data.results.splice(0,18);;  
                    console.log(respuesta.data.results)
                 })
        },
        obtenerGeneros() {
            const API_KEY = '3b5e72388c7203c96df4caf933255a83';
            const URL = `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}`;
    
            axios.get(URL)
                .then((respuesta) => {
                    this.generos = respuesta.data.genres; 
                })
                .catch((error) => {
                    console.error('Error al cargar géneros:', error);
                });
        },
        LLamarPorGenero() {
            if (!this.generoSeleccionado) return; 
            const API_KEY = '3b5e72388c7203c96df4caf933255a83';
            const URL = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${this.generoSeleccionado}`;
        
            axios.get(URL)
                .then((respuesta) => {
                    this.pelicula = respuesta.data.results.map(pelicula => ({
                        ...pelicula,
                        precio: parseFloat((Math.random() * (100 - 20) + 20).toFixed(2)) 
                    }));
                    this.filtrarPeliculas();
                    console.log('Películas por género:', this.pelicula);
                })
                .catch((error) => {
                    console.error('Error al obtener películas por género:', error);
                });
        },        
        filtrarPeliculas() {
            const buscarUpper = this.busqueda.toUpperCase();
            this.peliculasFiltradas = this.pelicula.filter(peli =>
                peli.title && peli.title.toUpperCase().includes(buscarUpper)
            );
        },
        agregarCarrito(pelicula) {
            Swal.fire({
                title: `¿Quieres agregar "${pelicula.title}" al carrito?`,
                text: `Precio: $${pelicula.precio}`,
                showDenyButton: true,
                showCancelButton: true,
                confirmButtonText: "Agregar",
                denyButtonText: "No agregar",
                customClass: {
                    popup: 'swal-dark-popup',
                    title: 'swal-dark-title',
                    content: 'swal-dark-content',
                    confirmButton: 'swal-dark-button',
                    denyButton: 'swal-dark-cancel-button',
                    cancelButton: 'swal-dark-cancel-button'
                },
                background: '#333',
                color: '#fff',
                iconColor: '#f8bb86'
            }).then((result) => {
                if (result.isConfirmed) {
                    // Recuperar el carrito desde localStorage
                    let carritoGuardado = JSON.parse(localStorage.getItem('carrito')) || [];
        
                    // Verificar si la película ya está en el carrito
                    const existe = carritoGuardado.find(item => item.id === pelicula.id);
        
                    if (existe) {
                        // Si ya existe, simplemente aumenta la cantidad
                        existe.cantidad++;
                    } else {
                        // Si no existe, agrega la película al carrito con la cantidad inicial de 1
                        carritoGuardado.push({
                            ...pelicula, // Copia todos los datos de la película
                            cantidad: 1 // Inicializa la cantidad en 1
                        });
                    }
        
                    // Guardar el carrito actualizado en localStorage
                    localStorage.setItem('carrito', JSON.stringify(carritoGuardado));
        
                    // Segunda alerta confirmando la acción
                    Swal.fire({
                        title: "¡Película agregada al carrito!",
                        text: `Has agregado "${pelicula.title}" por $${pelicula.precio}`,
                        icon: "success",
                        customClass: {
                            popup: 'swal-dark-popup',
                            title: 'swal-dark-title',
                            content: 'swal-dark-content',
                            confirmButton: 'swal-dark-button'
                        },
                        background: '#333',
                        color: '#fff',
                        iconColor: '#a5dc86'
                    });
                } else if (result.isDenied) {
                    // Segunda alerta para la acción denegada
                    Swal.fire({
                        title: "Película no agregada",
                        text: `No se agregó "${pelicula.title}" al carrito`,
                        icon: "info",
                        customClass: {
                            popup: 'swal-dark-popup',
                            title: 'swal-dark-title',
                            content: 'swal-dark-content',
                            confirmButton: 'swal-dark-button'
                        },
                        background: '#333',
                        color: '#fff',
                        iconColor: '#3fc3ee'
                    });
                }
            });
        },   
        verDetalle(pelicula) {
            localStorage.setItem('productoSeleccionado', JSON.stringify(pelicula));
            localStorage.setItem('posicionScroll', window.scrollY);
            window.location.href = 'Detalles.html';
        },
        abrirModal(persona) {
            this.personaSeleccionada = persona;
            this.modalVisible = true;
          },
          cerrarModal() {
            this.modalVisible = false;
            this.personaSeleccionada = null;
          },
          toggleVerMas() {
            this.mostrarMas = !this.mostrarMas;
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
            if (porcentaje > 90) {
                return 'bg-gradient-purple-blue'; // Morado degradado a azul
            } else if (porcentaje > 75) {
                return 'bg-success'; // Verde
            } else if (porcentaje > 50) {
                return 'bg-warning'; // Amarillo
            } else if (porcentaje > 25) {
                return 'bg-purple'; // Morado
            } else {
                return 'bg-danger'; // Rojo
            }
        }
        
    }
});
app.mount('#contenedor');