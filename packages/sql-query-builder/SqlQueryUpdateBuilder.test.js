const RelationQueryUpdateBuilder = require("./RelationQueryUpdateBuilder")

let configuration = {
  databaseName: "users-service@dev",
  select: {
    rootTableName: "User",
  },
  joins: [
    {
      source: {
        tableName: "User",
        columnName: "id",
      },
      target: {
        tableName: "_DriverOnUser",
        columnName: "B",
      },
    },
    {
      source: {
        tableName: "_DriverOnUser",
        columnName: "A",
      },
      target: {
        tableName: "Driver",
        columnName: "id",
      },
    },
  ],
  values: [
    {
      tableName: "User",
      columnName: "phone",
      columnValue: "9009009002",
    },
    {
      tableName: "Driver",
      columnName: "aboutMe",
      columnValue: "Test about me text.",
    },
    {
      tableName: "Driver",
      columnName: "blockedFromBooking",
      columnValue: false,
    },
    {
      tableName: "Driver",
      columnName: "allowedDLVAttempts",
      columnValue: 3,
    },
  ],
  filter: {
    tableName: "User",
    columnName: "id",
    columnValue: "ck8apifn7p4vr0a50la5x6yct",
  }
}

const queryStringAsFormattedArray = (string) =>
  string.split("\n").map(line => line.trim())

