const express=require('express')
const fs = require('fs');
const Router=express.Router();


const videoFileMap={
    'cdn':'./routes/videos/cdn.mp4',
    'generate-pass':'./routes/videos/generate-pass.mp4',
    'get-post':'./routes/videos/get-post.mp4'
}
Router.get('/videostream/:filename',(req,res)=>{
    const filename=req.params.filename;
    let filePath = videoFileMap[filename];
    if(filename==null){ 
        filePath ='./routes/videos/cdn.mp4' ;}
   
    
    if(!filePath){
        res.send("Not found")
    }
    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
        const chunksize = (end - start) + 1;
        const file = fs.createReadStream(filePath, { start, end });
        const head = {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunksize,
            'Content-Type': 'video/mp4',
        };

        res.writeHead(206, head);
        file.pipe(res);
    } else {
       
        const head = {
            'Content-Length': fileSize,
            'Content-Type': 'video/mp4',
        };
        res.writeHead(200, head);
        fs.createReadStream(filePath).pipe(res);
    }
})
module.exports=Router;