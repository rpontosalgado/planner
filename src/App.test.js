import React from 'react'
import { render, screen, wait } from '@testing-library/react';
import userEvent from '@testing-library/user-event'
import axios from 'axios'
import { baseUrl } from './assets/constants/axiosConstants'
import App from './App'

axios.get = jest.fn().mockResolvedValue({
  data: []
})
axios.post = jest.fn().mockResolvedValue()
axios.put = jest.fn().mockResolvedValue()
axios.delete = jest.fn().mockResolvedValue()

describe("Planner", () => {
  test("Render elements", async () => {
    render(<App/>)

    expect(screen.getByPlaceholderText(/.../)).toBeInTheDocument()
    expect(screen.getByTitle("Dia da semana")).toBeInTheDocument()
    expect(screen.getByTitle("Horário")).toBeInTheDocument()
    expect(screen.getByText(/criar/i)).toBeInTheDocument()
    expect(screen.getAllByTestId("planner-day-card")).toHaveLength(7)

    await wait ()
  })

  test("Initial render triggers request and renders tasks", async () => {
    axios.get = jest.fn().mockResolvedValue({
      data: [
        {hour: 9, day: "Sábado", task: "tarefa sábado 1", done: false, id: "1"},
        {hour: 13, day: "Domingo", task: "tarefa domingo 1", done: false, id: "2"},
        {hour: 18, day: "Sexta-Feira", task: "Sextou!", done: false, id: "3"},
        {hour: 10, day: "Sábado", task: "tarefa sábado 2", done: false, id: "4"},
        {hour: 11, day: "Sábado", task: "tarefa sábado 3", done: false, id: "5"},
        {hour: 7, day: "Segunda-Feira", task: "tarefa segunda 1", done: false, id: "6"},
        {hour: 8, day: "Domingo", task: "Corrida F1 Soochi", done: false, id: "7"},
      ]
    })

    render(<App />)

    const tasksSaturday = await screen.findAllByTestId("task-Sábado")
    const tasksSunday = await screen.findAllByTestId("task-Domingo")
    const tasksFriday = await screen.findAllByTestId("task-Sexta-Feira")
    const tasksMonday = await screen.findAllByTestId("task-Segunda-Feira")

    expect(axios.get).toHaveBeenCalled()
    expect(tasksSaturday).toHaveLength(3)
    expect(tasksSaturday[0]).toHaveTextContent("tarefa sábado 1")
    expect(tasksSaturday[1]).toHaveTextContent("tarefa sábado 2")
    expect(tasksSaturday[2]).toHaveTextContent("tarefa sábado 3")

    expect(tasksSunday).toHaveLength(2)
    expect(tasksFriday).toHaveLength(1)
    expect(tasksFriday[0]).toHaveTextContent("Sextou!")

    expect(tasksMonday).toHaveLength(1)
    await wait()
  })

  test("Create task", async () => {
    axios.get = jest.fn().mockResolvedValue({ data: [] })
    axios.post = jest.fn().mockResolvedValue()

    render(<App/>)
    await wait()

    const inputText = screen.getByPlaceholderText(/.../)
    await userEvent.type(inputText, "Testando criar tarefa")
    expect(inputText).toHaveValue("Testando criar tarefa")

    const selectDay = screen.getByTitle("Dia da semana")
    const optionDay = screen.getByTestId("Segunda-Feira")
    userEvent.selectOptions(selectDay, optionDay.value)
    expect(selectDay).toHaveValue("Segunda-Feira")
    
    const selectHour = screen.getByTitle("Horário")
    const optionHour = screen.getByTestId("hora-13")
    userEvent.selectOptions(selectHour, optionHour.value)
    expect(selectHour).toHaveValue(String(13))

    const buttonCreateTask = screen.getByText(/criar/i)
    userEvent.click(buttonCreateTask)

    expect(axios.post).toHaveBeenCalledWith(baseUrl, {
      task: "Testando criar tarefa",
      day: "Segunda-Feira",
      hour: 13,
      done: false,
    })
    
    await wait(() => expect(axios.get).toHaveBeenCalledTimes(2))
    
    expect(inputText).toHaveValue("")
  })

  test("Mark task as done", async() => {
    axios.get = jest.fn().mockResolvedValue({
      data: [
        {
          hour: 13,
          day: "Sexta-Feira",
          task: "Sextou!!!",
          done: false,
          id: "123"
        }
      ]
    })
    axios.put = jest.fn().mockResolvedValue()

    render(<App />)

    const task = await screen.findByText(/Sextou/i)

    userEvent.click(task)

    expect(axios.put).toHaveBeenCalledWith(`${ baseUrl }/123`, {
      done: true
    })

    await wait(() => {
      expect(axios.get).toHaveBeenCalledTimes(2)
    })
  })

  test("Delete task", async () => {
    axios.get = jest.fn().mockResolvedValue({
      data: [
        {
          hour: 13,
          day: "Sexta-Feira",
          task: "Sextou!!!",
          done: false,
          id: "123"
        }
      ]
    })
    axios.delete = jest.fn().mockResolvedValue()

    render(<App />)

    const task = await screen.findByText(/Sextou/i)

    userEvent.dblClick(task)

    expect(axios.delete).toHaveBeenCalledWith(`${ baseUrl }/123`)

    await wait(() => {
      expect(axios.get).toHaveBeenCalledTimes(4)
    })
  })

  test("Clear button erases all tasks", async () => {
    axios.get = jest.fn().mockResolvedValue({
      data: [
        {hour: 9, day: "Sábado", task: "tarefa sábado 1", done: false, id: "1"},
        {hour: 13, day: "Domingo", task: "tarefa domingo 1", done: false, id: "2"},
        {hour: 18, day: "Sexta-Feira", task: "Sextou!", done: false, id: "3"},
        {hour: 10, day: "Sábado", task: "tarefa sábado 2", done: false, id: "4"},
        {hour: 11, day: "Sábado", task: "tarefa sábado 3", done: false, id: "5"},
        {hour: 7, day: "Segunda-Feira", task: "tarefa segunda 1", done: false, id: "6"},
        {hour: 8, day: "Domingo", task: "Corrida F1 Soochi", done: false, id: "7"},
      ]
    })
    
    render(<App/>)

    let tasks = await screen.findAllByTestId(/task-/i)

    expect(tasks).toHaveLength(7)

    const clearButton = screen.getByText(/Limpar/i)
    userEvent.click(clearButton)

    tasks = screen.queryByText(/task-/i)

    await wait(() => {
      expect(tasks).toBeNull()
    })
  })
})