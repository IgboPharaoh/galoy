import fs from "fs"
import path from "path"
import { GraphQLSchema, printSchema } from "graphql"

import { isDev } from "../../utils"
import QueryType from "./queries"
import MutationType from "./mutations"

export const gqlSchema = new GraphQLSchema({
  query: QueryType,
  mutation: MutationType,
})

if (isDev) {
  fs.writeFileSync(
    path.resolve("./src/graphql/core/schema.graphql"),
    printSchema(gqlSchema),
  )
}