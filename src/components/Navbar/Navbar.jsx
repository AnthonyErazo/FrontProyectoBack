import { Link, useNavigate } from 'react-router-dom'
import './Navbar.css'
import { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { REACT_APP_BASE_URL } from '../../utils/config';

function Navbar() {
  const [searchValue, setSearchValue] = useState('');
  const [showAccount, setShowAccount] = useState(false);
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userAuth, setUserAuth] = useState(false);
  const [userData,setUserData]=useState(null)
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response=await axios.get(`${REACT_APP_BASE_URL}/extractToken`, {
          withCredentials: true
        });
        console.log(response)
        setUserData(response?.data)
        setUserAuth(true)
      } catch (error) {
        console.error(error.response.data.message)
        setUserAuth(false)
      }
    };
    fetchUser();
  }, [])

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearchItem(searchValue);
    }
  }
  const handleSearchItem = (value) => {
    if (searchValue) {
      navigate(`/search/${value}`);
    }
  }
  const logoutSession = () => {
    setLoading(true)
    const fetchProducts = async () => {
      try {
        setShowAccount(false)
        setCartUser(null)
        setUserData(null)
        const response = await axios.get(`${REACT_APP_BASE_URL}/api/sessions/logout`, {
          withCredentials: true
        });
        console.log(response)
        setLoading(false);
        setUserAuth(false)
      } catch (error) {
        console.error(error.response.data.message)
        const alertError = {
          id_toast: new Date().toString(),
          message: error.response.data.cause,
          duration: 4600,
          type: 'error',
          status_code: 400
        };
        setAlert(alertError)
        setLoading(false);
      }
    };

    fetchProducts();
  }
  const accountLinks = useMemo(() => {
    if (userAuth) {
      return (
        <>
          <li><Link onClick={()=>setShowAccount(false)} to='/dashboard'>My Account</Link></li>
          <li><Link onClick={logoutSession}>Logout <i className='ri-logout-box-r-line'></i></Link></li>
        </>
      );
    } else {
      return (
        <>
          <li><Link to='/auth/register'>Register</Link></li>
          <li><Link to='/auth/login'>Login <i className='ri-logout-box-line'></i></Link></li>
        </>
      );
    }
  }, [userAuth]);
  return (
    <header>
      <div className='container-logo'>
        <Link className='logo' to="/">
          <img src={`../../assets/logo.png`} alt="logo" />
          <p>OnlineShop</p>
        </Link>
      </div>

      <div className='search-bar'>
        <input type="text"
          placeholder='Hola, ¿Qué estás buscando?'
          className='search'
          id="searchInput"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        <i className='ri-search-line' onClick={() => handleSearchItem(searchValue)} ></i>
      </div>

      <div className="icons">
        <div className={`account ${showAccount ? 'active' : ''}`}>
          <div className='account-button' onClick={() => setShowAccount(!showAccount)}>
            <i className='ri-user-line' ></i>
            <p>My account</p>
            <i className='ri-arrow-down-s-line' ></i>
          </div>
          {showAccount && (
            <div className='account-bar'>
              <ul>
                {accountLinks}
              </ul>
            </div>
          )}
        </div>
        <Link className='cart' to={`/cart/${userData?.cart}`}>
          <i className='ri-shopping-cart-2-fill' ></i>
        </Link>
      </div>
    </header >
  )
}

export default Navbar