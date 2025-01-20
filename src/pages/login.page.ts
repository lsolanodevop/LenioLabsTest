import { expect , Locator , Page } from "@playwright/test";
import Wrapper from "../base/Wrapper";

export default class LoginPage extends Wrapper {
        readonly userInput: Locator;
        readonly passwordInput: Locator;
        readonly closeButton: Locator;
        readonly submitButton: Locator;
        readonly loggedLabel: Locator;

        constructor(public page:Page){
            super(page);
            this.userInput = this.page.locator('#loginusername');  
            this.passwordInput = this.page.locator('#loginpassword');  
            this.closeButton = this.page.getByLabel('Log in').getByText('Close');  
            this.submitButton = this.page.getByRole('button', { name: 'Log in' });
            this.loggedLabel = this.page.getByRole('link', { name: 'Welcome admin' });  
        }
        

        async setUsername(username:string){
            await this.userInput.fill(username);
        }
        async setPassword(password:string){
            await this.passwordInput.fill(password);
        }
        async submit(){
            await this.submitButton.click();
        }
        async validateThatUserIsLogged(){
            try{
            const visibility = await this.page.getByRole('link', { name: 'Welcome admin' }).innerText();
            return  visibility;
            } catch (error){
                console.error("Error upon validating the logged user",error);
                return false;
            }
        }

       

        async validateErrorMessage(){
            return new Promise(resolve => {
                this.page.on("dialog", async dialog => {
                    resolve(dialog.message());
                });
            });
        }
    
}