const express = require('express');
const cors = require('cors');
const static = require('./modules/static');
const session = require('express-session');
const app = express();
const port = process.env.PORT || 3030
const listen = () => console.log(`Starting on http://localhost:${port}`);
app.set('view engine', 'ejs');
app.set('views', './views')
app.listen(port,listen());
app.use(cors());
app.use(static('../public'))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: 'secret',
}));

// Step 2
app.use(require('./middlewares/cart'))

//Código que deben colocar en el main.controller - método addCart
    // Step 3
    addCart: (req,res) => {
        // Find Product in DB
        let product = one(req.body.id)
        // Check product exist in cart - Aquí lo programa diferente pero es lo mismo
        if(req.session.cart.find(item => item.id == product.id)){
            // Case 1: Exist and update quantity
            req.session.cart = req.session.cart.map(item => {
                if(item.id == product.id){
                    item.quantity = item.quantity + 1
                }
                return item
            })
        }else{
            // Case 2: Add cart and set quantity
            req.session.cart.push({...product,quantity:1})
        }
        return res.redirect('/')
    },

app.use(require('./routes/main.routes'))
app.use('/checkout',require('./routes/checkout.routes'))