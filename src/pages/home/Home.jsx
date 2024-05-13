import { useEffect, useState } from "react";
import axios from "axios";
import Loading from "../../components/Loading";
import ProductList from "./components/ProductList";
import ErrorPage from "../../error/ErrorPage";
import './styles/Home.css'
import { REACT_APP_BASE_URL } from "../../utils/config";

function Home() {
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
        const response = await axios.get(`${REACT_APP_BASE_URL}/api/products?&query={"status":"true"}`, {
          withCredentials: true
      });
        setData(response.data);
        setCurrentPage(response.data.page);
        setTotalPages(response.data.totalPages);
        setLoading(false);
      } catch (error) {
        console.error(error.response.data.message)
        setError(error.response.data);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    setError(null)
    setLoading(true)
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${REACT_APP_BASE_URL}/api/products?limit=10&page=${currentPage}&query={"status":"true"}`, {
          withCredentials: true
      });
        setData(response.data);
        setCurrentPage(response.data.page);
        setTotalPages(response.data.totalPages);
        setLoading(false);
      } catch (error) {
        console.error(error.response.data.message)
        setError(error.response.data);
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentPage]);

  const getPageButtons = () => {
    const buttons = [];
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, start + 4);
    if (end - start < 4) {
      start = Math.max(1, end - 4);
    }
    for (let i = start; i <= end; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => setCurrentPage(i)}
          style={{ backgroundColor: currentPage === i ? "darkgray" : "" }}
        >
          {i}
        </button>
      );
    }
    if (start > 1) {
      buttons.unshift(
        <span key="prevEllipsis">...</span>
      );
    }
    if (end < totalPages) {
      buttons.push(
        <span key="nextEllipsis">...</span>
      );
    }
    return buttons;
  };

  if (loading) return <Loading />
  if (error) return <ErrorPage errorMessage={error} />

  return (
    <div className="home-container">
      <div className="pagination">
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={!data.hasPrevPage}
        >
          Anterior
        </button>
        {getPageButtons()}
        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={!data.hasNextPage}
        >
          Siguiente
        </button>
      </div>
      <div className="products-container">
        <h1>Productos</h1>
        <ul className="product-list">
          {data.payload.map((product) => (
            <ProductList key={product.id} product={product} />
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Home;
