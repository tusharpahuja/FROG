// @flow

export default {
  type: 'object',
  properties: {
    categories: {
      title: 'List of categories',
      type: 'array',
      items: { type: 'string' }
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
    examples: {
      title: 'Examplex',
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
