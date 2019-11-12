let connection = new RTCMultiConnection();

connection.socketURL = 'https://rtcmulticonnection.herokuapp.com:443/';//'localhost:3000'

connection.session = {
    // audio: false,
    video: true,
};

connection.sdpConstraints.mandatory = {
    // offerToReceivaAudio: false,
    offerToReceiveVideo: true
};

connection.mediaConstraints = {
    audio: false,
    video: true
};

var localVideosContainer = document.getElementById('local-videos-container')
var remoteVideosContainer = document.getElementById('remote-videos-container')
let videoTag;
let stream;
connection.onstream = function(event){
    videoTag = event.mediaElement;
    stream = event.stream;
    if(event.type === 'local' && flag){
        localVideosContainer.appendChild(videoTag)
    }

    if(event.type === 'remote' && !flag){
        flag = false;
        remoteVideosContainer.appendChild(videoTag)
        console.log(videoTag.id+'---------------')
    }

};

let roomid = document.getElementById('txt-roomid');

// roomid.value = connection.token();

let flag = false;

document.getElementById('btn-open-or-join-room').onclick = async function(){

    $.get("https://jjapaguri.herokuapp.com/room/"+roomid.value, function(data){
        // flag = response.result;
        flag = data
        console.log(flag)
      });
    
    this.disabled = true;
    connection.openOrJoin(roomid.value || 'predefiend-roomid')
};


//스타트, 엔드 버튼-----------
var saveBtn = document.getElementById('start');
saveBtn.addEventListener("click", async ()=>{
    console.log('start click');
    //mediaRecorder.save();

    // if(remoteStream !== undefined){
    //     var streamFromVideoTag = remoteVideo.captureStream(15); // 15 is frame-rates
    //     recorder = RecordRTC(streamFromVideoTag, {type: 'video'});
    //     recorder.startRecording();
    // }else{
    //     console.log('recorder undefined')
    // }

    recorder = new RecordRTC(stream, {
        type: 'video',
        mimeType: 'video/webm',
    });
    await recorder.startRecording();
    recorder.camera = await stream;
    


})

uploadNum = 1;
var end_A_Btn = document.getElementById('end_A');
end_A_Btn.addEventListener("click", async ()=>{
    console.log('end_A click');
    
    recorder.stopRecording(function() {
        let blob = recorder.getBlob();

        var fileName = roomid.value+'_A_'+uploadNum+'.mkv';
        uploadNum++;
        
        // invokeSaveAsDialog(blob, fileName);

        // get recorded blob

        // we need to upload "File" --- not "Blob"
        var fileObject = new File([blob], fileName, {
            type: 'video/mkv'
        });

        var albumBucketName = "playstyle";
        var bucketRegion = "ap-northeast-2";
        var IdentityPoolId = "ap-northeast-2:e52b3ad7-a28f-4204-8a60-3fa1b2cea79b";

        AWS.config.update({
            region: bucketRegion,
            credentials: new AWS.CognitoIdentityCredentials({
                IdentityPoolId: IdentityPoolId
            })
        });

        // var s3 = new AWS.S3({
        //     apiVersion: "2006-03-01",
        //     params: { Bucket: albumBucketName }
        // });

        // 
        var file = fileObject;
        var fileName = file.name;
        // var albumPhotosKey = encodeURIComponent(albumName) + "/";
        // 예시 videos/test0.mp4
        var photoKey = "videos/" + fileName; 

        // Use S3 ManagedUpload class as it supports multipart uploads
        var upload = new AWS.S3.ManagedUpload({
            params: {
                Bucket: albumBucketName,
                Key: photoKey,
                Body: file,
                ACL: "public-read"
            }
        });

        var promise = upload.promise();

        promise.then(
            function (data) {
                alert("Successfully uploaded photo.");
            },
            function (err) {
                return alert("There was an error uploading your photo: ", err.message);
            }
        );

    });


    // const blob = new Blob(recordedBlobs, {type: 'video/webm'});
    // const url = URL.createObjectURL(blob);
    // const a = document.createElement('a');
    // a.style = 'display: none';
    // a.href = url;
    // a.download = 'test.webm';
    // document.body.appendChild(a);
    // a.click();
    // setTimeout(() => {
    //   document.body.removeChild(a);
    //   window.URL.revokeObjectURL(url);
    // }, 100);

    

});

