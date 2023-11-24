// rootReducer.js
import { combineReducers } from 'redux';
import counterReducer from './Slicers/counterSlice';

const rootReducer = combineReducers({
  counter: counterReducer,
});

export default rootReducer;