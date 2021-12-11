import {
  Box,
  Flex,
  Button,
  Menu,
  MenuButton,
  useColorModeValue,
  Stack,
  Link,
  useColorMode,
  Text,
} from '@chakra-ui/react';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';

function NavBar(props) {
  const { colorMode, toggleColorMode } = useColorMode();

  function nav(up) {
    window.scrollTo({
      top: up,
      behavior: "smooth"
    });
  }
  
  return (
    <Box w={"100%"} zIndex="1" position="fixed" bg={useColorModeValue('gray.100', 'gray.900')} px={4}>
        <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
        <Link style={{ textDecoration: 'none' }} onClick={() => nav(0)}>Dashboard</Link>
          <Flex alignItems={'center'}>
            <Stack direction={'row'} spacing={7}>
              <Button onClick={toggleColorMode}>
                {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
              </Button>
               <Menu>
                <MenuButton
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
