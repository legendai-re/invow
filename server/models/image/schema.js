module.exports = function getImageSchema(Schema) {

	return new Schema({
		createdAt: { type: Date },
		updatedAt: { type: Date },
	    mime: {
	        type: String,
	        required: true
	    },
	    folder: {
	    	type: String,
	    	required: true
	    }	    	    
	},{
		toObject: {
  			virtuals: true
  		},
  		toJSON: {
  			virtuals: true 
  		}
	});
    
}