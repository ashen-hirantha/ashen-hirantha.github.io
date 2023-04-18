//Register Users
const register = async (req, res) => {
    const { name, email, password, role } = req.body;
  
    try {
      // Check if user already exists
      let user = await User.findOne({ email });
  
      if (user) {
        return res.status(400).json({ msg: 'User already exists' });
      }
  
      // Create new user
      user = new User({
        name,
        email,
        password,
        role,
      });
  
      // Encrypt password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
  
      await user.save();
  
      // Return token
      const payload = {
        user: {
          id: user.id,
          role: user.role,
        },
      };
  
      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: 3600 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  };
//Login User
const login = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // Check if user exists
      let user = await User.findOne({ email });
  
      if (!user) {
        return res.status(400).json({ msg: 'Invalid Credentials' });
      }
  
      // Check password
      const isMatch = await bcrypt.compare(password, user.password);
  
      if (!isMatch) {
        return res.status(400).json({ msg: 'Invalid Credentials' });
      }
  
      // Return token
      const payload = {
        user: {
          id: user.id,
          role: user.role,
        },
      };
  
      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: 3600 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  };
//Create Initiative 
const createInitiative = async (req, res) => {
    const { title, description, images, donationGoal, timeframe } = req.body;
  
    try {
      const initiative = new Initiative({
        title,
        description,
        images,
        donationGoal,
        timeframe,
        charitableOrganization: req.user.id,
      });
  
      await initiative.save();
  
      res.json(initiative);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  };
//Get Initiatives
const getInitiatives = async (req, res) => {
    try {
      const initiatives = await Initiative.find().populate(
        'charitableOrganization',
        'name'
      );
  
      res.json(initiatives);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  };
