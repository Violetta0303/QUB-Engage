package com;

public class ApiResponse {
    private boolean error;
    private String message;
    private Object data;

    // Constructor for error response
    public ApiResponse(boolean error, String message) {
        this.error = error;
        this.message = message;
        this.data = null; // In case of error, no data is attached
    }

    // Constructor for success response
    public ApiResponse(boolean error, Object data) {
        this.error = error;
        this.message = error ? "An error occurred" : "Success";
        this.data = data;
    }

    // Getters and setters
    public boolean isError() {
        return error;
    }

    public void setError(boolean error) {
        this.error = error;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Object getData() {
        return data;
    }

    public void setData(Object data) {
        this.data = data;
    }
}

