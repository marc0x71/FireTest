const express = require('express');
const router = express.Router();
const validate = require('express-validation');
const validation = require('./validation/product-validation');

const { firebaseApp } = require('../firebaseConfig');

const ref = firebaseApp.database().ref('products');

router.get('/', (req, res, next) => {
    console.log("product get");
    res.set('Cache-Control', 'public, max-age=300, s-maxage=600');
    ref.once("value", snap => {
        if (snap.val()==null) {
            res.json({});
        } else {
            var result = [];
            snap.forEach(element => {
                var e = element.val();
                result.push({ id: element.key, name: e.name, category: e.category })
            });
            res.json(result);
        }
    });
});

router.post('/', validate(validation), (req, res, next) => {
    console.log("product post");
    var data = req.body;
    var pushRef = ref.push(data, err => {
        if (err) {
            res.send(err);
            return;
        }
    });
    res.json({ success: true, id: pushRef.key });
});

router.put('/:id', (req, res, next) => {
    console.log("product put");
    var data = req.body;
    ref.child(req.params.id).update(data, err => {
        if (err) {
            res.send(err);
        } else {
            res.json({ success: true, object: data });
        }
    });
});

module.exports = router;
