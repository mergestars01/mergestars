import {defineConfig, devices} from '@playwright/test';

const baseURL=process.env.QA_BASE_URL??'http://127.0.0.1:4173';
if(!['127.0.0.1','localhost','terminal.local'].includes(new URL(baseURL).hostname))
  throw new Error('Fixture tests are local-only. Hosted staging requires a genuine authorized owner session.');

export default defineConfig({
  testDir:'./tests/browser',outputDir:'./test-results',fullyParallel:false,
  workers:1,forbidOnly:!!process.env.CI,retries:0,timeout:60_000,
  expect:{timeout:15_000,toHaveScreenshot:{animations:'disabled',maxDiffPixelRatio:.001}},
  updateSnapshots:'none',
  snapshotPathTemplate:'{testDir}/__screenshots__/{projectName}/{arg}{ext}',
  reporter:[['list'],['html',{open:'never'}],['json',{outputFile:'test-results/browser-results.json'}]],
  use:{baseURL,locale:'en-US',timezoneId:'UTC',colorScheme:'dark',
    contextOptions:{reducedMotion:'reduce'},serviceWorkers:'block',
    trace:'retain-on-failure',screenshot:'only-on-failure',
    launchOptions:{args:['--disable-dev-shm-usage','--use-angle=swiftshader','--enable-unsafe-swiftshader']}},
  projects:[
    {name:'desktop-chromium',use:{...devices['Desktop Chrome'],viewport:{width:1440,height:960}}},
    {name:'mobile-chromium',use:{...devices['Pixel 7'],viewport:{width:390,height:844},deviceScaleFactor:1}},
  ],
});
