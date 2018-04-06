module.exports = {
	list:function(req,res){
		BadgeCode.find().populate('user').exec(function (err, bcs) {
			if (err) {
				return res.negotiate(err);
			}

			res.ok({
				badgecodes: bcs.map(function (bc) {
					return {
						id: bc.id,
						idString: bc.idString,
						active: bc.active,
						description: bc.description,
						user: bc.user ? bc.user.getPublicData() : null,
						badgeID: bc.badgeID
					};
				})
			});
		});
	},

	get: function (req, res) {
		var id = req.param('id');
		BadgeCode.findOne({id: id}).populate('user').exec(function (err, bc) {
			if (err) {
				return res.negotiate(err);
			}

			if (bc === undefined) {
				return res.notFound({message: 'Unknown badgecode id ' + id});
			}

			res.ok({
				badgecode: {
					id: bc.id,
					idString: bc.idString,
					active: bc.active,
					description: bc.description,
					user: bc.user ? bc.user.getPublicData() : null,
					badgeID: bc.badgeID	
				}
			});
		});
	},
	create: function (req, res) {
		var description = req.param('description');
		if (description === undefined)
			return res.badRequest({message: 'No description specified.'});

		var badgeID = req.param('badgeID');
		if (badgeID === undefined)
			return res.badRequest({message: 'No badgeID specified.'});

		if(sails.config.badges.registry[badgeID] === undefined){
			return res.badRequest({message: 'Invalid Badge!'});
		}

		TagGenerator.badgeTag().then(function (tag) {
			BadgeCode.create({
				idString: tag,
				active: true,
				description: description,
				user: null,
				badgeID: badgeID
			}, function (err, bc) {
				if (err) {
					return res.negotiate(err);
				}

				sails.log.info("BC #" + bc.id + " was created by " + req.user.email);

				res.ok({
					badgecode: {
						id: bc.id,
						idString: bc.idString,
						active: bc.active,
						description: bc.description,
						user: bc.user ? bc.user.getPublicData() : null,
						badgeID: bc.badgeID	
					}
				});
			});
		}).catch(function (err) {
			res.negotiate(err);
		});
	},

	destroy: function (req, res) {
		var id = req.param('id');
		BadgeCode.findOne({id: id}).exec(function (err, bc) {
			if (err) {
				return res.negotiate(err);
			}

			if (bc === undefined) {
				return res.notFound({message: 'Unknown badge code id ' + id});
			}

			BadgeCode.destroy({id: bc.id}).exec(function (err) {
				if (err) {
					return res.negotiate(err);
				}

				sails.log.info("BC #" + bc.id + " was deleted by " + req.user.email);

				return res.ok({message: 'Deleted badge code ' + bc.id});
			});
		});
	},

	update: function (req, res) {
		var id = req.param('id');
		if(sails.config.badges.registry[badgeID] === undefined){
			return res.badRequest({message: 'Invalid Badge!'});
		}
		BadgeCode.findOne({id: id}).populate('user').exec(function (err, bc) {
			if (err) {
				return res.negotiate(err);
			}

			if (bc === undefined) {
				return res.notFound({message: 'Unknown badge code id ' + id});
			}

			var changed = false;

			var description = req.param('description');
			if (description !== undefined) {
				bc.description = description;
				changed = true;
			}

			var badgeID = req.param('badgeID');
			if (badgeID !== undefined) {
				bc.badgeID = badgeID;
				changed = true;
			}

			if (!changed) {
				return res.badRequest({message: 'You didn\'t change anything!'});
			}

			bc.save(function (err) {
				if (err) {
					return res.negotiate(err);
				}

				sails.log.info("Badge Code #" + bc.id + " was modified by " + req.user.email);

				return res.ok({
					badgecode: {
						id: bc.id,
						idString: bc.idString,
						active: bc.active,
						description: bc.description,
						user: bc.user ? bc.user.getPublicData() : null,
						badgeID: bc.badgeID,	
					}
				});
			});
		});
	},

}