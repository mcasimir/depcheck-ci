import {resolve} from 'path';
import depcheck from 'depcheck';

const IGNORE_DIRS_DEFAULT = [
  'node_modules',
  'bower_components'
];

const IGNORE_DEFAULT = [];

export default class Depcheck {
  constructor(targetPath, options = {}) {
    this.targetPath = targetPath;
    this.packageJson = require(resolve(this.targetPath, 'package.json'));
    this.options = Object.assign({
      strict: true,
      unused: true
    }, options);

    this.options.ignore = IGNORE_DEFAULT.concat(options.ignore || []);
    this.options.ignoreDirs = IGNORE_DIRS_DEFAULT.concat(options.ignoreDirs || []);
  }

  checkStrictDependencies() {
    let errors = [];

    let dependencies = Object.entries(this.packageJson.dependencies || {})
      .concat(Object.entries(this.packageJson.devDependencies || {}));

    for (let [name, version] of dependencies) {
      let isStrict = this.isStrict(version);

      if (!isStrict) {
        errors.push(name);
      }
    }

    return errors;
  }

  isStrict(version) {
    if (version.includes('#')) {
      version = version.split('#')[1].replace(/^v/, '');
    }

    if (!(version.match(/^pull\/\d+\/head$/) || version[0].match(/([0-9])/))) {
      return false;
    }

    return true;
  }

  async checkUnusedDependencies() {
    let {dependencies, devDependencies} = await depcheck(this.targetPath, {
      ignoreMatches: this.options.ignore,
      ignoreDirs: this.options.ignoreDirs
    });

    return [].concat(dependencies)
      .concat(devDependencies);
  }

  async run() {
    if (this.options.strict) {
      let nonStrictDeps = this.checkStrictDependencies();

      if (nonStrictDeps.length) {
        throw this._dependenciesError('You have non strict dependencies', nonStrictDeps);
      }
    }

    if (this.options.unused) {
      let unusedDeps = await this.checkUnusedDependencies();

      if (unusedDeps.length) {
        throw this._dependenciesError('You have unused dependencies', unusedDeps);
      }
    }
  }

  _dependenciesError(cause, deps) {
    return new Error(`${cause}:\n\n${deps.join(',\n')}`);
  }
}
