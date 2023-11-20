import Test from './appTest/Test';
import Entrance from './pages/entrance/Entrance';
import Hub from './pages/hub/Hub';
import './App.css';

import { IS_DEBUG } from './index';

import { useSelector } from 'react-redux';

function App() {
  const login = useSelector((state) => state.userData.login);
  console.log(login);


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
          <Hub />
        )
        :
        (
          <Entrance />
        )
    )

  }

}

export default App;
