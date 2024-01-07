import React, { useEffect } from 'react'
import { GithubIcon } from './components/icons/github'
import { Outlet, useNavigate } from 'react-router-dom'
import { type User } from './api/auth'
import { useQuery } from '@tanstack/react-query'
import useUser from './api/user'

function App() {
  const { verifyUser } = useUser()
  const navigate = useNavigate()

  const { data: user, isLoading } = useQuery<User | undefined>({
    queryKey: ['verify-user'],
    queryFn: verifyUser,
  })

  useEffect(() => {
    // @ts-expect-error expected user.error in invalid token
    if (user && !user.error) {
      return navigate('/app')
    }

    return navigate('/login')
  }, [user, isLoading])

  if (isLoading) return <>Loading...</>

  return (
    <div className='flex flex-col items-center justify-center w-full h-screen gap-y-3 bg-primary'>
      <img
        src='https://bequest.finance/wp-content/uploads/2023/09/Bequest-4-1-1024x512.png'
        width={300}
      />
      <article className='flex flex-col items-center w-auto px-4 py-6 border rounded-lg bg-secondary border-slate-200'>
        <Outlet />
      </article>

      <footer className='flex items-center justify-center w-1/2 text-white gap-x-1'>
        <p className='flex items-center justify-center'>
          &copy; Copyright 2024
        </p>

        <a
          className='underline'
          href='https://github.com/r-muresan/bequest-interview-question-1'
        >
          From Bequest Interview Question #1
        </a>

        <a
          className='underline'
          href='https://www.linkedin.com/in/christopher-tineo-4a950817a/'
        >
          By Christopher Tineo
        </a>

        <a href='https://www.github.com/TineoC'>
          <GithubIcon className='fill-white' />
        </a>
      </footer>
    </div>
  )
}

export default App
