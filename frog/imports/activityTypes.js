// @flow
import { type ActivityPackageT, flattenOne } from 'frog-utils';
import { keyBy } from 'lodash';

codegen`
import fs from 'fs-extra';
const camelCased = s => s.replace(/-([a-z])/g, g => g[1].toUpperCase());

const pkgjs = fs.readFileSync('../package.json');
const pkg = JSON.parse(pkgjs);
const activities = Object.keys(pkg.dependencies).filter(x =>
  x.startsWith('ac-')
);

const imports = activities
  .map(x => \`import \${camelCased(x)} from '\${x}';\`)
  .join('\\n');
const list = activities.map(x => camelCased(x)).join(',');
const atypes =  "const atypes = flattenOne(["+list+"]).map(x => Object.freeze(x));"
module.exports = imports+"\\n"+atypes
`;

// see explanation of 'any' in operatorTypes.js
export const activityTypes: ActivityPackageT[] = atypes;
export const activityTypesObj: { [actId: string]: ActivityPackageT } = (keyBy(
  activityTypes,
  'id'
): any);
