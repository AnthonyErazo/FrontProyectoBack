/* eslint-disable no-unused-vars */

import { useEffect, useState } from "react"
import axios from "axios";
import { useParams } from "react-router-dom";
import ErrorPage from "../../error/ErrorPage";
import Loading from "../../components/Loading";
import ProductList from "./components/ProductList";

/* eslint-disable react/prop-types */
function SearchPage() {
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const { term } = useParams();

    useEffect(() => {
        setError(null)
        setLoading(true)
        const fetchProducts = async () => {
            try {
                const response = await axios.get(`${REACT_APP_BASE_URL}/api/products?term=${term}&query={"status":"true"}`);
                setData(response.data.payload);
                setLoading(false);
            } catch (error) {
                console.error(error.response.data.message)
                setError(error.response.data)
                setLoading(false);
            }
        };

        fetchProducts();
    }, [term])
    if (loading) return <Loading />
    if (error) return <ErrorPage errorMessage={error} />
    return (
        <div>
            {data.map((product) => (
                <ProductList key={product.id} product={product} />
            ))}
        </div>
    )
}

export default SearchPage