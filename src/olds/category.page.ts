import { expect , Locator , Page } from "@playwright/test";
import Wrapper from "../base/Wrapper";

export default class categoryPage extends Wrapper {
    
    readonly addButton: Locator;
    readonly categoryNameInput: Locator;
    readonly subCategoryCheckbox: Locator;
    readonly cancelButton: Locator;
    readonly acceptButton: Locator;
    readonly categoryTable:Locator;
    readonly categoryRows:Locator;
    readonly categoryNameColumn:Locator;
    readonly parentCategoryColumn:Locator;
    readonly successMessage:Locator;
    readonly subCategoryCombo:Locator;
    readonly subCategoryValue: Locator;

    constructor(public page: Page){
        super(page);
        this.addButton = this.page.locator('button:has-text("Adicionar")');
        this.categoryNameInput = this.page.locator('input[formcontrolname="name"]');
        this.subCategoryCheckbox = this.page.getByText('Es subcategoria?');
        this.cancelButton = this.page.getByRole('button', { name: 'Cancelar' });
        this.acceptButton = this.page.getByRole('button', { name: 'Aceptar' });
        this.categoryTable = this.page.locator('table.table');
        this.categoryRows = this.page.locator('tbody tr');
        this.categoryNameColumn = this.page.locator('td:nth-child(1)');
        this.parentCategoryColumn = this.page.locator('td:nth-child(2)');
        this.successMessage = this.page.locator('div').filter({ hasText: 'Tipo de categoría adicionada' }).nth(2);
        this.subCategoryCombo = this.page.getByRole('combobox').getByRole('textbox');
    }

    async clickNewCategory() {
        await this.addButton.click();
    }
 
    async enterCategoryName(name) {
        await this.categoryNameInput.fill(name);
    }
    async toggleSubCategory() {
        await this.subCategoryCheckbox.click();
    }
    async clickCancel() {
        await this.cancelButton.click();
    }

    async saveCategory() {
        await this.acceptButton.click();
    }

    async checkRecord(categoryName:string){
        return await this.page.getByRole('cell', {name:`${categoryName}`}).isVisible();
    }

    async goToLastPage(pageNumber) {
        await this.page.getByText(`${pageNumber}`).click();
    }
    async parentCategory(categoryName:string){
        await this.subCategoryCombo.click();
        await this.page.getByRole('option', {name:`${categoryName}`}).click();
    }

}
// 