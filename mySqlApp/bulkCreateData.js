	
const sql = require('mssql')
const config = require("./config/config.json")
const logger = require("./utils/logger")(config);

const bulckInsertNumber = 100000;
const bulckInsertBatch = 5000;
const pool1 = new sql.ConnectionPool(config.dbConfig);
const pool1Connect = pool1.connect();
const parent_task_id = config.parent_task_id;
const table_name = config.table_name;

pool1.on('error', err => {
    pool1.close();
    // ... error handler
})
 
async function main() {

    await pool1Connect; // ensures that the pool has been created
    try {
        const request = pool1.request();
        // logger.info(`table_name=${table_name}`)
        // const startResult = await request.query`select count(*) from tm_ondemandex_task`;
        // logger.info(`bulk creat data start, query count result is = ${JSON.stringify(startResult)}`)
        let tasks = []
        for(let i=0;i<bulckInsertBatch;i++){
         tasks.push(bulkInsert(i));
        }
        // let start_time = new Date().getTime();
        await Promise.all(tasks);
        // let end_time = new Date().getTime();
        // const result = await request.query`select count(*) from tm_ondemandex_task`;
        // logger.info(`All tasks are done,cost time is ：${end_time-start_time}, query count result is = ${JSON.stringify(result)}`)

    } catch (err) {
        logger.error(err);
    }finally{
        pool1.close();
    }
}

async function bulkInsert(batchNumber){
    const request = pool1.request();
    // let start_time = new Date().getTime();
    for(let i=0;i<bulckInsertNumber;i++){
        await request.query("INSERT INTO tm_ondemandex_task(task_id, parent_task_id, task_type, target, company_id, policy_id,task_parameter, heartbeat_time,schedule_id, create_time, status,target_id, target_description) values  (NEWID(), '762fac28-55c1-4411-a8b1-5f56c6940ee7', 2, 'test@trendmicro.com', 'test_company_guid', 'test_policy_id', '{}', CURRENT_TIMESTAMP, 'test_schedule_id', CURRENT_TIMESTAMP, 'W', 'test@trendmicro.com', 'allen_test')");
    }
    // let end_time = new Date().getTime();
    // const result = await request.query`select count(*) from tm_ondemandex_task`;
    // logger.info(`Current tasks number is ${batchNumber} ,all tasks are done,cost time is ：${end_time-start_time}, query count result is = ${JSON.stringify(result)}`)
}


main();
