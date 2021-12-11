import { useState } from "react";
import {
  Flex,
  Heading,
  Input,
  Button,
  InputGroup,
  Stack,
  Box,
  Link,
  Text,
  FormControl,
  InputRightElement
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { requestPostServer } from "../httpRequest.jsx"
import { FaFacebook } from 'react-icons/fa';
import { FacebookAuthProvider, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { SiGmail } from 'react-icons/si';
import {auth} from '../firebase/firebase.jsx'


const Authentification = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [Authentification, setAuthenfication] = useState(false);
    const [Mail, setValueMail] = useState("")
    const [Password, setValuePassword] = useState("")
    const [Error, setValueError] = useState("");

    const FbProvider = new FacebookAuthProvider();
    const GmailProvider = new GoogleAuthProvider();

    const handleShowClick = () => setShowPassword(!showPassword);
    const handleShowAuthentificationClick = () => setAuthenfication(!Authentification);
    const handleChangeMail = (event) => setValueMail(event.target.value)
    const handleChangePassword = (event) => setValuePassword(event.target.value)
    const navigate = useNavigate();

    async function Connexion(routePost) {
        let message = JSON.stringify({ "email": Mail, "password": Password });
        var response = await requestPostServer(routePost, message)
        if (response.status === 1) {
            setValueError("")
            navigate("/home", {state:{login: response.email, name: response.name, token: response.accessToken}});
        }
        else {
            setValueError(response.message)
        }
    }

    async function createEntry(route, message) {
        var response = await requestPostServer(route, message);
        if (response.status === 1) {
            setValueError("")
            if (response.accessToken === undefined)
                setValueError("Error while connecting, try to reconnect")
            else
                navigate("/home", {state:{login: response.email, name: response.name, token: response.accessToken}});
        }
        else {
            setValueError("error create Entry", response.message)
        }
    }

    async function signPopup(wich) {
        var provider;

        if (wich === "Facebook")
            provider = FbProvider
        else if (wich === "Gmail")
            provider = GmailProvider
        signInWithPopup(auth, provider)
        .then((result) => {
            var user = result.user;
            let message;

            if (wich === "Facebook") {
                const credential = FacebookAuthProvider.credentialFromResult(result);
                message = JSON.stringify({ "name": user.displayName, "email": user.email, "fbToken": credential});
            } else if (wich === "Gmail") {
                const credential = GoogleAuthProvider.credentialFromResult(result);
                message = JSON.stringify({ "name": user.displayName, "email": user.email, "gmailToken": credential});
            }
            createEntry(process.env.REACT_APP_URL + "/create_entry/name", message);
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            const email = error.email;
            var credential
            if (wich === "Facebook")
                credential = FacebookAuthProvider.credentialFromError(error);
            else if (wich === "Gmail")
                credential = GoogleAuthProvider.credentialFromError(error);
            console.error(errorCode, errorMessage, email, credential);
            return;
        })
    }

    function NewAccount(text1, text2) {
        return (
            <Flex m={5}>
                <Text mr={3}>{text1}</Text>
                <Link colorScheme="white" color="#2B6CB0" h="1.75rem" size="md" onClick={handleShowAuthentificationClick}>
                    {text2}
                </Link>
            </Flex>
        );
    }

    return (
        <Flex
        flexDirection="column"
        width="100wh"
        height="100vh"
        backgroundColor="gray.200"
        justifyContent="center"
        alignItems="center"
        >
        <Stack
            flexDir="column"
            mb="2"
            justifyContent="center"
            alignItems="center">
            <Heading color="#2B6CB0" m={5}>Welcome</Heading>
            <Box minW={{ base: "90%", md: "468px" }}>
            <form>
                <Stack
                spacing={4}
                p="1rem"
                backgroundColor="whiteAlpha.900"
                boxShadow="md"
                borderRadius="20px"
                >
                <FormControl>
                    <InputGroup>
                    <Input type="email" placeholder="email address" value={Mail} onChange={handleChangeMail} />
                    </InputGroup>
                </FormControl>
                <FormControl>
                    <InputGroup>
                    <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        value={Password}
                        onChange={handleChangePassword} />
                    <InputRightElement width="4.5rem">
                        <Button h="1.75rem" size="sm" onClick={handleShowClick}>
                        {showPassword ? "Hide" : "Show"}
                        </Button>
                    </InputRightElement>
                    </InputGroup>
                </FormControl>
                <Button
                    variant="solid"
                    colorScheme="blue"
                    width="full"
                    onClick={() => {Authentification ? Connexion(process.env.REACT_APP_URL+"/create_account/") : Connexion(process.env.REACT_APP_URL+"/authentification/")}}
                >
                {!Authentification ? "Login" : "Create"}
                </Button>
                {Error !== "" ? <Text color="red" textAlign="center">{Error}</Text> : ""}
                </Stack>
            </form>
                </Box>
            </Stack>
            {!Authentification ? NewAccount("New to us?", "Sign up") : NewAccount("Already have an account?", " Sign in")}
            <Flex>
                <Button colorScheme="facebook" leftIcon={<FaFacebook />} m={1} onClick={() => signPopup("Facebook")}>
                Facebook
                </Button>
                <Button bg="white" _hover={{bg: "#f9f9f9"}}leftIcon={<SiGmail color="red"/>} m={1} onClick={() => signPopup("Gmail")}>
                Gmail
                </Button>
            </Flex>
        </Flex>
    );
};

export default Authentification;
