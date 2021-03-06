import React from 'react';
import Routes from './Shared/Routes';
import './App.css';
import { StateProvider } from './State';

const App = () => {
  const initialState = {
    game: undefined,
    profile: undefined
  };

  const reducer = (state, action) => {
    switch (action.type) {
      case 'SET_PROFILE':
        return {
          ...state,
          profile: action.profile
        }
      default:
        return state;
    }
  }
  return (
    <StateProvider initialState={initialState} reducer={reducer}>
      <div className="App">
        <Routes />
      </div>
    </StateProvider>
  );
};

export default App;
