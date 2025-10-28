package com.server.app.components;

import com.server.app.services.PermissionService;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.mvc.method.RequestMappingInfo;
import org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerMapping;
import org.springframework.web.util.pattern.PathPattern;

import java.util.Map;

@Component
public class SaveEndpoints implements ApplicationListener<ApplicationReadyEvent> {

    private final RequestMappingHandlerMapping handlerMapping;
    private final PermissionService permissionService;

    public SaveEndpoints(RequestMappingHandlerMapping handlerMapping,
            PermissionService permissionService) {
        this.handlerMapping = handlerMapping;
        this.permissionService = permissionService;
    }

    @Override
    public void onApplicationEvent(ApplicationReadyEvent event) {
        Map<RequestMappingInfo, HandlerMethod> map = handlerMapping.getHandlerMethods();

        map.forEach((info, method) -> {
            if (info.getPathPatternsCondition() != null) {
                for (PathPattern pattern : info.getPathPatternsCondition().getPatterns()) {
                    processEndpoint(pattern.getPatternString(), info);
                }
            } else if (info.getPatternsCondition() != null) {
                for (String path : info.getPatternsCondition().getPatterns()) {
                    processEndpoint(path, info);
                }
            }
        });
    }

    private void processEndpoint(String path, RequestMappingInfo info) {
        if (path.equals("/error") || path.startsWith("/api/auth")) {
            return;
        }

        if (info.getMethodsCondition().getMethods().isEmpty()) {
            permissionService.createIfNotExists(path, "GET");
        } else {
            info.getMethodsCondition().getMethods()
                    .forEach(method -> permissionService.createIfNotExists(path, method.name()));
        }
    }
}
