import React, { useState } from 'react';
import './styles/SellProducts.css';
import MySellProducts from './components/MySellProducts';

function SellProducts() {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        thumbnails: [],
        code: '',
        stock: '',
        status: true,
        category: ''
    });

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        if (type === 'file') {
            const filesArray = Array.from(e.target.files);
            setFormData({
                ...formData,
                thumbnails: [...formData.thumbnails, ...filesArray]
            });
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.thumbnails.length === 0) {
            alert('Debe subir al menos una imagen.');
            return;
        }
        console.log(formData);
        setFormData({
            title: '',
            description: '',
            price: '',
            thumbnails: [],
            code: '',
            stock: '',
            status: true,
            category: ''
        });
    };

    const handleRemoveThumbnail = (index) => {
        const thumbnails = [...formData.thumbnails];
        thumbnails.splice(index, 1);
        setFormData({ ...formData, thumbnails });
    };

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
                            name="thumbnail"
                            onChange={handleChange}
                            accept="image/*"
                            multiple
                            required
                        />
                        <div className="thumbnails-preview">
                            {formData.thumbnails.map((thumbnail, index) => (
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