describe(
  "Query Building",
  () => {
    it(`
        builds the query
        with many intersection tables joined
        with many different tables updated
        with many columns set to be updated
        with 1 user ID filter as text
      `, () => {
      const expected = `
        UPDATE
        User \`Symbol(User)\`
        INNER JOIN \`users-service@dev\`._DriverOnUser \`Symbol(_DriverOnUser)\`  on \`Symbol(User)\`.id = \`Symbol(_DriverOnUser)\`.B
        INNER JOIN \`users-service@dev\`.Driver \`Symbol(Driver)\`  on \`Symbol(_DriverOnUser)\`.A = \`Symbol(Driver)\`.id
        SET
        \`Symbol(Driver)\`.allowedDLVAttempts = 3,
        \`Symbol(Driver)\`.blockedFromBooking = false,
        \`Symbol(Driver)\`.aboutMe = 'Test about me text.',
        \`Symbol(User)\`.phone = '9009009002'
        WHERE
        \`Symbol(User)\`.id = 'ck8apifn7p4vr0a50la5x6yct';
      `
    
      const builder = new RelationQueryUpdateBuilder(configuration)
      builder.build()
      const actual = builder.getQuery()
    
      const actualLines = queryStringAsFormattedArray(actual)
      const expectedLines = queryStringAsFormattedArray(expected)
      actualLines.forEach(
        (actualLine, index) => {
          const expecteLine = expectedLines[index]
          expect(actualLine).toBe(expecteLine)
        }
      )
    })
    
    it(`
      builds the query
      with 1 intersection tables joined
      with many different tables updated
      with many columns set to be updated
      with 1 user ID filter as text
    `, () => {
      const expectedConfiguration = {
        ...configuration,
        joins: [
          {
            source: {
              tableName: "User",
              columnName: "id",
            },
            target: {
              tableName: "DriverLicense",
              columnName: "userId",
            },
          },
        ],
        values: [
          {
            tableName: "User",
            columnName: "phone",
            columnValue: "9009009002",
          },
          {
            tableName: "DriverLicense",
            columnName: "city",
            columnValue: "Seattle",
          }
        ],
      }
      const expected = `
          UPDATE
          User \`Symbol(User)\`
          INNER JOIN \`users-service@dev\`.DriverLicense \`Symbol(DriverLicense)\`  on \`Symbol(User)\`.id = \`Symbol(DriverLicense)\`.userId
          SET
          \`Symbol(DriverLicense)\`.city = 'Seattle',
          \`Symbol(User)\`.phone = '9009009002'
          WHERE
          \`Symbol(User)\`.id = 'ck8apifn7p4vr0a50la5x6yct';
      `
    
      const builder = new RelationQueryUpdateBuilder(expectedConfiguration)
      builder.build()
      const actual = builder.getQuery()
    
      const actualLines = queryStringAsFormattedArray(actual)
      const expectedLines = queryStringAsFormattedArray(expected)
      actualLines.forEach(
        (actualLine, index) => {
          const expecteLine = expectedLines[index]
          expect(actualLine).toBe(expecteLine)
        }
      )
    })

    it(`
      builds the query
      with 1 intersection tables joined
      with 1 table updated
      with many columns set to be updated
      with 1 user ID filter as text
    `, () => {
      const expectedConfiguration = {
        ...configuration,
        joins: undefined,
        values: [
          {
            tableName: "User",
            columnName: "phone",
            columnValue: "9009009002",
          },
          {
            tableName: "User",
            columnName: "firstName",
            columnValue: "Bo",
          }
        ],
      }
      const expected = `
        UPDATE
        User \`Symbol(User)\`
        SET
        \`Symbol(User)\`.firstName = 'Bo',
        \`Symbol(User)\`.phone = '9009009002'
        WHERE
        \`Symbol(User)\`.id = 'ck8apifn7p4vr0a50la5x6yct';
      `
    
      const builder = new RelationQueryUpdateBuilder(expectedConfiguration)
      builder.build()
      const actual = builder.getQuery()
      console.log(actual)

      const actualLines = queryStringAsFormattedArray(actual)
      const expectedLines = queryStringAsFormattedArray(expected)
      actualLines.forEach(
        (actualLine, index) => {
          const expecteLine = expectedLines[index]
          expect(actualLine).toBe(expecteLine)
        }
      )
    })

    it(`
      builds the query
      with 1 intersection tables joined
      with 1 table updated
      with 1 columns set to be updated
      with 1 user ID filter as text
    `, () => {
      const expectedConfiguration = {
        ...configuration,
        joins: undefined,
        values: [
          {
            tableName: "User",
            columnName: "phone",
            columnValue: "9009009002",
          },
        ],
      }
      const expected = `
        UPDATE
        User \`Symbol(User)\`
        SET
        \`Symbol(User)\`.phone = '9009009002'
        WHERE
        \`Symbol(User)\`.id = 'ck8apifn7p4vr0a50la5x6yct';
      `
    
      const builder = new RelationQueryUpdateBuilder(expectedConfiguration)
      builder.build()
      const actual = builder.getQuery()

      const actualLines = queryStringAsFormattedArray(actual)
      const expectedLines = queryStringAsFormattedArray(expected)
      actualLines.forEach(
        (actualLine, index) => {
          const expecteLine = expectedLines[index]
          expect(actualLine).toBe(expecteLine)
        }
      )
    })
  }
)

describe(
  "Validations", 
  () => {
    it("Throws when there no database name to select by", () => {
      const expectedConfiguration = {
        ...configuration,
        databaseName: undefined,
      }
    
      expect(() => new RelationQueryUpdateBuilder(expectedConfiguration)).toThrow(new Error("RelationQueryUpdateBuilder: Database name required in configuration."))
    })
    it("Root table name required in configuration.", () => {
      const expectedConfiguration = {
        ...configuration,
        databaseName: undefined,
      }
    
      expect(() => new RelationQueryUpdateBuilder(expectedConfiguration)).toThrow(new Error("RelationQueryUpdateBuilder: Database name required in configuration."))
    })
    it("Throws when there is a mismatched table identifer to update", () => {
      const expectedConfiguration = {
        ...configuration,
        values: [
          {
            tableName: "UnlistedTable",
            columnName: "phone",
            columnValue: "9009009002",
          },
        ],
      }
    
      const builder = new RelationQueryUpdateBuilder(expectedConfiguration)
      expect(() => builder.build()).toThrow(new Error("RelationQueryUpdateBuilder: No alias created for: UnlistedTable"))
    })
  }
)