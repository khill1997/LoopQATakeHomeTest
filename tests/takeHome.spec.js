// const { test, expect } = require('@playwright/test');
// const testData = require('../test_data.json');

// /**
//  * Navigates to a specific section on the Projects page.
//  * @param {Page} page The Playwright page object.
//  * @param {string} navigationTarget The name of the section to navigate to (e.g., "Web Application").
//  */
// async function navigateToSection(page, navigationTarget) {
//   await page.locator(`h2:text-is("${navigationTarget}")`).click();
// }

// /**
//  * Verifies the tags associated with a ticket.
//  * This function locates the spans (likely tags, name, and date), checks if the number of spans is correct,
//  * and then iterates through the tags from the JSON, checking if each tag is present in the ticket.
//  * @param {Locator} ticketLocator The Playwright locator for the ticket element.
//  * @param {Array<string>} tags An array of tag names to verify (from the JSON data).
//  */
// async function verifyTags(ticketLocator, tags) {
//   const spansinfocusedTicket = ticketLocator.locator('span');
//   const spancount = await spansinfocusedTicket.count();
//   expect(spancount).toEqual(tags.length + 2, { message: "Incorrect number of spans found in the ticket." });

//   for (const tag of tags) {
//     let tagFound = false; // Flag to track if the current tag was found.
//     for (let k = 0; k < spancount; k++) { // Iterate through all spans.
//       const spanText = await spansinfocusedTicket.nth(k).textContent();
//       if (spanText.includes(tag)) {
//         console.log(`Found tag "${tag}" in span text: "${spanText}"`);
//         tagFound = true;
//         break;
//       }
//     }
//     if (!tagFound) {
//       expect(tagFound).toBeTruthy({ message: `Tag "${tag}" not found in the ticket.` }); // Assert that the tag was found.
//     }
//   }
// }

// /**
//  * Verifies the existence of a column based on its title.
//  * This function finds all columns, iterates through them, and checks if the current column's title
//  * matches the column name from the JSON data.
//  * @param {Page} page The Playwright page object.
//  * @param {Object} data The test data object from the JSON file (contains the column name).
//  * @returns {Locator|null} The Playwright locator for the column if found, otherwise null.
//  */
// async function verifyColumn(page, data) {
//   const parentLocator = page.locator(`div.flex.flex-col.w-80.bg-gray-50.rounded-lg.p-4`);
//   const count = await parentLocator.count();

//   for (let i = 0; i < count; i++) {
//     const childLocator = parentLocator.nth(i);
//     const h2Locator = childLocator.locator('h2.font-semibold.text-gray-700.mb-4.px-2');
//     const h2elementText = await h2Locator.textContent();

//     if (h2elementText.includes(`${data.column}`)) {
//       expect(true);
//       return childLocator; // Return the column locator if found.
//     } else if (i === count - 1 && !h2elementText.includes(`${data.column}`)) {
//       expect(true).toBeFalsy({ message: `Column "${data.column}" not found.` });
//       return null; // Return null if no column is found.
//     }
//   }
//   return null; // Return null if no column is found.
// }

// /**
//  * Verifies the existence of a task within a column and returns the task's ticket locator.
//  * This function uses the column locator to find all tickets within the column, iterates through them,
//  * and checks if the current ticket's title matches the task name from the JSON data.
//  * @param {Locator} columnLocator The Playwright locator for the column element.
//  * @param {Object} data The test data object from the JSON file (contains the task name).
//  * @returns {Locator|null} The Playwright locator for the ticket if found, otherwise null.
//  */
// async function verifyTask(columnLocator, data) {
//   if (!columnLocator) {
//     return null; // Return null if column is not found.
//   }

//   const ticketLocator = columnLocator.locator('div.bg-white.p-4.rounded-lg.shadow-sm.border.border-gray-200.hover\\:shadow-md.transition-shadow');
//   const ticketCount = await ticketLocator.count();

