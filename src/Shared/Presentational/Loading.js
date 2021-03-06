import React from 'react';
import Dimmer from 'semantic-ui-react/dist/commonjs/modules/Dimmer';
import Loader from 'semantic-ui-react/dist/commonjs/elements/Loader';

const Loading = () => (
    <div>
        <Dimmer active>
            <Loader size="medium">Floodlight failure...</Loader>
        </Dimmer>
    </div>
);

export default Loading;