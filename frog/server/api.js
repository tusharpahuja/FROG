import bodyParser from 'body-parser';
import { Picker } from 'meteor/meteorhacks:picker';
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

Picker.middleware(bodyParser.urlencoded({ extended: false }));
Picker.middleware(bodyParser.json());

Picker.filter(
  (req, res) => req.method === 'POST'
).route('/api/webhooks/:provider', ({ Provider }, request, response, next) => {
  const role = request.body.roles.split(',')[0];
  const user = request.body.user_id;
  response.writeHead(301, { Location: `/?login=${user}` });
  response.end();
});
