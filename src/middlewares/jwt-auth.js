module.exports = async (req) => {
    const token =await  req.headers['authorization'].split(" ")[1];
   return token;
}