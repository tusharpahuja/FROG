// @flow

import * as React from 'react';
import type { ActivityRunnerT } from 'frog-utils';
import { compose, withState } from 'recompose'
import { withStyles } from 'material-ui/styles';

import Example from '../Components/Example';
import Test from '../Components/Test';


const test = () => {
  console.log('Request')
  const http = new XMLHttpRequest();
  const url = "http://localhost:8000";
  const params = '{ "requestType": "INIT", "sessionId": "A" }';
  http.open("POST", url, true);


  // var xmlhttp = new XMLHttpRequest();   // new HttpRequest instance
  // xmlhttp.open("POST", "localhost:8000", true);
  // xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  // xmlhttp.send(JSON.stringify({ email: "hello@user.com", response: { name: "Tester" } }));


  // Send the proper header information along with the request
  http.setRequestHeader("Content-type", "application/json");

  http.onreadystatechange = function() {
      console.log('http')
      console.log(http)
      if(http.readyState == 4 && http.status == 200) {
          alert(http.responseText);
      }
  }
  console.log('Sending')
  http.send(params);
}


const styles = () => ({
  container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
})

const ActivityRunner = (props: ActivityRunnerT & {classes: Object}) => {
  const { activityData, classes, ex, setEx, type, setType } = props
  const { examples, categories } = activityData.config;

  const next = () => {
    setEx((ex + 1)% examples.length)
    setType(type === 'example' ? 'test' : 'example')
  }

  const Comp = { example: Example, test: Test }[type]
  //       <Comp example={examples[ex]} next={next} categories={categories} withFeedback />
  return (
    <div className={classes.container}>
      <button onClick={test} style={{width:"200px", height:"200px"}}/>
    </div>
  );
};



const AR = compose(
  withState('ex', 'setEx', 0),
  withState('type', 'setType', 'example')
)(ActivityRunner)

export default withStyles(styles)(AR)
