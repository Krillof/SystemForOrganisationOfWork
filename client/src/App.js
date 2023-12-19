import Test from './appTest/Test';
import Entrance from './pages/entrance/Entrance';
import Hub from './pages/hub/Hub';
import Workspace from './pages/workspace/Workspace';
import './App.css';

import { IS_DEBUG } from './index';

import { useSelector } from 'react-redux';

function App() {
  const login = useSelector((state) => state.userData.login);
  const current_group_title = useSelector((state) => state.scienceGroupData.current_group_title);

  if (IS_DEBUG) {

    return (
      <div style={{ height: 700 }}>
        <Test />
      </div>
    );

  } else {

    return (
      (login)
        ?
        (
          (current_group_title)
          ?
          (
            <Workspace />
          )
          :
          (
            <Hub />
          )
        )
        :
        (
          <Entrance />
        )
    )

  }

}

export default App;
