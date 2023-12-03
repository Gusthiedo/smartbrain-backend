const handleSignin = (db, bcrypt) => (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    console.log("Incorrect form submission");
    return res.status(400).json("incorrect form submission");
  }

  db.select("email", "hash")
    .from("login")
    .where("email", "=", email)
    .then((data) => {
      if (data.length === 0) {
        console.log("User not found");
        return res.status(400).json("wrong credentials");
      }

      const isValid = bcrypt.compareSync(password, data[0].hash);
      console.log("Stored hash:", data[0].hash); // Log the stored hash
      console.log("Entered password:", password); // Log the entered password
      console.log("Password comparison result:", isValid);

      if (isValid) {
        return db
          .select("*")
          .from("users")
          .where("email", "=", email)
          .then((user) => {
            if (user.length > 0) {
              console.log("User signed in successfully:", user[0]);
              res.json(user[0]);
            } else {
              console.log("User not found");
              res.status(400).json("user not found");
            }
          })
          .catch((err) => {
            console.error("Error getting user:", err);
            res.status(400).json("unable to get user");
          });
      } else {
        console.log("Wrong credentials");
        res.status(400).json("wrong credentials");
      }
    })
    .catch((err) => {
      console.error("Error checking credentials:", err);
      res.status(400).json("wrong credentials");
    });
};

module.exports = {
  handleSignin: handleSignin,
};
