const puppeteer = require('puppeteer');

const delay = millis => new Promise((resolve, reject) => {
    setTimeout(_ => resolve(), millis)
});

async function openChatPage(prompt, userName) {
    try {
        let message = null;
        let responseReceived = false;
        const browser = await puppeteer.launch({
            headless: false,
            defaultViewport: null,
        });

        console.log('Launched browser');

        const page = await browser.newPage();

        console.log('Created new page');

        page.on('response', async (response) => {
            const url = response.url();

            if (url.includes('https://pi.ai/api/chat')) {

                const body = await response.text();

                console.log('Received response from chat API');

                const events = body.split('\n\n');

                for (const event of events) {
                    if (event?.includes('partial')) {
                        const messageData = JSON.parse(event.split('data: ')[1].trim());
                        message = messageData?.text;
                        responseReceived = true;
                    }
                }
            }
        });

        await page.goto('https://pi.ai/chat');

        console.log('Navigated to chat page');

        // ============> USER WILL BE REDIRECTED TO "https://pi.ai/onboarding" <============

        // Wait for the navigation and redirection
        await page.waitForNavigation({ waitUntil: 'networkidle2' });

        await page.waitForSelector('button', { visible: true });

        console.log('Navigated to onboarding page');

        // Click on "Next" buttons
        const clickNextButtons = async () => {
            let nextButtonExists = true;

            while (nextButtonExists) {
                await page.waitForSelector('button');

                console.log('Found next button');

                // Find and click the "Next" button
                nextButtonExists = await page.evaluate(() => {
                    const button = Array.from(document.querySelectorAll('button')).find(
                        btn => btn.innerText.trim() === 'Next'
                    );
                    if (button) {
                        button.click();
                        return true;
                    }
                    return false;
                });
            }
        };

        await clickNextButtons();

        console.log('Clicked all next buttons');

        await page.waitForSelector('textarea');

        console.log('Found username input');

        // Type the UserName
        await page.type('textarea', userName);

        console.log('Typed username');

        await page.waitForSelector('button[aria-label="Submit text"]');

        console.log('Found submit button');

        // Submit the form by clicking the UP ARROW
        await page.click('button[aria-label="Submit text"]');

        console.log('Submitted form');

        await page.waitForSelector("::-p-xpath(//button[contains(., 'do it later')])");

        console.log('Found "do it later" button');

        // Click "I'll do it later" button
        await page.click("::-p-xpath(//button[contains(., 'do it later')])");

        console.log('Clicked "do it later" button');

        await page.waitForSelector("::-p-xpath(//button[contains(., 'got my own topic')])");

        console.log('Found "got my own topic" button');

        // Click "I got my own topic" button
        await page.click("::-p-xpath(//button[contains(., 'got my own topic')])");

        console.log('Clicked "got my own topic" button');


        // ============> USER WILL BE REDIRECTED TO "https://pi.ai/talk" <============

        // Wait for the navigation and redirection
        await page.waitForNavigation({ waitUntil: 'networkidle0' });

        console.log('Navigated to talk page');

        await page.waitForSelector('textarea[placeholder="Talk with Pi"]');

        console.log('Found prompt input');

        // Type the prompt
        await page.type('textarea[placeholder="Talk with Pi"]', prompt);

        console.log('Typed prompt');

        await delay(3000);

        // console.log('Waited for 3 seconds');

        await page.waitForSelector('button[aria-label="Submit text"].bg-primary-600', { visible: true });

        console.log('Found submit button');

        // Submit the prompt
        await page.click('button[aria-label="Submit text"].bg-primary-600');

        console.log('Submitted prompt');

        // Wait for the response
        while (!responseReceived) {
            await delay(100);
        }

        console.log('Received response');

        await browser.close();

        console.log('Closed browser');

        return message;

    } catch (error) {
        console.log(error);
    }
}


const captureCookie = async () => {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
    });

    const page = await browser.newPage();

    // Navigate to the page
    await page.goto('https://pi.ai/chat');

    // Wait for the navigation and redirection
    await page.waitForNavigation({ waitUntil: 'networkidle0' });

    const cookies = await page.cookies('https://pi.ai');

    // Sort cookies based on the expires field
    const sortedCookies = cookies.filter(cookie => cookie.expires).sort((a, b) => a.expires - b.expires);

    // Construct a cookie string with ';' separated values
    const cookieString = sortedCookies.map(cookie => `${cookie.name}=${cookie.value}`).join('; ');

    console.log('Final Cookie:', cookieString);
};


module.exports = {
    openChatPage,
    captureCookie,
};