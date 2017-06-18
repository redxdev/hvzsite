
/*
Messages are in the following format:
[
  "This is a string with a user reference: ",
  {t:'u',i: 123},
  "."
]

Each part of the array is concatinated. Objects are checked
for the 't' field, which denotes type.

If the type is 'u' (user) then the i field should be present,
which denotes the user id.

If the type is 'e' (error), then the type is unknown and should
either show an error message or be discarded.
*/

var Promise = require('bluebird');
var _ = require('lodash');

module.exports = {

  attributes: {
    relevantUser: {
      model: 'User'
    },

    message: {
      type: 'array'
    },

    viewed: {
      type: 'boolean',
      defaultsTo: false
    },

    image: {
      type: 'string',
      defaultsTo: null
    },

    getMessageDebug: function () {
      var result = "";
      this.message.forEach(function (el) {
        if (_.isString(el))
          result += el;
        else {
          switch (el.t) {
            default:
              result += '@E';
              break;
            
            case 'u':
              result += '@' + el.i;
              break;
          }
        }
      });

      return result;
    },

    getMessageString: function () {
      var promises = [];
      var result = [];
      for (var i = 0; i < this.message.length; ++i) {
        var value = this.message[i];
        result[i] = value;
        if (_.isString(value)) {
          continue;
        }

        var index = i;
        promises.push(new Promise(function (resolve, reject) {
          switch (value.t) {
            default:
              reject("Invalid Feed message object " + value.t);
              break;
            
            case 'u':
              if (value.i === (_.isObject(this.relevantUser) ? this.relevantUser.id : this.relevantUser)) {
                result[index] = this.relevantUser.name;
                resolve();
              }
              else {
                User.findOne({id: value.i}, function (err, user) {
                  if (err)
                    reject(err);

                  if (!user)
                    reject("Invalid user for Feed message object " + value.i);

                  result[index] = user.name;
                  resolve();
                });
              }
              break;
          }
        }));
      }

      return Promise.all(promises).then(function () {
        return result.join("");
      });
    }
  },
};

