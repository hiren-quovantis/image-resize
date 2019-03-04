'use strict';

const AWS = require('aws-sdk');
var s3 = new AWS.S3({
    accessKeyId: "<Your AWS Access Key Id>",
    secretAccessKey: "<Your AWS Secret Access Key>"
  });
const Sharp = require('sharp');

const BUCKET = "test-meetup-bucket/";

exports.handler = function(event, context, callback) {
	
	
	
	var srcBucket = event.Records[0].s3.bucket.name;
    // Object key may have spaces or unicode non-ASCII characters.
    var srcKey    = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, " "));  
    var dstBucket = srcBucket + "/thumbnails-200x200";
    var dstKey    = "resized-" + srcKey;
	
  console.log(srcBucket);
	console.log(dstBucket);
	
  const key = event.FileName;

  const width = 20;
  const height = 20;

  s3.getObject({Bucket: srcBucket, Key: srcKey}).promise()
    .then(data => Sharp(data.Body)
      .resize(width, height)
      .toFormat('png')
      .toBuffer()
    )
     .then(buffer => s3.putObject({
         Body: buffer,
         Bucket: dstBucket,
         ContentType: 'image/png',
         Key: dstKey,
       }).promise()
     )
    .then(() => callback(null, "Completed Successfully"))
    .catch(err => callback(err))
}
