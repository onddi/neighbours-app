/**
 * SaunaController
 *
 * @description :: Server-side logic for managing Saunas
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

	cancel: function (req, res) {

		console.log(req.allParams());

		var params = req.allParams();
		var id = params.userId;

		Sauna.findOne({userId:id}).exec(function (err, sauna) {
			 var timeslot = params.timeslot;
			 console.log(timeslot);
		   sauna.cancelled.push(timeslot);
		   sauna.save(function (err) {});
		});
	 return res.send("Sauna turn cancelled!");
 },

 extra: function (req, res) {

	 console.log(req.allParams());

	 var params = req.allParams();
	 var id = params.userId;

	 Sauna.findOne({userId:id}).exec(function (err, sauna) {
			var timeslot = params.timeslot;
			console.log(timeslot);
			if(sauna.extra.length < 3)
				sauna.extra.push(timeslot);
			sauna.save(function (err) {});
	 });
	return res.send("Sauna turn cancelled!");
 }

};
