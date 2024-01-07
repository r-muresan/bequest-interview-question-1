import React, { useEffect, useState } from 'react'

interface FormData {
  data: string
}

export default function DataForm() {
  const [formData, setFormData] = useState<FormData>({
    data: '',
  })

  const getData = async () => {
    const response = await fetch('')
    const { data } = await response.json()
    setFormData({ ...formData, data })
  }

  useEffect(() => {
    getData()
  }, [])

  const updateData = async () => {
    // await fetch(API_URL, {
    //   method: 'POST',
    //   body: JSON.stringify({ data: formData.data }),
    //   headers: {
    //     Accept: 'application/json',
    //     'Content-Type': 'application/json',
    //   },
    // })
    // await getData()
  }

  const verifyData = async () => {
    // throw new Error('Not implemented')
  }

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target
    setFormData({ ...formData, [name]: value })
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
  }

  return (
    <>
      <h1 className='mb-3 text-xl font-bold text-primary md:text-2xl xl:text-3xl'>
        Saved Data
      </h1>

      <form className='flex flex-col w-full gap-y-3' onSubmit={handleSubmit}>
        <input
          className='p-2 text-xl border border-gray-500'
          placeholder='Write down your personal info...'
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
    </>
  )
}
