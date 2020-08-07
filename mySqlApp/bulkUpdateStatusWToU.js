	
const sql = require('mssql')
const config = require("./config/config.json")
const logger = require("./utils/logger")(config);

const pool1 = new sql.ConnectionPool(config.dbConfig);
const pool1Connect = pool1.connect();
const table_name = config.table_name;

pool1.on('error', err => {
    pool1.close();
    // ... error handler
})
 
async function main() {

    await pool1Connect; // ensures that the pool has been created
    try {

      await scheduleTaskWToU();
    } catch (err) {
        logger.error(err);
    }finally{
        pool1.close();
    }
}

const waitFor = delay => new Promise(resolve => setTimeout(resolve, delay));

async function scheduleTaskWToU(){
    const request = pool1.request();
    let i = 100;
     while(i>0){
         let id = Math.floor(Math.random() * 10);
         let delegatorIds = config.delegatorIds;
         let currentDelegator = delegatorIds[id];
         let start_time = new Date().getTime();
        let updateResult = await request.query`UPDATE TOP (1000) tm_ondemandex_task SET STATUS = 'U',lastupdate_time = CURRENT_TIMESTAMP WHERE company_id = 'test_company_guid' AND parent_task_id ='762fac28-55c1-4411-a8b1-5f56c6940ee7' AND status = 'W'`;
         let end_time = new Date().getTime();
         await waitFor(1000);
         i--;
         logger.info(`Current tasks number is ${currentDelegator} ,all tasks are done,cost time is ：${end_time-start_time},update W TO u count result is = ${JSON.stringify(updateResult.rowsAffected[0])}`)
    }
    const result = await request.query('select count(*) from tm_ondemandex_task')
    logger.info(`all tasks are donequery count result is = ${JSON.stringify(result)}`)
}

main();
