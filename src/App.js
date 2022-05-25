import axios from 'axios';
import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [user, setUser] = useState('');

  console.log(user);

  useEffect(() => {
    googleLogin();
  }, []);

  const getCookieValue = (key) => {
    let cookieKey = key + '=';
    let result = '';
    const cookieArr = document.cookie.split(';');

    for (let i = 0; i < cookieArr.length; i++) {
      if (cookieArr[i][0] === ' ') {
        cookieArr[i] = cookieArr[i].substring(1);
      }

      if (cookieArr[i].indexOf(cookieKey) === 0) {
        result = cookieArr[i].slice(cookieKey.length, cookieArr[i].length);
        return result;
      }
    }
    return result;
  };

  const googleLogin = async () => {
    const accessToken = getCookieValue('accessToken');
    axios
      .get('http://localhost:3000/users/auth', {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then((res) => {
        console.log(res);
        setUser(res.data);
      });
  };

  return (
    <div>
      <a href="http://localhost:3000/users/google">google</a>
    </div>
  );
}

export default App;
