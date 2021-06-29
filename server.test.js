/********require('jest')*******/
const puppeteer = require('puppeteer')


// end-to-end testing
test ('should fail to access home page after logging out', async (done) =>{
    jest.setTimeout(20000);
    const browser =  await puppeteer.launch({
        headless: false,
        slowMo: 20, //increase it to slow down
        args: ['--window-size=1920,1080']
    });
    const page = await browser.newPage();
    await page.goto('http://localhost:3000/login');
    await page.click('input#email');
    await page.type('input#email','yourgmail');
    await page.click('input#password');
    await page.type('input#password','88887777');
    await page.click('button#signin');
    await page.goto('http://localhost:3000/');
    await page.click('button#logout');
    await page.goto('http://localhost:3000/');
    done();
});

test ('should be able to access home page after successful login', async (done) =>{
    jest.setTimeout(20000);
    const browser =  await puppeteer.launch({
        headless: false,
        slowMo: 20, //increase it to slow down
        args: ['--window-size=1920,1080']
    });
    const page = await browser.newPage();
    await page.goto('http://localhost:3000/login');
    await page.click('input#email');
    await page.type('input#email','yourgmail');
    await page.click('input#password');
    await page.type('input#password','88887777');
    await page.click('button#signin');
    await page.goto('http://localhost:3000/');
    done();
});