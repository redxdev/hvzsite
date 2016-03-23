module.exports = {
  endsWith: function (self, other) {
    return self.indexOf(other, this.length - other.length) !== -1;
  }
}
