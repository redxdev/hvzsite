
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

module.exports = {

  attributes: {
    relevantUser: {
      model: 'User'
    },

    message: {
      type: 'array'
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
    }
  },
};

