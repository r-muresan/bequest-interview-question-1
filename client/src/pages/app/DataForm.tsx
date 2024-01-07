import React from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast, { Toaster } from 'react-hot-toast'
import Spinner from '../../components/Spinner'
import useUser, { UpdateUserDataPayload } from '../../api/user'
import { useFormik } from 'formik'
import classNames from 'classnames'
import { useNavigate } from 'react-router-dom'

export default function DataForm() {
  const { updateUserData, getUserData, dataSchema } = useUser()
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const { data } = useQuery({
    queryKey: ['user-info'],
    queryFn: getUserData,
  })

  const { mutateAsync, isPending } = useMutation({
    mutationFn: updateUserData,
  })

  const onSubmit = async (payload: UpdateUserDataPayload) => {
    toast.promise(mutateAsync({ ...payload }), {
      loading: 'Loading user data...',
      success: 'User data load succesfully',
      error: 'Something went wrong updating user data',
    })

    queryClient.invalidateQueries()
  }

  const initialValues: UpdateUserDataPayload = {
    // @ts-expect-error Get actual info value
    data: data?.info ?? '',
  }

  const formik = useFormik({
    initialValues,
    onSubmit,
    validationSchema: dataSchema,
    enableReinitialize: true,
  })

  // @ts-expect-error Get integrity error message
  const dataIntegrityCheckFailed = data?.error?.message

  console.log({ data })

  return (
    <>
      {localStorage.getItem('token') && (
        <button
          className='p-3 font-bold text-white bg-red-500 rounded-lg'
          onClick={() => {
            localStorage.clear()
            navigate('/login')
          }}
        >
          Logout
        </button>
      )}{' '}
      <h1
        className={`mb-3 text-xl font-bold text-primary md:text-2xl xl:text-3xl ${
          dataIntegrityCheckFailed && 'text-red-500'
        }
        }`}
      >
        {dataIntegrityCheckFailed
          ? 'Your data integrity is in danger!'
          : 'Saved Data'}
      </h1>
      <form
        className='flex flex-col w-full gap-y-3'
        onSubmit={formik.handleSubmit}
      >
        <div className='flex flex-col'>
          <label className='font-bold' htmlFor='data'>
            Users data
          </label>
          <input
            className='p-2 text-xl border border-gray-500'
            placeholder='Write down your personal info...'
            type='text'
            name='data'
            value={formik.values.data}
            onChange={formik.handleChange}
          />
          {formik.errors.data && formik.touched.data && (
            <small className='text-primary'>{formik.errors.data}*</small>
          )}
        </div>

        <section className='flex flex-row justify-end gap-x-3'>
          <button
            className='w-full p-1 mb-2 text-sm font-bold text-white rounded-lg bg-primary sm:p-2 md:p-3 md:text-lg'
            // onClick={}
            type='submit'
          >
            {isPending ? <Spinner /> : 'Update Data'}
          </button>
        </section>
      </form>
      <RollbackUserInfoButton integrityCheckFailed={dataIntegrityCheckFailed} />
      <Toaster />
    </>
  )
}

function RollbackUserInfoButton(props: { integrityCheckFailed: boolean }) {
  const { integrityCheckFailed } = props
  const navigate = useNavigate()
  const { getUserHistoricalData, rollbackFromPreviousValue } = useUser()
  const queryClient = useQueryClient()

  const { data: infoHistory } = useQuery({
    queryKey: ['info-history'],
    queryFn: getUserHistoricalData,
  })

  const { mutateAsync, isPending } = useMutation({
    mutationFn: rollbackFromPreviousValue,
  })

  const handleDataHistory = async () => {
    if (!infoHistory) return

    if (integrityCheckFailed) {
      await mutateAsync({
        info_id: infoHistory.data[0].id,
      })

      queryClient.invalidateQueries()

      return
    }

    navigate('/rollback')
  }

  return (
    <button
      className={classNames(
        'p-1 text-sm w-full font-bold text-white rounded-lg bg-primary sm:p-2 md:p-3 md:text-lg disabled:bg-red-100',
        integrityCheckFailed && 'bg-red-500 '
      )}
      onClick={handleDataHistory}
      type='submit'
    >
      {isPending ? (
        <Spinner />
      ) : integrityCheckFailed ? (
        'Rollback from last value'
      ) : (
        'Get Data History'
      )}
    </button>
  )
}
