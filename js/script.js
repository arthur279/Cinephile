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
            grupoActual: 0,
            personasPorGrupo: 8,
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
        LLamarPersona() {
            const API_KEY = '3b5e72388c7203c96df4caf933255a83';
            const URL = `https://api.themoviedb.org/3/person/popular?api_key=${API_KEY}`;
            axios.get(URL)
              .then((respuesta) => {
                this.persona = respuesta.data.results.splice(0, 28).map(p => ({
                  ...p,
                  girada: false 
                }));
              })
              .catch(error => console.error('Error al llamar a la API de personas:', error));
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
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: "Agregar",
        cancelButtonText: "Cancelar",
        customClass: {
            popup: 'swal-dark-popup',
            title: 'swal-dark-title',
            content: 'swal-dark-content',
            confirmButton: 'swal-dark-button',
            cancelButton: 'swal-dark-cancel-button'
        },
        background: '#333',
        color: '#fff',
        iconColor: '#f8bb86'
    }).then((result) => {
        if (result.isConfirmed) {
            let carritoGuardado = JSON.parse(localStorage.getItem('carrito')) || [];
            const existe = carritoGuardado.find(item => item.id === pelicula.id);
            if (existe) {
                existe.cantidad++;
            } else {
                carritoGuardado.push({
                    ...pelicula, 
                    cantidad: 1 
                });
            }
            localStorage.setItem('carrito', JSON.stringify(carritoGuardado));
            Swal.fire({
                title: "¡Película agregada al carrito!",
                text: `Has agregado "${pelicula.title}" por $${pelicula.precio}`,
                icon: "success",
                showCancelButton: true,
                confirmButtonText: "Ir al carrito",
                cancelButtonText: "Seguir explorando",
                customClass: {
                    popup: 'swal-dark-popup',
                    title: 'swal-dark-title',
                    content: 'swal-dark-content',
                    confirmButton: 'swal-dark-button',
                    cancelButton: 'swal-dark-cancel-button'
                },
                background: '#333',
                color: '#fff',
                iconColor: '#a5dc86'
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.href = 'carrito.html'; 
                }
            });
        } 
    });
},
        verDetalle(pelicula) {
            localStorage.setItem('productoSeleccionado', JSON.stringify(pelicula));
            localStorage.setItem('posicionScroll', window.scrollY);
            window.location.href = 'Detalles.html';
        },
        girarTarjeta(id) {
            const persona = this.persona.find(p => p.id === id);
            if (persona) {
              persona.girada = !persona.girada; 
            } else {
              console.error(`Persona con id ${id} no encontrada`); 
            }
          },
          nextGrupo() {
            const totalGrupos = Math.ceil(this.persona.length / this.personasPorGrupo);
            if (this.grupoActual < totalGrupos - 1) {
              this.grupoActual++;
            }
          },
          prevGrupo() {
            if (this.grupoActual > 0) {
              this.grupoActual--;
            }
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
        },
        personasVisibles() {
            const inicio = this.grupoActual * this.personasPorGrupo;
            const fin = inicio + this.personasPorGrupo;
            return this.persona.slice(inicio, fin);
          },
    }
});
app.mount('#contenedor');