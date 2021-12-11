import { Center, Button, Box, Text, Img } from "@chakra-ui/react"
import { useState, useEffect } from "react";
import { requestPostServer } from "../../httpRequest.jsx"

export function ContentCinema(props) {
    const [error, setErrorMessage] = useState("")
    const [i, setValuei] = useState(0);
    const [data, setValuedata] = useState("");


    function element(Name, Description, src) {
        return (
            <Box pr={2}>
                <Center p={"30px"}>
                    <Img textAlign="center" src={src} />
                </Center>
                <Text textAlign="center" fontSize={["sm", "xl", "2xl", "4xl"]}>{Name}</Text>
                <Text noOfLines={10} textAlign="center" fontSize={["10px", "12px", "md", "xl"]}>{Description}</Text>
                <Center>
                    <Button bg="gray" size='xs' textAlign="center" color="#ffffff" borderRadius="10px"  fontSize={["10px", "12px", "md", "xl"]} onClick={() => ChangeFilm(0)}>
                        Previous
                    </Button>
                </Center>
                <Center>
                    <Button mt={"10px"} size='xs' bg="gray" textAlign="center" color="#ffffff" borderRadius="10px"  fontSize={["10px", "12px", "md", "xl"]} onClick={() => ChangeFilm(1)}>
                        Next
                    </Button>
                </Center>
            </Box>
        );
    }

    async function get_movie() {
        try {
            const response = await requestPostServer(process.env.REACT_APP_URL + "/get_cinema", "", props.token);
            try {
                if (response.status === 406 || response.status === 405) {
                    console.error('Error', response.message, "for cinema");
                    setErrorMessage(response.message)
                } else {
                    setErrorMessage("")
                    setValuedata(response.results)
                }
            } catch (error) {
                setErrorMessage(error)
                console.error(error, "for cinema")
            }
        } catch (error) {
            setErrorMessage(error)
            console.error(error, "for cinema")
        }
        
    }

    useEffect(() => {
        get_movie()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    function ChangeFilm(variable) {
        if (variable === 1 && i < data.length - 1) {
            setValuei(i + 1);
        }
        if (variable === 0 && i !== 0) {
            setValuei(i - 1);
        }
    }

    return (
        <Center h="80vh" w="75%" bg={props.color} color="#fff" borderRadius="10px">
            <Center p={"30px"}>
                {error === "" ? (data === "" ? "" : element(data[i].original_title, data[i].overview, "https://image.tmdb.org/t/p/w500" + data[i].backdrop_path)) : error}
            </Center>
        </Center>
    )
}