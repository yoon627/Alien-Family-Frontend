const initialState = {
    serverAddress: "http://52.78.141.180:8080"
  };
  
  const serverConnector = (state=initialState,action=null) => {
    switch(action.type){
      default:
        return state;
    }
  };
  
  export default serverConnector;