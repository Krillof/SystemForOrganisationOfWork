import { tryLeave, tryDelete } from '../../store/userDataSlice';
import { useSelector, useDispatch } from 'react-redux';
import { Modal, Chip, Divider, Button, Box, Container } from '@mui/material';

export default function Hub(){
  const dispatch = useDispatch();
  const login = useSelector((state) => state.userData.login);

  return (
    <Modal
      open={true}
    >
      <Container>
        <Box>
          <Chip 
            label={"Добро пожаловать, пользователь с логином " + login}
          />

          <Divider />

          <Button
            variant="contained"
            onClick={() => {
              dispatch(tryLeave({
                login:login,
              }))
            }}
          >
            Выйти
          </Button>

          <Button
            variant="contained"
            onClick={() => {
              dispatch(tryDelete({
                login:login,
              }))
            }}
          >
            Удалить аккаунт
          </Button>
        </Box>
      </Container>
    </Modal>
  );
}