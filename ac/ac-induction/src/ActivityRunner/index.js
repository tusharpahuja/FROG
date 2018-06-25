// @flow

import * as React from 'react';
import { withStyles } from '@material-ui/core/styles';

import Example from './Example';
import Test from './Test';
import SelfExplanation from './SelfExplanation';

const styles = () => ({
  container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column'
  },
  optimState: {
    position: 'fixed',
    top: '50px',
    left: '10px'
  }
});

type StateT = {
  progress: number,
  example: ?Object,
  context: {
    pretest: number[]
  },
  type: string,
  item: string,
  spinning: boolean,
  subActivity: string
};

const Prompt = ({ classes, subActivity, start }) => (
  <div className={classes.container}>
    <p>
      {
        {
          pretest: 'We will first test your knowledge on the topic',
          learning: 'Time to learn! Ready for the challenge?',
          posttest: "Let's test your knowledge again"
        }[subActivity]
      }
    </p>
    <button onClick={start}>
      {
        {
          pretest: 'Start test',
          learning: 'Start learning',
          posttest: 'Start test'
        }[subActivity]
      }
    </button>
  </div>
);

class ActivityRunner extends React.Component<any, StateT> {
  tests: Object[];
  examples: Object[];
  optimId: string;

  state = {
    progress: -1,
    example: null,
    context: {
      pretest: []
    },
    item: '',
    type: '',
    spinning: false,
    subActivity: 'pretest'
  };

  constructor(props) {
    super(props);
    const { examples, tests, optimId } = props.activityData.config;
    this.tests = tests;
    this.examples = examples;
    this.optimId = optimId;
    this.state.context = {
      pretest: tests.map(_ => 0)
    };
  }

  getContext() {
    const { pretest } = this.state.context;
    return [...pretest];
  }

  nextLearningActivity = () => {
    const { optimizer } = this.props;
    this.setState({ spinning: true });
    this.setState({ progress: this.state.progress + 1 });
    const context = this.getContext();
    optimizer.recommend(this.optimId, context, (err, res) => {
      if (err) {
        console.error(err);
      } else if (res) {
        const reco = res.data.msg;
        const idx = parseInt(reco, 10);
        const newExample = this.examples[idx];
        const newContext = { ...this.state.context };
        newContext.examples[idx] += 1;
        this.setState({ context: newContext });
        this.setState({ example: newExample });
        this.setState({ type: 'example' });
        this.setState({ item: reco });
        this.setState({ spinning: false });
      }
    });
  };

  nextTest = () => {
    const progress = this.state.progress + 1;
    if (progress < this.tests.length) {
      const example = this.tests[progress];
      this.setState({ example, progress });
    } else {
      this.setState({ example: null, subActivity: 'learning' });
    }
  };

  reportScore = score => {
    const { optimizer } = this.props;
    const { item, context } = this.state;
    const newContext = { ...context };
    newContext.tests[this.state.progress % this.tests.length] =
      score > 0 ? 1 : -1;
    newContext.latest = this.tests.map(_ => 0);
    newContext.latest[this.state.progress % this.tests.length] =
      score > 0 ? 1 : -1;
    this.setState({ context: newContext });
    if (this.state.subActivity == 'posttest') {
      optimizer.report(this.optimId, this.getContext(), item, score);
    }
  };

  handlePretestResult = score => {
    const { progress, context } = this.state;
    context.pretest[progress] = score > 0 ? 1 : -1;
    this.setState({ context });
  };

  render() {
    const { activityData, classes } = this.props;
    const { categories } = activityData.config;
    const { example, spinning, type, progress, subActivity } = this.state;

    if (!example) {
      return (
        <div className={classes.container}>
          <SelfExplanation next={this.nextTest} />
        </div>
      );
    }

    if (!example) {
      return (
        <Prompt
          classes={classes}
          subActivity={subActivity}
          start={this.nextTest}
        />
      );
    }

    if (spinning) {
      return (
        <div className={classes.container}>
          <h1>PLEASE WAIT</h1>
        </div>
      );
    }

    if (subActivity === 'pretest') {
      return (
        <div className={classes.container}>
          <Test
            config={activityData.config}
            example={example}
            next={this.nextTest}
            categories={categories}
            submitResult={this.handlePretestResult}
          />
        </div>
      );
    }

    if (progress >= this.tests.length) {
      return (
        <div className={classes.container}>
          <h1>Activity Completed !</h1>
          <button onClick={window.close}>Close tab</button>
        </div>
      );
    }

    const Comp = type === 'example' ? Example : Test;
    const next = type === 'example' ? this.nextTest : this.nextLearningActivity;

    return (
      <div className={classes.container}>
        <Comp
          config={activityData.config}
          example={example}
          next={next}
          categories={categories}
          optimizer={this.props.optimizer}
          reportScore={this.reportScore}
        />
      </div>
    );
  }
}

const AR = withStyles(styles)(ActivityRunner);

export default AR;
