import React, { useEffect, useState } from 'react';
import api from '../../Services/theEngineRoomApi';
import Button from 'semantic-ui-react/dist/commonjs/elements/Button';
import Divider from 'semantic-ui-react/dist/commonjs/elements/Divider';
import Form from 'semantic-ui-react/dist/commonjs/collections/Form';
import Grid from 'semantic-ui-react/dist/commonjs/collections/Grid';
import Header from 'semantic-ui-react/dist/commonjs/elements/Header';
import Icon from 'semantic-ui-react/dist/commonjs/elements/Icon';
import Image from 'semantic-ui-react/dist/commonjs/elements/Image';
import Input from 'semantic-ui-react/dist/commonjs/elements/Input';
import Step from 'semantic-ui-react/dist/commonjs/elements/Step';
import { displayAvailabilityConfirmation } from '../../utils/FormatDate';
import { useInput } from '../../Shared/useInput';
import Notification from '../../Shared/Presentational/Notification';
import Loading from '../../Shared/Presentational/Loading';
// import availablePlayerImg from '../../assets/available_footballer_silhouette.jpg';
// import unAvailablePlayerImg from '../../assets/injured_football_player.jpg';
import blankFootballerAvatarImg from '../../assets/footballer-avatar-128.png';

const PlayerBioForm = (
  { player, nickName },
  handleSubmit,
  bindPlayerName,
  bindNickName,
  error,
  errorMessage
) => (
  <div>
    <Form size='large' onSubmit={handleSubmit}>
      <Form.Field inline>
        <label>Name</label>
        <Input
          name='playerName'
          placeholder='Name'
          type='text'
          {...bindPlayerName}
        />
      </Form.Field>
      <Form.Field inline>
        <label>Known as</label>
        <Input
          name='nickName'
          placeholder='Known as'
          type='text'
          {...bindNickName}
        />
      </Form.Field>
      <Button color='teal' fluid type='submit'>
        Save
      </Button>
    </Form>
    { error && errorMessage &&
      <Notification
        type={errorMessage.type}
        messageHeader={errorMessage.messageHeader}
      />
    }
  </div>
);

const PlayerBioReadonly = ({ player, nickName }) => (
  <div className='player-profile-bio-details'>
    <div className='player-profile-bio-details-field'>
      <label className='player-profile-bio-label-heading'>Name: </label>
      <label className='player-profile-bio-label-value'>{player}</label>
    </div>
    <div className='player-profile-bio-details-field'>
      <label className='player-profile-bio-label-heading'>Known as: </label>
      <label className='player-profile-bio-label-value'>{nickName}</label>
    </div>
  </div>
);

const gameDetails = (gameName) => (
  <Grid.Row>
    <Grid.Column width={6}>
    <label className='player-profile-bio-label-heading'>Game: </label><label className='player-profile-bio-label-value'>{gameName}</label>
    </Grid.Column>
    <Grid.Column width={5}>
    <label className='player-profile-bio-label-heading'>Status: </label><label className='player-profile-bio-label-value'>On</label>
    </Grid.Column>
    <Grid.Column width={5}>
    <label className='player-profile-bio-label-heading'>Date: </label><label className='player-profile-bio-label-value'>null</label>
    </Grid.Column>
  </Grid.Row>
);

const availabilityProcess = (availability, confirmationTime, availabilityStatus) => {
  const disabledStep = availabilityStatus.icon === 'question';
  return (
  <Step.Group>
    <Step>
      <Icon name='futbol' />
      <Step.Content>
        <Step.Title>Availability</Step.Title>
        <Step.Description>Are you playing?</Step.Description>
      </Step.Content>
    </Step>

      <Step disabled={disabledStep}>
        <Icon name={availabilityStatus.icon} color={availabilityStatus.colour}/>
      <Step.Content>
          <Step.Title>{availabilityStatus.response}</Step.Title>
          <Step.Description>{`updated: ${displayAvailabilityConfirmation(confirmationTime)}`}</Step.Description>
      </Step.Content>
    </Step>
  </Step.Group>
);
}

