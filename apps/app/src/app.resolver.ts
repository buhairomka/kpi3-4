import { Resolver, Query, Mutation, Args, ResolveField, ObjectType, Field, InputType, Int } from "@nestjs/graphql";
import { CoFService } from "./cofservice/cofservice.service";
import { DbSingletonService } from "./dbsingleton/dbsingleton.service";
const format = require("pg-format")
@ObjectType()
export class Product {
  @Field(()=>Int)
  id: number;
  @Field()
  category: string;
  @Field()
  price: string;
  @Field()
  color: string;
  @Field()
  size: string;
  @Field(()=>Int)
  discount: number;
  @Field(()=>Int)
  amount: number;
}

@ObjectType()
export class Employee {
  @Field()
  id: string;
  @Field()
  firstName: string;
  @Field()
  lastName: string;
  @Field()
  designation: string;
  @Field({ nullable: true })
  city: string;
  @Field()
  projectId: string;

}

@InputType()
export class EmployeeCreateDTO {
  @Field()
  firstName: string;
  @Field()
  lastName: string;
  @Field()
  designation: string;
  @Field({ nullable: true })
  city: string;

  @Field()
  projectId: string;
}
@InputType()
class StuffBody {
  @Field(()=>Int,{nullable:true})
  id: number;
  @Field({nullable:true})
  category: string;
  @Field({nullable:true})
  price: string;
  @Field({nullable:true})
  color: string;
  @Field({nullable:true})
  size: string;
  @Field(()=>Int,{nullable:true})
  discount: number;
  @Field(()=>Int,{nullable:true})
  amount: number;
};

@Resolver(() => Employee)
export class EmployeeResolver {
  db;
  constructor(private cof: CoFService) {
    this.db = DbSingletonService.getClient()
  }

  @Query(()=>[[Product]])
  async findProducts(@Args("input") args:StuffBody){
    console.log(args);
    let res = await this.cof.findItems(args)
    return res
  }

  @Mutation(() => String, { name: "createProduct" })
  async createProduct(@Args("productInfo") prod: StuffBody) {
    console.log(prod);
    console.log(format(`INSERT INTO product (%I) VALUES %L returning id`,Object.keys(prod),[Object.values(prod)]));
    const id = await this.db.query(format(`INSERT INTO product (%I) VALUES %L returning id`,Object.keys(prod),[Object.values(prod)]))
    console.log(id.rows[0]);
    return id.rows[0]["id"];
  }

}

