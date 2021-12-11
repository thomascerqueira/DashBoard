async function requestGetServer(route)  {
  const res = await fetch(route);
  return res.json();
};

async function requestPostServer(route, message, token='') {
  try {
    const res = await fetch(route, {
      method: 'POST',
      body: message,
      headers: { 'Content-Type': 'application/json', 'authorization': `Bearer ${token}`}
    })
    return(res.json())
  } catch (error) {
    console.error('Error requestPostServer', error)
    return({'status': 84, message: error.message})
  }
  
};

export {requestGetServer, requestPostServer};