package zerogod.ecetaskhelper.controller;

import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class WebController implements ErrorController {
    @GetMapping({"/", "/error"})
    public String index() {
        // 기본 경로 요청을 리액트의 index.html 파일로 forward
        return "forward:/index.html";
    }

}
