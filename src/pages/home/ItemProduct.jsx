/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import axios from "axios";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "../../components/Loading";
import ErrorPage from "../../error/ErrorPage";
import './styles/ItemProduct.css'
import { REACT_APP_BASE_URL } from "../../utils/config";

function ItemProduct() {
    let { pid } = useParams();
    const navigate=useNavigate();
    const [product, setProduct] = useState([]);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setError(null)
        const fetchProducts = async () => {
            try {
                const response = await axios.get(`${REACT_APP_BASE_URL}/api/products/${pid}`);
                setProduct(response.data.payload);
                setLoading(false);
            } catch (error) {
                console.error(error.response.data.message)
                setError(error.response.data);
                setLoading(false);
            }
        };

        fetchProducts();
    }, [pid]);

    const handleIncrement = () => {
        if (quantity < product.stock) {
            setQuantity(quantity + 1);
        }
    };

    const handleDecrement = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };
    const AddToCart = async () => {
        try {
            const responseUser = await axios.get(`${REACT_APP_BASE_URL}/extractToken`, {
                withCredentials: true
            });
            await axios.post(`${REACT_APP_BASE_URL}/api/carts/${responseUser.data.cart}/product/${pid}`, {
                withCredentials: true
            });
        } catch (error) {
            if(error.response.statusText=="Forbidden"){
                console.log('no tiene acceso')
            }else if(error.response.statusText=="Unauthorized"){
                navigate('/auth/login')
            }else{
                console.log(error)
                setError(error.response.data);
            }
        }
    };

    if (loading) return <Loading />
    if (error) return <ErrorPage errorMessage={error} />
    return (
        <div className="item-product-container">
            <div className="product-images">
                <Slider dots infinite autoplay>
                    {product.thumbnail.map((image, index) => (
                        <img key={index} src={image} alt={product.title} />
                    ))}
                </Slider>
            </div>
            <div className="product-details">
                <h1 className="product-title">{product.title}</h1>
                <p className="product-description">{product.description}</p>
                <p className="product-info">Category: {product.category}</p>
                <p className="product-info">Precio: ${product.price}</p>
                <div className="quantity-container">
                    <button className="quantity-button" onClick={handleDecrement}>-</button>
                    <p>{quantity}</p>
                    <button className="quantity-button" onClick={handleIncrement}>+</button>
                </div>
                <p className="total-price">Total: ${product.price * quantity}</p>
                <button className="add-to-cart-button" onClick={AddToCart}>Agregar al carrito</button>
            </div>
        </div>
    )
}

export default ItemProduct