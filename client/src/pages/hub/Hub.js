import { tryLeave, tryDelete } from '../../store/userDataSlice';
import { tryGetAvailableGroups, trySendMembershipRequestScienceGroup, tryEnterScienceGroup, tryGetParticipatedGroups } from '../../store/scienceGroupDataSlice';
import { useSelector, useDispatch } from 'react-redux';
import { Modal, Chip, Divider, Button, Box, Container, List, ListItem, IconButton, ListItemText } from '@mui/material';
import ReplayIcon from '@mui/icons-material/Replay';

export default function Hub() {
  const dispatch = useDispatch();
  const login = useSelector((state) => state.userData.login);
  const available_groups = useSelector((state) => state.scienceGroupData.available_groups);
  const is_updated_available_groups = useSelector((state) => state.scienceGroupData.is_updated_available_groups);
  const participated_groups = useSelector((state) => state.scienceGroupData.participated_groups);
  const is_updated_participated_groups = useSelector((state) => state.scienceGroupData.is_updated_participated_groups);

  if (!is_updated_available_groups)
    dispatch(tryGetAvailableGroups({}));

  if (!is_updated_participated_groups)
    dispatch(tryGetParticipatedGroups({}));

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
                login: login,
              }))
            }}
          >
            Выйти
          </Button>

          <Button
            variant="contained"
            onClick={() => {
              dispatch(tryDelete({
                login: login,
              }))
            }}
          >
            Удалить аккаунт
          </Button>

          <Divider />
          <Chip
            label={"Вы можете попробовать присоединится к следующим группам: "}
          />

          <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
            {available_groups.map((value) => (
              <ListItem
                key={value[1]}
                disableGutters
                secondaryAction={
                  <IconButton
                    aria-label="comment"
                    onClick={() => {
                      dispatch(trySendMembershipRequestScienceGroup({
                        science_group_id: value[1]
                      }))
                    }}
                  >
                    Подать запрос
                  </IconButton>
                }
              >
                <ListItemText primary={` ${value[0]}`} />
              </ListItem>
            ))}
          </List>
          <Chip
            label={"Перезагрузить доступные для запроса группы: "}
          />
          <IconButton
            aria-label="comment"
            onClick={() => {
              dispatch(tryGetAvailableGroups({}))
            }}
          >
            <ReplayIcon/>
          </IconButton>


          <Divider />
          <Chip
            label={"Вы можете войти в следующие группы: "}
          />

          <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
            {participated_groups.map((value) => (
              <ListItem
                key={value[1]}
                disableGutters
                secondaryAction={
                  <IconButton
                    aria-label="comment"
                    onClick={() => {
                      dispatch(tryEnterScienceGroup({
                        science_group_id: value[1]
                      }))
                    }}
                  >
                    Войти
                  </IconButton>
                }
              >
                <ListItemText primary={` ${value[0]}`} />
              </ListItem>
            ))}
          </List>
          <Chip
            label={"Перезагрузить доступные для входа группы: "}
          />
          <IconButton
            aria-label="comment"
            onClick={() => {
              dispatch(tryGetParticipatedGroups({}))
            }}
          >
            <ReplayIcon/>
          </IconButton>

        </Box>
      </Container>
    </Modal>
  );
}