import test from '../utils/fixtures';
import { expect } from 'playwright/test';
import { ApiClient } from '../api/api-client';
import testData from './test-data'

let apiClient:ApiClient;
const baseAPIURL = 'https://api.club-administration.qa.qubika.com/'
const baseURL = "https://club-administration.qa.qubika.com/#/auth/login"

test.describe('Qbika: Technical Challenge', async () =>{
    test.beforeEach(async ({page}) => {
        apiClient = new ApiClient(baseAPIURL);
        await apiClient.initialize();
        await page.goto(baseURL);
    });
    
    test.skip('User should be able to login with a newly created user and do administrative tasks in the website: Creating Parent and Child Categories after Login',async({loginPage, mainPage,categoryPage,page})  =>{
        //API Testing
        await apiClient.authenticate();
        const userCreated = testData.userData();
        const categoryCreated = testData.categoryNames();
        const responseCreation = await apiClient.post('api/auth/register',JSON.stringify(userCreated)); 
        expect(responseCreation.status()).toBe(201);
        //First UI Validation
        await expect(loginPage.form).toBeVisible();
        await loginPage.setEmail(userCreated.email);
        await loginPage.setPassword(userCreated.password);
        await loginPage.submit();
        await page.waitForTimeout(2500);
        const loggedURL = await mainPage.checkUserIsLogged();
        expect(loggedURL).toBe("https://club-administration.qa.qubika.com/#/dashboard");
        //Switch to Categories and creation of first record
        await mainPage.switchToCategory();
        await categoryPage.clickNewCategory();
        await categoryPage.enterCategoryName(categoryCreated.categoryName);
        await categoryPage.saveCategory();
        await expect(categoryPage.successMessage).toBeVisible();
        await categoryPage.goToLastPage(154);
        expect(categoryPage.checkRecord(categoryCreated.categoryName)).toBeTruthy();
        //Creation of a subCategory
        await categoryPage.clickNewCategory();
        await categoryPage.toggleSubCategory();
        await categoryPage.enterCategoryName(categoryCreated.categoryName.concat("-Child"));
        await categoryPage.parentCategory(categoryCreated.categoryName);
        await categoryPage.saveCategory();
        await expect(categoryPage.successMessage).toBeVisible();
        expect(categoryPage.checkRecord(categoryCreated.categoryName.concat("-Child"))).toBeTruthy();
        await page.waitForTimeout(2500);
    });
});