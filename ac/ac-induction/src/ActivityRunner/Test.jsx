// @flow

import * as React from 'react';
import { withState } from 'recompose';

import { withStyles } from 'material-ui/styles';
import Card, { CardActions, CardContent, CardMedia } from 'material-ui/Card';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import Collapse from 'material-ui/transitions/Collapse';

import red from 'material-ui/colors/red';
import green from 'material-ui/colors/green';

const styles = () => ({
  card: {
    width: 450
  },
  media: {
    height: 450
  },
  button: {
    margin: 'auto',
    width: '30%'
  }
});

const Feedback = ({ correct, expected, next, classes }) => (
  <React.Fragment>
    <CardContent>
      <Typography paragraph variant="body1">
        {correct
          ? 'Bravo, you are right!'
          : 'The correct answer was ' + expected}
      </Typography>
    </CardContent>
    <CardActions>
      <Button
        key="idk"
        color="primary"
        onClick={next}
        className={classes.button}
      >
        Next
      </Button>
    </CardActions>
  </React.Fragment>
);

const StatelessTest = props => {
  const {
    example,
    withFeedback,
    categories,
    next,
    classes,
    reportScore,
    feedback,
    setFeedback
  } = props;
  const onClick = category => {
    const correct = category === example.category ? 1 : 0;
    const expected = example.category;
    reportScore(correct);
    setFeedback({ selected: category, expected, correct });

    if (!withFeedback) {
      next();
    }
  };

  const getButtonStyle = category => {
    if (!feedback) {
      return {};
    } else if (category === example.category) {
      return { backgroundColor: green[700], color: 'white' };
    } else if (category === feedback.selected) {
      return { backgroundColor: red[700], color: 'white' };
    }
  };

  return (
    <Card className={classes.card}>
      <CardMedia
        className={classes.media}
        image={example.url}
        title="Example"
      />
      <CardContent>
        <Typography gutterBottom variant="headline" component="h3">
          Which category is that example from?
        </Typography>
      </CardContent>
      <CardActions>
        {categories.map(category => (
          <Button
            key={category}
            color="primary"
            variant="raised"
            onClick={() => onClick(category)}
            className={classes.button}
            disabled={!!feedback}
            style={getButtonStyle(category)}
          >
            {category}
          </Button>
        ))}
        <Button
          key="idk"
          color="primary"
          variant="raised"
          onClick={() => onClick('idk')}
          className={classes.button}
          disabled={!!feedback}
        >
          I don't know
        </Button>
      </CardActions>
      <Collapse in={!!feedback} timeout="auto" unmountOnExit>
        <Feedback {...feedback} next={next} classes={classes} />
      </Collapse>
    </Card>
  );
};

const Test = withState('feedback', 'setFeedback', null)(StatelessTest);

export default withStyles(styles)(Test);
