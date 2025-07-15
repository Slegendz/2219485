import Url from "../models/url.js";

async function createShortCode(code) {
  let shortcode = "";
  const shortcodeRegex = /^[A-Za-z0-9]{6}$/;

  if (!shortcodeRegex.test(code)) {
    const str =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (let i = 0; i < 6; i++) {
      const idx = Math.floor(Math.random() * str.length);
      shortcode += str[idx];
    }
  } else {
    shortcode = code;
  }

  const exists = await Url.findOne({ shortcode });
  if (!exists) return shortcode;
  return "";
}

const createShortUrl = async (req, res) => {
  try {
    const { url, validity, shortcode } = req.body;

    if (!url) return res.status(400).json({ message: "Url is required" });

    const code = await createShortCode(shortcode);
    if (code.length === 0)
      return res.status(400).json({ message: "Shortcode exists" });

    const expiry = validity
      ? new Date(Date.now() + validity * 60000)
      : new Date(Date.now() + 30 * 60000);

    const shortUrl = await Url.create({
      originalUrl: url,
      shortcode: code,
      validity: expiry,
    });

    res.status(200).json({
      shortLink: `${req.protocol}://${req.get("host")}/${code}`,
      expiry: expiry.toISOString(),
    });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

const getStats = async (req, res) => {
    try{
        const { shortcode } = req.params;
        const url = await Url.findOne({ shortcode });

        if(!url){
            return res.status(404).json({ message: "No url found"});
        }

        res.json({ 
            clicks: url.clicks,
            url: url.originalUrl,
            createdAt: url.createdAt,
            expiry: url.validity,
        });
    }catch(err){
        res.status(500).json({ message: "Something went wrong" });
    }
}

const redirect = async (req, res) => {
    try{
        const { shortcode } = req.params;
        const url = await Url.findOne({ shortcode });

        if(!url){
            return res.status(404).json({ message: "No url found"});
        }

        const newDate = Date.now();
        if(newDate > url.validity){
            return res.status(404).json({ message: "ShortUrl is expired"});
        }

        url.clicks += 1;
        await url.save();
        res.redirect(url.originalUrl);
    }catch(err){
        res.status(500).json({ message: "Something went wrong"});
    }
}

export { getStats, createShortUrl, redirect };