const redis = require("redis");
// 端口、IP、密码
let client = redis.createClient("6379", "127.0.0.1", { auth_pass: "123456" });

client.on('ready',function(err){
    console.log('ready');
});


client.on('connect', function () {
    // set 语法
    client.set('name', 'long', function (err, data) {
        console.log(data)
    })
    // get 语法
    client.get('name', function (err, data) {
        console.log(data)
    })

    client.lpush('class',1,function (err,data) {
        console.log(data)
    })

    client.lrange('class',0,-1,function (err,data) {
        console.log(data)
    })
})



