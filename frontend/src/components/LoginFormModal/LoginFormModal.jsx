// frontend/src/components/LoginFormModal/LoginFormModal.jsx

import { useState } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import './LoginFormModal.css';

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleDemoLogin = (e) => {
    e.preventDefault();
    setErrors({});

    const demoCredentials = {
      credential: 'Demo-lition',
      password: 'password'
    }

    return dispatch(sessionActions.login(demoCredentials))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data?.errors) {
          console.log(data.errors);
          setErrors(data.errors);
        }
      });
  };

  return (
    <>
      <h1>Log In</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Username or Email
          <input
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        {errors.credential && <p className="errors">{errors.credential}</p>}
        {errors.password && <p className="errors">{errors.password}</p>}
        <button type="submit" /*disabled={credential.length < 4 || password.length < 6}*/>Log In</button>
      </form>

      <div className="demo-link-container">
        <button type="button" className="demo-link" onClick={handleDemoLogin}>
          Log in as Demo User
        </button>
      </div>
    </>
  );
}

export default LoginFormModal;