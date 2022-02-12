import { Center, Button, Box, Input, Text, Flex, Img, VStack } from "@chakra-ui/react"
import { useState, useEffect } from "react";
import { requestPostServer } from "../../httpRequest.jsx"

export function ContentSteam(props) {

    const [Game, setValueGame] = useState("");
    const handleChangeGame = (event) => setValueGame(event.target.value)

    const [numberPeople, setNumberPeople] = useState(-2)
    const [nameFound, setNameFound] = useState("")
    const [headerImg, setHeaderImg] = useState("")


    function InputGame() {
        return (
            <Input fontWeight="bold" bg="#223A4C" variant="unstyled" w="50%" borderRadius="0px" textAlign="center" fontSize={["md", "xl", "2xl", "4xl"]} placeholder="Game" onChange={handleChangeGame} value={Game} />
        );
    }

    function element(GameName, ActualUser) {
        let phrase;

        if (ActualUser > -1) {
            phrase = "There are " + ActualUser + " users in the game"
        } else if (ActualUser === -1) {
            phrase = "The game entered has not been found"
        } else if (ActualUser === -3) {
            phrase = "Loading"
        } else if (ActualUser === -2) {
            phrase = "No game entered"
        } else if (ActualUser === -4) {
            phrase = ""
        }
        return (
            <Box pr={2} >
                <Text textAlign="center" fontSize={["sm", "xl", "2xl", "4xl"]}>{GameName}</Text>
                <Text textAlign="center" fontSize={["sm", "xl", "2xl", "4xl"]}> {phrase}</Text>
                <Center p={"30px"}>
                    <Img textAlign="center" src={headerImg} />
                </Center>
            </Box>
        );
    }

    async function ValidateGame(Gamevalue) {
        const game = Game === "" ? Gamevalue : Game
        const message = JSON.stringify({'game': game});
        setNumberPeople(-3)

        try {
            const response = await requestPostServer(process.env.REACT_APP_URL+"/get_steam", message, props.token);

            const adddb = JSON.stringify({ 'name': props.name, 'widget': "Steam", 'value': JSON.stringify({ 'value': game }), 'route': `widgets/${props.index}`});
            await requestPostServer(process.env.REACT_APP_URL+"/widget/set", adddb, props.token);
            
            setNameFound("Game not found")
            setNumberPeople(-1)

            if (response.status === 1) {
                setNameFound(response.game)
                setNumberPeople(response.number)
                setHeaderImg(response.header_img)
            } else if (response.status === 406) {
                setNameFound("Error see console")
                console.error('Error', response.message)
                setNumberPeople(-4)
            } else if (response.status === 405) {
                setNameFound("Error see console")
                console.error('Error', response.message)
                setNumberPeople(-4)
            }
        } catch (error) {
            console.error(error)
            setNameFound("Error with the server")
            setNumberPeople(-1)
        }

    }

    async function Getdata() {
        var tmp = ''
        const message = JSON.stringify({ 'route': `widgets/${props.index}`, 'name': props.name, 'token': props.token});
        const data = await requestPostServer(process.env.REACT_APP_URL+"/get_info_db/", message, props.token);
        if (JSON.parse(data.message.value).value === '-1') {
            tmp = 'Arma 3'
        } else {
            tmp = JSON.parse(data.message.value).value
        }
        ValidateGame(tmp);
    }

    useEffect(()=>{
    Getdata()
    const interval=setInterval(()=>{
      Getdata()
    },600000) 
     return()=>clearInterval(interval)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    ,[])

    return (
        <Center h="80vh" w="95%" bg={props.color} color="#fff" borderRadius="10px" margin="10px">
            <VStack>
                <Center p={"30px"}>
                    <Flex>
                        {InputGame()}
                        <Button bg="#223A4C" color="#5FBDEA" size="lxl" borderRadius="0px" w="50%" fontSize={["sm", "xl", "2xl", "4xl"]} onClick={() => ValidateGame()}>
                            Validate
                        </Button>
                    </Flex>
                </Center>
                <Center >
                    {element(nameFound, numberPeople)}
                </Center>
            </VStack>
        </Center>
    )
}