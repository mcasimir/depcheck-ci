# Depcheck CI

Depcheck util that plays nice with ci

## NOTE for v1.1.0+:

Since version `v1.1.0` we only support node >= 8.

## Differences with depcheck

- Also checks for non strict dependencies (configurable)
- Does not check for missing dependencies
- Actually fails on errors (reliable for ci)
- Configurable through `.depcheckrc` or `package.json` section

## Install

``` bash
npm i --save-dev --save-exact depcheck-ci
```

Add npm script in `package.json`:

``` json
scripts: {
  "depcheck": "depcheck-ci"
}
```

### Usage

```
npm run depcheck
```

### Configuration

Either add a `.depcheckrc` file on root of project or a `depcheck` section in `package.json`

Default settings are:

```
{
  "ignore": [],
  "ignoreDirs": [
    "node_modules",
    "bower_components"
  ],
  "strict": true,
  "unused": true
}
```
