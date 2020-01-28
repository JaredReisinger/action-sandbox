const envCi = require("env-ci");
const getConfig = require("semantic-release/lib/get-config");
const getLogger = require("semantic-release/lib/get-logger");

main()
  // .then(() => {
  //   console.log('MAIN COMPLETE!');
  // })
  .catch(err => {
    console.error("MAIN ERROR!");
    console.error(err);
  });

async function main() {
  // console.log("TRYING COMMIT-ANALYZER?");

  const cwd = process.cwd();
  const env = process.env;

  const context = {
    cwd,
    env,
    stdout: process.stdout,
    stdin: process.stdin,
    envCi: envCi({ env, cwd })
  };
  context.logger = getLogger(context);

  const opts = {};

  // console.log("CONTEXT...");
  // console.dir({...context, env: '[REDACTED]'});

  context.logger.log("Loading semantic-release config...");
  const { plugins, options } = await getConfig(context, opts);
  context.logger.log("Loaded semantic-release config:");
  console.dir({ plugins, options });

  context.options = options;
  context.commits = [
    { hash: '123', message: 'feat: really?' },
    { hash: '234', message: 'xfix: yes really!\n\nDid some stuff\n\nxBREAKING CHANGE: really' },
  ]; // TODO, add commits from PR only

  context.logger.log("Analyzing commits...");
  const result = await plugins.analyzeCommits(context);
  context.logger.log("Analyzed commits:");
  console.dir(result);

  // result is falsy (no release), 'major', 'minor', or 'patch'.

  context.logger.log("MAIN COMPLETE!");
}
