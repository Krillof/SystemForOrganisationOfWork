import { closeModalForCreatingVerticies, endLookingAtGottenRequests, modalsContentForMindMapVerticies, showModalForCreatingGlobalTheme, startLookingAtGottenRequests, tryAcceptMembershipRequest, tryGetMembershipRequests, tryLeaveScienceGroup, tryUpdateScienceGroupMindMapData } from '../../store/scienceGroupDataSlice';
import { useSelector, useDispatch } from 'react-redux';
import { Modal, AppBar, Box, Container, Typography, Card, Chip, List, ListItem, IconButton, ListItemText, Button } from '@mui/material';
import MindMap from "../../mindMap/MindMap";

export default function Workspace() {
  const dispatch = useDispatch();
  const workspace_mindmap_data = useSelector((state) => state.scienceGroupData.workspace_mindmap_data);
  const is_have_to_update_mindmap_data = useSelector((state) => state.scienceGroupData.is_have_to_update_mindmap_data);
  const looking_at_gotten_requests_list = useSelector((state) => state.scienceGroupData.looking_at_gotten_requests_list);
  const is_have_to_update_gotten_requests_for_membership = useSelector((state) => state.scienceGroupData.is_have_to_update_gotten_requests_for_membership);
  const gotten_requests_for_membership = useSelector((state) => state.scienceGroupData.gotten_requests_for_membership);
  const is_show_modal_for_creating_verticies = useSelector((state) => state.scienceGroupData.is_show_modal_for_creating_verticies);
  const current_modal_for_verticies_type = useSelector((state) => state.scienceGroupData.current_modal_for_verticies_type);

  if (is_have_to_update_mindmap_data) {
    dispatch(tryUpdateScienceGroupMindMapData({}));
  }

  if (is_have_to_update_gotten_requests_for_membership) {
    dispatch(tryGetMembershipRequests({}));
  }

  return (
    <>
      <AppBar position='static'>
        <Container>
          <Box>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => {
                dispatch(tryLeaveScienceGroup())
              }}
            >
              Выйти
            </Button>
            <Chip></Chip>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => {
                dispatch(startLookingAtGottenRequests())
              }}
            >
              Посмотреть список запросов на поступление
            </Button>
            <Chip></Chip>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => {
                dispatch(showModalForCreatingGlobalTheme())
              }}
            >
              Создать глобальную тему
            </Button>
          </Box>
        </Container>
      </AppBar>
      <Modal
        open={looking_at_gotten_requests_list}
        onClose={() => {
          dispatch(endLookingAtGottenRequests())
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Card>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Список пользователей, подавших запрос на поступление
          </Typography>
          <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
            {gotten_requests_for_membership.map((value) => (
              <ListItem
                key={value[0]}
                disableGutters
                secondaryAction={
                  <div>
                    <IconButton
                      aria-label="comment"
                      onClick={() => {
                        dispatch(tryAcceptMembershipRequest({
                          membership_request_id: value[0]
                        }))
                      }}
                    >
                      Принять запрос
                    </IconButton>
                    <IconButton
                      aria-label="comment"
                      onClick={() => {
                        //dispatch(tryAcceptMembershipRequest({
                        //  membership_request_id: value[0]
                        //}))
                      }}
                    >
                      Отказать
                    </IconButton>
                  </div>

                }
              >
                <ListItemText primary={` ${value[1]}`} />
              </ListItem>
            ))}
          </List>
        </Card>
      </Modal>
      <Modal
        open={is_show_modal_for_creating_verticies}
        onClose={() => {
          dispatch(closeModalForCreatingVerticies())
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Card>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Вы создаете вершину типа {modalsContentForMindMapVerticies[current_modal_for_verticies_type].typeName}
          </Typography>
          {modalsContentForMindMapVerticies[current_modal_for_verticies_type].content}
        </Card>
      </Modal>
      <div style={{ height: 700 }}>
        {
          workspace_mindmap_data &&
          (
            <MindMap verticies={JSON.parse(JSON.stringify(workspace_mindmap_data.nodes))} links={JSON.parse(JSON.stringify(workspace_mindmap_data.links))} />
          )
        }
      </div>
    </>
  );
}