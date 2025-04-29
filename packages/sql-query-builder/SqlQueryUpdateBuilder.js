/**
 *  Query Mapping
 * ------------------------------------------------------
 *  UPDATE
 *   	User u
 *  INNER JOIN `users-service@dev`.`_DriverOnUser` dou
 *  	on dou.B = u.id
 *  INNER JOIN `users-service@dev`.Driver d
 *  	on dou.A = d.id
 *  SET
 *  	u.type = 'Driver',
 *  	d.aboutMe = 'Test Test Test'
 *  WHERE
 *   	u.id = 'ck8apifn7p4vr0a50la5x6yct'
 * ------------------------------------------------------
 *  UPDATE
 *    {Root Table}
 *  ?[JOINS]
 *  SET
 *    [Property Setters]
 *  ?WHERE
 *    [Filters]
 * ------------------------------------------------------
 */

class RelationQueryUpdateBuilder {
  constructor(configuration) {
    if (!configuration?.databaseName) {
      this.throw("Database name required in configuration.")
    }
    if (!configuration?.select?.rootTableName) {
      this.throw("Root table name required in configuration.")
    }
    this.databaseDirective = this.wrapWithBackTicks(configuration.databaseName)
    this.query = `
UPDATE
$___RootTable
$___JoinSegmentBegin
$___JoinSegmentEnd
SET
$___SetValuesSegmentBegin
$___SetSegmentEnd
$___FilterSegmentBegin
$___FiltersSegmentEnd
    `
    this.configuration = configuration
    this.tokenMap = new Map()
    configuration.joins?.forEach(
      join => {
        const stname = join.source.tableName;
        const ttname = join.target.tableName;
        this.tokenMap.set(stname, this.generateAlias(stname))
        this.tokenMap.set(ttname, this.generateAlias(ttname))
      }
    )
  }

  getQuery() {
    return this.query
  }
  build() {
    this.setRootTable()
    this.setJoins()
    this.setValues()
    this.setFilter()
    this.removePragma()
    this.validateWhereFilter()
  }

  // private
  generateTableAlias(tname) {
    const talias = this.generateAlias(tname)
    this.tokenMap.set(tname, talias)
    return talias
  }
  setRootTable() {
    const tname = this.configuration.select.rootTableName
    const talias = this.generateTableAlias(tname)
    this.query = this.query.replace("$___RootTable", `${tname} ${talias}`)
  }

  /**
   *  Reverse the order of list so the aliases exist
   *  by the time assignment takes place in the statement.
   */
  setJoins() {
    this.configuration.joins?.reverse().forEach(
      join => {
        const queryAsArray = this.query.split("\n")
        const index = queryAsArray.map(l=>l.trim()).indexOf("$___JoinSegmentBegin") + 1
        const stname = join.source.tableName;
        const stalias = this.tokenMap.get(stname)
        if (!stalias) this.throw(`No alias created for: ${stname}`)
        const stcolumn = join.source.columnName
        const ttname = join.target.tableName
        const ttalias = this.tokenMap.get(ttname)
        if (!ttalias) this.throw(`No alias created for: ${ttname}`)
        const ttcolumn = join.target.columnName
        const statement = `INNER JOIN ${this.databaseDirective}.${ttname} ${ttalias}  on ${stalias}.${stcolumn} = ${ttalias}.${ttcolumn}`
        queryAsArray.splice(index, 0, statement)
        this.query = queryAsArray.join("\n")
      }
    )
  }
  setValues() {
    this.configuration.values.forEach(
      (value, i) => {
        const queryAsArray = this.query.split("\n")
        const index = queryAsArray.map(l=>l.trim()).indexOf("$___SetValuesSegmentBegin") + 1
        const tname = value.tableName
        const talias = this.tokenMap.get(tname)
        if (!talias) this.throw(`No alias created for: ${tname}`)
        const tcolumn = value.columnName
        const tcolumnvalue = value.columnValue
        const tcolumnvaluedatatype = tcolumnvalue.constructor.name
        const addComma = i !== 0;
        let statement
        if (
          tcolumnvaluedatatype === "Number" ||
          tcolumnvaluedatatype === "Boolean"
        ) {
          statement = `${talias}.${tcolumn} = ${tcolumnvalue}`
          addComma && (statement += ",")
        }
        else if (
          tcolumnvaluedatatype === "String"
        ) {
          statement = `${talias}.${tcolumn} = '${tcolumnvalue}'`
          addComma && (statement += ",")
        }
        else {
          this.throw(`Filter data type not allowed: ${tcolumnvaluedatatype}`)
        }
        queryAsArray.splice(index, 0, statement)
        this.query = queryAsArray.join("\n")
      }
    )
  }
  setFilter() {
    const queryAsArray = this.query.split("\n")
    const index = queryAsArray.map(l=>l.trim()).indexOf("$___FilterSegmentBegin") + 1
    queryAsArray.splice(index, 0, "WHERE")
    this.query = queryAsArray.join("\n")
    const tname = this.configuration.filter.tableName
    const talias = this.tokenMap.get(tname)
    if (!talias) this.throw(`No alias created for: ${tname}`)
    const tcolumn = this.configuration.filter.columnName
    const tcolumnvalue = this.configuration.filter.columnValue
    const tcolumnvaluedatatype = tcolumnvalue.constructor.name
    let statement
    if (
      tcolumnvaluedatatype === "String"
    ) {
      statement = `${talias}.${tcolumn} = '${tcolumnvalue}';`
    }
    else {
      this.throw(`This builder only indexes cuid type columns.
                  Filter data type not allowed: ${tcolumnvaluedatatype}
      `)
    }
    queryAsArray.splice(index+1, 0, statement)
    this.query = queryAsArray.join("\n")
  }
  removePragma() {
    this.query = this.query.split("\n").filter(s => !s.includes("$___")).join("\n")
  }
  validateWhereFilter() {
    if (!this.query.toUpperCase().includes("WHERE")) {
      this.throw("Where filter required. Do not update the whole table.")
    }
  }
  throw(message) {
    const error = new Error(`RelationQueryUpdateBuilder: ${message}`);
    error.stack = undefined
    throw error
  }
  wrapWithBackTicks(string) {
    return `\`${string}\``
  }
  generateAlias(string) {
    return `\`${Symbol(string).toString()}\``
  }
}

module.exports = RelationQueryUpdateBuilder;
