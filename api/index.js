const express = require("express");
const app = express();
const cors = require('cors');
const path = require('path');
const Place = require('./models/place');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require("./models/user");
const imageDownloader = require('image-downloader');
const CookieParser = require('cookie-parser');
const fs = require('fs');
const multer = require('multer');
require('dotenv').config()

const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = process.env.JWT_SECRET;
console.log('JWT Secret:', jwtSecret);


app.use(express.json());
app.use(CookieParser());
app.use('/uploads',express.static(path.join(__dirname+'/uploads')));
app.use(cors({
    credentials : true,
    origin : 'http://localhost:5173'
}));

mongoose.connect(process.env.MONGO_URL);

app.get('/test',(req,res)=>{
    res.json('test ok');
});

app.post('/register',async (req,res)=>{
    const {name,email,password} = req.body;
    try{
        const user = await User.create({
            name,
            email,
            password : bcrypt.hashSync(password,bcryptSalt),
        });
        res.json(user);
    } catch(e){
        res.status(422).json({error:e.message});
    }
});

app.post('/login',async (req,res)=>{
    const {email,password}=req.body;
    const user = await User.findOne({email});
    if(user){
        const passOK = bcrypt.compareSync(password,user.password);
        if(passOK){
            jwt.sign({email:user.email,id:user._id},jwtSecret,{},(err,token)=>{
                if(err) throw err;
                res.cookie('token',token).json(user);
            });
           
        }else{
            res.status(422).json({error:'Incorrect password'});
        }
    }else{
        res.status(404).json({error:'User not found'});
    }
});

app.get('/profile',(req,res)=>{
    const {token} = req.cookies;
    if(token){
        jwt.verify(token,jwtSecret,{},async (err,userData)=>{
            if(err) throw err;
            const {name,email,_id}= await User.findById(userData.id);
            res.json({name,email,_id});
        });
    }else{
        res.json(null);
    }
});

app.post('/logout',(req,res)=>{
    res.cookie('token','').json(true);
});

app.post('/upload-by-link',async (req,res)=>{
    const {link} = req.body;
    const newName = 'photo' + Date.now()+'.jpg';
    const destinationPath = path.join(__dirname, 'uploads', newName); 
    try{
        await imageDownloader.image({
            url: link,
            dest: destinationPath,
        });
    console.log('Image downloaded and saved as : ', destinationPath);
    res.json(newName);
    }catch (error) {
        console.error('Error downloading image:', error);
        res.status(500).json({ error: 'Failed to download image' });
    }
});


const photosMiddleware = multer({dest:'uploads/'});
app.post('/upload',photosMiddleware.array('photos',100),(req,res)=>{
    const uploadedFiles = [];
    for(let i=0;i<req.files.length;i++){
        const {path:filePath , originalname} = req.files[i];
        const ext = originalname.split('.').pop();
        const newPath = `${filePath}.${ext}`;
        fs.renameSync(filePath,newPath);
        uploadedFiles.push(path.basename(newPath));
    }
    res.json(uploadedFiles);
});

app.post('/places',(req,res)=>{
    const {token} = req.cookies;
    const {title,address,addedPhotos,description,perks,extraInfo,checkIn,checkOut,maxGuests,price} = req.body;
    jwt.verify(token,jwtSecret,{},async (err,userData)=>{
        if(err) throw err;
        const placeDoc = await Place.create({
            owner:userData.id,
            title,address,photos:addedPhotos,
            description,perks,extraInfo,
            checkIn,checkOut,maxGuests
        });
        res.json(placeDoc);
    }); 
})

app.get('/user-places',(req,res)=>{
    const {token} = req.cookies;
    jwt.verify(token,jwtSecret,{},async(err,userData)=>{
        const {id} = userData;
        res.json(await Place.find({owner:id}));

    });
});

app.get('/places/:id',async (req,res)=>{
    const {id} = req.params;
    try{
        const place = await Place.findById(id);
        if(!place){
            return res.status(404).json({error:'Place not found'});
        }
        res.json(place);
    }catch(err){
        res.status(500).json({error:err.message});
    }
});

app.put('/places',async (req,res)=>{
    const {token} = req.cookies;
    const {id,title,address,addedPhotos,description,perks,extraInfo,checkIn,checkOut,maxGuests,price,} = req.body;
    jwt.verify(token,jwtSecret,{},async(err,userData)=>{
        if(err) throw err;
        const placeDoc = await Place.findById(id);
        if(userData.id === placeDoc.owner.toString()){
            console.log({price});
            placeDoc.set({
                title,
                address,
                photos:addedPhotos,
                description,
                perks,
                extraInfo,
                checkIn,
                checkOut,
                maxGuests,price
            })
            await placeDoc.save();
            res.json('ok');
        }
    });
});

app.get('/places',async(req,res)=>{
    res.json(await Place.find());
})


app.listen(4000);