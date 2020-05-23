package com.avseredyuk.exception;

/*
    Should be used only for input-device related flows
 */
public class UnknownDeviceException extends RuntimeException {

    public UnknownDeviceException() {
    }

    public UnknownDeviceException(String message) {
        super(message);
    }
}
