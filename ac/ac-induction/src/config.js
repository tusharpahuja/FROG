// @flow

export const config = {
  type: 'object',
  properties: {
    optimId: {
      title: 'Optimization Id',
      type: 'string'
    },
    categories: {
      title: 'List of categories',
      type: 'array',
      items: { type: 'string' }
    },
    introduction: {
      title: 'Introduction',
      type: 'string'
    },
    prompts: {
      title: 'Prompts for each category',
      type: 'array',
      items: { type: 'string' }
    },
    question: {
      title: 'Question for tests',
      type: 'string'
    },
    answers: {
      title: 'Answers to the question',
      type: 'array',
      items: { type: 'string' }
    },
    explanationPrompt: {
      title: 'Prompt for self-explanation card',
      type: 'string'
    },
    definition: {
      title: 'Definition',
      type: 'string'
    },
    examples: {
      title: 'Examples',
      type: 'array',
      items: {
        type: 'object',
        properties: {
          url: {
            title: 'url',
            type: 'string'
          },
          category: {
            title: 'category',
            type: 'string'
          },
          hint: {
            title: 'hint',
            type: 'string'
          }
        }
      }
    },
    testsWithFeedback: {
      title: 'TestWithFeedback',
      type: 'array',
      items: {
        type: 'object',
        properties: {
          url: {
            title: 'url',
            type: 'string'
          },
          category: {
            title: 'category',
            type: 'string'
          }
        }
      }
    },
    tests: {
      title: 'Tests',
      type: 'array',
      items: {
        type: 'object',
        properties: {
          url: {
            title: 'url',
            type: 'string'
          },
          category: {
            title: 'category',
            type: 'string'
          }
        }
      }
    }
  }
};

export const configUI = {
  introduction: {
    'ui:widget': 'textarea'
  },
  definition: {
    'ui:widget': 'textarea'
  }
};
