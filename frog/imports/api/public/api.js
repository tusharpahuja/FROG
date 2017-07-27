import bodyParser from 'body-parser';
import { Picker } from 'meteor/meteorhacks:picker';
import { OAuth } from 'oauth';
import {crypto} from 'crypto';
import {HMACSHA1} from './sha';
import oauthSignature from 'oauth-signature';

Picker.middleware(bodyParser.urlencoded({ extended: false }));
Picker.middleware(bodyParser.json());

Picker.filter((req,res) => req.method === 'POST')
.route('/api/webhooks/:provider', ({Provider}, request, response) => {
 // We'll handle the request here.`

 const isLTI = request.body.lti_message_type === 'basic-lti-launch-request' &&
   (request.body.lti_version === 'LTI-1p0' || request.body.lti_version === 'LTI-2p0') &&
   request.body.oauth_consumer_key &&
   request.body.resource_link_id;

    // const consumer = new OAuth(request.url,'',request.body.oauth_consumer_key, 'bubu',
    //  request.body.oauth_version, undefined, request.body.oauth_signature_method,
    //  request.body.oauth_nonce.length, false);
/*
  const baseSign = OAuth.prototype._createSignatureBase(request.body.oauth_signature_method, request.url, JSON.stringify(request.body));

  const baseSign2 = request.body.oauth_signature_method.toUpperCase()
    + "&" + OAuth.prototype._encodeData(OAuth.prototype._normalizeUrl(request.url))
    + "&" + OAuth.prototype._encodeData(JSON.stringify(request.body));

  const genSign = (signatureBase, sharedSecret) => {
    let key = OAuth.prototype._encodeData(sharedSecret);
    let hash = '';
    if( request.body.oauth_signature_method == "PLAINTEXT" ) {
     hash = key;
   }
  //  else if (request.body.oauth_signature_method == "RSA-SHA1") {
  //    key = "";
  //    hash = crypto.createSign("RSA-SHA1").update(signatureBase).sign(key, 'base64');
  //  }
    else {
      //  if( crypto.Hmac ) {
      //    hash = crypto.createHmac("sha1", key).update(signatureBase).digest("base64");
      //  }
      //  else {
         hash = HMACSHA1(key, signatureBase);
       //}
   }
   return hash;
  };


  //const sig = OAuth.prototype._getSignature(request.body.oauth_signature_method, request.url, JSON.stringify(request.body), 'bubu');
  const sign = genSign(baseSign2, 'bubu');
*/
const sign = oauthSignature.generate(request.body.oauth_signature_method, request.url, JSON.stringify(request.body), 'bubu', '', { encodeSignature: false});

 const isValid = request.body.oauth_callback === 'about:blank' &&
   request.body.oauth_version === '1.0' &&
   (OAuth.prototype._getTimestamp() < request.body.oauth_timestamp + 60*5) &&// || OAuth._getTimestamp() > request.body.oauth_timestamp - 60*5;
    sign === request.body.oauth_signature;
 //request.body.oauth_nonce.length
 //check authenticity with a oauth library

 console.log(sign);
console.log(request.body.oauth_signature);
 if(isLTI){
   if(isValid) console.log('valid LTI launch request');
   else console.log('unvalid LTI launch request');
 }

 response.end('Hello');
});
