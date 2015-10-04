module.exports = {

  create: function(req, res) {
		return res.status(200).send(req.body);
  }
}//end of module