import bodyParser from 'body-parser';
import { Picker } from 'meteor/meteorhacks:picker';
import { OAuth } from 'oauth';
// import {React} from 'react';
// import {apps, PageContainer} from '../../ui/App/index';

Picker.middleware(bodyParser.urlencoded({ extended: false }));
Picker.middleware(bodyParser.json());

Picker.filter(
  (req, res) => req.method === 'POST'
).route('/api/webhooks/:provider', ({ Provider }, request, response) => {
  // We'll handle the request here.`
  // console.log(request);

  const isLTI =
    request.body.lti_message_type === 'basic-lti-launch-request' &&
    (request.body.lti_version === 'LTI-1p0' ||
      request.body.lti_version === 'LTI-2p0') &&
    request.body.oauth_consumer_key &&
    request.body.resource_link_id;

  const isValid =
    request.body.oauth_callback === 'about:blank' &&
    request.body.oauth_version === '1.0' &&
    OAuth.prototype._getTimestamp() < request.body.oauth_timestamp + 60 * 5;
  // check authenticity with a oauth library

  // missing signature check (+nonces ?)

  // step3
  const hasParams =
    request.body.roles !== '' && request.body.ext_user_username !== '';
  //
  //
  const role = request.body.roles.split(',')[0];
  const user = request.body.ext_user_username;
  console.log(user);
  console.log(role);

  // console.log(request.body.oauth_signature);

  if (isLTI) {
    if (isValid) console.log('valid LTI launch request');
    else console.log('unvalid LTI launch request');
  }

  //  let result = null;
  //
  // if(role === 'Learner'){
  //   result = '<PageContainer
  //     username={user}
  //     apps={apps.student}
  //     currentApp={apps.student}
  //   />';
  // }else if(role === 'Instructor'){
  //   result = (<PageContainer
  //     username='teacher'
  //     apps={apps}
  //     currentApp={this.state.app === undefined ? '' : this.state.app}
  //   />);
  // }
  console.log(request.body);

  response.end(JSON.stringify(request.body));
});
