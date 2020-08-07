const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    username : {
        type : String,
        required : true,
        min : 6,
        max : 15
    },
    password :{
        type : String,
        required : true
    },
    role : {
        type : String,
        enum : ['user', 'admin'],
        required: true
    },
    todos : [{type : mongoose.Schema.Types.ObjectId, ref: 'Todo'}]
});

//checks to see if the password has been modified
userSchema.pre('save', function(next){
    if(!this.isModified('password'))
        return next();

    bcrypt.hash(this.password, 10, (err, passwordHash)=>{
        if(err)
            return next(err);
        this.password = passwordHash;
        next();
    });
});

//compares the plain text version from the client to the hashed password from the database
userSchema.methods.comparePassword = function(password, cb){
    bcrypt.compare(password, this.password, (err,isMatch)=>{
        if(err)
            return cb(err)
        else{
            if(!isMatch)
                return cb(null, isMatch);
            return cb(null,this);
        }
    });
}

module.exports = mongoose.model('User', userSchema);
