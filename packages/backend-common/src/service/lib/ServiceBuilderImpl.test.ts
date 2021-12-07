/*
 * Copyright 2020 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { NextFunction, Request, Response } from 'express';
import { applyCspDirectives, ServiceBuilderImpl } from './ServiceBuilderImpl';

describe('ServiceBuilderImpl', () => {
  describe('applyCspDirectives', () => {
    it('copies actual values', () => {
      const result = applyCspDirectives({ key: ['value'] });
      expect(result).toEqual(
        expect.objectContaining({
          'default-src': ["'self'"],
          key: ['value'],
        }),
      );
    });

    it('removes false value keys', () => {
      const result = applyCspDirectives({ 'upgrade-insecure-requests': false });
      expect(result!['upgrade-insecure-requests']).toBeUndefined();
    });
  });

  describe('setCustomErrorHandler', () => {
    it('adds custom error handler', () => {
      const serviceBuilder = new ServiceBuilderImpl(module);
      const customErrorHandler = (
        error: Error,
        // @ts-ignore
        req: Request,
        // @ts-ignore
        res: Response,
        next: NextFunction,
      ) => {
        next(error);
      };
      serviceBuilder.setErrorHandler(customErrorHandler);
      // @ts-ignore check private attribute
      expect(serviceBuilder.errorHandler).toEqual(customErrorHandler);
    });
    it('use default error handler', () => {
      const serviceBuilder = new ServiceBuilderImpl(module);
      // @ts-ignore check private attribute
      expect(serviceBuilder.errorHandler).toBeUndefined();
    });
  });
});
