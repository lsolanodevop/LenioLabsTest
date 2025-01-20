import {faker} from '@faker-js/faker';

function generateUsername() {
    return faker.internet.username();
  }

function generateEmail(username: string) {
    return faker.internet.email({firstName: username});
}

function generateCategoryName(){
    return faker.food.ethnicCategory()
}

const testData = {
        userData: () =>  {
            const firstName = generateUsername();
            const email = generateEmail(firstName);
            return {
                firstName,
                email,
                password: "12345678",
                roles: ["ROLE_ADMIN"],
            };
        },
        categoryNames: () => {
            const categoryName = generateCategoryName();
            return {
                categoryName
            }
        },
        authData: () => {
            return{
                email: "test.qubika@qubika.com",
                password: "12345678",
                userName: "test.qubika@qubika.com"    
            }
        }
    }


export default testData;