export default function Profile(props) {
  const { user } = props;

  const { value:playerName, setValue: setPlayerNameInput, bind:bindPlayerName, reset:resetPlayerName } = useInput('');
  const { value:nickName, setValue: setNickNameInput, bind:bindNickName, reset:resetNickName } = useInput('');
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState();

  const [updateMode, setUpdateMode] = useState(false);
  const [availability, setAvailability] = useState(user.available || null);
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const result = await api.get(`player/${user.playerId}/profile`);
      setProfileData(result.data);
      setAvailability(result.data.available);
      setPlayerNameInput(result.data.player);
      setNickNameInput(result.data.nickName);
    };
    fetchData();
  }, [setNickNameInput, setPlayerNameInput, user.playerId]);

  const onAvailabilityToggleClick = async (availabilityFlag) => {
    let result;
    if (availabilityFlag) {
      setAvailability(true);
      result = await api.put(`player/${user.playerId}/${user.gameId}/available/true`);
    } else {
      setAvailability(false);
      result = await api.put(`player/${user.playerId}/${user.gameId}/available/false`);
    }
    return props.setProfile({ ...user, available: result.data.Attributes.available});
  };

  const onEditClick = () => setUpdateMode(!updateMode);

  const amIAvailable = () => {
    if (availability) {
      return {
        icon: 'check',
        colour: 'green',
        response: 'In'
      };
    } else if (availability === false) {
      return {
        icon: 'cancel',
        colour: 'red',
        response: 'Out'
      };
    } else {
      return {
        icon: 'question',
        colour: 'grey',
        response: 'No reply'
      };
    }
  }

  const handleSubmit = async (evt) => {
    evt.preventDefault();

    if (!playerName) {
      setError(true)
      return setErrorMessage({
        type: 'negative',
        messageHeader: 'You have not entered a player name!'
      });
    }

    if (!nickName) {
      setError(true)
      return setErrorMessage({
        type: 'negative',
        messageHeader: 'You have not entered a nick name!'
      });
    }

    const updatedProfileDate = {
      ...profileData,
      player: playerName,
      nickName: nickName
    };
    console.log(`Saving Player Information`);
    console.log(updatedProfileDate);
    setUpdateMode(false);
    return updatedProfileDate;
  };

  if (!profileData) return (<Loading />);
  console.log(profileData);
  return (
    <div className='player-profile'>
      <div className='player-profile-bio'>
        <Grid>
          <Grid.Row>
            <Grid.Column width={16}>
              {availabilityProcess(availability, user.confirmationTime, amIAvailable())}
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={16}>
              <Header className='player-profile-welcome'>Welcome {profileData.nickName}</Header>
            </Grid.Column>
          </Grid.Row>
          <Divider horizontal>Bio</Divider>
          <Grid.Row>
            <Grid.Column width={6}>
              <Image src={blankFootballerAvatarImg} size='medium' circular />
            </Grid.Column>
            <Grid.Column width={10}>
              {
                updateMode
                  ? PlayerBioForm(profileData, handleSubmit, bindPlayerName, bindNickName, error, errorMessage)
                  : PlayerBioReadonly(profileData)
              }
              <div className='player-profile-edit' onClick={onEditClick}>
                <Icon name='pencil alternate' />
              </div>
            </Grid.Column>
          </Grid.Row>
          <Divider horizontal>Game</Divider>
              {gameDetails(profileData.gameName)}
          <Divider horizontal>Availability</Divider>
          <Grid.Row>
            <Grid.Column width={16}>
              <Button.Group>
                <Button color='green' onClick={() => onAvailabilityToggleClick(true)}>In</Button>
                <Button.Or />
                <Button color='red' onClick={() => onAvailabilityToggleClick(false)}>Out</Button>
              </Button.Group>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    </div>
  );
};
