import React, { useEffect, useState } from 'react';
import { CTX } from './Store';
import api from './Services/theEngineRoomApi';
import Divider from 'semantic-ui-react/dist/commonjs/elements/Divider';
import Icon from 'semantic-ui-react/dist/commonjs/elements/Icon';
import Item from 'semantic-ui-react/dist/commonjs/views/Item';
import Grid from 'semantic-ui-react/dist/commonjs/collections/Grid';
import Header from 'semantic-ui-react/dist/commonjs/elements/Header';
import Segment from 'semantic-ui-react/dist/commonjs/elements/Segment';
import Notification from './Shared/Presentational/Notification';

export default function Pitch(props) {
  // const [allGames] = React.useContext(CTX);
  const { gameName } = props.match.params;
  const gameId = "ZNHSGH"; // TODO: Get from dropdown, make listGames api endpoint

  // local state
  const [first10, setFirst10] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await api.get(`game/${gameId}/getFirst10`);
      setFirst10(result.data);
    };
    fetchData();
  }, []);

  const [subs, setSubs] = useState( { data: [] });

  useEffect(() => {
    const fetchData = async () => {
      const result = await api.get(`game/${gameId}/getSubs`);
      setSubs(result.data);
    };
    fetchData();
  }, [])

  const playerLineup = (playerSet) => {
    if (playerSet.length) {
      return playerSet.map(({ playerId, nickName }, index) => (
        <Item key={playerId}>
            <Item.Image size='tiny' src='https://react.semantic-ui.com/images/wireframe/image.png' />
          <Item.Content verticalAlign='middle'>{nickName.toUpperCase()}</Item.Content>
          </Item>
      ));
    } else {
      return (
      <Notification
        type='negative'
        messageHeader='No players available'
      />)
    }
  }

  return (
    <div className="Pitch-listGame">
      <h1>Game: {gameName}</h1>
      <Segment placeholder>
        <Grid columns={2} stackable textAlign='center'>
          <Divider vertical />

          <Grid.Row verticalAlign='middle'>
            <Grid.Column>
              <Header icon>
                <Icon name='futbol' />
                Playing
              </Header>
              <Item.Group divided>
              {
                playerLineup(first10)
              }
              </Item.Group>
            </Grid.Column>
            <Grid.Column>
              <Header icon>
                <Icon name='user close' />
                Subs
              </Header>
              <Item.Group divided>
              {
                playerLineup(subs)
              }
              </Item.Group>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
    </div>
  );
};
