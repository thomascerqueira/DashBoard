import {Stack,Flex, Center, Button, Text, Menu, MenuButton, MenuList, MenuItemOption } from "@chakra-ui/react"
import {updateValue} from "../../Functions/updateValue.jsx"
import React, { useState } from 'react';
import { ChevronDownIcon } from "@chakra-ui/icons";

const widgetAvailables = [
    "Weather",
    "Cinema",
    "Location",
    "Pokemon",
    "Steam",
    "Giphy"
  ]

export const AddWidget = (props) => {
    const [text, setText] = useState("Chose a widget")
    const [error, setError] = useState("")
    const setValues = props.setValues
    const Values = props.values
  
    return (
      <Flex
        flexDirection="column"
        margin="10px"
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
        <Center>

            <Menu>
              <MenuButton as={Button} rightIcon={<ChevronDownIcon/>}>
                {text}
              </MenuButton>
              <MenuList>
                {widgetAvailables.map((item, index) => {
                  return <MenuItemOption key={index} value={item} onClick={() => setText(item)}>
                    {item}
                  </MenuItemOption>
                })}
              </MenuList>
            </Menu>
        </Center>
        <Center>
          <Button onClick={() => {
            if (text === "Chose a widget") {
              setError("Chose a widget before validate")
              return
            } else {
              updateValue(Values, setValues, {name:text, value:'-1'}, props.index, props.name, props.token)
            }
          }}>
            Validate
          </Button>
        </Center>
        <Center>
          <Text>{error}</Text>
        </Center>
            </Stack>
      </Flex>
    )
  }
  