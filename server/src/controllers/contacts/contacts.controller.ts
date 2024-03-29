import { NextFunction, Response, Router } from "express";
import ContactsServie from "../../services/contacts/contacts.service";
import { validate } from "../../middlewares/zod";
import { ICreateContact, IUpdateContact } from "../../dto/contacts.dto";
import { IGetUserAuthInfoRequest, authorization } from "../../middlewares/auth";
import errorHandler from "../../middlewares/errors";
import { Post, Get, Put, Delete, Route, Tags } from "tsoa";
import { BASE_SUCCESS_OBJECT } from "../../config/constants";

@Route("/contacts")
@Tags("Contacts")
class ContactsController {
  public routerHandler;
  private service = new ContactsServie();
  constructor() {
    this.routerHandler = Router();
    this.create();
    this.findMany();
    this.update();
    this.findOne();
    this.delete();
  }

  @Delete("/:id")
  async delete() {
    this.routerHandler.delete(
      "/contacts/:id",
      authorization,
      async (
        req: IGetUserAuthInfoRequest,
        res: Response,
        next: NextFunction
      ) => {
        const cid = req.params.id;
        try {
          const contact = await this.service.delete({
            filters: {
              uid: req.user.id,
              cid,
            },
          });
          res.send({ ...BASE_SUCCESS_OBJECT, results: contact });
        } catch (error: any) {
          next(error);
        }
      },
      errorHandler
    );
  }

  @Put("/:id")
  async update() {
    this.routerHandler.put(
      "/contacts/:id",
      authorization,
      validate(IUpdateContact),
      async (
        req: IGetUserAuthInfoRequest,
        res: Response,
        next: NextFunction
      ) => {
        const { ...data } = req.body;
        const cid = req.params.id;
        try {
          const contact = await this.service.update({
            filters: {
              uid: req.user.id,
              cid,
            },
            data,
          });
          res.send({ ...BASE_SUCCESS_OBJECT, results: contact });
        } catch (error: any) {
          next(error);
        }
      },
      errorHandler
    );
  }

  @Get("/:id")
  async findOne() {
    this.routerHandler.get(
      "/contacts/:id",
      authorization,
      async (
        req: IGetUserAuthInfoRequest,
        res: Response,
        next: NextFunction
      ) => {
        const cid = req.params.id;
        try {
          const contact = await this.service.findUnique({
            filters: {
              uid: req.user.id,
              cid,
            },
          });
          res.send(contact);
        } catch (error: any) {
          next(error);
        }
      },
      errorHandler
    );
  }

  @Get("/")
  async findMany() {
    this.routerHandler.get(
      "/contacts",
      authorization,
      async (
        req: IGetUserAuthInfoRequest,
        res: Response,
        next: NextFunction
      ) => {
        let limit = 10;
        let page = 1;
        if (req.query) {
          if (req.query.limit) limit = +req.query.limit;
          if (req.query.page) page = +req.query.page;
        }
        try {
          const contacts = await this.service.findUserContacts({
            filters: {
              uid: req.user.id,
            },
            pagination: {
              limit,
              page,
            },
          });
          res.send({
            ...BASE_SUCCESS_OBJECT,
            results: contacts,
            pagination: {},
          });
        } catch (error: any) {
          next(error);
        }
      },
      errorHandler
    );
  }

  @Post("/")
  async create() {
    this.routerHandler.post(
      "/contacts",
      authorization,
      validate(ICreateContact),
      async (
        req: IGetUserAuthInfoRequest,
        res: Response,
        next: NextFunction
      ) => {
        try {
          const newContact = await this.service.create({
            data: {
              ...req.body,
              uid: req.user.id,
            },
          });
          res.send({ ...BASE_SUCCESS_OBJECT, results: newContact });
        } catch (error: any) {
          next(error);
        }
      },
      errorHandler
    );
  }
}

export default ContactsController;
