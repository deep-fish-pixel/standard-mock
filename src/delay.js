/**
 * delay ms time
 * @param time
 */
module.exports = function(time) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time || 0);
  })
};
