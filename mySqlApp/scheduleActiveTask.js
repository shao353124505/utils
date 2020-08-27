const sql = require('mssql')
const config = require("./config/config.json")
const logger = require("./utils/logger")(config);
const {v4: uuidv4} = require('uuid');
logger.info("Hello world, This is an app to connect to sql server.");

const pool1 = new sql.ConnectionPool(config.dbConfig_pool);
const pool1Connect = pool1.connect();
const delegator_number = 70;

pool1.on('error', err => {
    pool1.close();
    // ... error handler
})

const waitFor = delay => new Promise(resolve => setTimeout(resolve, delay));

async function main() {
    await pool1Connect; // ensures that the pool has been created
    let result_no_order_by = [];
    let result_no_order_by_cost=0;
    let result_order_by = [];
    let result_order_by_cost=0;
    try {
        // await subTask(true);
        //  await subTask(false);
         let tasks = [];
            for(let i=1;i<150;i++){
                tasks.push(subTask(config.delegatorIds[i],false));
            }
            result_no_order_by = await Promise.all(tasks);
            //result_order_by = await Promise.all([subTask(config.delegatorIds[i+2],true),subTask(config.delegatorIds[i+3],true)])

        result_no_order_by.forEach(time=>{
            result_no_order_by_cost +=time
        });
        result_order_by.forEach(time=>{
            result_order_by_cost +=time
        });
        logger.info(`cost_time array = ${result_no_order_by}`);
        logger.info(`total result_no_order_by cost_time = ${result_no_order_by_cost}`);
        logger.info(`cost_time array = ${result_order_by}`);
        logger.info(`total result_order_by cost_time = ${result_order_by_cost}`);


    } catch (err) {
        logger.error(err);
    } finally {
        pool1.close();
    }
}

function getAllDelegatorIds() {
    return config.delegatorIds;
}

async function subTask(currentDelegator,isOrderBy) {
    const request = pool1.request();
     let updateTopN = 10;
    // let id = Math.floor(Math.random() * 10);
    // // logger.info(`Current delegator id is ${id}`)
    // let delegatorIds = getAllDelegatorIds();
    // // logger.info(`Current delegator id is ${JSON.stringify(delegatorIds)}`)
    // let currentDelegator = delegatorIds[id];
    let start_time = new Date().getTime();
    let doBulkTasksResult = "";
    try{
        if (isOrderBy) {
            // for(let i=0;i<20;i++){
                doBulkTasksResult = await request.query`update tm_ondemandex_task set status='A',executed_times=executed_times+1, start_time=CURRENT_TIMESTAMP, delegator_id=${currentDelegator} WHERE  task_id in (select top(${updateTopN})  task_id from tm_ondemandex_task where status in ('U', 'F') AND task_type=2 order by lastupdate_time )`;

            // }//  doBulkTasksResult = await request.query`update m set status='A',executed_times=executed_times+1, start_time=CURRENT_TIMESTAMP, delegator_id=${currentDelegator} from (select top(${updateTopN})  status,executed_times, start_time, delegator_id from tm_ondemandex_task where status in ('U', 'F') AND task_type=2 order by lastupdate_time) m`;
        }else{
            // for(let i=0;i<20;i++){
            // let time = Math.floor(Math.random() * 10)
            // await waitFor(time*1000);
                doBulkTasksResult = await request.query`update top (${updateTopN}) tm_ondemandex_task set status='A',executed_times=executed_times+1, start_time=CURRENT_TIMESTAMP, delegator_id=${currentDelegator} where status in ('U', 'F') AND task_type=2 AND executed_times<max_executed_times`;
            // }
        }
    }catch (e) {
        logger.error(e);
    }
    let end_time = new Date().getTime();
    let cost_time = end_time - start_time;
    // const result = await request.query("select count(*) from tm_ondemandex_task where status ='A'")
    logger.info(`Current delegator id is ${currentDelegator} ,all tasks are done,orderBy is ${isOrderBy},cost time is ：${cost_time}, query count result is = ${JSON.stringify(doBulkTasksResult)}`);
    return cost_time;
}

async function insertTaskSummary(){
    await pool1Connect; // ensures that the pool has been created
    logger.info("start to insert");
    let start_time = new Date().getTime();
    try{
        const request = pool1.request();
        for(let i=0;i<25;i++){
            let sql = `insert into tm_task_summary(delegator_id,process_id,start_time) values(NEWID (),25,current_timestamp)`;
            for(let i=0;i<5;i++){
                sql = sql+`,(NEWID (),25,current_timestamp)`;
            }
            logger.info(sql);
            await request.query`${sql}`;
        }
        let end_time = new Date().getTime();
        let cost_time = end_time - start_time;
        logger.info(`done task,cost time is ${cost_time}`)
    }catch (e) {
        logger.error(e)
    }
}

async function insertTaskSummary_one_by_one(){
    await pool1Connect; // ensures that the pool has been created
    logger.info("start to insert");
    let start_time = new Date().getTime();
    try{
        const request = pool1.request();
        for(let i=0;i<1000;i++){
                await request.query`insert into tm_task_summary(delegator_id,process_id,start_time) values(NEWID (),25,current_timestamp)`;
        }
        let end_time = new Date().getTime();
        let cost_time = end_time - start_time;
        logger.info(`on by one done task,cost time is ${cost_time}`)
    }catch (e) {
        logger.error(e)
    }
}

 insertTaskSummary_one_by_one();
//insertTaskSummary()

// main();
