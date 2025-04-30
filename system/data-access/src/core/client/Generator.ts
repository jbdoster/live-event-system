type OperationType = 'SELECT' | 'INSERT' | 'UPDATE';

type Join = {
  type: 'INNER' | 'LEFT' | 'RIGHT' | 'FULL';
  table: string;
  on: string; // e.g., "a.id = b.a_id"
};

type SQLInput = {
  operation: OperationType;
  schema: string;
  table: string;
  columns?: string[];           // Used in SELECT and INSERT
  values?: string[];            // Used in INSERT
  setValues?: Record<string, string>; // Used in UPDATE
  joins?: Join[];               // SELECT only
  where?: string;               // Optional for SELECT and UPDATE
};

// Example Usage

// SELECT example
// generateSQL({
//   operation: "SELECT",
//   schema: "public",
//   table: "users",
//   columns: ["id", "name"],
//   joins: [{ type: "LEFT", table: "orders", on: "users.id = orders.user_id" }],
//   where: "users.active = true"
// });

// INSERT example
// generateSQL({
//   operation: "INSERT",
//   schema: "sales",
//   table: "orders",
//   columns: ["user_id", "amount"],
//   values: ["42", "199.99"]
// });

// UPDATE example
// generateSQL({
//   operation: "UPDATE",
//   schema: "hr",
//   table: "employees",
//   setValues: { salary: "70000", status: "active" },
//   where: "id = 12"
// });

export default (input: SQLInput): string => {
  const tableRef = `${input.schema}.${input.table}`;

  switch (input.operation) {
    case 'SELECT':
      if (!input.columns || input.columns.length === 0) {
        throw new Error("SELECT requires 'columns' to be specified.");
      }
      const selectClause = `SELECT ${input.columns.join(", ")}`;
      const fromClause = `FROM ${tableRef}`;
      const joinClauses = (input.joins || [])
        .map(join => `${join.type} JOIN ${join.table} ON ${join.on}`)
        .join(" ");
      const whereClause = input.where ? `WHERE ${input.where}` : "";
      return [selectClause, fromClause, joinClauses, whereClause]
        .filter(Boolean)
        .join(" ");

    case 'INSERT':
      if (!input.columns || !input.values || input.columns.length !== input.values.length) {
        throw new Error("INSERT requires matching 'columns' and 'values'.");
      }
      const insertCols = `(${input.columns.join(", ")})`;
      const insertVals = `VALUES (${input.values.map(val => `'${val}'`).join(", ")})`;
      return `INSERT INTO ${tableRef} ${insertCols} ${insertVals} RETURNING ${insertCols}`;

    case 'UPDATE':
      if (!input.setValues || Object.keys(input.setValues).length === 0) {
        throw new Error("UPDATE requires 'setValues' to be specified.");
      }
      const setClause = Object.entries(input.setValues)
        .map(([col, val]) => `${col} = '${val}'`)
        .join(", ");
      const updateWhere = input.where ? `WHERE ${input.where}` : "";
      return `UPDATE ${tableRef} SET ${setClause} ${updateWhere}`.trim();

    default:
      throw new Error(`Unsupported operation: ${input.operation}`);
  }
}