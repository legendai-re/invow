module.exports = function post (req, res) {

    var mongoose        = require('mongoose');
    var itemTypes       = require('../../models/item/itemTypes.json');
    var Collection      = mongoose.model('Collection');
    var Item            = mongoose.model('Item');
    var ItemUrl         = mongoose.model('ItemUrl');
    var ItemYoutube     = mongoose.model('ItemYoutube');
    var ItemImage       = mongoose.model('ItemImage');
    var ItemTweet       = mongoose.model('ItemTweet');

    if(!req.body._collection || !req.body.type || !typeOk(req.body.type)){
        res.status(400).send({ error: 'some required parameters was not provided'});
        res.end();
    }else{
        var item =  new Item();
        if(req.body.description){
            item.description = req.body.description;
        }
        item.type = req.body.type.id;
        Collection.findById(req.body._collection, function(err, collection){
            if(err) {console.log(err); res.sendStatus(500); return;}
            if(!collection) {res.status(400).send({ error: "cannot find collection with id: "+req.body._collection }); return;}
            if(collection._author!=req.user._id) {res.status(401).send({ error: "only the author of the collection can add item" }); return;}

            createItemContent(item, req, function(err, content){
                if (err){res.status(400).send({ error: "error while creating item content"}); return;}
                item._content = content._id;
                collection.addItem(item, function(err, item){
                    if(err) {console.log(err); res.sendStatus(500); return;}
                    res.json({data: item});
                });
            });

        });
    }

    function typeOk(reqType){
        if(itemTypes[reqType.id] != null)
            return true;
        return false;
    }

    function createItemContent(item, req, callback){
        switch(item.type){
            case itemTypes.URL.id:
                return createItemUrl(req, callback);
            case itemTypes.IMAGE.id:
                return createItemImage(req, callback);
            case itemTypes.YOUTUBE.id:
                return createItemYoutube(req, callback);
            case itemTypes.TWEET.id:
                return createItemTweet(req, callback);
            default:
                callback('Unknow itemType', item);
        }
    }

    function createItemUrl(req, callback){
        if(!req.body._content || !req.body._content.url){
            callback("itemUrl : some required parameters was not provided", null);
            return;
        }
        var itemUrl = new ItemUrl();
        itemUrl.url = req.body._content.url;
        itemUrl.host = req.body._content.host;

        itemUrl.image = req.body._content.image;
        itemUrl.title = req.body._content.title;
        itemUrl.description = req.body._content.description;
        itemUrl.author = req.body._content.author;
        itemUrl.type = req.body._content.type;
        itemUrl.site_name = req.body._content.site_name;

        itemUrl.save(function(err){
            if(err)console.log(err);
            callback(err, itemUrl)
        });
    }

    function createItemYoutube(req, callback){
        if(!req.body._content || !req.body._content.url || !req.body._content.embedUrl || !req.body._content.videoId){
            callback("itemYoutube : some required parameters was not provided", null);
            return;
        }
        var itemYoutube = new ItemYoutube();
        itemYoutube.url = req.body._content.url;
        itemYoutube.embedUrl = req.body._content.embedUrl;
        itemYoutube.videoId = req.body._content.videoId;
        itemYoutube.save(function(err){
            if(err)console.log(err);
            callback(err, itemYoutube)
        });
    }

    function createItemImage(req, callback){
        if(!req.body._content || !req.body._content.url){
            callback("itemImage : some required parameters was not provided", null);
            return;
        }
        var itemImage = new ItemImage();
        itemImage.url = req.body._content.url;
        itemImage.save(function(err){
            if(err)console.log(err);
            callback(err, itemImage)
        });
    }

    function createItemTweet(req, callback){
        if(!req.body._content || !req.body._content.url || !req.body._content.html){
            callback("itemUrl : some required parameters was not provided", null);
            return;
        }
        var itemTweet = new ItemTweet();
        itemTweet.url = req.body._content.url;
        itemTweet.html = req.body._content.html;
        itemTweet.author_name = req.body._content.author_name;
        itemTweet.author_url = req.body._content.author_url;
        itemTweet.width = req.body._content.width;
        itemTweet.height = req.body._content.height;
        itemTweet.type = req.body._content.type;
        itemTweet.provider_name = req.body._content.provider_name;
        itemTweet.version = req.body._content.version;
        itemTweet.save(function(err){
            if(err)console.log(err);
            callback(err, itemTweet)
        });

    }
}