import { tryUpdateScienceGroupMindMapData } from '../../store/scienceGroupDataSlice';
import { useSelector, useDispatch } from 'react-redux';
import { Modal, AppBar, Box, Container, List, ListItem, IconButton, ListItemText } from '@mui/material';
import MindMap from "../../mindMap/MindMap";

export default function Workspace() {
  const dispatch = useDispatch();
  const workspace_mindmap_data = useSelector((state) => state.scienceGroupData.workspace_mindmap_data);
  const is_have_to_update_mindmap_data = useSelector((state) => state.scienceGroupData.is_have_to_update_mindmap_data);

  if (is_have_to_update_mindmap_data) {
    dispatch(tryUpdateScienceGroupMindMapData({}));
  }

  return (
    <>
      <AppBar position='static'>
        <Container>
          <Box>
            Доп. данные, кнопки и т.п.

          </Box>
        </Container>
      </AppBar>
      <div style={{ height: 700 }}>
        {
          workspace_mindmap_data &&
          (
            <MindMap nodes={workspace_mindmap_data.nodes} links={workspace_mindmap_data.links} />
          )
        }
      </div>
    </>
  );
}