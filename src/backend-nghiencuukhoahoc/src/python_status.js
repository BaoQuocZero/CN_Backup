const axios = require("axios");

const Sevicel_CheckStatus_Python = async () => {
  try {
    const response = await axios.get("http://127.0.0.1:5000/api/hello");
    const data = response.data;
    console.log("Trả lời từ người AE Python: ", data);
    return {
      EM: "Success",
      EC: 0,
      DT: data,
    };
  } catch (error) {
    console.log("error: ", error);
    return {
      EM: "Không thể kết nối với server Python",
      EC: -1,
      DT: null,
    };
  }
};

module.exports = {
  Sevicel_CheckStatus_Python,
};
