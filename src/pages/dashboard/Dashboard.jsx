import React, { useEffect, useState } from "react";
import axios from "axios";
import Loading from "../../components/Loading";
import { Link, useNavigate } from "react-router-dom";
import UsersList from "./components/UsersList";
import "./styles/Dashboard.css";
import { REACT_APP_BASE_URL } from "../../utils/config";

function Dashboard() {
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const responseToken = await axios.get(`${REACT_APP_BASE_URL}/extractToken`, {
          withCredentials: true
        });
        console.log(responseToken)
        setUserData(responseToken.data);
        if (responseToken.data.role !== "admin") {
          const response = await axios.get(`${REACT_APP_BASE_URL}/api/users/${responseToken.data.id}`, {
            withCredentials: true
          });
          setUserData(response.data.payload);
        }
        setLoading(false);
      } catch (error) {
        console.error(error.response.data.message);
        navigate('/auth/login');
      }
    };
    fetchUser();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day < 10 ? '0' + day : day}/${month < 10 ? '0' + month : month}/${year}`;
  };

  const eliminatedInactive = () => {
    setLoading(true);
    const fetchUserInactive = async () => {
      try {
        const response = await axios.delete(`${REACT_APP_BASE_URL}/api/users/`, {
          withCredentials: true
        });
        setLoading(false);
      } catch (error) {
        console.error(error.response.data.message);
      }
    };
    fetchUserInactive();
  };
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleFileUpload = async () => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await axios.post(`${REACT_APP_BASE_URL}/api/upload`, formData, {
        withCredentials: true
      });
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="dashboard-container">
      <div className="user-info">
        {userData.role === 'admin' ? (
          <h1>Bienvenido Admin</h1>
        ) : (
          <>
            <h1>Bienvenido Usuario: {userData.first_name + ' ' + userData.last_name}</h1>
            <p>Fecha de nacimiento: {formatDate(userData.birthdate)}</p>
          </>
        )}
        <p>Email: {userData.email}</p>
        <p>Role: {userData.role}</p>
      </div>
      {userData.role != 'user' &&
        <div>
          <button>
            <Link to={`/dashboard/sellproduct`}>Agregar o quitar productos</Link>
          </button>
          {userData.role=='admin'&&<><button>
            <Link to={``}>Solicitudes a premium</Link>
          </button>
          <button onClick={eliminatedInactive}>
            Eliminar usuarios inactivos
          </button></>}
        </div>
      }
      {userData.role === 'user' && (
        <>
          <h1>Cambiar a usuario premium</h1>
          <input type="file" onChange={handleFileChange} />
          <button onClick={handleFileUpload}>Subir Archivo</button>
          <p>Nota: debe subir su dni y documento firmado</p>
        </>
      )}
      {userData.role === 'admin' && <UsersList />}
    </div>
  );
}

export default Dashboard;
