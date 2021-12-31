import { Injectable } from "@nestjs/common";

const localStorage = {
  products: [
    { id: 1, category: "shoes", price: 20, color: "black", size: "41", discount: 1, amount: 54 },
    { id: 2, category: "shoes", price: 20, color: "white", size: "41", discount: 2, amount: 23 },
    { id: 3, category: "shoes", price: 20, color: "red", size: "43", discount: 4, amount: 54 },
    { id: 4, category: "shoes", price: 20, color: "yellow", size: "42", discount: 1, amount: 32 },
    { id: 5, category: "shoes", price: 20, color: "red", size: "41", discount: 0, amount: 43 },
    { id: 6, category: "shoes", price: 20, color: "brown", size: "43", discount: 4, amount: 23 },
    { id: 7, category: "shoes", price: 20, color: "blue", size: "44", discount: 30, amount: 76 },
    { id: 8, category: "shoes", price: 20, color: "red", size: "45", discount: 5, amount: 34 },
    { id: 9, category: "shoes", price: 20, color: "red", size: "38", discount: 5, amount: 66 },
    { id: 10, category: "shoes", price: 20, color: "white", size: "39", discount: 23, amount: 4 },
    { id: 11, category: "shoes", price: 20, color: "purple", size: "42", discount: 0, amount: 3 }
  ]
};

@Injectable()
export class FirstSupplierService {

  sleep(ms) {
    console.log('sleeping ..zzZ');
    return new Promise(
      resolve => setTimeout(resolve, ms)
    );
  }
  async findProductsWhere(query) {
          await this.sleep(4000)
          console.log(query);

          if (Object.keys(query).length == 0) {
              return localStorage.products;
          }

          return localStorage.products.filter((row) => {
              for (const key of Object.keys(query)) {
                  // console.log(query[key]);
                  return (eval(`'${row[key]}'
        ${JSON.parse(query[key])[0] == "=" ? "==" : JSON.parse(query[key])[0]}
        '${JSON.parse(query[key])[1]}'`));
              }
          });

  }
}
