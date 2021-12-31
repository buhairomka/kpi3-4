import {Controller, Get, Param, Query} from '@nestjs/common';
import {FirstSupplierService} from "./firstsupplier.service";
import {SecondSupplierService} from "./secondsupplier.service";

@Controller()
export class Supplier1 {
    constructor(private readonly sup1:FirstSupplierService) {}



    @Get('/search')
    async search(@Query() query) {

        return await this.sup1.findProductsWhere(query)
    }

    @Get()
    any(): string {
        return '<p>app is working at http://localhost:3000/</p>\n ' +
            '<p>routes:</p>\n' +
            '<p>*   http://localhost:3000//search</p> \n' +
            '<p>*   http://localhost:3000//price-list</p>\n' +
            '<p>*   http://localhost:3000//details/{id}</p>'
    }

}


@Controller()
export class Supplier2 {
    constructor(private readonly sup2:SecondSupplierService) {
    }
    @Get('/price-list')
    prise_list() {
        return this.sup2.all()
    }
    @Get('/price-list/:n')
    prise_listN(@Param() params) {
        return this.sup2.getList(+params.n)
    }

    @Get('/details/:id')
    details(@Param() params) {
        console.log(params.id)
        return this.sup2.findProductsById(params.id)
    }
}
