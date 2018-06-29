// @flow
import type { socialOperatorT } from 'frog-utils';

const meta = {
  name: 'Argue',
  shortDesc: 'Group students to argue',
  description: 'Group students with as many similar answers as possible.'
};

const config = {};

export default ({
  id: 'op-argue',
  type: 'social',
  config,
  meta,
  outputDefinition: ['group']
}: socialOperatorT);
