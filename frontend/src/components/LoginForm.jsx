import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import validateManyFields from '../validations';
import Input from './utils/Input';
import { useDispatch, useSelector } from "react-redux";
import { postLoginData } from '../redux/actions/authActions';
import Loader from './utils/Loader';
import './LoginForm.css'; // Import CSS file

const LoginForm = ({ redirectUrl }) => {
  const [formErrors, setFormErrors] = useState({});
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const navigate = useNavigate();
  const authState = useSelector(state => state.authReducer);
  const { loading, isLoggedIn } = authState;
  const dispatch = useDispatch();

  useEffect(() => {
    if (isLoggedIn) {
      navigate(redirectUrl || "/");
    }
  }, [authState, redirectUrl, isLoggedIn, navigate]);

  const handleChange = e => {
    setFormData({
      ...formData, [e.target.name]: e.target.value
    });
  };

  const handleSubmit = e => {
    e.preventDefault();
    const errors = validateManyFields("login", formData);
    setFormErrors({});
    if (errors.length > 0) {
      setFormErrors(errors.reduce((total, ob) => ({ ...total, [ob.field]: ob.err }), {}));
      return;
    }
    dispatch(postLoginData(formData.email, formData.password));
  };

  const fieldError = (field) => (
    <p className={`error-text ${formErrors[field] ? "block" : ""}`}>
      <i className='mr-2 fa-solid fa-circle-exclamation'></i>
      {formErrors[field]}
    </p>
  );

  return (
    <form className='login-form-container'>
      {loading ? (
        <Loader />
      ) : (
        <>
          <h2>Welcome user, please login here</h2>
          <div className="mb-4">
            <label htmlFor="email">Email<span className="text-red-500">*</span></label>
            <Input type="text" name="email" id="email" value={formData.email} placeholder="youremail@domain.com" onChange={handleChange} />
            {fieldError("email")}
          </div>

          <div className="mb-4">
            <label htmlFor="password">Password<span className="text-red-500">*</span></label>
            <Input type="password" name="password" id="password" value={formData.password} placeholder="Your password.." onChange={handleChange} />
            {fieldError("password")}
          </div>

          <button onClick={handleSubmit}>Submit</button>

          <div className='signup-link'>
            <Link to="/signup">Don't have an account? Signup here</Link>
          </div>
        </>
      )}
    </form>
  );
};

export default LoginForm;
