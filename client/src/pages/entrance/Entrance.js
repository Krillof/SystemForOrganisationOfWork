import { useRef } from 'react';
import { useDispatch } from 'react-redux';
import { enter, register } from '../../store/userDataSlice';
import { Modal, Skeleton, Button, TextField, Box, Container } from '@mui/material';

export default function Entrance() {
  const dispatch = useDispatch();
  const loginRef = useRef("");
  const passwordRef = useRef("");

  return (
    <Modal
      open={true}
    >
      <Container>
        <Box>
          <Skeleton animation="wave" height="20px">
            Пожалуйста, зарегестрируйтесь или войдите в свой аккаунт, чтобы начать работу
          </Skeleton>
          <TextField
            label="Логин"
            variant="outlined"
            inputRef={loginRef}
          />
          <TextField
            label="Пароль"
            variant="outlined"
            inputRef={passwordRef}
          />

          <Button
            onClick={() => {
              dispatch(enter({
                login:loginRef.current.value,
                password:passwordRef.current.value,
              }))
            }}
          >
            Войти
          </Button>
          <Button
            onClick={() => {
              dispatch(register({
                login:loginRef.current.value,
                password:passwordRef.current.value,
              }))
            }}
          >
            Регистрация
          </Button>
        </Box>
      </Container>
    </Modal>
  );
}