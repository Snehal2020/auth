const notfound = (req,res,next)=>{
    const error=new Error(`Rout not found ${req.originalUrl}`);
    res.status(404);
    next(error);
}

const handleError = (err,req,res,next)=>{
    const statuscode=(res.statusCode)?res.statusCode:500;
    res.status(statuscode);
    res.json({
        status:false,
        message:err?.message,
        stack:err?.stack
    })
   
}

module.exports={notfound,handleError}