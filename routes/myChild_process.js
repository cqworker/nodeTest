var exec = require('child_process').exec;
//
exec('python stander.py create',function(error,stdout,stderr){
    //
    if(stdout.length >1){
        console.log('you offer args:',stdout);
    } else {
        console.log('you don\'t offer args');
    }
    //
    if(error) {
        console.info('stderr : '+stderr);
    }
});