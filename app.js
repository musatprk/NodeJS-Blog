const express= require('express')
const app =express()
const morgan=require('morgan')
const session=require('express-session')
const { resolveInclude } = require('ejs')
const connection=require('./models/models')
app.use(morgan('tiny'))
app.use(express.urlencoded({extended:true}))
app.set('view engine','ejs')
app.use(express.static('public'))
app.listen(3000,()=>{
    console.log("http://localhost:3000/")
})

app.use(session({
  secret: 'Özel-Anahtar',
  resave: false,
  saveUninitialized: true
}));
let usname=""
let password=""

app.get('/',(req,res)=>{
     connection.execute('SELECT * FROM content')
     .then((result)=>{
         res.render('index',{title:'Anasayfa',a:result[0]})
     }).catch((err)=>{
         console.log(err);
     });
})

app.get('/about',(req,res)=>{
    connection.execute('SELECT * FROM about')
    .then((result)=>{
        console.log(result.toString())
        res.render('about',{title:'Hakkımda',a:result[0][0]})
    }).catch((err)=>{
        console.log(err);
    });
})


app.get('/contact',(req,res)=>{
    res.render('contact',{title:'İletişim', a:" "})
})

app.post('/contact',(req,res)=>{
    connection.execute(`insert into contact(contactemail,contactmes) values('${req.body.email}','${req.body.message}')`)
    .then((result)=>{
            res.render('contact',{title:'Yazı Ekle',a:"Mesaj İletildi"})
    }).catch((err)=>{
        console.log(err);
        res.render('contact',{title:'Yazı Ekle',a:"Mesaj İletilemedi Tekrar Deneyiniz"})
    });
})

app.get('/login',(req,res)=>{

    res.render('login',{title:'Giriş Yap',status:" "})
 
})

app.post('/login',(req,res)=>{
    connection.execute(`Select * from users where usname='${req.body.username}' and uspaswrd='${req.body.password}'`)
    .then((result)=>{
            req.session.username=result[0][0].usname;
            req.session.password=result[0][0].uspaswrd;
            usname=req.session.username;
            password=req.session.password;
            if(req.session.username==req.body.username && req.session.password== req.body.password){
               res.redirect('/admin')
            }
            else{
                res.render('login',{title:'Giriş Yap',status:"Giriş Yapılmadı Lütfen Kullanıcı Adınız Ve Şifrenizi Kontrol Ediniz"})
            }
    }).catch((err)=>{
        console.log(err);
         res.render('login',{title:'Giriş Yap',status:"Giriş Yapılmadı Lütfen Kullanıcı Adınız Ve Şifrenizi Kontrol Ediniz"})
        
    });
    
})


app.get('/content/:id',(req,res)=>{
    const id= req.params.id
    connection.execute(`select * from content join comment on content.cid=comment.cid
    where comment.cid='${id}'and content.cid='${id}'`)
    .then((result)=>{
        res.render('content',{title:'İçerik',a:result[0]})
    }).catch((err)=>{
        console.log(err);
    });
})

app.post('/comment',(req,res)=>{
    connection.execute(`insert into comment(cid,comname,comment) values('${req.body.id}','${req.body.nick}','${req.body.comment}')`)
    .then((result)=>{
                console.log("musa")
            res.redirect(`/content/${req.body.id}`)
    }).catch((err)=>{
        console.log(err);
        res.redirect(`/content/${req.body.id}`)
        
    });
})


app.get('/admin',(reg,res)=>{
    if(usname!=null&&password!=null){
    connection.execute('SELECT * FROM content Order By cid DESc')
    .then((result)=>{
        res.render('admin',{title:'Anasayfa',b:result[0]})
    }).catch((err)=>{
        console.log(err);
    });
    }
    else{
        res.redirect("/404")
    }
})


app.get('/add',(reg,res)=>{
    res.render('add',{title:'Yazı Ekle',a:" "})
})

app.post('/add',(req,res)=>{
    connection.execute(`insert into content(chd,con) values('${req.body.header}','${req.body.content}')`)
    .then((result)=>{
            res.render('add',{title:'Yazı Ekle',a:"Yazı Eklendi"})
    }).catch((err)=>{
        console.log(err);
        res.render('add',{title:'Yazı Ekle',a:"Yazı Eklenemedi Tekrar Deneyiniz"})
        
    });
    

})

app.get('/delete/:id',(req,res)=>{
    const id= req.params.id
    connection.execute(`DELETE FROM content WHERE cid='${id}'`)
    .then((result)=>{
        res.render('delete',{title:'Silindi',a:"Yazı Silindi",b:"/admin"})
    }).catch((err)=>{
        console.log(err);
        res.render('delete',{title:'Silindi',a:"Yazı Silenemedi"})
    });
})

app.get('/message',(req,res)=>{
    connection.execute('SELECT * FROM contact')
    .then((result)=>{
        res.render('message',{title:'Mesajlar',a:result[0]})
    }).catch((err)=>{
        console.log(err);
    });
})
app.get('/deletemessage/:id',(req,res)=>{
    const id= req.params.id
    connection.execute(`DELETE FROM contact WHERE contactid='${id}'`)
    .then((result)=>{
        res.render('delete',{title:'Silindi',a:"Yazı Silindi",b:"/message"})
    }).catch((err)=>{
        console.log(err);
        res.render('delete',{title:'Silindi',a:"Yazı Silenemedi",b:"/message"})
    });
})

app.get('/aboutcreate',(req,res)=>{
    connection.execute('SELECT * FROM about')
    .then((result)=>{
        res.render('aboutcreate',{title:'Hakkımda Düzenle',a:result[0][0],b:" "})
    }).catch((err)=>{
        console.log(err);
    });
})

app.post('/aboutcreate',(req,res)=>{
    connection.execute(`UPDATE about SET abhed='${req.body.header}',abcon='${req.body.content}'`)
    .then((result)=>{
            res.redirect('/aboutcreate')
    }).catch((err)=>{
        console.log(err);
        res.redirect('/aboutcreate')
        
    });
    
})
app.get('/logout',(reg,res)=>{
    usname=null;
    password=null;
    res.redirect("/")
})


app.use((req,res)=>{
    res.status(404).render('404',{title:'404'})
})

module.exports=app
