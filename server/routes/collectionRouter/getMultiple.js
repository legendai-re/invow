module.exports = function getMultiple (req, res) {

    var async       = require('async');
	var visibility  = require('../../models/collection/visibility.json');
    var sortTypes   = require('../../models/customSort/sortTypes.json');
    var lifeStates  = require('../../models/lifeStates.json');
    var models      = require('../../models');

	var rq = req.query;
    var customSort = false;

    if(rq._author && rq.custom_sort){
        var skip = rq.skip ? parseInt(rq.skip) : 0;
        var limit = rq.limit ? parseInt(rq.limit) : 8;
        models.CustomSort.findOne({ _user: rq._author, type: sortTypes.MY_COLLECTIONS.id},{ ids : { $slice : [skip , limit] } }, function(err, customSort){
            var q = models.Collection.find({_id: {$in: customSort.ids} });
            q.populate('_thumbnail');
            q.populate({
                path: '_author',
                populate: { path: '_avatar' }
            });
            q.exec(function(err, collections){
                for(var i in collections){
                    collections[i].position = customSort.ids.indexOf(collections[i]._id) + skip;
                }
                res.json({data: collections});
            });
        })
    }else{
    	getQueryFiler(rq, req, function(filterObj){
    		var q = models.Collection.find(filterObj).limit(20);
            q.where('lifeState').equals(lifeStates.ACTIVE.id);

    		q.populate('_thumbnail');
    		q.populate({
                path: '_author',
                populate: { path: '_avatar' }
            });

            if(rq.sort_field && rq.sort_dir && (parseInt(rq.sort_dir)==1 || parseInt(rq.sort_dir)==-1)){
                var sortObj = {};
                sortObj[rq.sort_field] = parseInt(rq.sort_dir);
                q.sort(sortObj);
            }

    		if(rq.skip)
    			q.skip(parseInt(rq.skip));

    		if(rq.limit)
    			q.limit(parseInt(rq.limit));

    		q.exec(function(err, collections){
    	    	if (err) {console.log(err); res.sendStatus(500); return;}
                if(req.user){
                    addIsStarred(req.user, collections, function(collectionsResult){
                        res.json({data: collections});
                    })
                }else{
                    res.json({data: collections});
                }
    	    });
    	})
    }

	function getQueryFiler(rq, req, callback){
		var filterObj = {};

        if(!rq.search)
            filterObj.depth = 0;
		if(rq.search)
			filterObj.title = { $regex:  '.*'+decodeURIComponent(rq.search)+'.*', $options: 'i'};
        if(rq.isFeatured)
            filterObj.isFeatured = true;
        if(rq.isOnDiscover)
            filterObj.isOnDiscover = true;

		if(rq._author){
			filterObj._author = rq._author;
			if(req.user && req.user.isGranted('ROLE_USER'))
				filterObj.$or = [{visibility: visibility.PUBLIC.id}, {_author: req.user._id}]
			else
				filterObj.visibility = visibility.PUBLIC.id;
			callback(filterObj);
		}else if(rq._starredBy){
			getStarredByQuery(rq, req, function(starredByQuery){
				callback(starredByQuery);
			})
		}else{
			filterObj.visibility = visibility.PUBLIC.id;
			callback(filterObj);
		}
	}

	function getStarredByQuery(rq, req, callback){
		var filterObj = {};
		models.Star.find({_user: rq._starredBy}).exec(function (err, stars){
			if (err) {console.log(err); res.sendStatus(500); return;}
			if(!req.user || req.user._id != rq._starredBy)
				filterObj.visibility = visibility.PUBLIC.id
            var ids = [];
            for(var i in stars)
                ids.push(stars[i]._collection)
			filterObj._id = {$in: ids};
			callback(filterObj);
		});
	}

    function addIsStarred(user, collections, callback){
        async.times(collections.length, function(n, next) {
            models.Star.findOne({_user: user._id, _collection: collections[n]._id}, function(err, star){
                if(star)next(err, star);
                else next(err, null);
            })
        }, function(err, results) {
            for(var i in results){
                collections[i]._star = results[i];
            }
           callback(collections);
        });
    }
}
