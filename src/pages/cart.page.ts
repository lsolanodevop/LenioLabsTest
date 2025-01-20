import { expect , Locator , Page } from "@playwright/test";
import Wrapper from "../base/Wrapper";

export default class CartPage extends Wrapper {
    readonly addToCartButton: Locator; 
    readonly removeFromCartButton: Locator;
    readonly totalAmountLabel: Locator; 
    readonly placeOrderButton:Locator; 
    readonly nameInput: Locator;
    readonly countryInput: Locator;
    readonly cityInput: Locator;
    readonly creditCardInput: Locator;
    readonly monthInput: Locator;
    readonly yearInput: Locator;
    readonly purchaseButton: Locator;
    readonly succesfullMessage:Locator;
//getByText('Products Pic Title Price x')
    constructor(public page: Page){
        super(page);
        this.addToCartButton = this.page.getByRole('link', { name: 'Add to cart' });
        this.placeOrderButton = this.page.getByRole('button', { name: 'Place Order' });
        this.nameInput = this.page.getByLabel('Total:');
        this.countryInput = this.page.getByLabel('Country:');
        this.cityInput = this.page.getByLabel('City:');
        this.creditCardInput = this.page.getByLabel('Credit card:');
        this.monthInput = this.page.getByLabel('Month:');
        this.yearInput = this.page.getByLabel('Year:');
        this.purchaseButton = this.page.getByRole('button', { name: 'Purchase' });
        this.removeFromCartButton = this.page.locator('(//a[contains(text(), "Delete")])[1]');
        this.totalAmountLabel = this.page.getByRole('heading', { name: '720' });
        this.succesfullMessage = this.page.getByRole('heading', { name: 'Thank you for your purchase!' })
    }

    async addProductToCart(){
        await this.addToCartButton.click();
    }
    async validateProductAdded(){
        return new Promise(resolve => {
            this.page.on("dialog", async dialog => {
                resolve(dialog.message());
            });
        });
    }
    async checkProductsAdded(): Promise<number> {
        return new Promise<number>(async (resolve) => {
          const elements = await this.page.locator('.success'); 
          const count = await elements.count(); 
          resolve(count);
        });
      }

    async goToCheckout(){
        await this.placeOrderButton.click();
    }
    async fillOrderData(){
        await this.nameInput.fill("Peter Parker");
        await this.countryInput.fill("USA");
        await this.cityInput.fill("New York");
        await this.creditCardInput.fill("8877");
        await this.monthInput.fill("01");
        await this.yearInput.fill("1995");
    }
    async placeOrder(){
        await this.purchaseButton.click();
    }

    async validateOrderPlaced(): Promise<string> {
        return new Promise<string>(async (resolve, reject) => {
          try {
            const text = await this.succesfullMessage.innerText();
            resolve(text);
          } catch (error) {
            console.error('Error on getting the message:', error);
            reject(error); 
          }
        });
      }
      async validateTotalAmountLabel(amount: string): Promise<String> {
        return new Promise<String>(async (resolve, reject) => {
          try {
            const totalAmount = await this.page.getByRole('heading', { name: `${amount}` }).innerText();
            resolve(totalAmount);
          } catch (error) {
            console.error(`Error in the Total Amount:`, error);
            reject(error);
          }
        });
      }

      async removeProduct(){
          await this.removeFromCartButton.click()
      }

}

