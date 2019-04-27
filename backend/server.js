const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 5000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));




app.post('/api/wordBubble', (req, res) => {
  var fs = require('fs');
  console.log(req.body);
  var fileRequest = req.body.post;
  var keywordRequest = req.body.keyword;
  var wordRequested = req.body.word;
  var fileName = '';
  fileName = 'wco';
  if(fileRequest =='twitter'){
    fileName = fileName + '-tweets-'+ keywordRequest;
  }
  else if(fileRequest =='nyt'){
    fileName = fileName +  '-nyt-' + keywordRequest;
  }
  else{
    fileName = fileName +  '-cc-' + keywordRequest;
  }

  console.log(fileName);

  fs.readFile(fileName, 'utf8', function(err, contents) {
    var result = [];
    rows =  contents.split("\n");
    var count = 0 ;
    for (var i = 0 ; i< rows.length -1  ; i ++ ){
          rowData =  rows[i].split("\t");
          var dict = {};
          s = rowData[0].split(",");
          if(s[0].slice(1, s[0].length) == wordRequested){
            dict['label'] = s[1].slice(0, s[1].length-1);
            dict['value'] = parseInt(rowData[1], 10);
           result.push(dict);
           count  ++;
           if(count == 15 ){
             break;
           }
          }
    console.log(result);

    }

    var jsonObj = {"wordData" : result }
    res.json( jsonObj);
    });
});

app.post('/api/wordcloud', (req, res) => {
  var fs = require('fs');
  var fileRequest = req.body.post;
  var keywordRequest = req.body.keyword;
  var fileName = 'wordcount';
  var count = req.body.count;
  var cloudType = req.body.wordCloudType;
  var a = 40
  var b = 150
  if(cloudType == 'large data'){
    var a = 30
    var b = 150
    if(fileRequest =='twitter'){
      fileName = fileName + '-tweets-'+ keywordRequest;
    }
    else if(fileRequest =='nyt'){
      fileName = fileName +  '-nyt-' + keywordRequest;
    }
    else{
      fileName = fileName +  '-cc-' + keywordRequest;
    }
  }else{
    var a = 30
    var b = 80
    if(fileRequest =='twitter'){
      fileName = 's-'+fileName + '-tweets-'+ keywordRequest;
    }
    else if(fileRequest =='nyt'){
      fileName = 's-'+fileName +  '-nyt-' + keywordRequest;
    }
    else{
      fileName = 's-'+fileName +  '-cc-' + keywordRequest;
    }
  }



  console.log(fileName);

  fs.readFile(fileName, 'utf8', function(err, contents) {
    var result = [];
    rows =  contents.split("\n");
    first =  rows[0].split("\t");
    var max= parseInt(first[1], 10);

    var diff = b-a
    last =  rows[count-1].split("\t");
    var min= parseInt(last[1], 10);
    var denom = max - min
    for (var i = 0 ; i < count ; i ++){
          rowData =  rows[i].split("\t");
          var dict = {};
          dict['text'] = rowData[0];
          var currentVal = parseInt(rowData[1], 10)
          var num = diff * (currentVal - min)
          var rVal = (num/denom) + a
          dict['value'] =rVal ;

          result.push(dict)
    }

    var jsonObj = {"wordData" : result }
    res.json( jsonObj);
    });


});

app.listen(port, () => console.log(`Listening on port ${port}`));