//   const h3Locator = ticketLocator.locator('h3.font-medium.text-gray-900.mb-2');
//   for (let j = 0; j < ticketCount; j++) {
//     const title = h3Locator.nth(j);
//     const titleText = await title.textContent();
//     if (titleText.includes(`${data.task}`)) {
//       expect(true);
//       return ticketLocator.nth(j); // Return the ticket locator if found.
//     } else if (j === ticketCount - 1 && !titleText.includes(`${data.task}`)) {
//       expect(true).toBeFalsy({ message: `Task "${data.task}" not found.` });
//       return null; // Return null if task is not found.
//     }
//   }
//   return null; // Return null if task is not found.
// }

// /**
//  * This test suite verifies tasks and their associated tags on the Asana-like web application.
//  * It uses data from a JSON file to define the test cases.
//  */
// test.describe('Task Board Verification Checks', () => {
//   /**
//    * This hook runs before each test in the suite. It navigates to the application,
//    * logs in with the provided credentials, and verifies that the Projects page is visible.
//    */
//   test.beforeEach(async ({ page }) => {
//     await page.goto('https://animated-gingersnap-8cf7f2.netlify.app/');
//     await expect(page).toHaveURL('https://animated-gingersnap-8cf7f2.netlify.app/'); 

//     await page.locator('id=username').fill('admin');
//     await page.locator('id=password').fill('password123');
//     await page.locator('button[type="submit"]').click();

//     //this will ensure the login page is passed without doing any crazy logic about login cookies
//     await expect(page.locator('#username')).not.toBeVisible();
//     await expect(page.locator('#password')).not.toBeVisible();
//     await expect(page.locator('button[type="submit"]')).not.toBeVisible();
//     await expect(page.locator('div.flex.items-center.gap-2 >> h1:text("Projects")')).toBeVisible();
//   });

//   /**
//    * This loop iterates through the test data from the JSON file, creating a separate test case for each data entry.
//    * Each test case verifies a specific task within a column on the Projects page.
//    */
//   testData.forEach(async (data, index) => {
//     test(`Test Case ${index + 1}: Verify ${data.task} in the ${data.column} column on the ${data.navigationTarget} page`, async ({ page }) => {
//       await navigateToSection(page, data.navigationTarget);
//       const columnLocator = await verifyColumn(page, data);
//       if (columnLocator) { // Check if the column was found.
//         const taskLocator = await verifyTask(columnLocator, data);
//         if (taskLocator) { // Check if the task was found.
//           await verifyTags(taskLocator, data.tags);
//         }
//       }
//     });
//   });
// });

const { test, expect } = require('@playwright/test');
const testData = require('../test_data.json');

/**
 * Navigates to a specific section on the Projects page.
 * @param {Page} page The Playwright page object.
 * @param {string} navigationTarget The name of the section to navigate to (e.g., "Web Application").
 */
async function navigateToSection(page, navigationTarget) {
  await page.locator(`h2:text-is("${navigationTarget}")`).click();
}

/**
 * Verifies the existence of a column based on its title.
 * This function finds all columns, iterates through them, and checks if the current column's title
 * matches the column name from the JSON data.
 * @param {Page} page The Playwright page object.
 * @param {Object} data The test data object from the JSON file (contains the column name).
 * @returns {Locator|null} The Playwright locator for the column if found, otherwise null.
 */
async function verifyColumn(page, data) {
  const parentLocator = page.locator(`div.flex.flex-col.w-80.bg-gray-50.rounded-lg.p-4`);
  const count = await parentLocator.count();

  for (let i = 0; i < count; i++) {
    const childLocator = parentLocator.nth(i);
    const h2Locator = childLocator.locator('h2.font-semibold.text-gray-700.mb-4.px-2');
    const h2elementText = await h2Locator.textContent();

    if (h2elementText.includes(`${data.column}`)) {
      expect(true);
      return childLocator; // Return the column locator if found.
    } else if (i === count - 1 && !h2elementText.includes(`${data.column}`)) {
      expect(true).toBeFalsy({ message: `Column "${data.column}" not found.` });
      return null; // Return null if no column is found.
    }
  }
  return null; // Return null if no column is found.
}

/**
 * Verifies the existence of a task within a column and returns the task's ticket locator.
 * This function uses the column locator to find all tickets within the column, iterates through them,
 * and checks if the current ticket's title matches the task name from the JSON data.
 * @param {Locator} columnLocator The Playwright locator for the column element.
 * @param {Object} data The test data object from the JSON file (contains the task name).
 * @returns {Locator|null} The Playwright locator for the ticket if found, otherwise null.
 */
