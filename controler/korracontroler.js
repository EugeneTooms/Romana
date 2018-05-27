var express = require('express');
var router = express.Router();
var path = require('path');
var moment = require('moment-timezone');

//Majne modžuls
var config = require('../config');
var kon = config.getDBconnection();
/* GET FUNKCIJE */
router.get('/lokacije', function(req, res, next){
    kon.query(`
    SELECT * FROM bot_locations ORDER BY pozicija
    `,
        function(error, results){
                if(error) {
                    return res.status(500).json({
                        title: 'An error has occured',
                        error : error
                    });
                }			
                res.status(200).json({
                    message: 'Success',
                    obj: results
                });
        }
    );
});
router.get('/artikli', function(req, res, next){
    kon.query(`
    SELECT bot_location_articles.article_id, bot_location_articles.location_id, bot_location_articles.indeks, bot_inventura_detail.inventory_id, bot_inventura_detail.kolicina, bot_articles_details.article_name, bot_articles_details.img_src
    FROM bot_location_articles
    LEFT JOIN bot_inventura_detail ON (
    bot_inventura_detail.inventory_id = (SELECT  MAX(bot_inventura_detail.inventory_id) FROM bot_inventura_detail 
    WHERE bot_inventura_detail.location_id = bot_location_articles.location_id) &&
    bot_inventura_detail.article_id = bot_location_articles.article_id && 
    bot_inventura_detail.location_id = bot_location_articles.location_id)
    LEFT JOIN bot_articles_details ON bot_articles_details.article_id = bot_location_articles.article_id
    ORDER BY location_id, indeks
    `,
        function(error, results){
                if(error) {
                    return res.status(500).json({
                        title: 'An error has occured',
                        error : error
                    });
                }			
                res.status(200).json({
                    message: 'Success',
                    obj: results
                });
        }
    );
});
/* POST FUNKCIJE */
router.post('/ionicinventura', function(req, res, next){
    var artikli = [];
    var master = [];
    var lokacije = [];
    var jsonartikli = req.body.artikli;
    var datum = moment(req.body.datum).format('YYYY-MM-DD HH:mm:ss');
    for(var i = 0; i < jsonartikli.length; i++) {
        if(!lokacije.includes(jsonartikli[i].lokacija_id)) {
            lokacije.push(jsonartikli[i].lokacija_id);
        }
    }
    for (let i=0;i<lokacije.length; i++){
        master.push([jsonartikli[0].inventory_id+1,
            lokacije[i],
            datum
            ]);
    }   
    for (let i=0;i<jsonartikli.length; i++){
        artikli.push([jsonartikli[0].inventory_id+1,
            jsonartikli[i].lokacija_id,
            jsonartikli[i].id,
            jsonartikli[i].kolicina,
        ]);
    }
    kon.query('INSERT INTO bot_inventura_master VALUES ?', [master],
    function(error, results){
            if(error) {
                return res.status(500).json({
                    title: 'An error has occured',
                    error : error
                });
            }
            kon.query('INSERT INTO bot_inventura_detail VALUES ?', [artikli],
            function(error, results){
                    if(error) {
                        return res.status(500).json({
                            title: 'An error has occured',
                            error : error
                        });
                    }			
                    res.status(201).json({
                        message: 'Inventura spremljena',
                        obj: results
                    });
            }
            );		
        }
    );
});

module.exports = router;