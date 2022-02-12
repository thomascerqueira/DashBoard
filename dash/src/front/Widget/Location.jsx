import { Center, Button, Box, Text, Input,Flex } from "@chakra-ui/react"
import { useState, useEffect } from "react";
import { requestPostServer } from "../../httpRequest.jsx"

export function ContentLocation(props) {

    const [Location, setValueLocation] = useState("");
    const handleChangeLocation = (event) => setValueLocation(event.target.value)

    const [name, setValueName] = useState([]);
        const listItems = name !== "" ? name.map((item, index) =>
        <Text key={index} textAlign="center" fontSize={["sm", "xl", "2xl", "4xl"]}>{item}</Text>
      ) : "";
    function element(Name, Description) {
        return (
            <Box pr={2}>
                <Flex>
                <Input fontWeight="bold" bg="#057715" variant="unstyled" w="50%" borderRadius="0px" textAlign="center" fontSize={["md", "xl", "2xl", "4xl"]} placeholder="Zip code" onChange={handleChangeLocation} value={Location} />
                <Button bg="#057715" color="#FFFFFF" size="lxl" borderRadius="0px" w="50%" fontSize={["sm", "xl", "2xl", "4xl"]} onClick={() => ValidateLocation(Location)}>
                    Validate
                </Button>
                </Flex>
                {listItems}
            </Box>
        );
    }

    async function ValidateLocation(location) {
        const message = JSON.stringify({'location': location});
        try {
            const response = await requestPostServer(process.env.REACT_APP_URL + "/get_location", message,  props.token);
            const adddb = JSON.stringify({ 'name': props.name, 'widget': "Location", 'value': JSON.stringify({ 'value': location }), 'route': `widgets/${props.index}`});
            await requestPostServer(process.env.REACT_APP_URL+"/widget/set", adddb, props.token);
            setValueName("");
            response.places.forEach(function(item, index, array) {
                if (index > 5) {
                    return true;
                }
                setValueName(name => [...name, item["place name"]]);
              });
        } catch (error) {
            console.error(error, "for location")
        }

    }

    async function get_location() {
        var tmp = ''
        const message = JSON.stringify({ 'route': `widgets/${props.index}`, 'name': props.name, 'token': props.token});
        const data = await requestPostServer(process.env.REACT_APP_URL+"/get_info_db/", message, props.token);
        if (JSON.parse(data.message.value).value === '-1') {
            tmp = '95470'
        } else {
            tmp = JSON.parse(data.message.value).value
        }
        ValidateLocation(tmp)
    }

    useEffect(() => {
        get_location()
        const interval=setInterval(()=>{
            get_location()
          },600000000) 
           return()=>clearInterval(interval)
         // eslint-disable-next-line react-hooks/exhaustive-deps
          }, [])

    return (
        <Center h="80vh" w="95%" bg={props.color} color="#fff" borderRadius="10px" margin="10px">
            <Center p={"30px"}>
                {element("", "", "")}
            </Center>
        </Center>
    )
}