import {test as baseTest} from '@playwright/test';

import mainPage from '../pages/main.page';
import loginPage from '../pages/login.page';
import cartPage from '../pages/cart.page';

const test = baseTest.extend<{
    mainPage: mainPage;
    loginPage: loginPage;
    cartPage: cartPage;
}>({
mainPage: async({page}, use) => {
    await use(new mainPage(page));

},
loginPage: async({page}, use) => {
    await use(new loginPage(page));
},
cartPage: async({page}, use) =>{
    await use(new cartPage(page));
}
});

export default test;
export const expect = test.expect;