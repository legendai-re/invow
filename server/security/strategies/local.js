module.exports = function getLocalStrategy(LocalStrategy){

    var mongoose        = require('mongoose');
    var bCrypt          = require('bcrypt-nodejs');
    var connectionTypes = require('../connectionTypes.json');
    var User = mongoose.model('User');

   return new LocalStrategy(

        function (username, password, done) {
            var isValidPassword = function(user, password){
                return bCrypt.compareSync(password, user.local.password);
            }

            User.findOne({ $or: [{username: username}, {email: username}], connectionTypes: connectionTypes.LOCAL.id }).populate('_avatar').select('+local.password').exec(function (err, user) {
                if (err) {
                    return done(err);
                }
                if (!user) {
                    return done(null, false, {alert: 'Incorrect username.'});
                }
                if (!password || password == '' || !isValidPassword(user, password)) {
                    return done(null, false, {alert: 'Incorrect password.'});
                }
                user.local.password = "";
                return done(null, user);
            });
        }
    )

}
