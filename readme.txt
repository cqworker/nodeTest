 bin： 是真实的执行程序 bin目录下的www文件打开后可以修改端号，一般默认是3000。
 node_modules：存放所有的项目依赖库
 public：静态文件(css,js,img)
 views：页面文件
 routes：路由文件
 app.js，程序启动文件
 package.json：项目依赖配置及开发者信息



 jade 模板语言:
-var data = {"1":"1","2":"2"}
p #{data}
ul
each val, index in data
    li= index + ': ' + val



如何创建对象，目前了解到的可以和mgdb结合,如何使用mysql,和为什么mgdb的使用会大大多余mysql
    var userSchema = new mongoose.Schema({
        name: { type: String, required: true },
        email: { type: String, unique: true, required: true },
        hash: String,
        salt:String,
        createdOn: {
            type: Date,
            default: Date.now
        }
    });
    mongoose.model('User', userSchema);
