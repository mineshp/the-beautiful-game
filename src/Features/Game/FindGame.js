import React, { useEffect, useState } from 'react';
// import { withRouter } from "react-router-dom";
import api from '../../Services/theEngineRoomApi';
import Button from 'semantic-ui-react/dist/commonjs/elements/Button';
import Form from 'semantic-ui-react/dist/commonjs/collections/Form';
import Grid from 'semantic-ui-react/dist/commonjs/collections/Grid';
import Header from 'semantic-ui-react/dist/commonjs/elements/Header';
import Segment from 'semantic-ui-react/dist/commonjs/elements/Segment';
import { useInput } from '../../Shared/useInput';
import Notification from '../../Shared/Presentational/Notification';

export default function FindGame(props) {
  const { value, bind, reset } = useInput('');
  const [error, setError] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState();
  const [game, setGame] = useState();

  const findGame = async (gameName) => {
    const result = await api.get(`games/${gameName}`);
    setGame(result.data || {});
  }

  const handleSubmit = async (evt) => {
    setSubmitted(true);
    evt.preventDefault();
    if (!value) {
      setError(true)
      return setErrorMessage({
        type: 'negative',
        messageHeader: 'Oh oh, you have not entered a game name'
      });
    }
    await findGame(value);
  }

  const handleInputOnClick = () => {
    if (error && errorMessage) {
        reset();
        setError(false);
        setErrorMessage();
        setSubmitted(false);
    }
  }

  useEffect(() => {
    if (game && game.gameName) {
      props.history.push(`/game/${game.gameName}`);
    } else if (game && !game.gameName && value && submitted) {
      setError(true);
      setErrorMessage({
        type: 'negative',
        messageHeader: `The game '${value}' does not exist`
      });
    }
  }, [game, props.history, submitted, value])

  return (
    <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
      <Grid.Column style={{ maxWidth: 450 }}>
        <Header as='h2' color='teal' textAlign='center'>
          The Beautiful Game
      </Header>
        <Segment stacked>
          <Form size='large' onSubmit={handleSubmit}>
            <Form.Input
              placeholder='Enter game name...'
              type='text'
              fluid
              onClick={handleInputOnClick}
              {...bind}
            />
            <Button color='teal' fluid size='large' type='submit'>
              Find Game
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
