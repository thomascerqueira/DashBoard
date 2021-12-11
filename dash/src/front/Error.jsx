import { Center, Button, VStack, Text, Box } from "@chakra-ui/react"
import {
  useNavigate
} from "react-router-dom";


function Error() {

    const navigate = useNavigate();

    function redirect() {
        navigate("/");
    }

    return (
        <Box>
            <Center h="100vh">
                <VStack spacing="24px">
                    <Text fontSize="6xl" textalign="center">An error has been detected</Text>
                    <Button color="white" colorScheme="blue" onClick={() => {redirect()}} textAlign="center">
                    Go to login
                    </Button>
                </VStack>
          </Center>
        </Box>
      )
  }

export default Error;
