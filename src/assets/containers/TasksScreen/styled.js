import styled from 'styled-components'

export const Header = styled.div`
  height: 10vh;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.8rem;

  form {
    display: flex;
    align-items: center;
    gap: 0.8rem;
  }

  button {
    height: 19px;
  }
`

export const TasksContainer = styled.div`
  height: 85vh;
  padding: 0 0.8em;
  display: flex;
  justify-content: space-evenly;
  gap: 0.8em;
`