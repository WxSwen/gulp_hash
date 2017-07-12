var through = require('through2'); //处理stearm流
var fs = require("fs"); //文件系统
var crypto = require('crypto');//node hash


function version(ops)
{
    ops || (ops = {});
    ops.placeHolder || (ops.placeHolder = "_v_");
    function _version(file, enc, cb){
        var html = String(file.contents);
        //获取版本号
        /*var regex = new RegExp("\\?("+ops.placeHolder+"=.*?)\"","igm");
        ops.version || (ops.version = new Date().getTime());
        var versionStr = "?"+ops.placeHolder+"="+ops.version+"\"";
        html = html.replace(regex,versionStr);*/
        var regex = new RegExp("(href=\"|src=\")(.*?)\\?"+ops.placeHolder+"=.*?\"","igm");
        var result = null;
        var timestamp = new Date().getTime();
        while((result = regex.exec(html)) != null){
            var version = "";
	          var source = result[2].replace("{{jsDomain}}","").replace("{{cssDomain}}","");
            if(source.indexOf("{{") >= 0){
                version = ops.version || timestamp;
            }else{
                version = ops.version || 
                            crypto.createHash('md5')
                                .update(fs.readFileSync("src"+source,"utf8"))
                                .digest('hex');
            }
            html = html.replace(result[0],result[0].replace(new RegExp("\\?"+ops.placeHolder+"=.*?\""),"?"+ops.placeHolder+"="+version+"\""));
        }

        file.contents = new Buffer(html);
        cb(null,file);
    }
    return through.obj(_version);
}

module.exports = version;
