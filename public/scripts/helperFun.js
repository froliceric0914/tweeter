module.exports = {
  escape: function(str) {
    var div = document.createElement("div");
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  },
  createDate: function(date) {
    const newDate = new Date(parseInt(date, 10));
    const createDate = newDate.toString("MM/dd/yy HH:mm:ss");
    const tweet_createDate = createDate.slice(4, 25);
    return tweet_createDate;
  }
};
