import React from 'react'
import useUser from '../../api/user'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import moment from 'moment'
import { Link } from 'react-router-dom'
import { BackwardIcon } from '../../components/icons/backward'
import { RollbackIcon } from '../../components/icons/rollback'

export default function Rollback() {
  const { getUserHistoricalData, rollbackFromPreviousValue } = useUser()
  const queryClient = useQueryClient()

  const { data: infoHistory } = useQuery({
    queryKey: ['info-history'],
    queryFn: getUserHistoricalData,
  })

  const { mutateAsync } = useMutation({
    mutationFn: rollbackFromPreviousValue,
  })

  if (!infoHistory?.data || infoHistory?.data.length === 0)
    return <>No data history</>

  const handleRollback = async (previousValueId: string) => {
    toast.promise(
      mutateAsync({
        info_id: previousValueId,
      }),
      {
        loading: 'Loading rollback...',
        success: 'Rollback was succesfull!',
        error: 'Something bad happened on rollbacl',
      }
    )

    queryClient.invalidateQueries()
  }

  return (
    <>
      <Link
        className='flex items-center justify-center w-full p-2 mb-3 text-lg font-bold text-center text-white rounded-lg gap-x-3 bg-primary'
        to='/app'
      >
        <BackwardIcon className='fill-white' />
        Go back
      </Link>
      <table className='table-auto'>
        <thead className='text-white bg-primary'>
          <tr>
            <th>Info</th>
            <th>Created On</th>
            <th>Rollback</th>
          </tr>
        </thead>
        <tbody className='font-medium text-white bg-primary/75'>
          {infoHistory.data.map(({ id, info, created_on }) => {
            return (
              <tr key={id} className='hover:bg-primary/85'>
                <td className='p-2'>{info}</td>
                <td className='p-2'>
                  {moment(created_on).format('MMMM Do YYYY, h:mm:ss a')}
                </td>
                <td className='flex items-center justify-center p-2'>
                  <button onClick={() => handleRollback(id)}>
                    <RollbackIcon className='fill-white' />
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </>
  )
}
