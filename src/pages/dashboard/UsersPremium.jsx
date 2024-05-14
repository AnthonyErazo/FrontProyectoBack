import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { REACT_APP_BASE_URL } from '../../utils/config';
import Loading from '../../components/Loading';

function UsersPremium() {
    const [usersData, setUsersData] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const fetchUsers = async () => {
        try {
            const response = await axios.get(`${REACT_APP_BASE_URL}/api/users/?query={"documents":{"$exists":true,"$ne":[]},"role":"user"}`, {
                withCredentials: true
            });
            setUsersData(response.data.payload);
        } catch (error) {
            console.error(error);
            
        }
    };
    useEffect(() => {
        fetchUsers();
        setLoading(false);
    }, []);
    const calculateAge = (birthdate) => {
        const today = new Date();
        const birthDate = new Date(birthdate);
        let age = today.getFullYear() - birthDate.getFullYear();
        const month = today.getMonth() - birthDate.getMonth();

        if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        return age;
    };
    const downloadDocuments = async (uid) => {
        try {
            const response = await axios.get(`${REACT_APP_BASE_URL}/api/users/documents/${uid}`, {
                responseType: 'blob',
                withCredentials: true
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));

            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `documentos_${uid}.zip`);
            document.body.appendChild(link);
            link.click();

            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error(error);
        }
    };
    const handleChangeRole = async (uid) => {
        setLoading(true)
        try {
            const response = await axios.post(`${REACT_APP_BASE_URL}/api/users/premium/${uid}`, {}, {
                withCredentials: true
            });
            console.log(response)
            fetchUsers();
            setLoading(false)
        } catch (error) {
            console.error(error);
        }
    }

    if (loading) return <Loading />
    return (
        <div style={{ margin: '100px' }}>
            <h1>Solicitudes a premium</h1>
            {usersData == 0 ? <p>No hay usuarios disponibles</p> :
                <table>
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Apellido</th>
                            <th>Documentos</th>
                            <th>Edad</th>
                            <th>Cambiar Role</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usersData.map((user, index) => (
                            <tr key={index}>
                                <td>{user.first_name}</td>
                                <td>{user.last_name}</td>
                                <td>
                                    <button onClick={() => downloadDocuments(user._id)}>Descargar Documentos</button>
                                </td>
                                <td>{calculateAge(user.birthdate)}</td>
                                <td>
                                    <button onClick={() => handleChangeRole(user._id)}>Cambiar Role</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>}
        </div>
    );
}

export default UsersPremium
