import {Controller, Get, Query} from '@nestjs/common';
import { CoFService } from './cofservice/cofservice.service';

@Controller()
export class AppController {

    constructor(private readonly finder:CoFService) {
    }

    @Get('/main')
    async mainApp() : Promise<string>{
        return 'request format: ?id=["=","5"] or ?price=[">=","30"]'
    }
    @Get('/find')
    async getItems(@Query() query){
        console.log('query', query);
        return await this.finder.findItems(query)
    }

}
