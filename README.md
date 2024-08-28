# Topology Browser

## Getting Started
### Download and link necessary dependencies
```
sh bootstrap.sh
```

### Run application
```
cd TopologyBrowser-ui
npm start
```

### Lint (check style)
```
cd TopologyBrowser-ui
npm run lint

cd networkobjectlib
npm run lint
```

### Fix fixable lint errors
```
cd TopologyBrowser-ui
npm run lint-fix

cd networkobjectlib
npm run lint-fix
```


## Extra Info
### Install pre-commit hook to lint files before commit
```
cd TopologyBrowser/.git/hooks
wget pre-commit
```

### Now every time you run "git commit" your files will be linted and won't be committed in case of errors. To ignore linting and commit anyway run:
```
git commit --no-verify
```


### Shortcuts
```
npm start // runs application with our proxy server
npm test // runs build with proxy and external phantomjs
npm run lint // runs eslint for code style checks
npm run lint-fix or npm run lint -- --fix // fix automatically some 'fixable' code styles
npm run docs // generates yui documentation
```


### YUI Documentation
### To view UI documents locally
```
npm run docs
cd target/site/latest/api/
cdt2 serve
```