/* eslint-disable react/jsx-no-duplicate-props */
import { Center, Box, Text, Flex } from "@chakra-ui/react"

import { ContentWeather } from './Widget/Weather.jsx'
import { ContentFacebook } from './Widget/Facebook.jsx'
import { ContentGmail } from './Widget/Gmail.jsx'
import { ContentSteam } from './Widget/Steam.jsx'
import { ContentCinema } from './Widget/Cinema.jsx'


function Widget(props) {
    return (
        <Box h="100vh">
            {props.title === "Weather" ?
                <Flex pt={16}>
                    <Text fontSize="xl" fontWeight="bold" p={5}>{props.title}</Text>
                    <Text fontSize="xl" fontWeight="bold" pt={6}>{props.logo}</Text>
                </Flex> :
                <Flex>
                    <Text fontSize="xl" fontWeight="bold" p={5}>{props.title}</Text>
                    <Text fontSize="xl" fontWeight="bold" pt={6}>{props.logo}</Text>
                </Flex>
            }
            <Center>
                {props.title === "Weather" ?
                    <ContentWeather
                        login={props.login}
                        title={props.title}
                        status={props.status}
                        name={props.name}
                        token={props.token}
                        temperature={"29°C"}
                        rainy={"19%"}
                        humidity={"30%"}
                        windy={"40km/h"}
                    />
                    : ""}
                {props.title === "Facebook" ?
                    <ContentFacebook
                        title={props.title}
                        token={props.token}
                        status={props.status}
                        color={"#314E89"}
                        titleLeft={"Notification"}
                    />
                    : ""}
                {props.title === "Steam" ?
                    <ContentSteam
                        title={props.title}
                        status={props.status}
                        token={props.token}
                        color={"#1B2838"}
                        name={props.name}
                        titleRight={"Message"}
                        titleLeft={"Notification"}
                    />
                    : ""}
                {props.title === "Gmail" ?
                    <ContentGmail
                        title={props.title}
                        status={props.status}
                        token={props.token}
                        name={props.name}
                        color={"gray"}
                        titleRight={"Futur Event"}
                        titleLeft={"Notification"}
                    />
                    : ""}
                {props.title === "Cinema" ?
                    <ContentCinema
                        title={props.title}
                        status={props.status}
                        color={"#c1392b"}
                        token={props.token}
                        titleRight={"Futur Event"}
                        titleLeft={"Notification"}
                    />
                    : ""}
            </Center>
        </Box>
    )

}

export default Widget;
