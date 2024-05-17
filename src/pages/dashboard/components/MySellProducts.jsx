import React, { useEffect, useState } from 'react'
import { REACT_APP_BASE_URL } from '../../../utils/config';
import axios from 'axios';
import Loading from '../../../components/Loading';

function MySellProducts() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    useEffect(() => {
        setError(null)
        setLoading(true)
        const fetchProducts = async () => {
            try {
                const responseToken = await axios.get(`${REACT_APP_BASE_URL}/extractToken`, {
                    withCredentials: true
                });
                let response
                if (responseToken.data.role == 'admin') {
                    response = await axios.get(`${REACT_APP_BASE_URL}/api/products?&query={"status":"true","owner":"admin"}`);
                } else {
                    response = await axios.get(`${REACT_APP_BASE_URL}/api/products?&query={"status":"true","owner":"${responseToken.id}"}`);
                }
                setData(response.data.payload);
                setCurrentPage(response.data.page);
                setTotalPages(response.data.totalPages);
            } catch (error) {
                console.error(error.response.data.message)
                setError(error.response.data);
            }
        };

        fetchProducts();
        setLoading(false);
    }, []);
    const handleEditProduct=(pid)=>{
        
    }
    const handleEliminatedProduct=(pid)=>{

    }
    if(loading) return <Loading />
    return (
        <div>
            <table className="users-table">
                <thead>
                    <tr>
                        <th>Titulo</th>
                        <th>Precio</th>
                        <th>Stock</th>
                        <th>Estado</th>
                        <th>Categoria</th>
                        <th>Descripcion</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((data, index) => (
                        <tr key={index}>
                            <td>{data.title}</td>
                            <td>{data.price}</td>
                            <td>{data.stock}</td>
                            <td>{data.status==true?'Disponible':'No disponible'}</td>
                            <td>{data.category}</td>
                            <td>{data.description}</td>
                            <td>
                                <button onClick={()=>handleEditProduct(data._id)}>Editar</button>
                                <button onClick={()=>handleEliminatedProduct(data._id)}>Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default MySellProducts
