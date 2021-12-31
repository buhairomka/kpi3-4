import {Injectable} from '@nestjs/common';

@Injectable()
export class QueryBuilderService {
    private query = ''

    select(columns) {
        this.query += 'select ' + columns.join(', ')
        return this
    }

    from(table) {
        this.query += ' from ' + table
        return this
    }
    where(){
        this.query += ` where `
        return this
    }

    whereExpr(key, eq, val) {
        if (['id','userid','status','product_id','order_id','discount','amount','idrole'].includes(key)){
            this.query += ` ${key} ${eq} ${val} `
        }else {
            this.query += ` ${key} ${eq} '${val}' `
        }

        return this
    }

    and() {
        this.query += ' and '
        return this
    }

    getRes() {
        const temp = String(this.query)
        this.query =''
        return temp
    }
}


