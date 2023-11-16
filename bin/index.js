#! /usr/bin/env node
import * as fse from 'fs-extra';

const args = process.argv;

if (args[2] === 'migrations') {
    
    const fileName = args[3];

    const data = fileName.split("_");
    
    const operation = data.shift();
    
    data.pop();
    
    const name = data.join("_");
    
    

    switch (operation) {
        case 'create':
            // code block
            createTable(name, fileName);
            break;
        case 'update':
            // code block
            updateTable(name, fileName);
            break;
        case 'drop':
            dropTable(name, fileName);
            break;
        default:
            createMigrationFile(fileName);
            break;
    }
}
else if (args[2] === 'commands') {

} else {
    console.error('Invalid command. Please use "migrations" or "commands".');
    process.exit(1);
}

function createTable(tableName, fileName) {
    const query = `
    -- create query with relationships
    CREATE TABLE IF NOT EXISTS ${tableName} (
    id text primary key not null
    email text not null
    created_at timestamp datetime default current_timestamp not null,
    updated_at timestamp datetime default current_timestamp not null,
    deleted_at datetime default null,
    FOREIGN KEY (related_id) REFERENCES related_table(related_id)
    )

    -- create index
    CREATE INDEX IF NOT EXISTS idx_email ${tableName}(email)

    -- create index composite
    CREATE INDEX IF NOT EXISTS idx_created_updated_${tableName} ON ${tableName}(created_at, updated_at);
    `;

    createMigrationFile(fileName, query);
}

function updateTable(tableName, fileName) {
    // generate update query for sqlite3
    const query = `UPDATE ${tableName} SET column1 = value1, column2 = value2 WHERE condition`;

    createMigrationFile(fileName, query);
}

function dropTable(tableName, fileName) {
    // Drop table or indexes

    const query = `
        DROP TABLE IF EXISTS ${tableName}
        DROP INDEX IF EXISTS idx_email;
        DROP INDEX IF EXISTS idx_created_updated_${tableName};
        `;

    createMigrationFile(fileName, query);
}

function createMigrationFile(fileName, query = 'YOUR QUERY GOES HERE') {
    const dateNow = getCurrentDateFormatted();
    fse.outputFile(`./migrations/${dateNow}_${fileName}.sql`, query)
        .then(() => {
            console.log(`Migration file created: ./migrations/${dateNow}_${fileName}.sql`);
        })
        .catch(err => {
            console.error(err)
            console.error('Please provide a valid file name as a command-line argument.');
            process.exit(1); // Exit with an error code
        });
}

function getCurrentDateFormatted() {
    const now = new Date();

    const year = now.getFullYear();
    const month = padZero(now.getMonth() + 1); // Months are zero-based
    const day = padZero(now.getDate());
    const hours = padZero(now.getHours());
    const minutes = padZero(now.getMinutes());
    const seconds = padZero(now.getSeconds());

    const formattedDate = `${year}_${month}_${day}_${hours}${minutes}${seconds}`;

    return formattedDate;
}

function padZero(value) {
    return value < 10 ? `0${value}` : value;
}
