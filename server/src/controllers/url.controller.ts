import { Request, Response } from "express";
import { Url } from "../models/Url.model";

import validator from "validator";

//@ts-ignore
import { nanoid } from "nanoid";

const createUrl = async (req: Request, res: Response) => {
  try {
    const { fullurl, userId } = req.body;
    console.log(userId);

    if (!validator.isURL(fullurl)) {
      return res.status(406).json({
        success: false,
        message: "Invalid URL! Please enter a valid url",
      });
    }

    // To Avoid Duplicate URLs
    // const urlInstance = await Url.find({ url: fullurl });

    // if (urlInstance.length > 0) {
    //   res.status(409).json({
    //     success: true,
    //     data: urlInstance,

    //     message: "Duplicate entry, URL already existssssss",
    //   });
    // }

    const short = nanoid(10);
    const shortUrl = await Url.create({
      userId: userId,
      url: fullurl,
      shorturl: short,
    });
    console.log(shortUrl);
    res.status(201).json({
      success: true,
      message: "URL entry Successful",
      data: shortUrl,
    });
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

const getUrlByUser = async (req: Request, res: Response) => {
  const { userId } = await req.body;
  // console.log(req.body);
  // console.log("userId <><><>", userId);
  const urls = (await Url.find({ userId: userId })) as any;

  try {
    if (urls.length === 0) {
      return res.status(404).json({
        success: false,
        message: "shorturl doesn't exist",
      });
    }

    return res.status(200).json({
      success: true,
      data: urls,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err,
    });
  }
};

const DeleteUrl = async (req: Request, res: Response) => {
  const urlDetails = (await Url.find({ _id: req.params.id }))[0] as any;
  // console.log(urlDetails, req.params.id);
  const deletedData = await Url.deleteOne(urlDetails?._id);

  // console.log("deleted : ", deletedData);
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

const DeleteAllUsersUrl = async (req: Request, res: Response) => {
  const user = (await Url.find({ userId: req.params.userid }))[0] as any;
  // console.log("User Id", req.params.userid);
  // console.log("User", user);
  const deletedData = await Url.deleteMany({ userId: req.params.userid });

  console.log("deleted : ", deletedData);
  if (deletedData.acknowledged) {
    return res.status(200).json({
      success: true,
      message: "your url have been deleted",
    });
  } else if (user) {
    return res.status(404).json({
      success: false,
      message: "User not found, invalid userid",
    });
  } else {
    return res.status(500).json({
      success: false,
      message: "Something went wrong while deleting url",
    });
  }
};

export {
  createUrl,
  getAllUrl,
  getUrlByUser,
  DeleteUrl,
  DeleteAllUsersUrl,
  getUrl,
};
