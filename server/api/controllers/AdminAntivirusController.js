module.exports = {
  list: function (req, res) {
    AntivirusId.find().populate('user').exec(function (err, avs) {
      if (err) {
        return res.negotiate(err);
      }

      res.ok({
        antiviruses: avs.map(function (av) {
          return {
            id: av.id,
            idString: av.idString,
            active: av.active,
            description: av.description,
            user: av.user ? av.user.getPublicData() : null,
            expirationTime: av.expirationTime
          };
        })
      });
    });
  },

  get: function (req, res) {
    var id = req.param('id');
    AntivirusId.findOne({id: id}).populate('user').exec(function (err, av) {
      if (err) {
        return res.negotiate(err);
      }

      if (av === undefined) {
        return res.notFound({message: 'Unknown antivirus id ' + id});
      }

      res.ok({
        antivirus: {
          id: av.id,
          idString: av.idString,
          active: av.active,
          description: av.description,
          user: av.user ? av.user.getPublicData() : null,
          expirationTime: av.expirationTime
        }
      });
    });
  },

  create: function (req, res) {
    var description = req.param('description');
    if (description === undefined)
      return res.badRequest({message: 'No description specified.'});

    var expirationTime = req.param('expirationTime');
    if (expirationTime === undefined)
      return res.badRequest({message: 'No expirationTime specified.'});

    TagGenerator.tag().then(function (tag) {
      AntivirusId.create({
        idString: tag,
        active: true,
        description: description,
        user: null,
        expirationTime: new Date(expirationTime)
      }, function (err, av) {
        if (err) {
          return res.negotiate(err);
        }

        sails.log.info("Antivirus #" + av.id + " was created by " + req.user.email);

        res.ok({
          antivirus: {
            id: av.id,
            idString: av.idString,
            active: av.active,
            description: av.description,
            user: null,
            expirationTime: av.expirationTime
          }
        });
      });
    }).catch(function (err) {
      res.negotiate(err);
    });
  },

  update: function (req, res) {
    var id = req.param('id');
    AntivirusId.findOne({id: id}).populate('user').exec(function (err, av) {
      if (err) {
        return res.negotiate(err);
      }

      if (av === undefined) {
        return res.notFound({message: 'Unknown antivirus id ' + id});
      }

      var changed = false;

      var description = req.param('description');
      if (description !== undefined) {
        av.description = description;
        changed = true;
      }

      var expirationTime = req.param('expirationTime');
      if (expirationTime !== undefined) {
        av.expirationTime = new Date(expirationTime);
        changed = true;
      }

      if (!changed) {
        return res.badRequest({message: 'You didn\'t change anything!'});
      }

      av.save(function (err) {
        if (err) {
          return res.negotiate(err);
        }

        sails.log.info("Antivirus #" + av.id + " was modified by " + req.user.email);

        return res.ok({
          antivirus: {
            id: av.id,
            idString: av.idString,
            active: av.active,
            description: av.description,
            user: av.user ? av.user.getPublicData() : null,
            expirationTime: av.expirationTime
          }
        });
      });
    });
  },

  destroy: function (req, res) {
    var id = req.param('id');
    AntivirusId.findOne({id: id}).exec(function (err, av) {
      if (err) {
        return res.negotiate(err);
      }

      if (av === undefined) {
        return res.notFound({message: 'Unknown antivirus id ' + id});
      }

      AntivirusId.destroy({id: av.id}).exec(function (err) {
        if (err) {
          return res.negotiate(err);
        }

        sails.log.info("Antivirus #" + av.id + " was deleted by " + req.user.email);

        return res.ok({message: 'Deleted antivirus ' + av.id});
      });
    });
  }
};
