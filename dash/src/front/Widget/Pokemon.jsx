import { Center, Button, Box, Text, Img, Input,Flex } from "@chakra-ui/react"
import { useState, useEffect } from "react";
import { requestPostServer } from "../../httpRequest.jsx"

export function ContentPokemon(props) {

    const [Pokemon, setValuePokemon] = useState("");
    const handleChangePokemon = (event) => setValuePokemon(event.target.value)

    const [name, setValueName] = useState("");
    const [img, setValueImg] = useState("");


    function element(Name, Description) {
        return (
            <Box pr={2}>
                <Flex>
                <Input fontWeight="bold" bg="gray" variant="unstyled" w="50%" borderRadius="0px" textAlign="center" fontSize={["md", "xl", "2xl", "4xl"]} placeholder="FR for france" onChange={handleChangePokemon} value={Pokemon} />
                <Button bg="gray" color="#FFFFFF" size="lxl" borderRadius="0px" w="50%" fontSize={["sm", "xl", "2xl", "4xl"]} onClick={() => ValidatePokemon(Pokemon)}>
                            Validate
                        </Button>
                        </Flex>
                <Center p={"30px"}>
                    <Img textAlign="center" width="300px" height="200px"src={img} />
                </Center>
                <Text textAlign="center" fontSize={["sm", "xl", "2xl", "4xl"]}>{name}</Text>
                <Center>
                </Center>
                <Center>
                </Center>
            </Box>
        );
    }

    async function ValidatePokemon(pokemon) {
        const message = JSON.stringify({'pokemon': pokemon});
        try {
            const response = await requestPostServer(process.env.REACT_APP_URL + "/get_pokemon", message,  props.token);
            const adddb = JSON.stringify({ 'name': props.name, 'widget': "Pokemon", 'value': JSON.stringify({ 'value': pokemon }), 'route': `widgets/${props.index}`});
            await requestPostServer(process.env.REACT_APP_URL+"/widget/set", adddb, props.token);
            setValueName(response.species.name);
            setValueImg(response.sprites.front_default);
        } catch (error) {
            console.error(error, "for pokemon")
        }

    }

    async function get_pokemon() {
        var tmp = ''
        const message = JSON.stringify({ 'route': `widgets/${props.index}`, 'name': props.name, 'token': props.token});
        const data = await requestPostServer(process.env.REACT_APP_URL+"/get_info_db/", message, props.token);
        if (JSON.parse(data.message.value).value === '-1') {
            tmp = 'pikachu'
        } else {
            tmp = JSON.parse(data.message.value).value
        }
        ValidatePokemon(tmp)
        
    }

    useEffect(() => {
        get_pokemon()
        const interval=setInterval(()=>{
            get_pokemon()
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