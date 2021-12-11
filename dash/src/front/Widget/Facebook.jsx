/* eslint-disable react/jsx-no-duplicate-props */
import { Center, Button, Box, Text, Flex, Img, Divider } from "@chakra-ui/react"
import { useState } from "react";
import { FaFacebook } from 'react-icons/fa';

export function ContentFacebook(props) {

    const [CoFacebook, setValueCoFacebook] = useState(true);

    function element(srcProfile, time, name, description) {
        return (
            <Box pr={2} >
                <Box w="100%">
                    <Flex >
                        <Img borderRadius="full" p="2" boxSize={["50px", "70px", "80px"]} src={srcProfile}></Img>
                        <Text fontWeight="bold" mt={["15px", "20px", "20px"]} fontSize={["10px", "12px", "12px", "20px"]}>{name}</Text>
                    </Flex>
                </Box>
                <Text ml={10} fontSize={["10px", "12px", "12px", "20px"]} >{description}</Text>
                <Text pr={"5%"} fontWeight="bold" textAlign="right" fontSize={["10px", "12px", "12px", "20px"]}>{time}</Text>
                <Divider mb={2} mt={"1%"} mb={["5px", "11px", "20px"]} borderColor="white" width="100%" />
            </Box>
        );
    }

    if (CoFacebook === true) {
        return (
            <Center h="80vh" w="95%" bg={props.color} color="#fff" borderRadius="10px">
                <Button colorScheme="facebook" leftIcon={<FaFacebook />} m={1} onClick={() => setValueCoFacebook(false)}>
                    Facebook
                </Button>
            </Center>
        );
    }
    else {
        return (
            <Box h="80vh" w="95%" bg={props.color} color="#fff" borderRadius="10px">
                <Flex>
                    <Box pr={2} boxShadow="2xl" mt={1} ml={1} mr={1} width="100%" h="79vh" >
                        <Text fontSize={["xx-small", "sm", "xl", "2xl"]} fontWeight="bold" pt={5} pl={5}>{props.titleLeft}</Text>
                        <Divider mt={2} ml={5} mb={["5px"]} borderColor="white" border="1px" width="70%" />
                        {element("https://bit.ly/dan-abramov", "4sec ago", "Jean File", "Jean added a new video")}
                        {element("https://bit.ly/dan-abramov", "1min ago", "Marie Laureafezfezakdsd", "Marie added a new video")}
                        {element("https://bit.ly/dan-abramov", "2h ago", "Pascal Pepe", "Pascal added an event")}
                    </Box>
                </Flex>
            </Box>
        )
    }
}