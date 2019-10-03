import React from 'react';
import { StateProvider } from './State';

export default function Store(props) {
  const initialState = {
    game: undefined,
    profile: undefined
  };

  const reducer = (state, action) => {
    switch (action.type) {
      case 'SET_PROFILE':
        return {
          ...state,
          profile: {
            ...action.payload
          }
        }
      case 'RETRIEVE_PROFILE':
        return {
          profile: state.profile
        }
      default:
        return state;
    }
  }

  return (
    <StateProvider initialState={initialState} reducer={reducer}>
      {props.children}
    </StateProvider>
  )
}