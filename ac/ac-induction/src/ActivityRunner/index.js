// @flow

import * as React from 'react';
import { shuffle } from 'lodash';

import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import Example from './Example';
import Test from './Test';
import TestWithFeedback from './TestWithFeedback';
import SelfExplanation from './SelfExplanation';
import Definition from './Definition';
import ProgressBar from './ProgressBar';

import styles from './style';

type StateT = {
  progress: number,
  pretest: number[],
  posttest: number[],
  spinning: boolean,
  subActivity: string
};

const PretestPrompt = ({ classes, next, introduction }) => (
  <Card className={classes.prompt}>
    <CardContent>
      <Typography gutterBottom variant="subheading">
        {introduction}
      </Typography>
    </CardContent>
    <CardActions>
      <Button color="primary" onClick={next} className={classes.promptButton}>
        Start the test.
      </Button>
    </CardActions>
  </Card>
);

const LearningPrompt = ({ classes, next }) => (
  <Card className={classes.prompt}>
    <CardContent>
      <Typography gutterBottom component="h3">
        Time to learn! Ready for the challenge?
      </Typography>
    </CardContent>
    <CardActions>
      <Button color="primary" onClick={next} className={classes.promptButton}>
        Start Learning
      </Button>
    </CardActions>
  </Card>
);

const PosttestPrompt = ({ classes, next }) => (
  <Card className={classes.prompt}>
    <CardContent>
      <Typography gutterBottom component="h3">
        Let's see how much you learned
      </Typography>
    </CardContent>
    <CardActions>
      <Button color="primary" onClick={next} className={classes.promptButton}>
        Start the test
      </Button>
    </CardActions>
  </Card>
);

const EndPrompt = ({ classes, score }) => (
  <Card className={classes.prompt}>
    <CardContent>
      <Typography gutterBottom variant="headline" component="h3">
        Activity Completed !
      </Typography>
      <Typography gutterBottom component="p">
        You scored {score} on the final test
      </Typography>
    </CardContent>
    <CardActions>
      <Button
        color="primary"
        onClick={window.close}
        className={classes.promptButton}
      >
        Close tab
      </Button>
    </CardActions>
  </Card>
);

class ActivityRunner extends React.Component<any, StateT> {
  cards: Object[];
  sequence: number[];
  N: number;

  state = {
    progress: 0,
    pretest: [],
    posttest: [],
    spinning: false,
    subActivity: 'pretest'
  };

  constructor(props) {
    super(props);
    this.cards = [];
    this.N = 8 + 5 + 8 + 3 + 1;
    this.getPretest();
  }

  getPretest() {
    const { config } = this.props.activityData;
    const { tests, categories } = config;
    this.cards.push(
      <PretestPrompt
        introduction={config.introduction}
        classes={this.props.classes}
        next={this.next}
        skip={this.skipPretest}
      />
    );
    tests.forEach(test => {
      this.cards.push(
        <Test
          config={config}
          example={test}
          next={this.next}
          categories={categories}
          submitResult={this.handlePretestResult}
          logger={this.props.logger}
          skip={this.skipPretest}
        />
      );
    });
  }

