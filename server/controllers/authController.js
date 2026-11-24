import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

// @desc    Register a new guest account
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, confirmPassword, phone, country } = req.body;

    const trimmedName = typeof name === 'string' ? name.trim() : '';
    const trimmedEmail = typeof email === 'string' ? email.toLowerCase().trim() : '';
    const cleanPhone = typeof phone === 'string' ? phone.trim() : '';
    const cleanCountry = typeof country === 'string' ? country.trim() : 'India';

    if (!trimmedName || !trimmedEmail || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide full name, email address, and password.'
      });
    }

    if (trimmedName.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Name must be at least 2 characters.'
      });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.'
      });
    }

    // Password strength validation (min 8 chars, 1 letter, 1 number/symbol)
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters long.'
      });
    }

    if (!/[a-zA-Z]/.test(password) || !/[0-9!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return res.status(400).json({
        success: false,
        message: 'Password must contain at least one letter and one number or symbol.'
      });
    }

    // Confirm password match check (if sent)
    if (confirmPassword !== undefined && password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match.'
      });
    }

    const existingUser = await User.findOne({ email: trimmedEmail });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists. Please sign in.'
      });
    }

    const user = await User.create({
      name: trimmedName,
      email: trimmedEmail,
      password,
      phone: cleanPhone,
      country: cleanCountry,
      authProvider: 'local'
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Your Veloura Guest Account has been created.',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        country: user.country,
        avatar: user.avatar,
        authProvider: user.authProvider,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate user & retrieve JWT token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const trimmedEmail = typeof email === 'string' ? email.toLowerCase().trim() : '';

    if (!trimmedEmail || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.'
      });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email format.'
      });
    }

    const user = await User.findOne({ email: trimmedEmail }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Please verify your email and password.'
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Please verify your email and password.'
      });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Signed in successfully.',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        country: user.country,
        avatar: user.avatar,
        authProvider: user.authProvider,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate or register user via Google
// @route   POST /api/auth/google
// @access  Public
export const googleLogin = async (req, res, next) => {
  try {
    const { credential, profile, accessToken } = req.body;

    let email = null;
    let name = null;
    let googleId = null;
    let avatar = null;

    if (credential) {
      // Decode JWT credential from Google Identity Services
      try {
        const payloadBase64 = credential.split('.')[1];
        const decodedJson = Buffer.from(payloadBase64, 'base64').toString('utf-8');
        const payload = JSON.parse(decodedJson);
        email = payload.email;
        name = payload.name;
        googleId = payload.sub;
        avatar = payload.picture;
      } catch (err) {
        console.warn('Could not parse Google credential JWT:', err.message);
      }
    }

    // Verify access token using Google userinfo endpoint if provided
    if (!email && accessToken) {
      try {
        const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        if (userInfoRes.ok) {
          const payload = await userInfoRes.json();
          email = payload.email;
          name = payload.name;
          googleId = payload.sub;
          avatar = payload.picture;
        }
      } catch (err) {
        console.warn('Could not verify Google accessToken:', err.message);
      }
    }

    // Direct verified profile fallback
    if (!email && profile && (profile.googleId || profile.sub)) {
      email = profile.email;
      name = profile.name;
      googleId = profile.googleId || profile.sub;
      avatar = profile.avatar || profile.picture;
    }

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Google authentication failed: Email address could not be verified by Google.'
      });
    }

    const emailNormalized = email.toLowerCase().trim();
    let user = await User.findOne({ email: emailNormalized });

    if (user) {
      // Link Google ID and update avatar if not yet present
      let modified = false;
      if (!user.googleId && googleId) {
        user.googleId = googleId;
        user.authProvider = 'google';
        modified = true;
      }
      if (avatar && !user.avatar) {
        user.avatar = avatar;
        modified = true;
      }
      if (modified) {
        await user.save();
      }
    } else {
      // Create new user with Google verified identity
      user = await User.create({
        name: name || emailNormalized.split('@')[0],
        email: emailNormalized,
        googleId: googleId || `google_${Date.now()}`,
        avatar: avatar || '',
        authProvider: 'google',
        country: 'India'
      });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Signed in with Google successfully.',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        country: user.country,
        avatar: user.avatar,
        authProvider: user.authProvider,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate or register user via Apple ID
// @route   POST /api/auth/apple
// @access  Public
export const appleLogin = async (req, res, next) => {
  try {
    const { identityToken, profile } = req.body;

    let email = null;
    let name = null;
    let appleId = null;

    if (identityToken) {
      try {
        const payloadBase64 = identityToken.split('.')[1];
        const decodedJson = Buffer.from(payloadBase64, 'base64').toString('utf-8');
        const payload = JSON.parse(decodedJson);
        email = payload.email;
        appleId = payload.sub;
      } catch (err) {
        console.warn('Could not parse Apple identity token:', err.message);
      }
    }

    if (!email && profile) {
      email = profile.email;
      name = profile.name;
      appleId = profile.appleId || profile.sub || profile.id;
    }

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Apple authentication failed: Email address could not be verified.'
      });
    }

    const emailNormalized = email.toLowerCase().trim();
    let user = await User.findOne({ email: emailNormalized });

    if (user) {
      if (!user.appleId && appleId) {
        user.appleId = appleId;
        user.authProvider = 'apple';
        await user.save();
      }
    } else {
      user = await User.create({
        name: name || emailNormalized.split('@')[0],
        email: emailNormalized,
        appleId: appleId || `apple_${Date.now()}`,
        authProvider: 'apple',
        country: 'India'
      });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Signed in with Apple ID successfully.',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        country: user.country,
        avatar: user.avatar,
        authProvider: user.authProvider,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current authenticated user profile
// @route   GET /api/auth/me
// @access  Private
export const getUserProfile = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      user: req.user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/me
// @access  Private
export const updateUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found.'
      });
    }

    user.name = req.body.name || user.name;
    user.phone = req.body.phone !== undefined ? req.body.phone : user.phone;
    user.country = req.body.country !== undefined ? req.body.country : user.country;

    if (req.body.password) {
      if (req.body.password.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'Password must be at least 6 characters long.'
        });
      }
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        country: updatedUser.country,
        avatar: updatedUser.avatar,
        authProvider: updatedUser.authProvider,
        role: updatedUser.role
      }
    });
  } catch (error) {
    next(error);
  }
};
