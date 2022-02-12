import {Box, Button} from "@chakra-ui/react"
import NavBar from './NavBar'
import {
  useLocation,
} from "react-router-dom";
import Error from './Error'
import React, { useState, useEffect } from 'react';
import { MyGrid } from './MyGrid.jsx';
import { requestPostServer } from "../httpRequest.jsx"


async function getStartWidget (setValues, name, token) {
  var temp = []
  for (var i = 0; i < 6; i++) {
    const message = JSON.stringify({ 'route': `widgets/${i}`, 'name': name, 'token': token});
    const data = await requestPostServer(process.env.REACT_APP_URL+"/get_info_db/", message, token);
    temp.push(data.message);
  }
  setValues(temp);
}

function Home() {
  const [Values, setValues] = useState([
    {name:'none', value:'-1'},
    {name:'none', value:'-1'},
    {name:'none', value:'-1'},
    {name:'none', value:'-1'},
    {name:'none', value:'-1'},
    {name:'none', value:'-1'},
  ])

  const { state } = useLocation();

  useEffect(() => {
    if (state.login !== null) {
      getStartWidget(setValues, state.name, state.token)
    }
  }, [])

  try {
    if (state.login !== null) {
      
      
      const login = state.login
      const name = state.name
      const token = state.token

      return (
        <Box>
          <NavBar login={login} />
          <MyGrid login={login} name={name} token={token} values={Values} setValues={setValues}></MyGrid>
          <Button onClick={() => {console.log(Values)}}></Button>
        </Box>
      )
    }
  }
  catch (e) {
    return (
      <Error />
    )
  }
}

export default Home;
