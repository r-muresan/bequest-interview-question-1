// RegisterPage.js
import React from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';

const RegisterPage = () => {
  const history = useHistory();

  const validationSchema = yup.object({
    name: yup.string().required('Name is required'),
    email: yup.string().email('Invalid email').required('Email is required'),
    password: yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
    assetId: yup.string().required('Asset ID is required'),
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      assetId: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const response = await axios.post('http://localhost:8080/register', values);
        console.log('Registration successful', response.data);

        history.push('/login');
      } catch (error) {
        console.error('Registration failed', error);
         alert('Registration failed. Please try again.');
      }
    },
  });

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h2 className="text-center mb-4">Register</h2>

              <form onSubmit={formik.handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">Name:</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className={`form-control ${formik.touched.name && formik.errors.name ? 'is-invalid' : ''}`}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.name}
                  />
                  {formik.touched.name && formik.errors.name ? (
                    <div className="invalid-feedback">{formik.errors.name}</div>
                  ) : null}
                </div>

                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email:</label>
                  <input
                    type="text"
                    id="email"
                    name="email"
                    className={`form-control ${formik.touched.email && formik.errors.email ? 'is-invalid' : ''}`}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.email}
                  />
                  {formik.touched.email && formik.errors.email ? (
                    <div className="invalid-feedback">{formik.errors.email}</div>
                  ) : null}
                </div>

                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Password:</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    className={`form-control ${formik.touched.password && formik.errors.password ? 'is-invalid' : ''}`}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.password}
                  />
                  {formik.touched.password && formik.errors.password ? (
                    <div className="invalid-feedback">{formik.errors.password}</div>
                  ) : null}
                </div>

                <div className="mb-3">
                  <label htmlFor="assetId" className="form-label">Asset ID:</label>
                  <input
                    type="text"
                    id="assetId"
                    name="assetId"
                    className={`form-control ${formik.touched.assetId && formik.errors.assetId ? 'is-invalid' : ''}`}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.assetId}
                  />
                  {formik.touched.assetId && formik.errors.assetId ? (
                    <div className="invalid-feedback">{formik.errors.assetId}</div>
                  ) : null}
                </div>

                <div className="text-center">
                  <button type="submit" className="btn btn-primary">Register</button>
                </div>

                <div className="text-center mt-3">
                  <p>
                    Already have an account? <Link to="/login">Login here</Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
