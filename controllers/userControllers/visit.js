const Visit = require("../../models/visit");
const Image = require("../../models/image");

exports.getVisitImages = async (req, res, next) => {
  const visitId = req.params.vid;
  let images;

  try {
    const foundVisit = await Visit.findById(visitId);
    if (!foundVisit) return res.sendStatus(404);
    if (req.user.userId !== foundVisit.userId.toString())
      return res.sendStatus(401);
    images = await Image.find({
      userId: foundVisit.userId,
      visitId: foundVisit._id,
    });
  } catch (e) {
    const error = new Error(e.message);
    error.statusCode = 500;
    return next(error);
  }

  res.status(200).json({
    images,
  });
};
