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
            Swal.fire({
                title: "¿Estás seguro?",
                text: "Esto eliminará el producto del carrito.",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Sí, eliminar",
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
                iconColor: '#f27474'
            }).then((result) => {
                if (result.isConfirmed) {
                    // Eliminar el producto del carrito
                    this.carrito.splice(index, 1);
        
                    // Guardar el carrito actualizado en localStorage
                    localStorage.setItem('carrito', JSON.stringify(this.carrito));
        
                    // Confirmación de eliminación
                    Swal.fire({
                        title: "Eliminado",
                        text: "El producto ha sido eliminado del carrito.",
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
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                    // Acción cancelada
                    Swal.fire({
                        title: "Cancelado",
                        text: "El producto sigue en el carrito.",
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
        
        comprar() {
            if (this.carrito.length === 0) {
                Swal.fire({
                    title: "Carrito vacío",
                    text: "No hay productos en el carrito para comprar.",
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
                return;
            }
        
            // Crear un resumen de la compra
            const resumenCompra = this.carrito.map(item => `
                <div style="margin-bottom: 10px;">
                    <strong>${item.title}</strong><br>
                    Cantidad: ${item.cantidad}<br>
                    Subtotal: $${(item.cantidad * item.precio).toFixed(2)}
                </div>
            `).join("");
        
            const totalCompra = this.carrito.reduce((total, item) => total + (item.cantidad * item.precio), 0).toFixed(2);
        
            // Mostrar resumen en SweetAlert
            Swal.fire({
                title: "Resumen de tu compra",
                html: `
                    <div style="text-align: left; margin: 0 auto;">
                        ${resumenCompra}
                        <hr>
                        <strong>Total: $${totalCompra}</strong>
                    </div>
                `,
                icon: "success",
                confirmButtonText: "Confirmar compra",
                cancelButtonText: "Cancelar",
                showCancelButton: true,
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
                    // Vaciar el carrito y mostrar mensaje de confirmación
                    this.carrito = [];
                    localStorage.removeItem('carrito');
        
                    Swal.fire({
                        title: "¡Compra confirmada!",
                        text: "Gracias por tu compra.",
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
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                    Swal.fire({
                        title: "Compra cancelada",
                        text: "Tu carrito sigue intacto.",
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
        }
        
    },
    computed: {
        totalCarrito() {
            return this.carrito.reduce((total, item) => total + item.cantidad * item.precio, 0).toFixed(2);
        },
    },
});
appCarrito.mount('#carrito');
