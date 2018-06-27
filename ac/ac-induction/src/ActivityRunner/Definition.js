// @flow

import * as React from 'react';

import { withStyles } from '@material-ui/core/styles';

import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import styles from './style';

const Definition = ({ classes, next, definition }) => (
  <Card className={classes.card}>
    <CardContent>
      <Typography gutterBottom variant="headline" component="h2">
        Definition
      </Typography>
      <Typography gutterBottom component="p">
        {definition}
      </Typography>
    </CardContent>
    <CardActions>
      <Button color="primary" onClick={next} className={classes.button}>
        Next
      </Button>
    </CardActions>
  </Card>
);

export default withStyles(styles)(Definition);
