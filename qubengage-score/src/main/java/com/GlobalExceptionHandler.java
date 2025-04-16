package com;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // Handle the case where method argument is not valid (e.g., missing required request parameter)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse> handleValidationExceptions(MethodArgumentNotValidException ex) {
        String error = "Input error: Missing or incomplete input.";
        ex.printStackTrace();
        return new ResponseEntity<>(new ApiResponse(true, error), HttpStatus.BAD_REQUEST);
    }

    // Handle illegal argument exceptions (e.g., a number is out of the expected range)
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiResponse> handleIllegalArgumentException(IllegalArgumentException ex) {
        String error = ex.getMessage();
        ex.printStackTrace();
        return new ResponseEntity<>(new ApiResponse(true, error), HttpStatus.BAD_REQUEST);
    }

    // Handle generic exceptions
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse> handleAllExceptions(Exception ex) {
        ex.printStackTrace();
        String error = "An error occurred";
        return new ResponseEntity<>(new ApiResponse(true, error), HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
