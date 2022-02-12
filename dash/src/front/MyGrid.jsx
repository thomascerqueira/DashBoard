import { CgClose } from 'react-icons/cg'
import { Box, Grid, Text, IconButton } from "@chakra-ui/react"
import { AddWidget } from './Widget/AddWidget';
import { updateValue } from '../Functions/updateValue';
import { ContentWeather } from './Widget/Weather.jsx'

import { ContentPokemon } from './Widget/Pokemon.jsx'
import { ContentSteam } from './Widget/Steam.jsx'
import { ContentCinema } from './Widget/Cinema.jsx'
import {ContentLocation} from './Widget/Location.jsx'
import { Giphy } from './Widget/Giphy.jsx'



const ChoseWidget = (props, value, index) => {
    switch (value.name) {
        case "Weather":
            return <ContentWeather
            login={props.login}
            title={value}
            name={props.name}
            token={props.token}
            index={index}
        />
        case "Cinema":
            return <ContentCinema
            title={value}
            color={"#c1392b"}
            token={props.token}
            name={props.name}
            index={index}

        />
        case "Location":
            return <ContentLocation
            title={value}
            color={"#057715"}
            token={props.token}
            name={props.name}
            index={index}

        />
        case "Pokemon":
            return <ContentPokemon
            title={value}
            token={props.token}
            name={props.name}
            color={"gray"}
            index={index}

        />
        case "Steam":
            return <ContentSteam
            title={value}
            token={props.token}
            color={"#1B2838"}
            name={props.name}
            index={index}

        />
        case "Giphy":
            return <Giphy
            token={props.token}
            index={index}
            />
        default:
            return <Text>{value}</Text>
    }
}



export const MyGrid = (props) => {
    const setValues = props.setValues;
    const Values = props.values;
  
    const items = Values.map((itemData, index) => {
      return itemData.name === 'none' ?
        <AddWidget key={index} index={index} setValues={setValues} values={Values} name={props.name} token={props.token}></AddWidget> :
        <Box key={index}>
          <IconButton 
          margin="10px"
          bg="red"
          color="white"
          icon={<CgClose/>}
            onClick={() => {
              updateValue(Values, setValues, {name:'none', value:'-1'}, index, props.name, props.token)
            }}
          >
          </IconButton>
          {ChoseWidget(props, itemData, index)}
        </Box>
        
    })
    return (
      <Box h="100hv">
        <Grid templateColumns='repeat(3,1fr)' gap={6}>
          {items}
        </Grid>
      </Box>
    )
  }

