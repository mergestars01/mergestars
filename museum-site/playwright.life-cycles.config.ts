import {defineConfig, devices} from '@playwright/test';

// Offline fixtures must never intercept a hosted user's genuine CORE session.
export default defineConfig({
  testDir:'./tests/browser', testMatch:'life-cycles.spec.ts',
  outputDir:'./test-results/life-cycles', workers:1, retries:0,
  forbidOnly:!!process.env.CI, timeout:60_000,
  expect:{timeout:15_000},
  reporter:[['list'],['html',{outputFolder:'playwright-life-cycles-report',open:'never'}]],
  use:{baseURL:'http://127.0.0.1:4173', locale:'en-US', colorScheme:'dark',
    contextOptions:{reducedMotion:'reduce'}, serviceWorkers:'block', trace:'retain-on-failure', screenshot:'only-on-failure'},
  projects:[
    {name:'desktop',use:{...devices['Desktop Chrome'],viewport:{width:1440,height:960}}},
    {name:'mobile',use:{...devices['Pixel 7'],viewport:{width:390,height:844},deviceScaleFactor:1}},
  ],
  webServer:{command:'pnpm exec vinext dev --port 4173',url:'http://127.0.0.1:4173/life-cycles',
    reuseExistingServer:!process.env.CI,timeout:120_000},
});
