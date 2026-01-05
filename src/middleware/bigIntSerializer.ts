// src/middleware/bigIntSerializer.ts
import { Request, Response, NextFunction } from 'express';

export function bigIntSerializer(_req: Request, res: Response, next: NextFunction) {
  res.json = function (data: any) {
    const stringified = JSON.stringify(data, (_key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    );
    
    this.set('Content-Type', 'application/json');
    return this.send(stringified);
  };
  
  next();
}