async function verifyTask(columnLocator, data) {
  if (!columnLocator) {
    return null; // Return null if column is not found.
  }

  const ticketLocator = columnLocator.locator('div.bg-white.p-4.rounded-lg.shadow-sm.border.border-gray-200.hover\\:shadow-md.transition-shadow');
  const ticketCount = await ticketLocator.count();

  const h3Locator = ticketLocator.locator('h3.font-medium.text-gray-900.mb-2');
  for (let j = 0; j < ticketCount; j++) {
    const title = h3Locator.nth(j);
    const titleText = await title.textContent();
    if (titleText.includes(`${data.task}`)) {
      expect(true);
      return ticketLocator.nth(j); // Return the ticket locator if found.
    } else if (j === ticketCount - 1 && !titleText.includes(`${data.task}`)) {
      expect(true).toBeFalsy({ message: `Task "${data.task}" not found.` });
      return null; // Return null if task is not found.
    }
  }
  return null; // Return null if task is not found.
}

/**
 * Verifies the tags associated with a ticket.
 * This function locates the spans (likely tags, name, and date), checks if the number of spans is correct,
 * and then iterates through the tags from the JSON, checking if each tag is present in the ticket.
 * @param {Locator} ticketLocator The Playwright locator for the ticket element.
 * @param {Array<string>} tags An array of tag names to verify (from the JSON data).
 */
async function verifyTags(ticketLocator, tags) {
  const spansinfocusedTicket = ticketLocator.locator('span');
  const spancount = await spansinfocusedTicket.count();
  expect(spancount).toEqual(tags.length + 2, { message: "Incorrect number of spans found in the ticket." });

  for (const tag of tags) {
    let tagFound = false; // Flag to track if the current tag was found.
    for (let k = 0; k < spancount; k++) { // Iterate through all spans.
      const spanText = await spansinfocusedTicket.nth(k).textContent();
      if (spanText.includes(tag)) {
        console.log(`Found tag "${tag}" in span text: "${spanText}"`);
        tagFound = true;
        break;
      }
    }
    if (!tagFound) {
      expect(tagFound).toBeTruthy({ message: `Tag "${tag}" not found in the ticket.` }); // Assert that the tag was found.
    }
  }
}


/**
 * This test suite verifies tasks and their associated tags on the Asana-like web application.
 * It uses data from a JSON file to define the test cases.
 */
test.describe('Task Board Verification Checks', () => {
  /**
   * This hook runs before each test in the suite. It navigates to the application,
   * logs in with the provided credentials, and verifies that the Projects page is visible.
   */
  test.beforeEach(async ({ page }) => {
    await page.goto('https://animated-gingersnap-8cf7f2.netlify.app/');
    await expect(page).toHaveURL('https://animated-gingersnap-8cf7f2.netlify.app/'); 

    await page.locator('id=username').fill('admin');
    await page.locator('id=password').fill('password123');
    await page.locator('button[type="submit"]').click();

    //this will ensure the login page is passed without doing any crazy logic about login cookies
    await expect(page.locator('#username')).not.toBeVisible();
    await expect(page.locator('#password')).not.toBeVisible();
    await expect(page.locator('button[type="submit"]')).not.toBeVisible();
    await expect(page.locator('div.flex.items-center.gap-2 >> h1:text("Projects")')).toBeVisible();
  });

  /**
   * This loop iterates through the test data from the JSON file, creating a separate test case for each data entry.
   * Each test case verifies a specific task within a column on the Projects page.
   */
  testData.forEach(async (data, index) => {
    test(`Test Case ${index + 1}: Verify "${data.task}" in the "${data.column}" column on the "${data.navigationTarget}" page`, async ({ page }) => {
      await navigateToSection(page, data.navigationTarget); // 1. Navigate to section
      const columnLocator = await verifyColumn(page, data); // 2. Verify column
      if (columnLocator) { // 3. Check if column is found
        const taskLocator = await verifyTask(columnLocator, data); // 4. Verify task
        if (taskLocator) { // 5. Check if task is found
          await verifyTags(taskLocator, data.tags); // 6. Verify tags
        }
      }
    });
  });
});