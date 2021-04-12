/********require('jest')*******/
const puppeteer = require('puppeteer')

/*
test ('should fail to login with invalid/unregistered email', async (done) =>{
    jest.setTimeout(20000);
    const browser =  await puppeteer.launch({
        headless: false,
        slowMo: 20, //increase it to slow down
        args: ['--window-size=1920,1080']
    });
    const page = await browser.newPage();
    await page.goto('http://localhost:3000/login');
    await page.click('input#email');
    await page.type('input#email','shiv6522@gmail.com');
    await page.click('input#password');
    await page.type('input#password','88767777');
    await page.click('button#signin');
    done();
});

test ('should fail to login with wrong password', async (done) =>{
    jest.setTimeout(20000);
    const browser =  await puppeteer.launch({
        headless: false,
        slowMo: 20, //increase it to slow down
        args: ['--window-size=1920,1080']
    });
    const page = await browser.newPage();
    await page.goto('http://localhost:3000/login');
    await page.click('input#email');
    await page.type('input#email','shivam6522@gmail.com');
    await page.click('input#password');
    await page.type('input#password','88767777');
    await page.click('button#signin');
    done();
});
*/

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
    await page.type('input#email','shivam6522@gmail.com');
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
    await page.type('input#email','shivam6522@gmail.com');
    await page.click('input#password');
    await page.type('input#password','88887777');
    await page.click('button#signin');
    await page.goto('http://localhost:3000/');
    done();
});

/*
test ('should login and change password successfully', async (done) =>{
    jest.setTimeout(20000);
    const browser =  await puppeteer.launch({
        headless: false,
        slowMo: 20, //increase it to slow down
        args: ['--window-size=1920,1080']
    });
    const page = await browser.newPage();
    // to login first
    await page.goto('http://localhost:3000/login');
    await page.click('input#email');
    await page.type('input#email','shivam6522@gmail.com');
    await page.click('input#password');
    await page.type('input#password','88887777');
    await page.click('button#signin');
    await page.goto('http://localhost:3000/');

    // to change password
    await page.click('button#changePassword');
    await page.goto('http://localhost:3000/change_password');
    await page.click('input#email');
    await page.type('input#email', 'shivam6522@gmail.com');
    await page.click('input#password');
    await page.type('input#password','88887777');
    await page.click('input#new_password');
    await page.type('input#new_password', '77776666');
    await page.click('input#confirm_password');
    await page.type('input#confirm_password', '77776666');
    await page.click('button#submit');
    done();
});
*/