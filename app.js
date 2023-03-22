const express = require("express");

const mongoose = require("mongoose");

const _ = require("lodash");

const bodyParser = require("body-parser");

const app = express();


app.use(bodyParser.urlencoded({extended:true}));

app.listen(3000,()=>{
    console.log("服务器已在端口3000启动");
});

async function Main(){
    await mongoose.connect("mongodb+srv://melrain:wszy1989@cluster0.azcsaaz.mongodb.net/wikiDB").then(()=>{
        console.log("与数据库的连接已成功");
    }).catch((error)=>{
        console.log("数据库连接错误："+error);
    })
};

Main();

const Articles = mongoose.model("article",{
    title:String,
    content:String
})



////////////////Get all articles//////////////////

app.route("/articles").get((req,res)=>{
    Articles.find({}).then((result)=>{
        console.log(result);
        res.send(result);
    }).catch((error)=>{
        console.log(error);
    })
}).delete((req,res)=>{
    Articles.deleteMany({}).then((result)=>{
        console.log(result);
        res.send("成功删除所有数据");
    }).catch((error)=>{
        console.log(error);
        res.send("删除数据失败");
    });
}).post((req,res)=>{
    const userParams = req.body.userParams;
    const articleContent = req.body.articleContent;

    Articles.findOne({title:userParams}).then((result)=>{
        console.log("查询到的数据为:"+result)
        console.log("result为:"+result);
        if(result === null){
            Articles.insertMany({
                title:userParams,
                content:articleContent
            }).then(()=>{
                console.log("成功插入文章，标题为："+userParams);
                res.send("已成功提交文章，请耐心等待审核，谢谢！");
            }).catch((error)=>{
                console.log(error);
                res.send(error);
            });
        }else{
            console.log("已有相同的文章，请勿重复提交");
            res.send("已有相同标题的文章,请勿重复提交，或者更改标题再次提交");
        }
    })
});

//////////////for specific article////////////////////

app.route("/articles/:userParams",(req,res)=>{
    
}).get((req,res)=>{
    const userParams = req.params.userParams;
    Articles.findOne({title:userParams}).then((result)=>{
        if(result === null){
            console.log("未找到相关文章，请重新查询");
            res.send("未找到相关文章，请重新查询");
        }else{
            console.log("找到文章:"+result);
            res.send(result);
        }
    }).catch((error)=>{
        res.send(error);
        console.log(error);
    })
}).put((req,res)=>{
    const userParams = req.params.userParams;
    const updateContent = req.body.updateContent;
    Articles.findOne({title:userParams}).then((result)=>{
        if(result === null){
            console.log(`未找到${userParams}相关文章`);
            res.send(`未找到${userParams}相关文章`);
        }else{
            Articles.findOneAndUpdate({title:userParams},{$set:{
                content:updateContent
            }}).then(()=>{
                console.log("已修改文章内容:"+updateContent);
                res.send("已修改文章内容:"+updateContent);
            }).catch((error)=>{
                console.log(error);
            })
        }
    }).catch((error)=>{
        console.log(error);
    })
})