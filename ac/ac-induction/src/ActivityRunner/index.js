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

const PretestPrompt = ({ classes, skip, next, introduction }) => (
  <Card className={classes.prompt}>
    <CardContent>
      <Typography gutterBottom variant="subheading">
        {introduction}
      </Typography>
    </CardContent>
    <CardActions>
      <Button color="primary" onClick={next} className={classes.promptButton}>
        Yes, I know it already! Take the test.
      </Button>
    </CardActions>
    <CardActions>
      <Button color="primary" onClick={skip} className={classes.promptButton}>
        No, I don't know it. Skip the test
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
  optimId: string;
  cards: Object[];
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
      ...examples.map(example => (
        <Example
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

    shuffle(learningActivities)
      .slice(0, 5)
      .forEach(i => this.cards.push(i));

    // const { optimizer } = this.props;
    // this.setState({ spinning: true });
    // this.setState({ progress: this.state.progress + 1 });
    // const context = this.getContext();
    // optimizer.recommend(this.optimId, context, (err, res) => {
    //   if (err) {
    //     console.error(err);
    //   } else if (res) {
    //     const reco = res.data.msg;
    //     const idx = parseInt(reco, 10);
    //     const newExample = this.examples[idx];
    //     const newContext = { ...this.state.context };
    //     newContext.examples[idx] += 1;
    //     this.setState({ context: newContext });
    //     this.setState({ example: newExample });
    //     this.setState({ type: 'example' });
    //     this.setState({ item: reco });
    //     this.setState({ spinning: false });
    //   }
    // });
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

    this.cards.push(
      <SelfExplanation
        next={this.next}
        config={config}
        logger={this.props.logger}
      />
    );
  }

  getEnd() {
    const { posttest } = this.state;
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
    // const { optimizer } = this.props;
    // const { item, context } = this.state;
    // const newContext = { ...context };
    // newContext.tests[this.state.progress % this.tests.length] =
    //   score > 0 ? 1 : -1;
    // newContext.latest = this.tests.map(_ => 0);
    // newContext.latest[this.state.progress % this.tests.length] =
    //   score > 0 ? 1 : -1;
    // this.setState({ context: newContext });
    // if (this.state.subActivity == 'posttest') {
    //   optimizer.report(this.optimId, this.getContext(), item, score);
    // }
  };

  render() {
    return (
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
