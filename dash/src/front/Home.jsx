import { Box, Divider } from "@chakra-ui/react"
import NavBar from './NavBar'
import {
  useLocation,
} from "react-router-dom";
import Error from './Error'
import Widget from './Widget'
import { FaFacebook, FaSteam } from 'react-icons/fa';
import { SiGmail } from 'react-icons/si';
import { TiWeatherSunny } from 'react-icons/ti';
import { FiFilm } from 'react-icons/fi'



function Home() {

  const { state } = useLocation();

  try {
    if (state.login !== null) {
      const login = state.login
      const name = state.name
      const token = state.token

      return (
        <Box>
          <NavBar login={login}/>
          <Widget login={login} name={name} token={token} title="Weather" status={"Snowy"} logo={<TiWeatherSunny/>}/>
            <Divider border="2px"></Divider>
          <Widget login={login} name={name} token={token} title="Facebook" color="#F8F7F7" logo={<FaFacebook/>}/>
            <Divider border="2px"></Divider>
          <Widget login={login} name={name} token={token} title="Steam" color="#F8F7F7" logo={<FaSteam/>}/>
            <Divider border="2px"></Divider>
          <Widget login={login} name={name} token={token} title="Gmail" color="#F8F7F7" logo={<SiGmail/>}/>
            <Divider border="2px"></Divider>
          <Widget login={login} name={name} token={token} title="Cinema"  color="#F8F7F7" logo={<FiFilm/>}/>
            <Divider border="2px"></Divider>
        </Box>
      )
    }
  }
  catch (e) {
    return (
          <Error/>
      )
  }
}

export default Home;
