import { useState, useEffect } from 'react'
import { getTasks } from '../actions/requests'

export const useGetTasks = (url, initialState) => {
  const [data, setData] = useState(initialState)

  useEffect(() => getTasks(url, setData), [url])

  const updateData = () => getTasks(url, setData)

  return [data, updateData]
}