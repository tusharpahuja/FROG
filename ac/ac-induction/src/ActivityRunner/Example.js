// @flow

import * as React from 'react';

import { withStyles } from '@material-ui/core/styles';

import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import styles from './style';

const Example = ({ example, next, classes, config }) => (
  <Card className={classes.card}>
    <div className={classes.media}>
      <img src={example.url} className={classes.image} alt="example" />
    </div>
    <CardContent>
      <Typography gutterBottom variant="headline" component="h2">
        {config.prompts[config.categories.indexOf(example.category)] ||
          example.category}
      </Typography>
      <Typography gutterBottom component="p">
        {example.hint}
      </Typography>
    </CardContent>
    <CardActions>
      <Button color="primary" onClick={next} className={classes.button}>
        Next
      </Button>
    </CardActions>
  </Card>
);

export default withStyles(styles)(Example);
