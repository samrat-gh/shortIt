import { Request, response, Response } from "express";
import { Url } from "../models/Url.model";

import validator from "validator";

//@ts-ignore
import { nanoid } from "nanoid";

const createUrl = async (req: Request, res: Response) => {
  try {
    const { fullurl } = req.body;

    if (!validator.isURL(fullurl)) {
      return res.status(406).json({
        success: false,
        message: "Invalid URL! Please enter a valid url",
      });
    }

    const urlInstance = await Url.find({ url: fullurl });
    console.log("UrlInstance", urlInstance);

    if (urlInstance.length > 0) {
      res.status(409).json({
        success: false,
        message: "Duplicate entry, URL already exist",
      });
    } else {
      const short = nanoid(10);
      const shortUrl = await Url.create({ url: fullurl, shorturl: short });
      console.log(shortUrl);
      res.status(201).json({
        success: true,
        message: "URL entry Successful",
        url: short,
      });
    }
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message ?? "Something went wrong!",
    });
  }
};

const getAllUrl = async (req: Request, res: Response) => {
  try {
    const shortUrl = await Url.find();
    if (shortUrl.length < 0) {
      res.status(404).json({
        success: false,
        message: "URL not found",
      });
    } else {
      res.status(200).json({
        success: true,
        url: shortUrl,
        message: "Url found !",
      });
    }
  } catch (err: any) {}
};

const getUrl = async (req: Request, res: Response) => {
  console.log("getURl params", req.params.id);

  const urlDetails = (await Url.find({ shorturl: req.params.id })) as any;

  if (urlDetails.length === 0) {
    return res.status(404).json({
      success: false,
      message: "shorturl doesn't exist",
    });
  }

  console.log("URL Details", urlDetails);
  const count = await Url.findOneAndUpdate(
    { shorturl: urlDetails[0].shorturl },
    { clicks: urlDetails[0].clicks + 1 }
  );
  console.log("Count Increment", count);
  return res.status(200).json({
    success: true,
    data: urlDetails,
  });
};

const DeleteUrl = async (req: Request, res: Response) => {
  const urlDetails = (await Url.find({ shorturl: req.params.id })) as any;
  const deletedData = await Url.deleteOne(urlDetails?._id);

  console.log("ABCD", deletedData);
  if (deletedData.acknowledged) {
    return res.status(200).json({
      success: true,
      message: "your url have been deleted",
    });
  } else if (!urlDetails) {
    return res.status(404).json({
      success: false,
      message: "Original Url not found for the given short url",
    });
  } else {
    return res.status(500).json({
      success: false,
      message: "Something went wrong while deleting url",
    });
  }
};

export { createUrl, getAllUrl, DeleteUrl, getUrl };
