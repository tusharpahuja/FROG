// @flow

import * as React from 'react';
import { withStyles } from '@material-ui/core/styles';

import Example from './Example';
import Test from './Test';
import SelfExplanation from './SelfExplanation';
import Definition from './Definition';

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
  context: {
    pretest: number[]
  },
  type: string,
  item: string,
  spinning: boolean,
  subActivity: string
};

const Prompt = ({ subActivity, next }) => (
  <React.Fragment>
    <p>
      {
        {
          pretest: 'We will first test your knowledge on the topic',
          learning: 'Time to learn! Ready for the challenge?',
          posttest: "Let's test your knowledge again"
        }[subActivity]
      }
    </p>
    <button onClick={next}>
      {
        {
          pretest: 'Start test',
          learning: 'Start learning',
          posttest: 'Start test'
        }[subActivity]
      }
    </button>
  </React.Fragment>
);

const End = ({ score }) => (
  <React.Fragment>
    <h1>Activity Completed !</h1>
    <p>You scored {score} on the final test</p>
    <button onClick={window.close}>Close tab</button>
  </React.Fragment>
);

class ActivityRunner extends React.Component<any, StateT> {
  tests: Object[];
  examples: Object[];
  optimId: string;
  cards: Object[];
  next = Function;

  state = {
    progress: 0,
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
    const { tests } = props.activityData.config;

    this.state.context = {
      pretest: tests.map(_ => 0)
    };

    this.cards = [];
    this.getPretest();
  }

  getPretest() {
    const { config } = this.props.activityData;
    const { tests, categories } = config;
    this.cards.push(<Prompt subActivity="pretest" next={this.next} />);
    tests.forEach(test => {
      this.cards.push(
        <Test
          config={config}
          example={test}
          next={this.next}
          categories={categories}
          submitResult={this.handlePretestResult}
        />
      );
    });
  }

  getLearningActivities = () => {
    const { config } = this.props.activityData;
    const { examples, categories, definition } = config;
    this.cards.push(<Prompt subActivity="learning" next={this.next} />);
    examples.forEach(example => {
      this.cards.push(
        <Example
          config={config}
          example={example}
          next={this.next}
          categories={categories}
        />
      );
    });
    this.cards.push(<SelfExplanation next={this.next} config={config} />);
    this.cards.push(<Definition next={this.next} definition={definition} />);

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
    this.cards.push(<Prompt subActivity="posttest" next={this.next} />);

    tests.forEach(test => {
      this.cards.push(
        <Test
          config={config}
          example={test}
          next={this.next}
          categories={categories}
          submitResult={this.handlePosttestResult}
        />
      );
    });
  }

  getEnd() {
    this.cards.push(<End score="50%" />);
  }

  next = () => {
    const progress = this.state.progress + 1;
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
    const { progress, context } = this.state;
    context.pretest[progress] = score > 0 ? 1 : -1;
    this.setState({ context });
  };

  handlePosttestResult = score => {
    console.log('handlePosttest', score);
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
    return this.cards[this.state.progress];
  }
}

const AR = withStyles(styles)(props => (
  <div className={props.classes.container}>
    <ActivityRunner {...props} />
  </div>
));

export default AR;
