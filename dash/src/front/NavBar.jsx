import {
  Box,
  Flex,
  Button,
  Menu,
  MenuButton,
  useColorModeValue,
  Stack,
  Link,
  Text,
} from '@chakra-ui/react';
import { useNavigate } from "react-router-dom";

function NavBar(props) {
  const navigate = useNavigate();

  function nav(up) {
    window.scrollTo({
      top: up,
      behavior: "smooth"
    });
  }
  
  return (
    <Box w={"100%"} zIndex="1" bg={useColorModeValue('gray.100', 'gray.900')} px={4}>
        <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
        <Link style={{ textDecoration: 'none' }} onClick={() => nav(0)}>Dashboard</Link>
          <Flex alignItems={'center'}>
            <Stack direction={'row'} spacing={7}>
               <Menu>
                <MenuButton
                onClick={() => navigate("/",)}
                  as={Button}
                  >
                  <Text>{props.login}</Text>
                </MenuButton>
              </Menu>
            </Stack>
          </Flex>
        </Flex>
      </Box>
  );
}
export default NavBar;
