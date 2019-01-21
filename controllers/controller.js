
var parse = require('csv-parse');
var request= require('request');
var s3= require('../Database/awsS3.js');
var appSetting = require('../staticfile/app.setting.json');

const controller ={
    readCsvAsStream: async function(keyName)   {

      return new Promise(function(resolve,reject){  
        var csvData =[];
        const parser = parse({
          delimiter: ','
        }) 
         var getParams = {
            Bucket: appSetting.S3Bucket,
            Key: keyName
        }
        

        //Fetch or read data from aws s3
        s3.getObject(getParams).createReadStream().pipe(parser)
            .on('data', function(csvrow) {
                //do something with csvrow
                let obj ={};
                obj.id=csvrow[0],
                obj.prop1=csvrow[1],
                obj.prop2=csvrow[2],
                obj.prop3=csvrow[3],
                obj.prop4=csvrow[4],
                obj.prop5=csvrow[5],
                obj.prop6=csvrow[6],
                obj.prop7=csvrow[7],
                obj.prop8=csvrow[8],
                obj.prop9=csvrow[9],

                csvData.push(obj);
            })
            .on('end',function() {
              //do something wiht csvData
              resolve(csvData);
            })
            .on('error', function(error) {
              reject(error);
            });
        })  

    },
    saveFilesToS3: function(elasticData,logName){
      return new Promise(function(resolve,reject){  
        var currentDate= new Date();
        var fileName=logName+"_"+currentDate.toJSON()+".json"
        const params = {
          Bucket: appSetting.S3Bucket, // pass your bucket name
          Key: appSetting.S3FolderName+fileName, // file will be saved as testBucket/contacts.csv
          Body: JSON.stringify(elasticData)
          };
          s3.upload(params, function(s3Err, data) {
              if (s3Err) reject(s3Err);
              var resultObj={
                "bucket":appSetting.S3Bucket,
                "key":appSetting.S3FolderName+fileName,
                "location":data.Location
              }
              resolve(resultObj);
          });
        });  
    },
    readJsonFromS3 : function(keyName){
        return new Promise(function(resolve,reject){  
                var getParams = {
                    Bucket: appSetting.S3Bucket,
                    Key: keyName
                }

                s3.getObject(getParams,function(err,data){
                    if(err) reject(err);
                    var json = JSON.parse(new Buffer(data.Body).toString("utf8"));
                    resolve(json);
                }) 
        })  
    }
}

module.exports=controller;