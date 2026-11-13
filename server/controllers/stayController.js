import Stay from '../models/Stay.js';

// @desc    Get all active stays with optional category, search, and sorting
// @route   GET /api/stays
// @access  Public
export const getStays = async (req, res, next) => {
  try {
    const { category, search, sortBy } = req.query;

    const filter = { isActive: true };

    // Filter by Category
    if (category && category !== 'All Stays' && category !== 'all') {
      filter.category = category;
    }

    // Keyword Search
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      filter.$or = [
        { name: searchRegex },
        { subtitle: searchRegex },
        { view: searchRegex },
        { shortDescription: searchRegex }
      ];
    }

    // Determine Sorting
    let sortOptions = { featured: -1, createdAt: -1 };
    if (sortBy === 'price_asc') {
      sortOptions = { pricePerNight: 1 };
    } else if (sortBy === 'price_desc') {
      sortOptions = { pricePerNight: -1 };
    } else if (sortBy === 'rating') {
      sortOptions = { rating: -1 };
    }

    const stays = await Stay.find(filter).sort(sortOptions);

    res.status(200).json({
      success: true,
      count: stays.length,
      stays
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single stay by slug, id, or Mongo _id
// @route   GET /api/stays/:idOrSlug
// @access  Public
export const getStayBySlugOrId = async (req, res, next) => {
  try {
    const { idOrSlug } = req.params;

    const query = {
      $or: [
        { slug: idOrSlug },
        { id: idOrSlug }
      ]
    };

    // If param is a 24-character hex string, allow Mongo _id lookup as well
    if (/^[0-9a-fA-F]{24}$/.test(idOrSlug)) {
      query.$or.push({ _id: idOrSlug });
    }

    const stay = await Stay.findOne(query);

    if (!stay) {
      return res.status(404).json({
        success: false,
        message: `Sanctuary '${idOrSlug}' not found in Veloura collections.`
      });
    }

    res.status(200).json({
      success: true,
      stay
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all available room categories
// @route   GET /api/stays/categories
// @access  Public
export const getCategories = async (req, res, next) => {
  try {
    const categories = await Stay.distinct('category', { isActive: true });
    res.status(200).json({
      success: true,
      categories: ['All Stays', ...categories]
    });
  } catch (error) {
    next(error);
  }
};

