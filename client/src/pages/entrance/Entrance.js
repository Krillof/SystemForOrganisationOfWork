import { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { tryEnter, tryRegister } from '../../store/userDataSlice';
import { Modal, Chip, Divider, Button, TextField, Box, Container, Alert } from '@mui/material';

import { trySetCurrentLogin } from '../../store/userDataSlice';

export default function Entrance() {
  const dispatch = useDispatch();
  const entrance_error_message = useSelector((state) => state.userData.entrance_error_message);
  const loginRef = useRef("");
  const passwordRef = useRef("");

  dispatch(trySetCurrentLogin());
  

  return (
    <Modal
      open={true}
    >
      <Container>
        <Box>
          <Chip
            label="Пожалуйста, зарегестрируйтесь или войдите в свой аккаунт, чтобы начать работу"
          />
          <Divider />

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
          <Divider />

          {
            entrance_error_message
              ?
              (
                <>
                  <Alert severity="error">{entrance_error_message}</Alert>
                  <Divider />
                </>
              )
              :
              (
                <>

                </>
              )
          }

          <Button
            variant="contained"
            onClick={() => {
              dispatch(tryEnter({
                login: loginRef.current.value,
                password: passwordRef.current.value,
              }))
            }}
          >
            Войти
          </Button>

          <Button
            variant="contained"
            onClick={() => {
              dispatch(tryRegister({
                login: loginRef.current.value,
                password: passwordRef.current.value,
              }))
            }}
          >
            Зарегестрироваться
          </Button>
        </Box>
      </Container>
    </Modal>
  );
}