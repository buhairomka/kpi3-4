import { Injectable, CacheModule, Inject, CACHE_MANAGER } from "@nestjs/common";
import { QueryBuilderService } from "../querybuilder/querybuilder.service";
import { DbSingletonService } from "../dbsingleton/dbsingleton.service";
import { Cache } from "cache-manager";

const fetch = require("node-fetch");


// class cacheManager{
//   @Inject(CACHE_MANAGER) cm: Cache
//
// }


interface Handler {
  setNext(handler: Handler): Handler;

  handle(request);
}

abstract class AbstractHandler implements Handler {
  static res = [];
  private nextHandler: Handler;

  static getRes() {
    let [...res] = this.res;
    this.res = [];
    return res;
  }

  public setNext(handler: Handler): Handler {
    this.nextHandler = handler;
    return handler;
  }

  public async handle(request) {
    if (this.nextHandler) {
      return this.nextHandler.handle(request);
    }

    return null;
  }
}

class DBHandler extends AbstractHandler {
  qb: QueryBuilderService;
  db = DbSingletonService.getClient();

  constructor(private cm: Cache) {
    super();
  }

  async handle(query) {
    console.log(query);
    this.qb = new QueryBuilderService();
    this.db = await DbSingletonService.getClient();
    if (query) {

      // await this.cm.get('db',(e,r)=>{
      //   console.log(r,'\nrrrrrrrrrrrr')});
      // @ts-ignore
      if (await this.cm.get("db")) {
      } else {
        console.log("empty");
        await this.cm.set("db", (await this.db.query("select * from product")).rows, 86400000);
        console.log("loaded to cache");
      }
      let ress = await this.cm.get("db");
      // console.log(ress);
      // @ts-ignore
      ress = ress.filter((row) => {
        let tr=true

        for (const key of Object.keys(query)) {

          // console.log(`'${row[key]}' ${JSON.parse(query[key])[0]=='='?'==':JSON.parse(query[key])[0]} '${JSON.parse(query[key])[1]}'`)
          tr=tr &&  (eval(`'${row[key]}'
          ${JSON.parse(query[key])[0] == "=" ? "==" : JSON.parse(query[key])[0]}
          '${JSON.parse(query[key])[1]}'`));
        }
        return tr;
      });

      AbstractHandler.res.push(ress);
    }
    return await super.handle(query);
  }
}

class Supplier1Handler extends AbstractHandler {
  constructor(private cm: Cache) {
    super();
  }

  public async handle(request) {

    // console.log(AbstractHandler.res)
    if (request) {
      if (await this.cm.get("1sup")) {
      } else {
        console.log("empty 1st supp");
        await this.cm.set("1sup", await fetch(`http://localhost:3000/search`).then(async response => await response.json()), 86400000);
        console.log("loaded to cache");
      }
      // let url = "";
      // for (const key in request) {
      //   url += "&" + key.toString() + "=" + request[key].toString();
      // }
      //
      // let ress = await fetch(`http://localhost:3000/search?${url}`).then(async response => await response.json());
      let ress = await this.cm.get("1sup");
      // @ts-ignore
      ress = ress.filter((row) => {
        let tr=true
        for (const key of Object.keys(request)) {
          // console.log(key,row[key]);
          // console.log(`'${row[key]}' ${JSON.parse(request[key])[0] == "=" ? "==" : JSON.parse(request[key])[0]} '${JSON.parse(request[key])[1]}'`);
          tr=tr && (eval(`'${row[key]}'
          ${JSON.parse(request[key])[0] == "=" ? "==" : JSON.parse(request[key])[0]}
          '${JSON.parse(request[key])[1]}'`));
        }
        return tr;
      });
      AbstractHandler.res.push(ress);

    }
    return await super.handle(request);

  }
}


class Supplier2Handler extends AbstractHandler {
  constructor(private cm: Cache) {
    super();
  }

  public async handle(query) {
    let temp = [];
    if (query) {
      if (await this.cm.get("2sup")) {
      } else {
        console.log("empty 2st supp");
        let counter = 0;
        while (true) {
          let ress = await fetch(`http://localhost:3000/price-list/` + counter).then(async response => await response.json());

          if (ress.length != 0) {
            temp = temp.concat(ress);
            counter++;

          } else {
            break;
          }
        }
        await this.cm.set('2sup',temp,86400000)

        console.log("loaded to cache");
      }
      let ress = await this.cm.get("2sup");
      // @ts-ignore
      ress = ress.filter((row) => {
        let tr = true
        for (const key of Object.keys(query)) {
          // console.log(`'${row[key]}' ${JSON.parse(query[key])[0]=='='?'==':JSON.parse(query[key])[0]} '${JSON.parse(query[key])[1]}'`)
          tr=tr &&  (eval(`'${row[key]}'
        ${JSON.parse(query[key])[0] == "=" ? "==" : JSON.parse(query[key])[0]}
        '${JSON.parse(query[key])[1]}'`));
        }
        return tr;
      });

      AbstractHandler.res.push(ress);

    }
    return await super.handle(query);
  }
}


@Injectable()
export class CoFService {
  constructor(@Inject(CACHE_MANAGER) private cm: Cache) {
  }

  async findItems(query) {
    const dbhandler = await new DBHandler(this.cm);
    const fstsupp = await new Supplier1Handler(this.cm);
    const scndsupp = await new Supplier2Handler(this.cm);
    dbhandler.setNext(fstsupp);
    fstsupp.setNext(scndsupp);
    await dbhandler.handle(query);
    return await AbstractHandler.getRes();
  }
}