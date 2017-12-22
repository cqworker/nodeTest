var exec = require('child_process').exec;
//
exec('music.bat',function(error,stdout,stderr){
    if(error) {
        console.info('stderr : '+stderr);
    }else{
        console.log("success");
    }
});