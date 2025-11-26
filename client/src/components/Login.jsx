
import React, { useContext, useState } from 'react';
import { AuthenticationContext } from '../context/AuthenticationContextProvider';

const Login = ({setIsLoginBox}) => {
  const {setEmail, setPassword, login, error} = useContext(AuthenticationContext);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    await login();
    setIsLoading(false);
  }

  return (
    <form className="authForm" onSubmit={handleLogin}>
        <h2>Login</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <div className="form-floating mb-3 authFormInputs">
            <input 
              type="email" 
              className="form-control" 
              id="floatingInput" 
              placeholder="name@example.com" 
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
            <label htmlFor="floatingInput">Email address</label>
        </div>
        <div className="form-floating mb-3 authFormInputs">
            <input 
              type="password" 
              className="form-control" 
              id="floatingPassword" 
              placeholder="Password" 
              onChange={(e) => setPassword(e.target.value)}
              required 
            /> 
            <label htmlFor="floatingPassword">Password</label>
        </div>
        <button 
          type="submit" 
          className="btn btn-primary" 
          disabled={isLoading}
        >
          {isLoading ? 'Signing in...' : 'Sign in'}
        </button>

        <p>Not registered? <span onClick={()=> setIsLoginBox(false)}>Register</span></p>
    </form>
  );
}

export default Login;
