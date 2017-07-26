import bodyParser from 'body-parser';
import { Picker } from 'meteor/meteorhacks:picker';

Picker.middleware(bodyParser.json());
Picker.filter((req,res) => req.method === 'POST')
.route('/api/webhooks/:provider', ({ Provieder }, request, response) => {
 // We'll handle the request here.`

 let isLTI = request.body.lti_message_type === 'basic-lti-launch-request' &&
   (request.body.lti_version === 'LTI-1p0' || request.body.lti_version === 'LTI-2p0') &&
   request.body.oauth_consumer_key &&
   request.body.resource_link_id;

 let isValid = request.body.oauth_callback === 'about:blank' && request.body.oauth_version === '1.0';
 //check authenticity with a oauth library

 if(isLTI){
   if(isValid) console.log('valid LTI launch request');
   else console.log('unvalid LTI launch request');
 }


 response.end('Hello');
});
