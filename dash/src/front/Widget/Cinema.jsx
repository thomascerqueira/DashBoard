import { Center, Button, Box, Text, Img, Input,Flex } from "@chakra-ui/react"
import { useState, useEffect } from "react";
import { requestPostServer } from "../../httpRequest.jsx"

export function ContentCinema(props) {

    const [Countrycode, setValueCountrycode] = useState("");
    const handleChangeCountrycode = (event) => setValueCountrycode(event.target.value)
    
    const [error, setErrorMessage] = useState("")
    const [i, setValuei] = useState(0);
    const [data, setValuedata] = useState("");


    function element(Name, Description, src) {
        return (
            <Box pr={2}>
                <Flex>
                <Input fontWeight="bold" bg="gray" variant="unstyled" w="50%" borderRadius="0px" textAlign="center" fontSize={["md", "xl", "2xl"]} placeholder="FR for france" onChange={handleChangeCountrycode} value={Countrycode} />
                <Button bg="gray" color="#FFFFFF" size="lxl" borderRadius="0px" w="50%" fontSize={["sm", "xl", "2xl"]} onClick={() => ValidateCountry(Countrycode)}>
                            Validate
                        </Button>
                        </Flex>
                <Center p={"30px"}>
                    <Img textAlign="center" width="300px" height="200px"src={src} />
                </Center>
                <Text textAlign="center" fontSize={["sm", "xl", "2xl", "4xl"]}>{Name}</Text>
                <Text noOfLines={13} textAlign="center" fontSize={["10px", "12px", "md", "md"]}>{Description}</Text>
                <Center>
                    <Button bg="gray" size='xs' textAlign="center" color="#ffffff" borderRadius="10px"  fontSize={["10px", "12px", "md"]} onClick={() => ChangeFilm(0)}>
                        Previous
                    </Button>
                </Center>
                <Center>
                    <Button mt={"10px"} size='xs' bg="gray" textAlign="center" color="#ffffff" borderRadius="10px"  fontSize={["10px", "12px", "md"]} onClick={() => ChangeFilm(1)}>
                        Next
                    </Button>
                </Center>
            </Box>
        );
    }

    async function ValidateCountry(countrycode) {
        const message = JSON.stringify({'Countrycode': countrycode});
        
        try {
            const response = await requestPostServer(process.env.REACT_APP_URL + "/get_cinema", message,  props.token);
            try {
                if (response.status === 406 || response.status === 405) {
                    setValuedata(["error"])
                    console.error('Error', response.message, "for cinema");
                    setErrorMessage(response.message)
                } else {
                    setErrorMessage("")
                    const adddb = JSON.stringify({ 'name': props.name, 'widget': "Cinema", 'value': JSON.stringify({ 'value': countrycode }), 'route': `widgets/${props.index}`});
                    await requestPostServer(process.env.REACT_APP_URL+"/widget/set", adddb, props.token);
                    setValuedata(response.results)
                }
            } catch (error) {
                setErrorMessage(error)
                setValuedata(["error"])
                console.error(error, "for cinema")
            }
        } catch (error) {
            setErrorMessage(error)
            setValuedata(["error"])
            console.error(error, "for cinema")
        }

    }

    async function get_movie() {
        var tmp = ''

        const message = JSON.stringify({ 'route': `widgets/${props.index}`, 'name': props.name, 'token': props.token});
        const data = await requestPostServer(process.env.REACT_APP_URL+"/get_info_db/", message, props.token);
        if (JSON.parse(data.message.value).value === '-1') {
            tmp = 'FR'
        } else {
            tmp = JSON.parse(data.message.value).value
        }
        ValidateCountry(tmp);
    }

    useEffect(() => {
        get_movie()
        const interval=setInterval(()=>{
            get_movie()
          },600000000) 
           return()=>clearInterval(interval)
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
        <Center h="80vh" w="95%" bg={props.color} color="#fff" borderRadius="10px" margin="10px">
            <Center p={"30px"}>
                {error === "" ? 
                    (data[0] === "error"  || data.length === 0 ? element("error", error, "https://image.tmdb.org/t/p/w500")
                     : element(data[i].original_title, data[i].overview, "https://image.tmdb.org/t/p/w500" + data[i].backdrop_path))
                : error}
            </Center>
        </Center>
    )
}