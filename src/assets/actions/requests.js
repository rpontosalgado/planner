import axios from 'axios'

export const getTasks = (url, setData) => {
  axios.get(url).then(response => setData(response.data))
}

export const createTask = (url, body, clear, update) => {
  axios.post(url, body).then(() => {
    clear()
    update()
  })
}

export const editTask = (url, body, update) => {
  axios.put(url, body).then(() => update())
}

export const deleteTask = (url, update) => {
  axios.delete(url).then(() => update())
}