const {
    selectBieuDoTron,
  } = require("../../services/TruongbomonServices/ThongKeServices");
  
  const getBieuDoTron = async (req, res) => {
    try {
      const MABOMON = req.body.MABOMON;
      const MANAMHOC = req.body.MANAMHOC;
      console.log("MABOMON: ", MABOMON);
      console.log("MANAMHOC: ", MANAMHOC);
      let results = await selectBieuDoTron(MABOMON, MANAMHOC);
      return res.status(200).json({
        EM: results.EM,
        EC: results.EC,
        DT: results.DT,
      });

    } catch (error) {
      console.log(error);
      return res.status(200).json({
        EM: "lỗi get_bieudotron",
        EC: -1,
        DT: [],
      });
    }
  };

  module.exports = {
    getBieuDoTron,
  };
  