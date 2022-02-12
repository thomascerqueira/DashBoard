import { requestPostServer } from "../httpRequest.jsx"

export async function updateValue(value, setValues, newValue, index, name, token) {
    const adddb = JSON.stringify({ 'name': name, 'widget': `${newValue.name}`, 'value': JSON.stringify({ 'value': newValue.value }), 'route': `widgets/${index}`});
    await requestPostServer(process.env.REACT_APP_URL+"/widget/set", adddb, token);

    let temp_state = [...value]
    temp_state[index] = newValue
    setValues(temp_state)
}
  