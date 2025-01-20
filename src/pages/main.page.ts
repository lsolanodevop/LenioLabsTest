import { expect , Locator , Page } from "@playwright/test";
import Wrapper from "../base/Wrapper";

export default class MainPage extends Wrapper {

    readonly navbarHomeButton: Locator; 
    readonly navbarCartButton: Locator; 
    readonly navbarLoginButton: Locator; 
    readonly navbarSignUpButton: Locator; 
    readonly phoneButton: Locator; 
    readonly laptopsButton: Locator; 
    readonly monitorsButton: Locator; 
    readonly resultsPage: Locator;

    constructor(public page: Page){
        super(page);
        this.navbarHomeButton = this.page.getByRole('link', { name: 'Home (current)' });
        this.navbarCartButton = this.page.getByRole('link', { name: 'Cart', exact: true });
        this.navbarLoginButton = this.page.getByRole('link', { name: 'Log in' });
        this.phoneButton = this.page.getByRole('link', { name: 'Phones' });
        this.laptopsButton = this.page.getByRole('link', { name: 'Laptops' });
        this.monitorsButton = this.page.getByRole('link', { name: 'Monitors' })
        this.resultsPage = this.page.locator('#tbodyid');
    }

    async checkUserIsLogged(){
        return  this.page.url();
    }
    async goToHome(){
        await this.navbarHomeButton.click();
    }
    async goToCart(){
        await this.navbarCartButton.click();
    }
    async goToLogin(){
        await this.navbarLoginButton.click();
    }
    async goToSignUp(){
        await this.navbarSignUpButton.click();
    }
    async showPhones(){
        await this.phoneButton.click();
    }
    async showLaptops(){
        await this.laptopsButton.click();
    }
    async showMonitors(){
        await this.monitorsButton.click();
    }

    async validateCategoryExists(category: string): Promise<boolean> {
        return new Promise<boolean>(async (resolve) => {
          try {
            let isVisible: boolean;
            switch (category) {
              case "Phones":
                isVisible = await this.phoneButton.isVisible();
                break;
              case "Laptops":
                isVisible = await this.laptopsButton.isVisible();
                break;
              case "Monitors":
                isVisible = await this.monitorsButton.isVisible();
                break;
              default:
                throw new Error("Parameter is not valid: " + category);
            }
            resolve(isVisible);
          } catch (error) {
            console.error("Error in parameter:", error);
            resolve(false);
          }
        });
      }

    async getDataFromFirstCard(productName: string): Promise<string> {
        return new Promise<string>(async (resolve, reject) => {
          try {
            const text = await this.page.getByRole('link', { name: `${productName}` }).innerText();
            resolve(text);
          } catch (error) {
            console.error(`Error on getting the text name ${productName}:`, error);
            reject(error); 
          }
        });
      }
    
    async checkProductDetails(productName:string){
        await this.page.getByRole('link', { name: `${productName}` }).click();
    }
}