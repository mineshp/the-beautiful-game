import React, { useState } from 'react';
import Profile from '../Player/Profile';
import Login from './Login';

export default function EntryApp() {
  const [profile, setProfile] = useState(null);

  const renderApp = () => {
    const userSession = JSON.parse(window.sessionStorage.getItem('profile'));
    console.log(profile);
    if (profile || (userSession && userSession.user && userSession.user.isLoggedIn)) {
      return <Profile user={profile || userSession.user} setProfile={setProfile}/>;
    } else {
      return <Login setProfile={setProfile} />;
    }
  };

  return (
    <div className='container'>
      {renderApp()}
    </div>
  );
};