//B승
var end_B_Btn = document.getElementById('end_B');
end_B_Btn.addEventListener("click", async ()=>{
    console.log('end_B click');
    
    recorder.stopRecording(function() {
        let blob = recorder.getBlob();

        var fileName = roomid.value+'_B_'+uploadNum+'.mkv';
        uploadNum++;
        
        // invokeSaveAsDialog(blob, fileName);

        // get recorded blob

        // we need to upload "File" --- not "Blob"
        var fileObject = new File([blob], fileName, {
            type: 'video/mkv'
        });

        var albumBucketName = "playstyle";
        var bucketRegion = "ap-northeast-2";
        var IdentityPoolId = "ap-northeast-2:e52b3ad7-a28f-4204-8a60-3fa1b2cea79b";

        AWS.config.update({
            region: bucketRegion,
            credentials: new AWS.CognitoIdentityCredentials({
                IdentityPoolId: IdentityPoolId
            })
        });

        // var s3 = new AWS.S3({
        //     apiVersion: "2006-03-01",
        //     params: { Bucket: albumBucketName }
        // });

        // 
        var file = fileObject;
        var fileName = file.name;
        // var albumPhotosKey = encodeURIComponent(albumName) + "/";
        // 예시 videos/test0.mp4
        var photoKey = "videos/" + fileName; 

        // Use S3 ManagedUpload class as it supports multipart uploads
        var upload = new AWS.S3.ManagedUpload({
            params: {
                Bucket: albumBucketName,
                Key: photoKey,
                Body: file,
                ACL: "public-read"
            }
        });

        var promise = upload.promise();

        promise.then(
            function (data) {
                alert("Successfully uploaded photo.");
            },
            function (err) {
                return alert("There was an error uploading your photo: ", err.message);
            }
        );

        
    });


    // const blob = new Blob(recordedBlobs, {type: 'video/webm'});
    // const url = URL.createObjectURL(blob);
    // const a = document.createElement('a');
    // a.style = 'display: none';
    // a.href = url;
    // a.download = 'test.webm';
    // document.body.appendChild(a);
    // a.click();
    // setTimeout(() => {
    //   document.body.removeChild(a);
    //   window.URL.revokeObjectURL(url);
    // }, 100);

    // get recorded blob
    var blob = recorder.getBlob();
    // generating a random file name
    var fileName = 'B.mkv';
    console.log(1);
    // we need to upload "File" --- not "Blob"
    var fileObject = new File([blob], fileName, {
        type: 'video/mkv'
    });
    console.log(2);
    var formData = new FormData();
    // recorded data
    await formData.append('video-blob', fileObject);
    // file name
    await formData.append('video-filename', fileObject.name);
    
    var upload_url = 'http://ec2-15-164-228-137.ap-northeast-2.compute.amazonaws.com/efspoint/videos/';
    
    console.log(3);
    // upload using jQuery
    $.ajax({
        url: upload_url, // replace with your own server URL
        data: formData,
        cache: false,
        contentType: false,
        processData: false,
        crossOrigin: true,
        type: 'POST',
        success: function(response) {
            alert('업로드 성공!'); // error/failure
        }
    });

});


var add_A_Btn = document.getElementById('add_A');
add_A_Btn.addEventListener("click", async ()=>{
    $.post("https://jjapaguri.herokuapp.com/score/A/", function(data){
        console.log('A 득점!!')
      });
});

var add_B_Btn = document.getElementById('add_B');
add_B_Btn.addEventListener("click", async ()=>{
    $.post("https://jjapaguri.herokuapp.com/score/B/", function(data){
        console.log('B 득점!!')
      });
});

var reset_Btn = document.getElementById('reset');
reset_Btn.addEventListener("click", async ()=>{
    $.post("https://jjapaguri.herokuapp.com/score/reset/", function(data){
        console.log('점수 Reset!!')
      });
});


setInterval(function(){
    $.get("https://jjapaguri.herokuapp.com/score/", function(data){
        // flag = response.result;
        score = data
        console.log(score)
      });
}, 2000);