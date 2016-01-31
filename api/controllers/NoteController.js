/**
 * NoteController
 *
 * @description :: Server-side logic for managing Notes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

	addComment: function (req, res) {

			console.log(req.allParams());

			var params = req.allParams();
			var id = params.id;

			Note.findOne(id).exec(function (err, note) {
				 var comment = params.comment;
				 console.log(comment);
				 if(!note.comments)
				 	note['comments'] = new Array();

				 note.comments.push(comment);

			   note.save(function (err) {});
			});
		 return res.send("Comment Added!");
	 },

	 deleteComment: function (req, res) {
		 console.log(req.allParams());
		 var params = req.allParams();
		 var id = params.id;

		 Note.findOne(id).exec(function (err, note) {
			 var commentid = params.commentid;
			 console.log(commentid)
			 for(var i = 0; i < note.comments.length; i++)
					if(commentid === note.comments[i].id)
			 			note.comments.splice(i, 1);

			 note.save(function (err) {});
		 })
		 return res.send("Comment deleted!");
	 }

};
