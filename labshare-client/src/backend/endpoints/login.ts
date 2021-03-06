import argon2 from "argon2";
import express from "express";
import HttpStatus from 'http-status-codes';
import jsonwebtoken from "jsonwebtoken";
import { getUserForMail } from '../database/database';
import { IUserLab } from "../database/schemas/IUserLab";
import { IUserHuman } from "../database/schemas/IUserHuman";
import JsonSchema, { schemas } from "../jsonSchemas/JsonSchema";
import utils from '../utils';
import { HMAC_KEY } from '../main';


export async function login(req: express.Request, res: express.Response, next: express.NextFunction) {
    let body = req.body;
    if (!JsonSchema.validate(body, schemas.login)) {
        return utils.badRequest(res);
    }

    let mail = body.email;
    let user = await getUserForMail(mail);
    if (!user) {
        return utils.errorResponse(res, HttpStatus.UNAUTHORIZED, "Ungülige Login-Daten!");
    }


    let hash: string = user.password;
    let password = body.password;
    let validPassword = await argon2.verify(hash, password);
    if (!validPassword) {
        return utils.errorResponse(res, HttpStatus.UNAUTHORIZED, "Ungülige Login-Daten!");
    }


    let userID: string = user._id.toString(); // Database ID
    let payload = {
        role: user.role,
        email: user.role === "human" ? (<IUserHuman>user).contact.email : (<IUserLab>user).contact.email
    };
    let options = {
        issuer: "labshare",
        subject: userID,
        notBefore: 0,
        expiresIn: "2h",
    };
    let jwt = jsonwebtoken.sign(payload, HMAC_KEY, options);
    
    res.send({
        success: true,
        sessionToken: jwt
    });
}
