import React, { useState } from 'react';
import { Center, Button, Box, Input, Img, Grid } from "@chakra-ui/react"
import { requestPostServer } from "../../httpRequest.jsx"

const Error = (props) => {
    if (!props.isError) {
        return null
    }
    return (
        <p className="error">{props.text}</p>
    )
}

const Item = (props) => {
    var url = props.totalurl
    return (
        <Box>
            <Img src={`https://media1.giphy.com/media/${props.url}/giphy-downsized.gif`} onClick={() => {window.open(url)}}/>
        </Box>
    )
}

const TextList = (props) => {
    const items = props.gifs.map((itemData) => {
        return <Item url={itemData.id} totalurl={itemData.embed_url} />
    })
    return (
        <Grid  templateColumns='repeat(5, 1fr)' gap={6}>
            {items}
        </Grid>
    )
}

export function Giphy(props) {
    const [text, setText] = useState('');
    const handleChangeInput = (event) => setText(event.target.value)
    const [results, setResults] = useState([]);
    const [err, setErr] = useState(false);


    const handleSubmit = (e) => {
        setResults([])
        if (text.length === 0) {
            setErr(true);
            return;
        }

        const apiCall = async () => {

            const message = JSON.stringify({ 'name': text, 'limit': 20 });
            try {
                const response = await requestPostServer(process.env.REACT_APP_URL + "/get_gif", message, props.token);
                try {
                    if (response.status === 406 || response.status === 405) {
                        console.error('Error', response.message, "for gif");
                        setErr(true);
                    } else {
                        setResults(response.data);
                    }
                } catch (error) {
                    setErr(true);
                    console.error(error, "for cinema")
                }
            } catch (error) {
                setErr(true);
                console.error(error, "for cinema")
            }
        }

        apiCall();
        setText('');
        setErr(false);
    }

    return (
        <Box h="80vh" w="95%" bg="#166FE5" borderRadius="10px" margin="10px">
            <Center paddingTop={"20px"}>
                <Input  color="white" fontWeight="bold" variant="unstyled" w="50%" borderRadius="0px" textAlign="center" fontSize={["md", "xl", "2xl"]} placeholder="Your giphy" onChange={handleChangeInput} value={text} />
                <Button onClick={handleSubmit}>Submit</Button>
                <Error isError={err} text="need length longer than 0 for input"></Error>
            </Center>
            <Box paddingTop={"20px"}>
            {results && <TextList gifs={results} />}
</Box>
        </Box>
    )
}