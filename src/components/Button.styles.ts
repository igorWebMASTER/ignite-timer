import styled from 'styled-components'

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'success'

interface ButtonContainerProps {
  variant: ButtonVariant
}

// const buttonVariables = {
//   primary: 'purple',
//   secondary: 'orange',
//   danger: 'red',
//   success: 'green',
// }

export const ButtonContainer = styled.button<ButtonContainerProps>`
  width: 100px;
  height: 40px;
  color: white;
  border: 0;
  border-radius: 5px;
  margin: 8px;
`
