import React, { useState } from 'react';
import './styles/SellProducts.css';
import axios from 'axios';
import MySellProducts from './components/MySellProducts';
import Loading from '../../components/Loading';
import { REACT_APP_BASE_URL } from '../../utils/config';

function SellProducts() {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        code: '',
        stock: '',
        status: true,
        category: ''
    });
    const [thumbnails, setThumbnails] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleThumbnailChange = (e) => {
        const filesArray = Array.from(e.target.files);
        setThumbnails([...thumbnails, ...filesArray]);
    };

    const handleSubmit = async (e) => {
        setLoading(true)
        e.preventDefault();

        try {

            const images = new FormData();
            thumbnails.forEach((image) => {
                images.append('file', image);
            });

            const reponseImage=await axios.post(`${REACT_APP_BASE_URL}/upload-to-firebase`, images, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log(reponseImage.data.urls)
            const productData = {
                ...formData,
                thumbnail: [...reponseImage.data.urls]
            };
            console.log(productData)
            const productResponse = await axios.post(`${REACT_APP_BASE_URL}/api/products/`, productData, {
                withCredentials: true
            });

            setFormData({
                title: '',
                description: '',
                price: '',
                code: '',
                stock: '',
                status: true,
                category: ''
            });
            setThumbnails([]);
            setLoading(false)
        } catch (error) {
            console.error('Error al enviar el formulario:', error); 
        }
    };

    const handleRemoveThumbnail = (index) => {
        const newThumbnails = [...thumbnails];
        newThumbnails.splice(index, 1);
        setThumbnails(newThumbnails);
    };

    if(loading) return <Loading />
    return (
        <>
            <div className="sell-products-container">
                <h2>Vender Producto</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-field">
                        <label htmlFor="title">Título:</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-field">
                        <label htmlFor="description">Descripción:</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                        ></textarea>
                    </div>
                    <div className="form-field">
                        <label htmlFor="price">Precio:</label>
                        <input
                            type="number"
                            id="price"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-field">
                        <label htmlFor="thumbnail">Thumbnail:</label>
                        <input
                            type="file"
                            id="thumbnail"
                            name="file"
                            onChange={handleThumbnailChange}
                            accept="image/*"
                            multiple
                            required
                        />
                        <div className="thumbnails-preview">
                            {thumbnails.map((thumbnail, index) => (
                                <div key={index} className="thumbnail-item">
                                    <img src={URL.createObjectURL(thumbnail)} alt={`Thumbnail ${index + 1}`} className="thumbnail-image" />
                                    <button type="button" onClick={() => handleRemoveThumbnail(index)} className="remove-thumbnail-button">Eliminar</button>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="form-field">
                        <label htmlFor="code">Código:</label>
                        <input
                            type="number"
                            id="code"
                            name="code"
                            value={formData.code}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-field">
                        <label htmlFor="stock">Stock:</label>
                        <input
                            type="number"
                            id="stock"
                            name="stock"
                            value={formData.stock}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-field">
                        <label htmlFor="category">Categoría:</label>
                        <input
                            type="text"
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button type="submit" className="submit-button">Poner en venta</button>
                </form>
            </div>
            <div>
                <h1>Mis productos en venta</h1>
                <MySellProducts />
            </div>
        </>
    );
}

export default SellProducts;
