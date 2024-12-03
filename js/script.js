const inst = Vue.createApp({
    el: '#contenedor', 

    data() {
        return {
            pelicula: [], 
            mostrarTendencias: false,
            mostrarPopular: false,
            mostrarPuntuacion: false,
            busqueda: '', 
        }
    },

    computed: {
        buscarPelicula() {
            return this.Mayuscula(this.busqueda);
        },
        pelisEncontrados() {
            return this.buscarPelicula.length;
        },
        porcentaje() {
            if (this.pelicula.length === 0) return 0; 
            return Math.round((this.pelisEncontrados / this.pelicula.length) * 100); 
        },
        color() {
            return {
                'bg-danger': this.porcentaje <= 35,
                'bg-warning': this.porcentaje > 35 && this.porcentaje <= 75,
                'bg-success': this.porcentaje > 75
            };
        }   
    },

    methods: {
        Mayuscula(busqueda) {
            if (!busqueda) return this.pelicula;
            const buscarUpper = busqueda.toUpperCase();
            return this.pelicula.filter(peli => 
                peli.title.toUpperCase().includes(buscarUpper)
            );
        },

        LLamarTendencia() {          
            const API_KEY = '3b5e72388c7203c96df4caf933255a83';
            const URL = `https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}`;
            axios.get(URL).then((respuesta) => {
                this.pelicula = respuesta.data.results; 
                this.mostrarTendencias = true;               
                console.log(respuesta);
            }).catch((error) => {
                console.error('Error al llamar a la API de tendencias:', error);
            });
        },

        LLamarPopular() {
            const API_KEY = '3b5e72388c7203c96df4caf933255a83';
            const URL = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}`;
            axios.get(URL).then((respuesta) => {
                this.pelicula = respuesta.data.results; 
                this.mostrarPopular = true;               
                console.log(respuesta);
            }).catch((error) => {
                console.error('Error al llamar a la API de populares:', error);
            });
        },

        LLamarPuntuada() {
            const API_KEY = '3b5e72388c7203c96df4caf933255a83';
            const URL = `https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}`;
            axios.get(URL).then((respuesta) => {
                this.pelicula = respuesta.data.results; 
                this.mostrarPuntuacion = true;               
                console.log(respuesta);
            }).catch((error) => {
                console.error('Error al llamar a la API de puntuadas:', error);
            });
        },

        LLamarGeneros() {
            const API_KEY = '3b5e72388c7203c96df4caf933255a83';
            const URL = `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}`;
            axios.get(URL).then((respuesta) => {
                this.pelicula = respuesta.data.genres; 
                console.log(respuesta);
            }).catch((error) => {
                console.error('Error al llamar a la API de géneros:', error);
            });
        },
    },
});

const app = inst.mount('#contenedor');

