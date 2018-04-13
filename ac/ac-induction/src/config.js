// @flow

export default {
  type: 'object',
  properties: {
    categories: {
      title: 'List of categories',
      type: 'array',
      items: { type: 'string' }
    },
    properties: {
      title: 'List of properties',
      type: 'array',
      items: { type: 'string' }
    },
    examples: {
      title: 'New example',
      type: 'array',
      items: {
        type: 'object',
        properties: {
          url: {
            title: 'Image URL',
            type: 'string'
          },
          category: {
            title: "Category",
            type: 'string'
          },
          properties: {
            title: "Indices of true properties",
            type: 'string'
          }
        }
      }
    }
  }
};
