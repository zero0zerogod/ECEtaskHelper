package zerogod.ecetaskhelper.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.format.FormatterRegistry;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import zerogod.ecetaskhelper.controller.OauthServerTypeConverter;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.FilterConfig;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }

    @Override
    public void addFormatters(FormatterRegistry registry) {
        registry.addConverter(new OauthServerTypeConverter());
    }

    @Bean
    public Filter xContentTypeOptionsHeaderFilter() {
        return new Filter() {
            @Override
            public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
                if (response instanceof HttpServletResponse httpServletResponse) {
                    httpServletResponse.setHeader("X-Content-Type-Options", "nosniff");
                }
                chain.doFilter(request, response);
            }

            @Override
            public void init(FilterConfig filterConfig) throws ServletException {
                // 초기화 코드가 필요할 경우 여기에 추가
            }

            @Override
            public void destroy() {
                // 자원 정리가 필요할 경우 여기에 추가
            }
        };
    }

    @Bean
    public Filter cacheControlHeaderFilter() {
        return new Filter() {
            @Override
            public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
                if (response instanceof HttpServletResponse httpServletResponse) {
                    httpServletResponse.setHeader("Cache-Control", "max-age=3600, must-revalidate");
                }
                chain.doFilter(request, response);
            }

            @Override
            public void init(FilterConfig filterConfig) throws ServletException {
                // 초기화 코드가 필요할 경우 여기에 추가
            }

            @Override
            public void destroy() {
                // 자원 정리가 필요할 경우 여기에 추가
            }
        };
    }

    @Bean
    public Filter utf8CharsetFilter() {
        return new Filter() {
            @Override
            public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
                if (response instanceof HttpServletResponse httpServletResponse) {
                    httpServletResponse.setContentType("text/html; charset=UTF-8");
                }
                chain.doFilter(request, response);
            }

            @Override
            public void init(FilterConfig filterConfig) throws ServletException {
                // 초기화 코드가 필요할 경우 여기에 추가
            }

            @Override
            public void destroy() {
                // 자원 정리가 필요할 경우 여기에 추가
            }
        };
    }
}
