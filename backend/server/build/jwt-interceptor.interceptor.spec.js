"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@angular/core/testing");
const jwt_interceptor_interceptor_1 = require("./jwt-interceptor.interceptor");
describe('JwtInterceptorInterceptor', () => {
    beforeEach(() => testing_1.TestBed.configureTestingModule({
        providers: [
            jwt_interceptor_interceptor_1.JwtInterceptorInterceptor
        ]
    }));
    it('should be created', () => {
        const interceptor = testing_1.TestBed.inject(jwt_interceptor_interceptor_1.JwtInterceptorInterceptor);
        expect(interceptor).toBeTruthy();
    });
});
