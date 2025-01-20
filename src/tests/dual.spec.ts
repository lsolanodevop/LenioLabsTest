import test from '../utils/fixtures';
import { expect } from 'playwright/test';
import { ApiClient } from '../api/api-client';
import exp from 'constants';

let apiClient:ApiClient;
const baseAPIURL = 'https://petstore.swagger.io/';
const baseURL = "https://www.demoblaze.com/";

test.describe('DualBoot: Technical Challenge', async () =>{

    test.beforeEach(async ({page}) => {
        apiClient = new ApiClient(baseAPIURL);
        await apiClient.initialize();
        await page.goto(baseURL);
    });
    
    test.afterAll(async ({ browser }) => {
        await browser.close();
      });

    test('Valid Credentials: User should be able to login',async({mainPage,loginPage}) =>{
        await mainPage.goToLogin();
        await loginPage.setUsername("admin");
        await loginPage.setPassword("admin");
        await loginPage.submit();
        const loginMessage = await loginPage.validateThatUserIsLogged();
        expect(loginMessage).toBe("Welcome admin");
    });

    test('Invalid Credentials: User should not be able to login',async({mainPage,loginPage}) =>{
        await mainPage.goToLogin();
        await loginPage.setUsername("joseluis");
        await loginPage.setPassword("user");
        await loginPage.submit();
        const errorMessage =  await loginPage.validateErrorMessage();
        expect(errorMessage).toBe("Wrong password.");
    });

    test('Category Validation: Phone Category Exists',async({mainPage,loginPage}) =>{
        await mainPage.goToLogin();
        await loginPage.setUsername("admin");
        await loginPage.setPassword("admin");
        await loginPage.submit();
        await mainPage.validateCategoryExists("Phones").then(isVisible =>{
            expect(isVisible).toBe(true);
        });
    });

    test('Category Validation: Laptops Category Exists',async({mainPage,loginPage}) =>{
        await mainPage.goToLogin();
        await loginPage.setUsername("admin");
        await loginPage.setPassword("admin");
        await loginPage.submit();
        await mainPage.validateCategoryExists("Laptops").then(isVisible =>{
            expect(isVisible).toBe(true);
        });
    });

    test('Category Validation: Monitors Category Exists',async({mainPage,loginPage}) =>{
        await mainPage.goToLogin();
        await loginPage.setUsername("admin");
        await loginPage.setPassword("admin");
        await loginPage.submit();
        await mainPage.validateCategoryExists("Monitors").then(isVisible =>{
            expect(isVisible).toBe(true);
        });
    });
    
    test('Category Validation: Phone are in the Phone category',async({mainPage,loginPage}) =>{
        await mainPage.goToLogin();
        await loginPage.setUsername("admin");
        await loginPage.setPassword("admin");
        await loginPage.submit();
        await mainPage.showPhones();
        await mainPage.getDataFromFirstCard("Samsung galaxy s6")
        .then(text =>{
            expect(text).toBe("Samsung galaxy s6");
        });
    });

    test('Category Validation: Laptops are in the Laptops category',async({mainPage,loginPage}) =>{
        await mainPage.goToLogin();
        await loginPage.setUsername("admin");
        await loginPage.setPassword("admin");
        await loginPage.submit();
        await mainPage.showLaptops();
        await mainPage.getDataFromFirstCard("Sony vaio i5")
        .then(text =>{
            expect(text).toBe("Sony vaio i5");
        });;
    });

    test('Category Validation: Monitors are in the Monitors category',async({mainPage,loginPage}) =>{
        await mainPage.goToLogin();
        await loginPage.setUsername("admin");
        await loginPage.setPassword("admin");
        await loginPage.submit();
        await mainPage.showMonitors();
        await mainPage.getDataFromFirstCard("Apple monitor 24")
        .then(text =>{
            expect(text).toBe("Apple monitor 24");
        });
    });

    test("Checkout Process: Adding a product to cart", async({mainPage,loginPage,cartPage}) =>{
        await mainPage.goToLogin();
        await loginPage.setUsername("admin");
        await loginPage.setPassword("admin");
        await loginPage.submit();
        await mainPage.checkProductDetails("Samsung galaxy s6");
        await cartPage.addProductToCart();
        const productAddedMessage =  await cartPage.validateProductAdded();
        expect(productAddedMessage).toBe("Product added.");
    });
    
    test("Checkout Process: Buying a product", async({mainPage,loginPage,cartPage}) =>{
        await mainPage.goToLogin();
        await loginPage.setUsername("admin");
        await loginPage.setPassword("admin");
        await loginPage.submit();
        await mainPage.checkProductDetails("Samsung galaxy s6");
        await cartPage.addProductToCart();
        await mainPage.goToCart();
        await cartPage.goToCheckout();
        await cartPage.fillOrderData();
        await cartPage.placeOrder();
        await cartPage.validateOrderPlaced()
        .then(text =>{
            expect(text).toBe("Thank you for your purchase!");
        });
    });

    test("Extended: Checkout without a product | WARNING VALIDATION DOES NOT WORK THIS TEST WILL FAIL", async({mainPage,loginPage,cartPage}) =>{
        await mainPage.goToLogin();
        await loginPage.setUsername("admin");
        await loginPage.setPassword("admin");
        await loginPage.submit();
        await mainPage.goToCart();
        await cartPage.goToCheckout();
        await cartPage.fillOrderData();
        await cartPage.placeOrder();
        await cartPage.validateOrderPlaced()
        .then(text =>{
            expect(text).not.toBe("Thank you for your purchase!");
        });
    });

    test("Dynamic Validation: Several Product to Cart", async({mainPage,loginPage,cartPage,page}) =>{
        await mainPage.goToLogin();
        await loginPage.setUsername("admin");
        await loginPage.setPassword("admin");
        await loginPage.submit();
        for (let i = 0; i <= 3; i++) {
            await mainPage.checkProductDetails("Samsung galaxy s6");
            await cartPage.addProductToCart();
            await mainPage.goToHome();
          }
        await mainPage.goToCart();
        await cartPage.validateTotalAmountLabel("1440")
        .then(text => {
            expect(text).toBe("1440");
        });
        await cartPage.removeProduct();
        await cartPage.validateTotalAmountLabel("1080")
        .then(text => {
            expect(text).toBe("1080");
        });
    });

});