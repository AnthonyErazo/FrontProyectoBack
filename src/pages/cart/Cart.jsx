import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "../../components/Loading";
import { REACT_APP_BASE_URL } from "../../utils/config";
import "./styles/Cart.css";

function Cart() {
  let { cid } = useParams();
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true);
  const [cartProducts, setCartProducts] = useState([]);
  const [priceTotal, setPriceTotal] = useState(0);
  
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await axios.get(`${REACT_APP_BASE_URL}/api/carts/${cid}`, {
          withCredentials: true
        });
        setCartProducts(response.data.data.products);
        let total = 0;
        response.data.data.products.forEach(cart => {
          total += (cart.product.price * cart.quantity);
        });
        setPriceTotal(total);
        setLoading(false);
      } catch (error) {
        console.error(error.response.data.message)
        navigate('/auth/login')
      }
    };
    fetchCart();
  }, []);

  const buyProducts=()=>{
    const fetchCart = async () => {
      try {
        const response = await axios.post(`${REACT_APP_BASE_URL}/api/carts/${cid}/purchase`, {
          withCredentials: true
        });
      } catch (error) {
        console.error(error.response.data.message)
      }
    };
    fetchCart();
  }
  const eliminatedProductCart=(pid)=>{
    console.log(pid)
    const fetchCart = async () => {
      try {
        const response = await axios.delete(`${REACT_APP_BASE_URL}/api/carts/${cid}/products/${pid}`, {
          withCredentials: true
        });
      } catch (error) {
        console.error(error.response.data.message)
      }
    };
    fetchCart();
  }
  const eliminatedAllProductCart=()=>{
    const fetchCart = async () => {
      try {
        const response = await axios.delete(`${REACT_APP_BASE_URL}/api/carts/${cid}`, {
          withCredentials: true
        });
      } catch (error) {
        console.error(error.response.data.message)
      }
    };
    fetchCart();
  }

  if (loading) return <Loading />;

  return (
    <>
      <div className="cart-container">
        <h1 className="cart-title">Mi Carrito</h1>
        <div className="column-names">
          <p>Titulo</p>
          <p>Imagen</p>
          <p>Cantidad</p>
          <p>Precio</p>
          <p>Subtotal</p>
          <p>Acciones</p>
        </div>
        {cartProducts.map((cart, index) => (
          <div className="cart-item" key={index}>
            <div className="cart-item-title">{cart.product.title}</div>
            <div className="cart-item-image">
              <img src={cart.product.thumbnail[0]} alt={cart.product.title} />
            </div>
            <div className="cart-item-quantity">{cart.quantity}</div>
            <div className="cart-item-price">${cart.product.price}</div>
            <div className="cart-item-subtotal">${cart.product.price * cart.quantity}</div>
            <div className="cart-item-actions">
              <button className="cart-item-button" onClick={()=>eliminatedProductCart(cart.product._id)}>Eliminar</button>
            </div>
          </div>
        ))}
        <p className="cart-total">Total: ${priceTotal}</p>
      </div>
      <button className="buy-button" onClick={buyProducts}>Comprar</button>
      <button className="buy-button" onClick={eliminatedAllProductCart}>eliminar todo</button>
      <button className="buy-button">Mis tickets</button>
    </>
  );
}

export default Cart;
