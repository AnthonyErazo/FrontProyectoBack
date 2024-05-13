import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "../../components/Loading";
import { REACT_APP_BASE_URL } from "../../utils/config";

function Cart() {
  let { cid } = useParams();
  const navigate=useNavigate()
  const [loading,setLoading]=useState(true);
  useEffect(() => {
    const fetchUser = async () => { 
      try {
        const response =await axios.get(`${REACT_APP_BASE_URL}/api/carts/${cid}`, {
          withCredentials: true
        });
        console.log(response)
        setLoading(false)
      } catch (error) {
        console.error(error.response.data.message)
        navigate('/auth/login')
      }
    };
    fetchUser();
  }, [])
  if(loading) return <Loading />
  return (
    <div>
      <h1>Mi Carrito</h1>
    </div>
  )
}

export default Cart