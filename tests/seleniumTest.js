// Import the required modules from Selenium WebDriver
const { Builder, By, Key, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

async function runTest() {
    // Set up the Chrome options
    let options = new chrome.Options();
    options.addArguments('--headless'); // Run Chrome in headless mode (without UI)
    options.addArguments('--disable-gpu'); // Necessary for Chrome in headless mode
    options.addArguments('--window-size=1280x800'); // Set window size if needed

    // Initialize the WebDriver and specify Chrome as the browser
    let driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(options) // Apply the Chrome options
        .build();

    try {
        // Navigate to Google's homepage
        await driver.get('https://www.google.com');

        // Find the search box by its name attribute and enter 'Selenium'
        await driver.findElement(By.name('q')).sendKeys('Selenium', Key.RETURN);

        // Wait for the page title to update to reflect the search query result
        await driver.wait(until.titleContains('Selenium'), 5000);

        // Get and log the page title to ensure the test ran successfully
        let title = await driver.getTitle();
        console.log('Test passed, page title is: ' + title);

        // Example assertion (check if the title contains 'Selenium')
        if (title.includes('Selenium')) {
            console.log('Title validation passed!');
        } else {
            console.log('Title validation failed.');
        }
    } finally {
        // Quit the WebDriver and close the browser
        await driver.quit();
    }
}

// Run the test
runTest();
