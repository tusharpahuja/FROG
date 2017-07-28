const body = {
  oauth_version: '1.0',
  oauth_nonce: '8b8074b3ceb2723fb29a93733234cb35',
  oauth_timestamp: '1501238173',
  oauth_consumer_key: 'activityTest',
  user_id: '2',
  lis_person_sourcedid: '',
  roles:
    'Instructor,urn:lti:sysrole:ims/lis/Administrator,urn:lti:instrole:ims/lis/Administrator',
  context_id: '2',
  context_label: 'learn',
  context_title: 'Learn a lot',
  resource_link_title: 'test romain LTI',
  resource_link_description:
    'a first test to figure out the structure of the lti request',
  resource_link_id: '1',
  context_type: 'CourseSection',
  lis_course_section_sourcedid: '',
  lis_result_sourcedid:
    '{"data":{"instanceid":"1","userid":"2","typeid":null,"launchid":574520262},"hash":"4b6c8d9ac49f5cbd910724999f0d60fe362ee4e61e48d31f5f130423470d2a20"}',
  lis_outcome_service_url:
    'http://icchilisrv4.epfl.ch:5000/mod/lti/service.php',
  lis_person_name_given: 'Admin',
  lis_person_name_family: 'User',
  lis_person_name_full: 'Admin User',
  ext_user_username: 'admin',
  lis_person_contact_email_primary: 'shaklev@gmail.com',
  launch_presentation_locale: 'en',
  ext_lms: 'moodle-2',
  tool_consumer_info_product_family_code: 'moodle',
  tool_consumer_info_version: '2017051501.02',
  oauth_callback: 'about:blank',
  lti_version: 'LTI-1p0',
  lti_message_type: 'basic-lti-launch-request',
  tool_consumer_instance_guid: 'icchilisrv4.epfl.ch',
  tool_consumer_instance_name: 'LTI',
  tool_consumer_instance_description: 'Testing LTI',
  launch_presentation_document_target: 'iframe',
  launch_presentation_return_url:
    'http://icchilisrv4.epfl.ch:5000/mod/lti/return.php?course=2&launch_container=3&instanceid=1&sesskey=L7Q8WtSBWP',
  oauth_signature_method: 'HMAC-SHA1',
  oauth_signature: 'ZT/ygZMe8x5v5fGKci57jHBTIwU='
};
// for sign def as :
// generateSignature(url, body, sharedSecret)
test('Test signature', () => {
  expect(generateSignature('/api/webhooks/testRomain', body, 'bubu')).toBe(
    'ZT/ygZMe8x5v5fGKci57jHBTIwU='
  );
});
