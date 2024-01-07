import React from 'react'
import { useMutation } from '@tanstack/react-query'
import useAuth, { LoginPayload } from '../../api/auth'
import { useFormik } from 'formik'
import Spinner from '../../components/Spinner'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const { loginUser, userSchema } = useAuth()
  const navigate = useNavigate()

  const { mutateAsync, isPending, isError, error } = useMutation({
    mutationFn: loginUser,
  })

  const initialValues: LoginPayload = {
    email: '',
    password: '',
  }

  const onSubmit = async (payload: LoginPayload) => {
    mutateAsync({ ...payload })

    if (isError) {
      return toast.error(error.message)
    }

    toast.success('Login was successfull')
    navigate('/app')
  }

  const formik = useFormik({
    initialValues,
    onSubmit,
    validationSchema: userSchema,
  })

  return (
    <form className='flex flex-col gap-y-3' onSubmit={formik.handleSubmit}>
      <h2 className='text-xl font-bold text-center text-bold text-primary'>
        Login Form
      </h2>
      <div className='flex flex-col gap-y-2'>
        <label className='font-bold text-primary' htmlFor='email'>
          Email
        </label>
        <input
          className='p-2'
          type='email'
          name='email'
          onChange={formik.handleChange}
          value={formik.values.email}
          placeholder='Write down your email...'
        />
        {formik.errors.email && formik.touched.email && (
          <small className='text-primary'>{formik.errors.email}*</small>
        )}
      </div>

      <div className='flex flex-col gap-y-2'>
        <label className='font-bold text-primary' htmlFor='password'>
          Password
        </label>
        <input
          className='p-2'
          name='password'
          type='password'
          onChange={formik.handleChange}
          value={formik.values.password}
          placeholder='Write down your password...'
        />
        {formik.errors.password && formik.touched.password && (
          <small className='text-primary'>{formik.errors.password}*</small>
        )}
      </div>

      <button
        type='submit'
        className='flex justify-center p-3 font-bold text-white rounded-lg bg-primary hover:bg-primary/75 text-md'
      >
        {isPending ? <Spinner /> : 'Login'}
      </button>
    </form>
  )
}
