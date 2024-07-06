import { Request, Response } from "express";
import { Url } from "../models/Url.model";

//@ts-ignore
import { nanoid } from "nanoid";

const createUrl = async (req: Request, res: Response) => {
  try {
    const { fullurl } = req.body;
    console.log(req.body);
    console.log("The Full URL is :", fullurl);

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

const getUrl = async (req: Request, res: Response) => {};

const DeleteUrl = async (req: Request, res: Response) => {};

export { createUrl, getAllUrl, DeleteUrl, getUrl };
