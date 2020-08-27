const config = require("./config/config.json")
const logger = require("./utils/logger")(config);
const db = require("./utils/dbManager1")

db.sql('select count(*) from tm_task_summary',function(err,result){

    var data = result.recordset;//把数据提取出来
  console.log(data)
    if (err) {
        console.log(err);
        return;     }
});

async function insertTaskSummary(){
    // await pool1Connect; // ensures that the pool has been created
    logger.info("start to insert");
    let start_time = new Date().getTime();
    try{
        for(let i=0;i<20;i++){
            let sql = `insert into tm_task_summary(delegator_id,process_id,start_time) values(NEWID (),25,current_timestamp)`;
            for(let i=0;i<49;i++){
                sql = sql+`,(NEWID (),25,current_timestamp)`;
            }
            // logger.info(sql);
            db.sql(sql,function(err,result) {

                var data = result.recordset;//把数据提取出来
                // console.log(data)
                if (err) {
                    console.log(err);
                    return;
                }
            });
        }
        let end_time = new Date().getTime();
        let cost_time = end_time - start_time;
        logger.info(`done task,cost time is ${cost_time}`)
    }catch (e) {
        logger.error(e)
    }
}

db.sql('select count(*) from tm_task_summary',function(err,result){

    var data = result.recordset;//把数据提取出来
    console.log(data)
    if (err) {
        console.log(err);
        return;     }
});

insertTaskSummary();