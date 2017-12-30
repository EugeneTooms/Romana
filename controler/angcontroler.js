var express = require('express');
var router = express.Router();
var path = require('path');

//Majne modžuls
var config = require('../config');
var kon = config.getDBconnection();

/*select
    articles.id
    articles.name,
	art_show_gr.naziv,
	bot_inventura_in_out.ulazi,
	bot_inventura_in_out.izlazi
from 
	articles, art_show_gr, bot_inventura_in_out
where 
	articles.prikaz_group_id = art_show_gr.id 
order by 
    art_show_gr.naziv, articles.name;*/


/*select  
	art_show_gr.naziv,
	articles.name,
	articles.id
from 
	articles, art_show_gr
where 
articles.prikaz_group_id = art_show_gr.id
union all
select  
	naziv,
	null as name,
	null as id
from 
	art_show_gr
order by 
naziv, name;
bot_inventura_in_out

*/
router.get('/inventura/artikli', function(req, res, next){
    kon.query(`select
    articles.id,
    articles.name,
	art_show_gr.naziv as grupa,
    ROUND((bot_inventura_in_out.ulazi - bot_inventura_in_out.izlazi ), 2 ) as  postojece_stanje,
	ROUND(bot_inventura_in_out.ulazi, 2),
	ROUND(bot_inventura_in_out.izlazi, 2)
from 
	articles, art_show_gr, bot_inventura_in_out
where 
	articles.prikaz_group_id = art_show_gr.id && articles.id = bot_inventura_in_out.article_id
order by 
    art_show_gr.naziv, articles.name`,
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
router.get('/grupeartikala', function(req, res, next){
    kon.query(`SELECT * FROM ugo.art_show_gr`,
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
router.get('/dobavljaci', function(req, res, next){
    kon.query('SELECT * from suppliers',
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

router.post('/inventura', function(req, res, next){
    console.log(req.body);
        kon.query('INSERT INTO inventura SET ?', req.body,
        function(error, results){
                if(error) {
                    return res.status(500).json({
                        title: 'An error has occured',
                        error : error
                    });
                }			
                res.status(200).json({
                    message: 'Inventura spremljena',
                    obj: results
                });
            }
        );
    // return res.status(201).json({
    //     message : 'Inventura spremljena',
    //     obj : req.body.content
    // });
});

// router.get('/articles', function(req, res, next){
//     kon.query('SELECT * from articles',
//         function(error, results){
//                 if(error) {
//                     return res.status(500).json({
//                         title: 'An error has occured',
//                         error : error
//                     });
//                 }			
//                 res.status(200).json({
//                     message: 'Success',
//                     obj: results
//                 });
//         }
//     );
// });
// router.get('/receivingitems/:id', function(req, res, next){
    
//     kon.query('SELECT * from receiving_items WHERE receiving_id = ' + req.params.id,
//         function(error, results){
//                 if(error) {
//                     return res.status(500).json({
//                         title: 'An error has occured',
//                         error : error
//                     });
//                 }			
//                 res.status(200).json({
//                     message: 'Success',
//                     obj: results
//                 });
//         }
//     );
// });
// router.get('/receivings_list', function(req, res, next){
    
//     kon.query('SELECT * from receivings',
//         function(error, results){
//                 if(error) {
//                     return res.status(500).json({
//                         title: 'An error has occured',
//                         error : error
//                     });
//                 }			
//                 res.status(200).json({
//                     message: 'Success',
//                     obj: results
//                 });
//         }
//     );
// });

// router.post('/article', function(req, res, next){
//     console.log(req.body);
//     res.status(200).json({
//         message : 'Success',
//         obj : req.body.content
//     });
//     // kon.query('INSERT INTO articles SET ?', req.body,
//     //     function(error, results){
//     //             if(error) {
//     //                 return res.status(500).json({
//     //                     title: 'An error has occured',
//     //                     error : error
//     //                 });
//     //             }			
//     //             res.status(200).json({
//     //                 message: 'Success',
//     //                 obj: results
//     //             });
//     //     }
//     // );
// });

module.exports = router;