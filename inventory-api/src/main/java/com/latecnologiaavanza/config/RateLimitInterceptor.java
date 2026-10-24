package com.latecnologiaavanza.config;

import java.io.IOException;
import java.util.concurrent.ConcurrentHashMap;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
public class RateLimitInterceptor implements HandlerInterceptor {

    private final ConcurrentHashMap<String, Window> windows = new ConcurrentHashMap<>();

    @Value("${app.rate-limit.enabled:true}")
    private boolean enabled;

    @Value("${app.rate-limit.max-requests:100}")
    private int maxRequests;

    @Value("${app.rate-limit.window-seconds:60}")
    private long windowSeconds;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        if ("OPTIONS".equalsIgnoreCase(request.getMethod()) || !enabled) {
            return true;
        }

        long now = System.currentTimeMillis();
        long windowMillis = windowSeconds * 1000L;
        String ipAddress = request.getRemoteAddr();

        Window window = windows.compute(ipAddress, (key, currentWindow) -> {
            if (currentWindow == null || now - currentWindow.startedAt >= windowMillis) {
                return new Window(now, 1);
            }

            currentWindow.requests++;
            return currentWindow;
        });

        if (window.requests <= maxRequests) {
            return true;
        }

        response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        try {
            response.getWriter().write(
                    "{\"status\":429,\"message\":\"Se excedió el límite de solicitudes. Intenta nuevamente más tarde.\"}");
        } catch (IOException exception) {
            // The response cannot be written when the client has disconnected.
        }
        return false;
    }

    private static class Window {

        private final long startedAt;
        private int requests;

        private Window(long startedAt, int requests) {
            this.startedAt = startedAt;
            this.requests = requests;
        }

    }

}
