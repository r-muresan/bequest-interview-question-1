import React from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';

const LoginPage = () => {
  const history = useHistory();

  const validationSchema = yup.object({
    email: yup.string().email('Invalid email').required('Email is required'),
    password: yup.string().required('Password is required'),
  });

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        const api = axios.create({
          baseURL: 'http://localhost:8080',
        });

        const response = await api.post('/login', values);
 const accessToken = response.data.accessToken;

      // Save the token to local storage for future requests
      localStorage.setItem('accessToken', accessToken);

      // Redirect to the view page
      setTimeout(()=>{
        history.push('/view');
      },600)
      
      
      } catch (error) {
        console.error('Login failed', error);
        // Display a warning note in case of an error
        setErrors({ loginError: 'Invalid email or password. Please try again.' });
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h2 className="text-center mb-4">Login</h2>

              {formik.errors.loginError && (
                <div className="alert alert-warning" role="alert">
                  {formik.errors.loginError}
                </div>
              )}

              <form onSubmit={formik.handleSubmit}>
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

                <div className="text-center">
                  <button type="submit" className="btn btn-primary">Login</button>
                </div>

                <div className="text-center mt-3">
                  <p>
                    Don't have an account? <Link to="/register">Register here</Link>
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

export default LoginPage;
