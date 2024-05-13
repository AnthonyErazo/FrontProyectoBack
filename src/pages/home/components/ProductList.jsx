/* eslint-disable react/prop-types */
import { Link } from "react-router-dom"
import '../styles/ProductList.css'

function ProductList({ product }) {
    return (
        <li className="product-item">
            <img src={product.thumbnail[0]} alt={product.title} />
            <div className="product-description">
                <h3>{product.title}</h3>
                <p>{product.description}</p>
                <p>Precio: ${product.price}</p>
                <button className="view-more-button">
                    <Link to={`/product/${product.id}`}>Ver más</Link>
                </button>
            </div>
        </li>
    );
}

export default ProductList