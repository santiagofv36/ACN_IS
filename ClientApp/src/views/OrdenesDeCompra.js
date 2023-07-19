import React, { useState } from 'react';

const OrdenesDeCompra = () => {
    const [busqueda, setBusqueda] = useState('');
    const [productoSeleccionado, setProductoSeleccionado] = useState(null);
    const [cantidad, setCantidad] = useState(0);
    const [fecha, setFecha] = useState('');
    const [descripcion, setDescripcion] = useState('');

    const buscarProductos = () => {
        // Lógica para buscar productos en el sistema
        // y mostrar los resultados en una lista desplegable
    };

    const handleProductoSeleccionado = (producto) => {
        setProductoSeleccionado(producto);
        // Mostrar la ventana emergente para ingresar la cantidad
    };

    const handleGuardarOrden = () => {
        // Lógica para guardar la orden de compra
    };

    return (
        <div className="container">
            <h2>Órdenes de compra</h2>
            <div className="search-bar">
                <input
                    type="text"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    placeholder="Buscar productos..."
                />
                <button onClick={buscarProductos}>Buscar</button>
            </div>

            {productoSeleccionado && (
                <div className="product-details">
                    <h3>Producto seleccionado: {productoSeleccionado.nombre}</h3>
                    <p>Precio: {productoSeleccionado.precio}</p>
                    <p>Stock disponible: {productoSeleccionado.stock}</p>
                    <label>
                        Cantidad:
                        <input
                            type="number"
                            value={cantidad}
                            onChange={(e) => setCantidad(e.target.value)}
                        />
                    </label>
                    <br />
                    <label>
                        Fecha de orden:
                        <input
                            type="date"
                            value={fecha}
                            onChange={(e) => setFecha(e.target.value)}
                        />
                    </label>
                    <br />
                    <label>
                        Descripción:
                        <textarea
                            value={descripcion}
                            onChange={(e) => setDescripcion(e.target.value)}
                        />
                    </label>
                    <br />
                    <button onClick={handleGuardarOrden}>Guardar orden de compra</button>
                </div>
            )}
        </div>
    );
};

export default OrdenesDeCompra;
