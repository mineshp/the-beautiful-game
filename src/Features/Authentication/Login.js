import React, { useState } from 'react';
import api from '../../Services/theEngineRoomApi';
import Button from 'semantic-ui-react/dist/commonjs/elements/Button';
import Form from 'semantic-ui-react/dist/commonjs/collections/Form';
import Grid from 'semantic-ui-react/dist/commonjs/collections/Grid';
import Header from 'semantic-ui-react/dist/commonjs/elements/Header';
import Segment from 'semantic-ui-react/dist/commonjs/elements/Segment';
import { useInput } from '../../Shared/useInput';
import { useStateValue } from '../../State';
import Notification from '../../Shared/Presentational/Notification';

const storeUserSession = (profile) => {
  const userSession = {
    expiresAt: new Date(new Date().setHours(1)),
    user: {
      ...profile,
      isLoggedIn: true,
    }
  };

  window.sessionStorage.setItem('profile', JSON.stringify(userSession));
}

export default function Login(props) {
  const { value, bind, reset } = useInput('');
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState();
  const [state, dispatch] = useStateValue();

  const findPlayer = async (playerId) => {
    const result = await api.get(`player/${playerId}/profile`);

    if (result.data) {
      props.setProfile(result.data);
      console.log(dispatch);
      dispatch({
        type: 'SET_PROFILE',
        profile: { ...result.data }
      });

      const { available, ...player } = result.data;
      storeUserSession(player);
    } else {
      props.setProfile(null);
      setError(true);
      setErrorMessage({
        type: 'negative',
        messageHeader: `The player code '${value}' is not valid!`
      });
    }
  }

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    if (!value) {
      setError(true)
      return setErrorMessage({
        type: 'negative',
        messageHeader: 'You have not entered a player code!'
      });
    }
    await findPlayer(value);
  }

  const handleInputOnClick = () => {
    if (error && errorMessage) {
        reset();
        setError(false);
        setErrorMessage();
    }
  }

  return (
    <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
      <Grid.Column style={{ maxWidth: 450 }}>
        <Header as='h2' color='teal' textAlign='center'>
          Login to The Beautiful Game
        </Header>
        <Segment stacked>
          <Form size='large' onSubmit={handleSubmit}>
            <Form.Input
              placeholder='Enter player code...'
              type='text'
              fluid
              onClick={handleInputOnClick}
              {...bind}
            />
            <Button color='teal' fluid size='large' type='submit'>
              Login
            </Button>
            </Form>
            { error && errorMessage &&
              <Notification
              type={errorMessage.type}
              messageHeader={errorMessage.messageHeader}
              />
            }
          </Segment>
      </Grid.Column>
    </Grid>
  );
};
