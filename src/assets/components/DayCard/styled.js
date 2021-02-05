import styled from 'styled-components'

export const CardContainer = styled.div`
  width: 13%;
  border: 1px dotted rgb(53, 53, 53);
  padding: 5px;
  flex-grow: 1;

  h3 {
    margin-top: 0;
  }

  ul {
    list-style-position: inside;
    text-align: left;
    padding-left: 0.4em;
  }
`

export const TaskListItem = styled.li`
  font-size: 0.8em;
  text-decoration: ${ props => props.done ? "line-through" : "none" };
  cursor: pointer;
`