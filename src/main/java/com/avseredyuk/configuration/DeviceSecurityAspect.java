package com.avseredyuk.configuration;

import java.util.Objects;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.avseredyuk.exception.UnknownDeviceException;
import com.avseredyuk.model.Device;
import com.avseredyuk.service.DeviceService;

@Aspect
@Component
public class DeviceSecurityAspect {

    @Autowired
    private DeviceService deviceService;

    @Before("execution(public * com.avseredyuk.controller.InputDeviceController.*(..) )")
    public void doAccessCheck(JoinPoint joinPoint) {
        Object[] arguments = joinPoint.getArgs();
        if (arguments.length > 0) {
            Object tokenObject = arguments[0];
            if (!(tokenObject instanceof String)) {
                throw new UnknownDeviceException();
            }
            String token = (String) tokenObject;
            Device device = deviceService.findTrustedDevice(token);
            if (Objects.isNull(device)){
                throw new UnknownDeviceException(token);
            }
        } else {
            throw new UnknownDeviceException();
        }
    }
}