  getLearningActivities = () => {
    const { config } = this.props.activityData;
    const { examples, categories, definition, testsWithFeedback } = config;
    this.cards.push(
      <LearningPrompt classes={this.props.classes} next={this.next} />
    );

    const learningActivities = [
      ...examples.map(example => (
        <Example
          config={config}
          example={example}
          next={this.next}
          categories={categories}
          logger={this.props.logger}
        />
      )),
      ...testsWithFeedback.map(example => (
        <TestWithFeedback
          key={example.url}
          config={config}
          example={example}
          next={this.next}
          categories={categories}
          logger={this.props.logger}
        />
      )),
      <SelfExplanation
        next={this.next}
        config={config}
        logger={this.props.logger}
      />,
      <Definition
        next={this.next}
        definition={definition}
        logger={this.props.logger}
      />
    ];

    const { optimizer, logger } = this.props;
    this.setState({ spinning: true });
    optimizer.recommend(config.optimId, (err, res) => {
      if (err) {
        console.error(err);
        logger({ type: 'recommendation', value: 'ERROR' });
        shuffle(learningActivities)
          .slice(0, 5)
          .forEach(i => this.cards.push(i));
      } else if (res) {
        this.sequence = res.data.recommendation;
        logger({ type: 'recommendation', value: this.sequence });
        const EH = shuffle([0, 1, 2]);
        let ehIndex = 0;
        const TH = shuffle([3, 4, 5]);
        let thIndex = 0;
        this.sequence.forEach(x => {
          if (x === 0) {
            this.cards.push(learningActivities[EH[ehIndex]]);
            ehIndex += 1;
          }
          if (x === 1) {
            this.cards.push(learningActivities[TH[thIndex]]);
            thIndex += 1;
          }
          if (x === 2) {
            this.cards.push(learningActivities[6]);
          }
          if (x === 3) {
            this.cards.push(learningActivities[7]);
          }
        });
      }
      this.setState({ spinning: false });
    });
  };

  getPostTest() {
    const { config } = this.props.activityData;
    const { tests, categories } = config;
    this.cards.push(
      <PosttestPrompt classes={this.props.classes} next={this.next} />
    );

    tests.forEach(test => {
      this.cards.push(
        <Test
          config={config}
          example={test}
          next={this.next}
          categories={categories}
          submitResult={this.handlePosttestResult}
          logger={this.props.logger}
        />
      );
    });
  }

  getEnd() {
    const { config } = this.props.activityData;
    const { posttest } = this.state;
    this.cards.push(
      <SelfExplanation
        next={this.next}
        config={config}
        logger={this.props.logger}
      />
    );

    const score =
      Math.ceil(100 * posttest.filter(x => x > 0).length / posttest.length) +
      '%';
    this.cards.push(<EndPrompt classes={this.props.classes} score={score} />);
  }

  skipPretest = () => {
    this.setState({ progress: this.cards.length });
    this.getLearningActivities();
    this.setState({ subActivity: 'learning' });
  };

  next = () => {
    const progress = this.state.progress + 1;
    this.props.logger({ type: 'progress', value: progress / this.N });
    if (progress >= this.cards.length) {
      if (this.state.subActivity === 'pretest') {
        this.getLearningActivities();
        this.setState({ subActivity: 'learning' });
      } else if (this.state.subActivity === 'learning') {
        this.getPostTest();
        this.setState({ subActivity: 'posttest' });
      } else if (this.state.subActivity === 'posttest') {
        this.reportToOptimizer();
        this.getEnd();
        this.setState({ subActivity: 'end' });
      }
    }
    this.setState({ progress });
  };

  handlePretestResult = score => {
    this.props.logger({ type: 'pretest', value: score });
    const { pretest } = this.state;
    pretest.push(score > 0 ? 1 : -1);
    this.setState({ pretest });
  };

  handlePosttestResult = score => {
    this.props.logger({ type: 'posttest', value: score });
    const { posttest } = this.state;
    posttest.push(score > 0 ? 1 : -1);
    this.setState({ posttest });
  };

  reportToOptimizer = () => {
    const { config } = this.props.activityData;
    const { optimizer } = this.props;
    const { posttest } = this.state;
    optimizer.report(config.optimId, this.sequence, posttest);
  };

  render() {
    return this.state.spinning ? (
      <h1>Please Wait</h1>
    ) : (
      <React.Fragment>
        <ProgressBar progress={this.state.progress} />
        {this.cards[this.state.progress]}
      </React.Fragment>
    );
  }
}

const AR = withStyles(styles)(props => (
  <div className={props.classes.container}>
    <ActivityRunner {...props} />
  </div>
));

export default AR;
