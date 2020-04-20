const puppeteer = require('puppeteer');
const fetch = require('node-fetch');
const readline = require('readline-sync');
const CronJob = require('cron').CronJob;

async function run() {
    const sgbcode = await readline.question('SGB CODE : ')
    const browser = await puppeteer.launch({
        headless: false,
        executablePath: 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
        defaultViewport: null
    });
    const page = await browser.newPage();
    const cookie = await fetch('https://netflix.raditya.website', { method: 'POST', headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: `code=${sgbcode}` }).then(res => { return res.json(); })
    if (cookie.status == 'ok') {
        await page.setCookie.apply(page, cookie.data);
        await page.waitFor(1000);
        await page.goto('https://www.netflix.com/browse');
        const cron = new CronJob('5 * * * *', async function () {
            await fetch('https://netflix.raditya.website', { method: 'POST', headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: `update&instance=${cookie.instance}&code=${sgbcode}` }).then(res => { return res.json(); })
        })
        cron.start();
    } else {
        console.log('SGB CODE INVALID / Server Penuh Ndan')
    }
}

run()