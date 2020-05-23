package com.avseredyuk.controller;

import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import com.avseredyuk.exception.UnknownDeviceException;
import com.avseredyuk.exception.InconsistentDataException;
import com.avseredyuk.model.internal.ApiResult;

@ControllerAdvice
public class RestResponseEntityExceptionHandler extends ResponseEntityExceptionHandler {

    @ExceptionHandler({ InconsistentDataException.class })
    protected ResponseEntity<Object> handleInconsistentData(RuntimeException ex, WebRequest request) {
        logger.warn(ex.getMessage(), ex);
        return handleExceptionInternal(ex, new ApiResult(ex.getMessage()),
                new HttpHeaders(), HttpStatus.BAD_REQUEST, request);
    }

    @ExceptionHandler({ DataAccessException.class })
    protected ResponseEntity<Object> handleDatabaseExceptions(RuntimeException ex, WebRequest request) {
        logger.warn(ex.getMessage(), ex);
        return handleExceptionInternal(ex, new ApiResult("Unknown error"),
                new HttpHeaders(), HttpStatus.BAD_REQUEST, request);
    }

    @ExceptionHandler({ IllegalArgumentException.class })
    protected ResponseEntity<Object> handleIllegalArgumentException(RuntimeException ex, WebRequest request) {
        logger.warn(ex.getMessage(), ex);
        return handleExceptionInternal(ex, new ApiResult("Something went wrong"),
                new HttpHeaders(), HttpStatus.BAD_REQUEST, request);
    }

    @ExceptionHandler({ BadCredentialsException.class })
    protected ResponseEntity<Object> handleBadCredentials(RuntimeException ex, WebRequest request) {
        logger.warn(ex.getMessage(), ex);
        return handleExceptionInternal(ex, new ApiResult("Invalid credentials"),
                new HttpHeaders(), HttpStatus.UNAUTHORIZED, request);
    }

    /*
        Handling exceptions in input device related flow
     */
    @ExceptionHandler({ UnknownDeviceException.class })
    protected ResponseEntity<Object> handleUnknownDevice(RuntimeException ex, WebRequest request) {
        logger.warn(ex.getMessage(), ex);
        return handleExceptionInternal(ex, new ApiResult("Unknown device"),
                new HttpHeaders(), HttpStatus.NOT_FOUND, request);
    }
}
