/* eslint-disable react/jsx-no-duplicate-props */
import { Center, Button, Box, Input, Text, Flex, Img, Divider } from "@chakra-ui/react"
import { useState, useEffect } from "react";
import { requestPostServer } from "../../httpRequest.jsx"

export function ContentWeather(props) {

    const [City, setValueCity] = useState("");
    const handleChangeCity = (event) => setValueCity(event.target.value)

    const [temp, setValueTemp] = useState(0)
    const [humidity, setValueHumidity] = useState(0)
    const [wind, setValueWind] = useState(0)
    const [image, setValueImg] = useState()
    const [weather, setValueWeather] = useState()



    function IndicationWeater(src, value) {

        return (
            <Box>
                <Center h={"25vh"} w="100%" >
                    <Img mr={5} boxSize={["20px", "50px", "70px", "90px", "100px"]} src={src} /><Text fontWeight="bold" textAlign="center" fontSize={["md", "xl", "4xl"]}>{value}</Text>
                </Center>
                <Center><Divider borderColor="white" border="5px" width="40%" /></Center>
            </Box>
        );
    }

    async function ValidateCity(Cityvalue) {
        const city = City === "" ? Cityvalue : City
        const message = JSON.stringify({ 'city': city });

        const weather = await requestPostServer(process.env.REACT_APP_URL+"/get_weather", message, props.token);

        const adddb = JSON.stringify({ 'name': props.name, 'widget': "weather", 'value': message });
        await requestPostServer(process.env.REACT_APP_URL+"/set_widget", adddb, props.token);
        try {
            setValueTemp(weather.main.temp)
            setValueHumidity(weather.main.humidity)
            setValueWind((weather.wind.speed * 3.6).toFixed(2))
            setValueWeather(weather.weather[0].description)
            setValueImg(process.env.REACT_APP_WEATHERIMG + weather.weather[0].icon + '@2x.png')
        }
        catch (e) {
            switch (weather.status) {
                case 404:
                    console.error('Error get weather\n', weather.message, "Probably you have entered an invalid City")
                    break;
                case 406:
                    console.error('Error get weather\n', weather.message)
                    break;
                case 405:
                    console.error('Error get weather\n', weather.message)
                    break;
                default:
                    console.error(e)
                    break;
            }
            setValueTemp("Error")
            setValueHumidity("Error")
            setValueWind("Error")
            setValueWeather("Error")
            setValueImg("Error")
        }
    }

    async function Getdata() {
        const message = JSON.stringify({ 'name': props.name, 'widget': "weather" });
        const data = await requestPostServer(process.env.REACT_APP_URL+"/widget_info_user", message, props.token);
        setValueCity(JSON.parse(data).city)
        ValidateCity(JSON.parse(data).city)
    }

    useEffect(()=>{
        Getdata()
        const interval=setInterval(()=>{
            Getdata()
        },10000)
        return()=>clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])



    return (
        <Box h="80vh" w="75%" bgGradient="linear(to-r, #6CACC7, #b7e5f7)" borderRadius="10px">
            <Flex>
                <Box width="50%" h="80vh" >
                    <Flex direction="column">
                        <Center h={"80vh"} w="100%" color="#FFFFFF">
                            <Flex direction="column">
                                <Text fontWeight="bold" textAlign="center" fontSize={["md", "xl", "2xl", "4xl"]}>{weather}</Text>
                                <Center>
                                    <Img boxSize={["50px", "70px", "100px", "120px", "150px"]} src={image} />
                                </Center>
                                <Input fontWeight="bold" variant="unstyled" w="100%" size="xl" textAlign="center" fontSize={["md", "xl", "2xl", "4xl"]} placeholder="City" onChange={handleChangeCity} value={City} />
                                <Center p={10}>
                                    <Button bg="white" color="#6CACC7" size="lg" w="70%" fontSize={["sm", "xl", "2xl", "4xl"]} onClick={() => ValidateCity()}>
                                        Validate
                                    </Button>
                                </Center>
                            </Flex>
                        </Center>
                    </Flex>
                </Box>
                <Box width={"50%"} h="80vh">
                    <Flex direction="column" color="white">
                        {IndicationWeater("https://img.icons8.com/office/96/000000/temperature--v1.png", temp + ' °C')}
                        {IndicationWeater("https://img.icons8.com/external-justicon-flat-justicon/96/000000/external-humidity-weather-justicon-flat-justicon-1.png", humidity + " %")}
                        <Center h={"25vh"} w="100%">
                            <Img mr={5} boxSize={["20px", "50px", "70px", "90px", "100px"]} src="https://img.icons8.com/color/96/000000/wind.png" /><Text fontWeight="bold" textAlign="center" fontSize={["sm", "xl", "4xl"]}>{wind + ' km/h'}</Text>
                        </Center>
                    </Flex>
                </Box>
            </Flex>
        </Box>
    )
}