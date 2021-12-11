import { ChakraProvider} from "@chakra-ui/react"
import Authentification from './Authentification'
import Home from './Home'
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

function App() {
  return (

    <ChakraProvider>
      <Router>
        <Routes>
          <Route path="/home" element={<Home />}>
          </Route>
          <Route path="/" element={<Authentification />}>
          </Route>
        </Routes>
      </Router>
    </ChakraProvider>
  );
}

export default App;
