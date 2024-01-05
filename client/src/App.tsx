import React, { useEffect, useState } from 'react'
import github from '/icons/github.svg'
import { GithubIcon } from './components/icons/github'

const API_URL = 'http://localhost:8080'

interface FormProps {
  onSubmit: (data: FormData) => void
}

interface FormData {
  data: string
}

function App() {
  const [formData, setFormData] = useState<FormData>({
    data: '',
  })

  const getData = async () => {
    const response = await fetch(API_URL)
    const { data } = await response.json()
    setFormData({ ...formData, data })
  }

  useEffect(() => {
    getData()
  }, [])

  const updateData = async () => {
    await fetch(API_URL, {
      method: 'POST',
      body: JSON.stringify({ data: formData.data }),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })

    await getData()
  }

  const verifyData = async () => {
    throw new Error('Not implemented')
  }

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target
    setFormData({ ...formData, [name]: value })
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
  }

  return (
    <div className='flex flex-col items-center justify-center w-full h-screen gap-y-3 bg-primary'>
      <img
        src='https://bequest.finance/wp-content/uploads/2023/09/Bequest-4-1-1024x512.png'
        width={300}
      />
      <article className='flex flex-col items-center w-1/2 px-4 py-6 border rounded-lg bg-secondary border-slate-200'>
        <h1 className='mb-3 text-xl font-bold text-primary md:text-2xl xl:text-3xl'>
          Saved Data
        </h1>

        <form className='flex flex-col w-full gap-y-3' onSubmit={handleSubmit}>
          <input
            className='p-2 text-xl border border-gray-500'
            placeholder='Write down some data...'
            type='text'
            name='data'
            value={formData.data}
            onChange={handleInputChange}
          />

          <section className='flex flex-row justify-end gap-x-3'>
            <button
              className='p-1 text-sm font-bold text-white rounded-lg bg-primary sm:p-2 md:p-3 md:text-lg'
              onClick={updateData}
              type='submit'
            >
              Update Data
            </button>
            <button
              className='p-1 text-sm font-bold text-white rounded-lg bg-primary sm:p-2 md:p-3 md:text-lg'
              onClick={verifyData}
              type='submit'
            >
              Verify Data
            </button>
            <button
              className='p-1 text-sm font-bold text-white rounded-lg bg-primary sm:p-2 md:p-3 md:text-lg'
              onClick={() => alert('Get data history')}
              type='submit'
            >
              Get Data History
            </button>
          </section>
        </form>
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
