import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import validateManyFields from '../validations';
import Input from './utils/Input';
import Loader from './utils/Loader';
import './SignupForm.css'; // Import CSS file

const SignupForm = () => {
  const [formErrors, setFormErrors] = useState({});
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [fetchData, { loading }] = useFetch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validateManyFields('signup', formData);
    setFormErrors({});
    if (errors.length > 0) {
      setFormErrors(errors.reduce((total, ob) => ({ ...total, [ob.field]: ob.err }), {}));
      return;
    }

    const config = { url: '/auth/signup', method: 'post', data: formData };
    fetchData(config).then(() => {
      navigate('/login');
    });
  };

  const fieldError = (field) => (
    <p className={`signup-error ${formErrors[field] ? 'block' : ''}`}>
      <i className='fa-solid fa-circle-exclamation'></i> {formErrors[field]}
    </p>
  );

  return (
    <form className='signup-form'>
      {loading ? (
        <Loader />
      ) : (
        <>
          <h2>Welcome user, please signup here</h2>

          <div className='mb-4'>
            <label htmlFor='name' className='signup-label'>Name</label>
            <Input type='text' name='name' id='name' value={formData.name} placeholder='Your name' onChange={handleChange} />
            {fieldError('name')}
          </div>

          <div className='mb-4'>
            <label htmlFor='email' className='signup-label'>Email</label>
            <Input type='text' name='email' id='email' value={formData.email} placeholder='youremail@domain.com' onChange={handleChange} />
            {fieldError('email')}
          </div>

          <div className='mb-4'>
            <label htmlFor='password' className='signup-label'>Password</label>
            <Input type='password' name='password' id='password' value={formData.password} placeholder='Your password..' onChange={handleChange} />
            {fieldError('password')}
          </div>

          <button className='signup-button' onClick={handleSubmit}>Submit</button>

          <div>
            <Link to='/login' className='signup-link'>Already have an account? Login here</Link>
          </div>
        </>
      )}
    </form>
  );
};

export default SignupForm;
