import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/UsersList.css';
import { REACT_APP_BASE_URL } from '../../../utils/config';

function UsersList() {
    const [usersData, setUsersData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get(`${REACT_APP_BASE_URL}/api/users?query={}`, {
                    withCredentials: true
                });
                setUsersData(response.data.payload);
                setLoading(false);
            } catch (error) {
                console.error(error);
            }
        };
        fetchUsers();
    }, []);

    const formatTimeAgo = (difference, unit) => {
        const roundedValue = Math.floor(difference);
        return `${roundedValue} ${unit}${unit=='mes'?'e':''}${roundedValue !== 1 ? 's' : ''}`;
    };
    
    const formatLastConnection = (lastConnection) => {
        if (lastConnection === true) {
            return 'Conectado';
        } else {
            const currentDate = new Date();
            const connectionDate = new Date(lastConnection);
            const difference = (currentDate.getTime() - connectionDate.getTime()) / 1000;
    
            if (difference < 60) {
                return formatTimeAgo(difference, 'segundo');
            } else if (difference < 3600) {
                return formatTimeAgo(difference / 60, 'minuto');
            } else if (difference < 86400) {
                return formatTimeAgo(difference / 3600, 'hora');
            } else if (difference < 2592000) {
                return formatTimeAgo(difference / 86400, 'día');
            } else if (difference < 31536000) {
                return formatTimeAgo(difference / 2592000, 'mes');
            } else {
                return formatTimeAgo(difference / 31536000, 'año');
            }
        }
    };
    

    if (loading) return <div className="loading"></div>;

    return (
        <div className="users-list-container">
            <h1>Lista de Usuarios</h1>
            <table className="users-table">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Apellido</th>
                        <th>Email</th>
                        <th>Rol</th>
                        <th>Última conexión</th>
                    </tr>
                </thead>
                <tbody>
                    {usersData.map((user, index) => (
                        <tr key={index}>
                            <td>{user.first_name}</td>
                            <td>{user.last_name}</td>
                            <td>{user.email}</td>
                            <td>{user.role}</td>
                            <td>hace {formatLastConnection(user.last_connection)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default UsersList;
