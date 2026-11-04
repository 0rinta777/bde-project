// TestCafe configuration.
const path = require('path');
const os = require('os');

// On Windows, TestCafe's built-in Chrome launcher can't connect to Chrome 156,
// so we start Chrome directly from its install path instead.
// On Linux (GitHub Actions) the normal "chrome:headless" launcher is used.
const windowsChrome = {
  path: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  cmd: `--headless=new --disable-gpu --user-data-dir=${path.join(os.tmpdir(), 'testcafe-chrome-profile').split(path.sep).join('/')}`,
};

module.exports = {
  // --no-sandbox and --disable-dev-shm-usage are needed for Chrome on GitHub's Linux machines
  browsers: process.platform === 'win32' ? windowsChrome : 'chrome:headless --no-sandbox --disable-dev-shm-usage',
  src: 'tests/e2e',
  hostname: 'localhost',
  appCommand: 'npx vite preview --port 4173 --strictPort',
  appInitDelay: 4000,

  // TestCafe comes with an old TypeScript (4.9) that can't read the newest Node type files,
  // so we tell it to use the project's own TypeScript instead.
  compilerOptions: {
    typescript: {
      customCompilerModulePath: path.resolve(__dirname, 'node_modules/typescript'),
      options: {
        skipLibCheck: true,
        ignoreDeprecations: '6.0',
      },
    },
  },
};
