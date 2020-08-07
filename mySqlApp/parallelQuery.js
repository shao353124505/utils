
const sql = require('mssql')
import { v4 as uuidv4 } from 'uuid';
const config = require("./config/config.json")
const logger = require("./utils/logger")(config);
logger.info("Hello world, This is an app to connect to sql server.");

const bulckQueryNumber = 50;
const bulckQueryBatch = 20;
const pool1 = new sql.ConnectionPool(config.dbConfig);
const pool1Connect = pool1.connect();

pool1.on('error', err => {
    pool1.close();
    // ... error handler
})

async function main() {

    await pool1Connect; // ensures that the pool has been created
    try {
        const request = pool1.request(); // or: new sql.Request(pool1)
        let tasks = []
        for(let i=0;i<bulckQueryBatch;i++){
            tasks.push(bulkQuery());
        }
        let start_time = new Date().getTime();
        await Promise.all(tasks);
        let end_time = new Date().getTime();
        const result = await request.query('select count(*) from tm_ondemandex_task')
        logger.info(`All update tasks are done,cost time is ：${end_time-start_time}, update count result is = ${JSON.stringify(result)}`)

    } catch (err) {
        console.error('SQL error', err);
    }finally{
        pool1.close();
    }
}

async function bulkQuery(){
    const request = pool1.request(); // or: new sql.Request(pool1)
    for(let i=0;i<bulckQueryNumber;i++){
        let start_time = new Date().getTime();
        await request.query("update tm_ondemandex_task set status='A',executed_times=executed_times+1, start_time=CURRENT_TIMESTAMP, delegator_id=@delegator_id " +
            "where status in ('U', 'F') AND task_type=2 AND executed_times<3 limit 50");
        let end_time = new Date().getTime();
        const result = await request.query('select count(*) from tm_ondemandex_task')
        console.log(`每批次更新执行结束，消耗时间：${end_time-start_time},结果${JSON.stringify(result)}`)
    }
    const result = await request.query('select count(*) from tm_ondemandex_task')
    console.log(`执行结束，${JSON.stringify(result)}`)
}

main();
