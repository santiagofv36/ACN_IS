import { useEffect, useState } from "react";
import DataTable from 'react-data-table-component';
import { Card, CardBody, CardHeader, Button, Modal, ModalHeader, ModalBody, Label, Input, FormGroup, ModalFooter, Row, Col } from "reactstrap"
import Swal from 'sweetalert2'

const modeloProducto = {
    idProducto :0,
    marca :"",
    descripcion :"",
    idCategoria :0,
    stock :0,
    precio: 0,
    esActivo: true
}

const Producto = () => {

    const [producto, setProducto] = useState(modeloProducto);
    const [pendiente, setPendiente] = useState(true);
    const [productos, setProductos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [verModal, setVerModal] = useState(false);
    const [filtro, setFiltro] = useState(""); // Nuevo estado para el filtro de búsqueda
    const [modoVisualizacion, setModoVisualizacion] = useState(false);
    const [codigoProducto, setCodigoProducto] = useState("");
    const [modoAgregar, setModoAgregar] = useState(false); // Nuevo estado para el modo de agregar

    const generarCodigoProducto = () => {
        const nuevoCodigo = productos.length + 1;
        const codigoGenerado = nuevoCodigo.toString().padStart(5, "0");

        setCodigoProducto(codigoGenerado);

        return codigoGenerado;
    };

    const handleChange = (e) => {
        let value;

        if (e.target.name === "idCategoria") {
            value = e.target.value;
        } else if (e.target.name === "esActivo") {
            value = e.target.value === "true" ? true : false;
        } else {
            value = e.target.value;
        }

        setProducto({
            ...producto,
            [e.target.name]: value
        });
    };

    const obtenerCategorias = async () => {
        let response = await fetch("api/categoria/Lista");
        if (response.ok) {
            let data = await response.json()
            setCategorias(data)
        }
    }

    const obtenerProductos = async () => {
        let response = await fetch("api/producto/Lista");

        if (response.ok) {
            let data = await response.json();

            // Actualiza la cantidad en stock y el precio de cada producto
            const productosActualizados = data.map((producto) => ({
                ...producto,
                stock: producto.stock,
                precio: producto.precio,
            }));

            setProductos(productosActualizados);
            setPendiente(false);
        }
    };

    useEffect(() => {
        obtenerCategorias();
        obtenerProductos();
    }, [])


    const columns = [
        {
            name: 'Codigo',
            selector: row => row.codigo,
            sortable: true,
        },
        {
            name: 'Producto',
            selector: row => row.marca,
            sortable: true,
        },
        {
            name: "Stock",
            selector: "stock",
            sortable: true,
        },
        {
            name: "Precio ($)",
            selector: "precio",
            sortable: true,
        },
        {
            name: 'Categoria',
            selector: row => row.idCategoriaNavigation,
            sortable: true,
            cell: row => (row.idCategoriaNavigation.descripcion)
        },
        {
            name: 'Estado',
            selector: row => row.esActivo,
            sortable: true,
            cell: row => {
                let clase;
                clase = row.esActivo ? "badge badge-info p-2" : "badge badge-danger p-2"
                return (
                    <span className={clase}>{row.esActivo ? "Activo" : "No Activo"}</span>
                )
            }
        },
        {
            name: '',
            cell: row => (
                <>
                    <Button color="primary" size="sm" className="mr-2"
                        onClick={() => abrirEditarModal(row)}
                    >
                        <i className="fas fa-pen-alt"></i>
                    </Button>

                    <Button color="info" size="sm" className="mr-2" onClick={() => abrirVerModal(row)}>
                        <i className="fas fa-eye"></i>
                    </Button>

                    <Button color="danger" size="sm"
                        onClick={() => eliminarProducto(row.idProducto)}
                    >
                        <i className="fas fa-trash-alt"></i>
                    </Button>
                </>
            ),
        },
    ];

    const customStyles = {
        headCells: {
            style: {
                fontSize: '13px',
                fontWeight: 800,
            },
        },
        headRow: {
            style: {
                backgroundColor: '#eee',
            },
        },
        table: {
            style: {
                width: '100%',
            },
        },
    };

    const paginationComponentOptions = {
        rowsPerPageText: 'Filas por página',
        rangeSeparatorText: 'de',
        selectAllRowsItem: true,
        selectAllRowsItemText: 'Todos',
    };

    const abrirEditarModal = (data) => {
        setProducto(data);
        setModoVisualizacion(false);
        setModoAgregar(false); // Restablecer el modo de agregar al abrir el modal de edición
        setVerModal(true);
    };

    const cerrarModal = () => {
        setProducto(modeloProducto);
        if (producto.idProducto !== 0) {
            setModoVisualizacion(false); // Restablecer el modo de visualización solo si se cierra el modal en modo de edición
        }
        setVerModal(false);
    };

    const guardarCambios = async () => {                                            //Modificar existencias 
        if (producto.marca.trim() === "") {
            Swal.fire("Opp!", 'El campo "Producto" es obligatorio.', "warning");
            return;
        }

        if (producto.stock <= 0 || producto.stock >= 999) {
            Swal.fire(
                "Opp!",
                'El campo "Stock" debe ser mayor a 0 y menor a 999.',
                "warning"
            );
            return;
        }

        if (producto.precio <= 0 || producto.precio >= 10000) {
            Swal.fire(
                "Opp!",
                'El campo "Precio" debe ser mayor a 0 y menor a 10000.',
                "warning"
            );
            return;
        }

        delete producto.idCategoriaNavigation;

        let response;
        if (producto.idProducto === 0) {
            const codigoProducto = generarCodigoProducto(); // Genera el código del producto
            const nuevoProducto = { ...producto, codigo: codigoProducto }; // Agrega el código generado al producto

            response = await fetch("api/producto/Guardar", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json;charset=utf-8",
                },
                body: JSON.stringify(nuevoProducto),
            });
        } else {
            response = await fetch("api/producto/Editar", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json;charset=utf-8",
                },
                body: JSON.stringify(producto),
            });
        }

        if (response.ok) {
            await obtenerProductos();
            setProducto(modeloProducto);
            setVerModal(!verModal);
        } else {
            Swal.fire("Opp!", "No se pudo guardar.", "warning");
        }
    };



    const eliminarProducto = async (id) => {

        Swal.fire({
            title: 'Esta seguro?',
            text: "Desea eliminar el producto",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, continuar',
            cancelButtonText: 'No, volver'
        }).then((result) => {
            if (result.isConfirmed) {

                const response = fetch("api/producto/Eliminar/" + id, { method: "DELETE" })
                    .then(response => {
                        if (response.ok) {

                            obtenerProductos();

                            Swal.fire(
                                'Eliminado!',
                                'El producto fue eliminado.',
                                'success'
                            )
                        }
                    })
            }
        })
    }

    const productosFiltrados = productos.filter(
        (producto) =>
            producto.codigo.toLowerCase().includes(filtro.toLowerCase()) ||
            producto.marca.toLowerCase().includes(filtro.toLowerCase()) ||
            producto.descripcion.toLowerCase().includes(filtro.toLowerCase()) ||
            producto.idCategoriaNavigation.descripcion.includes(filtro)
    );

    const abrirVerModal = (data) => {
        setProducto(data);
        setCodigoProducto(data.codigo);
        setModoVisualizacion(true);
        setModoAgregar(false); // Restablecer el modo de agregar al abrir el modal de visualización
        setVerModal(true);
    };

    return (
        <>
            <Card>
                <CardHeader style={{ backgroundColor: '#4e73df', color: 'white' }}>
                    Lista de Productos
                </CardHeader>
                <CardBody>
                    <div className="d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center">
                            <Button
                                color="success"
                                size="sm"
                                onClick={() => {
                                    setModoAgregar(true); // Establecer el modo de agregar cuando se hace clic en "Nuevo Producto"
                                    setVerModal(true);
                                }}
                                className="mr-2"
                            >
                                Nuevo Producto
                            </Button>
                            <input
                                type="text"
                                placeholder="Buscar producto..."
                                value={filtro}
                                onChange={(e) => setFiltro(e.target.value)}
                            />
                        </div>
                    </div>
                    <hr />
                    <div style={{ overflowX: 'auto' }}>
                        <DataTable
                            columns={columns}
                            data={productosFiltrados}
                            progressPending={pendiente}
                            pagination
                            paginationComponentOptions={paginationComponentOptions}
                            customStyles={customStyles}
                        />
                    </div>
                </CardBody>
            </Card>


            <Modal isOpen={verModal}>
                <ModalHeader>
                    {modoVisualizacion
                        ? "Detalle de Producto"
                        : modoAgregar
                            ? "Agregar Producto" // Mostrar el título "Agregar Producto" si está en modo de agregar
                            : "Editar Producto"}
                </ModalHeader>
                <ModalBody>
                    <Row>
                        <Col sm={6}>
                            <FormGroup>
                                <Label>Codigo</Label>
                                <Input
                                    bsSize="sm"
                                    name="codigo"
                                    onChange={handleChange}
                                    value={producto.idProducto === 0 ? codigoProducto : producto.codigo}
                                    readOnly={true}
                                />
                            </FormGroup>
                        </Col>
                        <Col sm={6}>
                            <FormGroup>
                                <Label>Producto</Label>
                                <Input bsSize="sm" name="marca" onChange={handleChange} value={producto.marca} readOnly={modoVisualizacion} />
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col sm={6}>
                            <FormGroup>
                                <Label>Descripcion</Label>
                                <Input bsSize="sm" name="descripcion" onChange={handleChange} value={producto.descripcion} readOnly={modoVisualizacion} />
                            </FormGroup>
                        </Col>
                        <Col sm={6}>
                            <FormGroup>
                                <Label>Categoria</Label>
                                <Input
                                    type="select"
                                    name="idCategoria"
                                    value={producto.idCategoria}
                                    onChange={handleChange}
                                    readOnly={modoVisualizacion}
                                    disabled={modoVisualizacion} // Cambio aquí
                                >
                                    <option value={0}>Seleccionar</option>
                                    {categorias.map((item) => {
                                        if (item.esActivo)
                                            return (
                                                <option key={item.idCategoria} value={item.idCategoria}>
                                                    {item.descripcion}
                                                </option>
                                            );
                                    })}
                                </Input>

                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col sm={6}>
                            <FormGroup>
                                <Label>Stock</Label>
                                <Input bsSize="sm" name="stock" onChange={handleChange} value={producto.stock} type="number" readOnly={modoVisualizacion} />
                            </FormGroup>
                        </Col>
                        <Col sm={6}>
                            <FormGroup>
                                <Label>Precio ($)</Label>
                                <Input bsSize="sm" name="precio" onChange={handleChange} value={producto.precio} type="number" readOnly={modoVisualizacion} />
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col sm="6" >
                            <FormGroup>
                                <Label>Estado</Label>
                                <Input bsSize="sm" type="select" name="esActivo" onChange={handleChange} value={producto.esActivo} disabled={modoVisualizacion}>
                                    <option value={true}>Activo</option>
                                    <option value={false}>No Activo</option>
                                </Input>
                            </FormGroup>
                        </Col>
                    </Row>
                </ModalBody>
                <ModalFooter>
                    {!modoVisualizacion && (
                        <Button size="sm" color="primary" onClick={guardarCambios}>
                            Guardar
                        </Button>
                    )}
                    <Button size="sm" color="danger" onClick={cerrarModal}>
                        Cerrar
                    </Button>
                </ModalFooter>
            </Modal>
        </>
    )
}

export default Producto;